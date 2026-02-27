/**
 * @arcanea/media — Processor
 * Local image/video processing. Zero API costs.
 * Guardian: Elara (Shift Gate, 852 Hz) — Transformation
 *
 * Images: sharp (libvips — fastest Node.js image lib)
 * Videos: fluent-ffmpeg wrapping system FFmpeg
 *
 * COSTS: $0 — all local processing, no external APIs needed.
 * Optional: Gemini Vision API for AI-based auto-tagging ($0.002/image)
 */

import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { MediaEntry, ProcessOptions, ProcessResult } from './types.js';

const DEFAULT_OPTIONS: ProcessOptions = {
  outputDir:          '',
  convertWebP:        true,
  maxWidth:           2400,
  webpQuality:        85,
  generateThumbs:     true,
  archiveDuplicates:  true,
  approvedOnly:       false,
};

// ── Sharp (images) ────────────────────────────────────────────────────────────

async function processImage(
  entry: MediaEntry,
  opts: ProcessOptions
): Promise<Partial<ProcessResult>> {
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default as unknown as typeof import('sharp');
  } catch {
    return { error: 'sharp not installed — run: npm install sharp' };
  }

  const dest = join(opts.outputDir, entry.guardian ?? 'unassigned');
  mkdirSync(dest, { recursive: true });

  const outPath = join(dest, entry.suggested_name);
  const thumbDir = join(opts.outputDir, '_thumbnails');
  mkdirSync(thumbDir, { recursive: true });
  const thumbPath = join(thumbDir, entry.suggested_name.replace(/\.[^.]+$/, '-thumb.webp'));

  try {
    const img = sharp(entry.original_path);
    const meta = await img.metadata();

    // Main conversion
    await img
      .resize({ width: opts.maxWidth, withoutEnlargement: true })
      .webp({ quality: opts.webpQuality })
      .toFile(outPath);

    // Thumbnail
    if (opts.generateThumbs) {
      await sharp(entry.original_path)
        .resize({ width: 320, height: 320, fit: 'cover' })
        .webp({ quality: 70 })
        .toFile(thumbPath);
    }

    const origSize = entry.size_bytes;
    const { size: newSize } = await import('node:fs').then(fs =>
      Promise.resolve(fs.statSync(outPath))
    );

    return {
      success:    true,
      webpPath:   outPath,
      thumbPath:  opts.generateThumbs ? thumbPath : undefined,
      savedBytes: origSize - newSize,
      entry: {
        ...entry,
        webp_path:      outPath,
        thumbnail_path: opts.generateThumbs ? thumbPath : null,
        width:          meta.width  ?? null,
        height:         meta.height ?? null,
      },
    };
  } catch (e: unknown) {
    return { error: String(e) };
  }
}

// ── FFmpeg (videos) ───────────────────────────────────────────────────────────

async function processVideo(
  entry: MediaEntry,
  opts: ProcessOptions
): Promise<Partial<ProcessResult>> {
  let ffmpeg: typeof import('fluent-ffmpeg');
  try {
    ffmpeg = (await import('fluent-ffmpeg')).default as unknown as typeof import('fluent-ffmpeg');
  } catch {
    return { error: 'fluent-ffmpeg not installed — run: npm install fluent-ffmpeg' };
  }

  const thumbDir = join(opts.outputDir, '_thumbnails');
  mkdirSync(thumbDir, { recursive: true });
  const thumbPath = join(thumbDir, entry.suggested_name.replace(/\.[^.]+$/, '-thumb.webp'));

  return new Promise(resolve => {
    ffmpeg(entry.original_path)
      .screenshots({
        timestamps: ['10%'],
        filename: entry.id + '-thumb.png',
        folder: thumbDir,
        size: '320x?',
      })
      .on('end', () => {
        resolve({
          success:   true,
          thumbPath,
          entry: { ...entry, thumbnail_path: thumbPath },
        });
      })
      .on('error', (e: Error) => {
        resolve({ error: `FFmpeg: ${e.message}` });
      });
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function processEntry(
  entry: MediaEntry,
  options: Partial<ProcessOptions> = {}
): Promise<ProcessResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!opts.outputDir) {
    return { entry, success: false, error: 'outputDir is required' };
  }

  if (entry.duplicate_of && !opts.archiveDuplicates) {
    return { entry, success: false, error: 'duplicate — skipped' };
  }

  const partial = entry.type === 'image'
    ? await processImage(entry, opts)
    : await processVideo(entry, opts);

  return {
    entry:      partial.entry ?? entry,
    success:    partial.error == null,
    webpPath:   partial.webpPath,
    thumbPath:  partial.thumbPath,
    savedBytes: partial.savedBytes,
    error:      partial.error,
  };
}

export async function processBatch(
  entries: MediaEntry[],
  options: Partial<ProcessOptions> = {},
  onProgress?: (done: number, total: number, result: ProcessResult) => void
): Promise<ProcessResult[]> {
  const toProcess = options.approvedOnly
    ? entries.filter(e => e.status === 'approved' && !e.duplicate_of)
    : entries.filter(e => !e.duplicate_of);

  const results: ProcessResult[] = [];
  let done = 0;

  // Process in batches of 4 to avoid memory pressure
  const BATCH = 4;
  for (let i = 0; i < toProcess.length; i += BATCH) {
    const chunk = toProcess.slice(i, i + BATCH);
    const chunkResults = await Promise.all(chunk.map(e => processEntry(e, options)));
    for (const r of chunkResults) {
      results.push(r);
      done++;
      onProgress?.(done, toProcess.length, r);
    }
  }

  return results;
}

/**
 * Cost transparency — no surprises.
 * All processing is LOCAL. $0 API cost.
 * Optional AI tagging via Gemini Vision: ~$0.002/image (disabled by default).
 */
export const PROCESSING_COSTS = {
  imageConversion:  '$0   — sharp/libvips, local CPU',
  videoThumbnail:   '$0   — FFmpeg, local CPU',
  videoCompression: '$0   — FFmpeg, local CPU',
  aiTagging:        '$0.002/image — Gemini Vision API (opt-in only)',
  storageVercelBlob:'$0.023/GB-month + $0.10/GB bandwidth',
  storageSupabase:  '$0 up to 1GB (free), $25/mo Pro = 100GB',
  storageR2:        '$0.015/GB-month, $0 egress (best at scale)',
};
