/**
 * Arcanea — Upload Local Guardian Images to Supabase Storage
 *
 * Walks apps/web/public/guardians/ and uploads every .webp file to
 * the `arcanea-gallery` bucket, mirroring the directory structure.
 *
 * Files that already exist in Storage are skipped (no overwrite by default).
 * Pass --force to overwrite existing files.
 *
 * Usage:
 *   npx tsx scripts/upload-local-to-supabase.ts
 *   npx tsx scripts/upload-local-to-supabase.ts --force
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL  (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ── Env ───────────────────────────────────────────────────────────────────────

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL) {
  console.error('[upload] ERROR: Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)');
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error('[upload] ERROR: Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// ── Config ────────────────────────────────────────────────────────────────────

const BUCKET = 'arcanea-gallery';
const FORCE_OVERWRITE = process.argv.includes('--force');

// Resolve the guardians directory relative to the repo root
const REPO_ROOT = path.resolve(__dirname, '..');
const GUARDIANS_DIR = path.join(REPO_ROOT, 'apps', 'web', 'public', 'guardians');

// Storage prefix — mirrors the /public path
const STORAGE_PREFIX = 'guardians';

// ── Types ─────────────────────────────────────────────────────────────────────

interface UploadTask {
  /** Absolute filesystem path */
  localPath: string;
  /** Path within the bucket, e.g. "guardians/v3/draconia-hero-v3.webp" */
  storagePath: string;
  /** File name only, for display */
  filename: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively collects all .webp files under a directory.
 */
function collectWebpFiles(dir: string, base: string): UploadTask[] {
  const tasks: UploadTask[] = [];

  if (!fs.existsSync(dir)) {
    return tasks;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      tasks.push(...collectWebpFiles(fullPath, path.join(base, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.webp')) {
      tasks.push({
        localPath: fullPath,
        storagePath: path.join(base, entry.name).replace(/\\/g, '/'),
        filename: entry.name,
      });
    }
  }

  return tasks;
}

/**
 * Lists all objects in the bucket under a given prefix.
 * Returns a Set of storage paths for O(1) existence checks.
 */
async function fetchExistingPaths(
  supabase: SupabaseClient,
  prefix: string
): Promise<Set<string>> {
  const existing = new Set<string>();
  let offset = 0;
  const PAGE_SIZE = 1000;

  // Supabase Storage `list()` is paginated and non-recursive.
  // We walk subdirectories by listing known folder names from the task list.
  // Instead of a full recursive list (slow), we do a single top-level check here
  // and let the upload step handle "already exists" errors for nested paths.

  // List the top-level prefix to seed known paths
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: PAGE_SIZE, offset });

  if (error) {
    console.warn(`[upload] Warning: could not pre-fetch existing paths — ${error.message}`);
    return existing;
  }

  for (const item of data ?? []) {
    existing.add(`${prefix}/${item.name}`);
  }

  return existing;
}

/**
 * Check whether a single storage path exists by attempting a download of
 * zero bytes. Returns true if the object exists, false otherwise.
 *
 * This is the most reliable per-file existence check available via the JS SDK.
 */
async function fileExistsInStorage(
  supabase: SupabaseClient,
  storagePath: string
): Promise<boolean> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (!error) return true;

  // "Object not found" means the file does not exist
  if (
    error.message.includes('Object not found') ||
    error.message.includes('not found') ||
    error.message.includes('404')
  ) {
    return false;
  }

  // Any other error — assume it doesn't exist so we attempt the upload
  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\nArcanea — Upload Local Guardians to Supabase Storage');
  console.log('═'.repeat(60));
  console.log(`Source  : ${GUARDIANS_DIR}`);
  console.log(`Bucket  : ${BUCKET}`);
  console.log(`Prefix  : ${STORAGE_PREFIX}`);
  console.log(`Mode    : ${FORCE_OVERWRITE ? 'OVERWRITE (--force)' : 'SKIP existing'}`);
  console.log('═'.repeat(60));

  if (!fs.existsSync(GUARDIANS_DIR)) {
    console.error(`\nERROR: Guardians directory not found:\n  ${GUARDIANS_DIR}`);
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Collect all .webp files
  const tasks = collectWebpFiles(GUARDIANS_DIR, STORAGE_PREFIX);

  if (tasks.length === 0) {
    console.log('\nNo .webp files found. Nothing to do.');
    return;
  }

  console.log(`\nFound ${tasks.length} .webp file(s)\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures: Array<{ storagePath: string; message: string }> = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const progress = `${String(i + 1).padStart(String(tasks.length).length)}/${tasks.length}`;

    // Skip check (unless --force)
    if (!FORCE_OVERWRITE) {
      const exists = await fileExistsInStorage(supabase, task.storagePath);
      if (exists) {
        console.log(`  [skip]  ${progress} — ${task.filename}`);
        skipped++;
        continue;
      }
    }

    // Read file
    let buffer: Buffer;
    try {
      buffer = fs.readFileSync(task.localPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [fail]  ${progress} — ${task.filename} — read error: ${message}`);
      failures.push({ storagePath: task.storagePath, message });
      failed++;
      continue;
    }

    // Upload
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(task.storagePath, buffer, {
        contentType: 'image/webp',
        upsert: FORCE_OVERWRITE,
        cacheControl: '31536000', // 1 year CDN cache for static guardian art
      });

    if (error) {
      // Treat "already exists" as a skip, not a failure
      if (
        error.message.toLowerCase().includes('already exist') ||
        error.message.toLowerCase().includes('duplicate')
      ) {
        console.log(`  [skip]  ${progress} — ${task.filename}`);
        skipped++;
      } else {
        console.error(`  [fail]  ${progress} — ${task.filename} — ${error.message}`);
        failures.push({ storagePath: task.storagePath, message: error.message });
        failed++;
      }
    } else {
      console.log(`  [ok]    ${progress} — ${task.filename}`);
      uploaded++;
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log(
    `  Uploaded ${uploaded}  |  Skipped ${skipped}  |  Failed ${failed}  |  Total ${tasks.length}`
  );

  if (failures.length > 0) {
    console.log('\nFailed uploads:');
    for (const f of failures) {
      console.error(`  [!] ${f.storagePath}\n      ${f.message}`);
    }
    process.exit(1);
  }

  console.log('\nDone.\n');
}

main().catch((err) => {
  console.error('\n[upload] Unhandled error:', err);
  process.exit(1);
});
