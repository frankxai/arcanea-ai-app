/**
 * Arcanea — Supabase Storage Bucket Provisioner
 *
 * Creates all required storage buckets for the Arcanea platform.
 * Safe to re-run — existing buckets are reported but not recreated.
 *
 * Usage:
 *   npx tsx scripts/provision-storage.ts
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL  (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

// ── Env ───────────────────────────────────────────────────────────────────────

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL) {
  console.error(
    '[provision-storage] ERROR: Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)'
  );
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error(
    '[provision-storage] ERROR: Missing SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface BucketSpec {
  /** Bucket ID / name in Supabase Storage */
  id: string;
  /** Whether objects are publicly accessible without auth */
  public: boolean;
  /** Human-readable description (for logging) */
  description: string;
  /** Allowed MIME type prefixes. Empty array = allow all. */
  allowedMimeTypes: string[];
  /** Max file size in bytes */
  fileSizeLimit: number;
}

// ── Bucket definitions ────────────────────────────────────────────────────────

const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;   // 10 MB
const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024;   // 100 MB

const BUCKETS: BucketSpec[] = [
  {
    id: 'arcanea-gallery',
    public: true,
    description: 'Guardian / godbeast / gallery art (official Arcanea assets)',
    allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif'],
    fileSizeLimit: IMAGE_SIZE_LIMIT,
  },
  {
    id: 'user-creations',
    public: true,
    description: 'User-generated content (images, audio, video)',
    allowedMimeTypes: [
      'image/webp',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
    ],
    fileSizeLimit: VIDEO_SIZE_LIMIT,
  },
  {
    id: 'brand-assets',
    public: true,
    description: 'Logos, icons, marketing materials',
    allowedMimeTypes: [
      'image/webp',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/gif',
    ],
    fileSizeLimit: IMAGE_SIZE_LIMIT,
  },
  {
    id: 'profile-assets',
    public: false,
    description: 'User avatars and profile cover images (private)',
    allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif'],
    fileSizeLimit: IMAGE_SIZE_LIMIT,
  },
];

// ── CORS configuration ────────────────────────────────────────────────────────

// Supabase Storage handles CORS at the project level (Dashboard → Storage → CORS).
// The JS client does not expose a per-bucket CORS API, so we log the expected
// settings so they can be applied via the Supabase Dashboard or Management API.

const CORS_ALLOWED_ORIGINS = [
  'https://arcanea.ai',
  'https://www.arcanea.ai',
  'http://localhost:3000',
  'http://localhost:3001',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(str: string, len: number): string {
  return str.padEnd(len);
}

function formatBytes(bytes: number): string {
  return bytes >= 1_000_000
    ? `${bytes / 1_000_000} MB`
    : `${bytes / 1_000} KB`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\nArcanea — Supabase Storage Provisioner');
  console.log('═'.repeat(55));
  console.log(`Project URL : ${SUPABASE_URL}`);
  console.log(`Buckets     : ${BUCKETS.length}`);
  console.log('═'.repeat(55));

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Fetch existing buckets to avoid duplicate-creation errors
  const { data: existing, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error(`\nFailed to list existing buckets: ${listError.message}`);
    process.exit(1);
  }

  const existingIds = new Set((existing ?? []).map((b) => b.id));

  const results: Array<{
    id: string;
    status: 'created' | 'already-exists' | 'error';
    message?: string;
  }> = [];

  for (const spec of BUCKETS) {
    process.stdout.write(`\n  ${pad(spec.id, 20)}`);

    if (existingIds.has(spec.id)) {
      process.stdout.write('ALREADY EXISTS\n');
      results.push({ id: spec.id, status: 'already-exists' });
      continue;
    }

    const { error } = await supabase.storage.createBucket(spec.id, {
      public: spec.public,
      allowedMimeTypes: spec.allowedMimeTypes.length > 0
        ? spec.allowedMimeTypes
        : undefined,
      fileSizeLimit: spec.fileSizeLimit,
    });

    if (error) {
      // Supabase returns "already exists" as an error in some SDK versions
      if (error.message.toLowerCase().includes('already exist')) {
        process.stdout.write('ALREADY EXISTS\n');
        results.push({ id: spec.id, status: 'already-exists' });
      } else {
        process.stdout.write(`ERROR — ${error.message}\n`);
        results.push({ id: spec.id, status: 'error', message: error.message });
      }
    } else {
      process.stdout.write('CREATED\n');
      results.push({ id: spec.id, status: 'created' });
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(55));
  console.log('Summary');
  console.log('─'.repeat(55));
  for (const r of results) {
    const icon =
      r.status === 'created'
        ? '[+]'
        : r.status === 'already-exists'
        ? '[=]'
        : '[!]';
    console.log(`  ${icon} ${pad(r.id, 22)} ${r.status}${r.message ? ` (${r.message})` : ''}`);
  }

  const created = results.filter((r) => r.status === 'created').length;
  const errors = results.filter((r) => r.status === 'error').length;

  console.log('\n' + '─'.repeat(55));
  console.log(`  ${created} created  |  ${results.length - created - errors} already existed  |  ${errors} errors`);

  // ── Bucket specs table ───────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(55));
  console.log('Bucket specs:');
  for (const spec of BUCKETS) {
    console.log(
      `  ${pad(spec.id, 20)}  public=${String(spec.public).padEnd(5)}  limit=${formatBytes(spec.fileSizeLimit).padEnd(6)}  ${spec.description}`
    );
  }

  // ── CORS reminder ────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(55));
  console.log('CORS — configure in Supabase Dashboard → Storage → Policies:');
  for (const origin of CORS_ALLOWED_ORIGINS) {
    console.log(`  ${origin}`);
  }
  console.log('─'.repeat(55));

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n[provision-storage] Unhandled error:', err);
  process.exit(1);
});
