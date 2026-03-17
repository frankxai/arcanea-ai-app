/**
 * POST /api/storage/upload
 *
 * Uploads a file to the appropriate Supabase Storage bucket based on the
 * `category` field in the FormData metadata.
 *
 * FormData fields:
 *   file      — the binary file (required)
 *   category  — one of: gallery | creation | brand | profile (required)
 *   path      — optional sub-path within the bucket (e.g. "guardians/v3")
 *
 * Returns:
 *   { url: string, path: string, bucket: string }
 *
 * Errors:
 *   401  Unauthorized        — no valid session
 *   400  Bad Request         — missing file or category
 *   413  Payload Too Large   — exceeds per-bucket size limit
 *   415  Unsupported Media   — MIME type not allowed for this category
 *   500  Internal Error      — Supabase upload failure
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// ── Constants ─────────────────────────────────────────────────────────────────

const IMAGE_TYPES = new Set(['image/webp', 'image/png', 'image/jpeg', 'image/gif']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;   // 10 MB
const VIDEO_SIZE_LIMIT = 100 * 1024 * 1024;  // 100 MB

// ── Category → bucket mapping ─────────────────────────────────────────────────

type Category = 'gallery' | 'creation' | 'brand' | 'profile';

interface BucketPolicy {
  bucketId: string;
  allowedTypes: Set<string>;
  maxBytes: number;
  /** Whether uploads are restricted to the user's own folder */
  userScoped: boolean;
}

const BUCKET_POLICIES: Record<Category, BucketPolicy> = {
  gallery: {
    bucketId: 'arcanea-gallery',
    allowedTypes: IMAGE_TYPES,
    maxBytes: IMAGE_SIZE_LIMIT,
    userScoped: false,
  },
  creation: {
    bucketId: 'user-creations',
    allowedTypes: new Set([...IMAGE_TYPES, ...VIDEO_TYPES]),
    maxBytes: VIDEO_SIZE_LIMIT,
    userScoped: true,
  },
  brand: {
    bucketId: 'brand-assets',
    allowedTypes: new Set([...IMAGE_TYPES, 'image/svg+xml']),
    maxBytes: IMAGE_SIZE_LIMIT,
    userScoped: false,
  },
  profile: {
    bucketId: 'profile-assets',
    allowedTypes: IMAGE_TYPES,
    maxBytes: IMAGE_SIZE_LIMIT,
    userScoped: true,
  },
};

const VALID_CATEGORIES = new Set<string>(Object.keys(BUCKET_POLICIES));

// ── Path sanitiser ────────────────────────────────────────────────────────────

/**
 * Validates and normalises a sub-path so it cannot escape the bucket root.
 * Returns null if the path is invalid.
 */
function sanitisePath(raw: string): string | null {
  // Strip leading/trailing slashes and whitespace
  const cleaned = raw.trim().replace(/^\/+|\/+$/g, '');

  // Reject directory traversal attempts
  if (cleaned.includes('..') || cleaned.includes('\0')) {
    return null;
  }

  // Allow only alphanumeric, hyphens, underscores, dots, and slashes
  if (!/^[a-zA-Z0-9._\-/]*$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

// ── Supabase admin client (bypasses RLS for gallery/brand writes) ──────────────

function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!url || !key) {
    throw new Error('Supabase env vars not configured.');
  }

  return createAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Authenticate — require a valid session for all uploads
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse FormData
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  // Validate file
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate category
  const rawCategory = form.get('category');
  if (typeof rawCategory !== 'string' || !VALID_CATEGORIES.has(rawCategory)) {
    return NextResponse.json(
      {
        error: `Invalid category. Must be one of: ${[...VALID_CATEGORIES].join(', ')}`,
      },
      { status: 400 }
    );
  }
  const category = rawCategory as Category;
  const policy = BUCKET_POLICIES[category];

  // Validate MIME type
  if (!policy.allowedTypes.has(file.type)) {
    return NextResponse.json(
      {
        error: `File type "${file.type}" is not allowed for category "${category}". ` +
          `Allowed types: ${[...policy.allowedTypes].join(', ')}`,
      },
      { status: 415 }
    );
  }

  // Validate file size
  if (file.size > policy.maxBytes) {
    const limitMB = policy.maxBytes / (1024 * 1024);
    return NextResponse.json(
      { error: `File exceeds the ${limitMB} MB limit for category "${category}"` },
      { status: 413 }
    );
  }

  // Validate and build storage path
  const rawSubPath = form.get('path');
  let subPath = '';

  if (typeof rawSubPath === 'string' && rawSubPath.trim() !== '') {
    const safe = sanitisePath(rawSubPath);
    if (safe === null) {
      return NextResponse.json(
        { error: 'Invalid path — must not contain "..", null bytes, or special characters' },
        { status: 400 }
      );
    }
    subPath = safe;
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const filename = `${crypto.randomUUID()}.${ext}`;

  // User-scoped categories enforce a user-id folder prefix
  const storagePath = policy.userScoped
    ? [user.id, subPath, filename].filter(Boolean).join('/')
    : [subPath, filename].filter(Boolean).join('/');

  // Upload via admin client (service role key) so RLS does not block writes.
  // RLS read policies still protect the objects at retrieval time.
  let adminClient;
  try {
    adminClient = getAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server misconfiguration';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const bytes = await file.arrayBuffer();

  const { data: uploadData, error: uploadError } = await adminClient.storage
    .from(policy.bucketId)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: '3600',
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = adminClient.storage.from(policy.bucketId).getPublicUrl(uploadData.path);

  return NextResponse.json(
    {
      url: publicUrl,
      path: uploadData.path,
      bucket: policy.bucketId,
    },
    { status: 201 }
  );
}
