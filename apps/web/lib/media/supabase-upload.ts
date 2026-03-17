/**
 * Supabase Storage Upload Utility
 *
 * Uploads images to the Supabase Storage bucket 'arcanea-gallery'.
 * Can be called from API routes or scripts.
 *
 * Uses the admin (service-role) client so uploads are not gated by RLS.
 * The bucket is public — uploaded objects are readable without auth.
 *
 * Bucket layout mirrors the /public directory structure:
 *   arcanea-gallery/guardians/v3/{name}-hero-v3.webp
 *   arcanea-gallery/guardians/v2/{name}-divine-bond.webp
 *   arcanea-gallery/guardians/v2/{godbeast}-godbeast.webp
 *   arcanea-gallery/guardians/{name}-hero.webp
 *   arcanea-gallery/guardians/gallery/{name}-gallery-{N}.webp
 *   arcanea-gallery/images/luminors/{NN}-{slug}.jpg
 *   arcanea-gallery/user/{userId}/{filename}
 */

import { createClient } from '@supabase/supabase-js';

// ── Constants ────────────────────────────────────────────────────────────────

const BUCKET = 'arcanea-gallery' as const;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// ── Types ────────────────────────────────────────────────────────────────────

export interface UploadOptions {
  /**
   * Storage path within the bucket, e.g. "guardians/v3/draconia-hero-v3.webp".
   * Do NOT include the bucket name.
   */
  storagePath: string;
  /** File data — Buffer, Blob, ReadableStream, or base64 string */
  data: Buffer | Blob | ReadableStream | string;
  /** MIME type, e.g. "image/webp". Defaults to "image/webp". */
  contentType?: string;
  /**
   * If true, overwrite an existing object at storagePath.
   * Defaults to false (will error if the path already exists).
   */
  upsert?: boolean;
}

export interface UploadResult {
  /** Public URL of the uploaded object */
  publicUrl: string;
  /** Storage path within the bucket */
  storagePath: string;
  /** Supabase bucket ID */
  bucket: string;
}

export interface UploadError {
  message: string;
  storagePath: string;
}

// ── Client factory ───────────────────────────────────────────────────────────

/**
 * Creates a one-off admin Supabase client.
 * Does NOT use the shared server client to avoid cookie machinery
 * (this utility is used in scripts as well as API routes).
 *
 * @throws {Error} if SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.
 */
function getAdminClient() {
  if (!SUPABASE_URL) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) environment variable.'
    );
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'Admin upload requires the service-role key.'
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Core upload function ─────────────────────────────────────────────────────

/**
 * Uploads a single file to Supabase Storage and returns its public URL.
 *
 * @example
 * const result = await uploadToStorage({
 *   storagePath: 'guardians/v3/draconia-hero-v3.webp',
 *   data: fs.readFileSync('./draconia-hero-v3.webp'),
 *   contentType: 'image/webp',
 *   upsert: true,
 * });
 * console.log(result.publicUrl);
 */
export async function uploadToStorage(options: UploadOptions): Promise<UploadResult> {
  const {
    storagePath,
    data,
    contentType = 'image/webp',
    upsert = false,
  } = options;

  // Validate storage path — prevent directory traversal
  if (!storagePath || storagePath.includes('..') || storagePath.startsWith('/')) {
    throw new Error(
      `Invalid storagePath "${storagePath}". ` +
      'Must be a relative path without leading slash or ".." segments.'
    );
  }

  const supabase = getAdminClient();

  // Convert base64 string to Buffer if needed
  let uploadData: Buffer | Blob | ReadableStream;
  if (typeof data === 'string') {
    // Strip optional data URL header (e.g. "data:image/webp;base64,")
    const base64 = data.replace(/^data:[^;]+;base64,/, '');
    uploadData = Buffer.from(base64, 'base64');
  } else {
    uploadData = data;
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, uploadData, {
      contentType,
      upsert,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Supabase upload failed for "${storagePath}": ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return {
    publicUrl: urlData.publicUrl,
    storagePath,
    bucket: BUCKET,
  };
}

// ── Batch upload ─────────────────────────────────────────────────────────────

export interface BatchUploadItem {
  storagePath: string;
  data: Buffer | Blob | ReadableStream | string;
  contentType?: string;
  upsert?: boolean;
}

export interface BatchUploadResult {
  succeeded: UploadResult[];
  failed: UploadError[];
}

/**
 * Uploads multiple files sequentially (to avoid rate-limiting).
 * Failures are collected and returned — a single failure does not abort the batch.
 *
 * @example
 * const items = files.map((f) => ({
 *   storagePath: `guardians/gallery/${f.name}`,
 *   data: f.buffer,
 *   contentType: 'image/webp',
 *   upsert: true,
 * }));
 * const { succeeded, failed } = await batchUpload(items);
 */
export async function batchUpload(items: BatchUploadItem[]): Promise<BatchUploadResult> {
  const succeeded: UploadResult[] = [];
  const failed: UploadError[] = [];

  for (const item of items) {
    try {
      const result = await uploadToStorage(item);
      succeeded.push(result);
    } catch (err) {
      failed.push({
        storagePath: item.storagePath,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { succeeded, failed };
}

// ── Public URL helpers ───────────────────────────────────────────────────────

/**
 * Returns the public Supabase Storage URL for a known storage path
 * WITHOUT making a network request.
 *
 * Useful for pre-computing CDN URLs from the image registry.
 */
export function getPublicUrl(storagePath: string): string {
  if (!SUPABASE_URL) return '';
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

/**
 * Converts a /public path (e.g. "/guardians/v3/draconia-hero-v3.webp")
 * to its expected Supabase storage path (strips leading slash).
 *
 * The Supabase bucket mirrors the /public layout so the conversion is trivial.
 */
export function publicPathToStoragePath(publicPath: string): string {
  return publicPath.startsWith('/') ? publicPath.slice(1) : publicPath;
}

/**
 * Deletes a file from Supabase Storage.
 * Primarily for cleanup scripts.
 */
export async function deleteFromStorage(storagePath: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) {
    throw new Error(`Supabase delete failed for "${storagePath}": ${error.message}`);
  }
}
