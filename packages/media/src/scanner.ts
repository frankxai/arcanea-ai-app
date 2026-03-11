/**
 * @arcanea/media — Scanner
 * Walks a directory tree, builds MediaEntry objects, deduplicates.
 * Guardian: Lyssandria (Foundation Gate, 174 Hz) — Earth, stability
 */

import { createHash } from 'node:crypto';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, extname, basename, relative } from 'node:path';
import { detectGuardian, GUARDIANS } from './canon.js';
import type { MediaEntry, MediaSource, MediaType } from './types.js';

export const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
export const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.avi', '.mkv']);

const UUID_RE   = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const GROK_V_RE = /^grok_video_(\d{4}-\d{2}-\d{2})/i;
const GROK_I_RE = /^grok_image_(\d+)/i;
const LV_RE     = /^lv_\d+/i;
const MJ_USER   = /^frankx\d+_/i;

// ── Filename parsing ─────────────────────────────────────────────────────────

function parseFilename(name: string, stem: string): { description: string; source: MediaSource } {
  // Midjourney: frankx77_Description_words_<uuid>
  if (UUID_RE.test(stem) && MJ_USER.test(stem)) {
    const s = stem
      .replace(MJ_USER, '')
      .replace(UUID_RE, '')
      .replace(/[_-]+$/, '')
      .replace(/_/g, ' ')
      .trim();
    return { description: s, source: 'midjourney' };
  }
  const gv = GROK_V_RE.exec(name);
  if (gv) return { description: `Grok video ${gv[1]}`, source: 'grok-video' };
  const gi = GROK_I_RE.exec(name);
  if (gi) return { description: `Grok image ${gi[1]}`, source: 'grok-image' };
  if (LV_RE.test(name)) return { description: `Grok clip ${stem.slice(0, 20)}`, source: 'grok-video' };
  return {
    description: stem.replace(/[_-]+/g, ' ').trim(),
    source: 'manual',
  };
}

// ── Tagging ──────────────────────────────────────────────────────────────────

function autoTags(
  guardian: string | null,
  folder: string,
  scene: string,
  type: string,
  source: string
): string[] {
  const tags = new Set<string>();
  if (guardian) {
    const info = GUARDIANS[guardian as keyof typeof GUARDIANS];
    tags.add(`guardian:${guardian.toLowerCase()}`);
    tags.add(`gate:${info.gate.toLowerCase()}`);
    tags.add(`element:${info.element.toLowerCase()}`);
    tags.add(`hz:${info.frequency}`);
    tags.add(`godbeast:${info.godbeast.toLowerCase()}`);
  }
  tags.add(`source:${source}`);
  tags.add(`type:${type}`);

  const ctx = `${folder} ${scene}`.toLowerCase();
  if (/portrait|face|close/.test(ctx))             tags.add('style:portrait');
  if (/dragon|godbeast|beast|creature/.test(ctx))  tags.add('content:godbeast');
  if (/battle|armor|warrior|fight/.test(ctx))      tags.add('content:action');
  if (/embrace|love|tender|lovingly/.test(ctx))    tags.add('content:emotional');
  if (/community|group|together|crowd/.test(ctx))  tags.add('content:world-building');
  if (/tree|forest|earth|wooden|nature/.test(ctx)) tags.add('content:nature');
  if (/logo/.test(ctx))                            tags.add('category:logo');
  if (/band/.test(ctx))                            tags.add('category:music');
  if (/2026/.test(ctx))                            tags.add('campaign:2026');

  return [...tags].sort();
}

// ── Naming ───────────────────────────────────────────────────────────────────

function slugify(text: string, max = 40): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, max)
    .replace(/-+$/, '');
}

// ── Fast hash (first 128 KB + size) ─────────────────────────────────────────

async function fastHash(filePath: string): Promise<string> {
  return new Promise(resolve => {
    try {
      const size = statSync(filePath).size;
      const hash = createHash('sha256');
      hash.update(String(size));
      const stream = createReadStream(filePath, { start: 0, end: 131071 });
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end',  () => resolve(hash.digest('hex').slice(0, 16)));
      stream.on('error', () => resolve(Math.random().toString(36).slice(2, 18)));
    } catch {
      resolve(Math.random().toString(36).slice(2, 18));
    }
  });
}

// ── Scanner ──────────────────────────────────────────────────────────────────

export interface ScanProgress {
  found:     number;
  processed: number;
  total:     number;
}

export async function scanDirectory(
  rootPath: string,
  onProgress?: (p: ScanProgress) => void
): Promise<MediaEntry[]> {
  if (!existsSync(rootPath)) {
    throw new Error(`Path not found: ${rootPath}`);
  }

  // Collect all files first
  const allFiles: string[] = [];
  async function walk(dir: string) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
          await walk(full);
        } else {
          const ext = extname(e.name).toLowerCase();
          if (IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)) allFiles.push(full);
        }
      }
    } catch { /* skip permission errors */ }
  }
  await walk(rootPath);

  const results: MediaEntry[] = [];
  const hashMap = new Map<string, string>();
  const counters: Record<string, number> = {};

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    onProgress?.({ found: allFiles.length, processed: i, total: allFiles.length });

    try {
      const ext      = extname(filePath).toLowerCase();
      const name     = basename(filePath);
      const stem     = name.slice(0, name.length - ext.length);
      const mtype: MediaType = IMAGE_EXTS.has(ext) ? 'image' : 'video';
      const stat     = statSync(filePath);
      const rel      = relative(rootPath, filePath);
      const parts    = rel.split(/[/\\]/);
      const folder   = parts.length > 1 ? parts[0] : 'root';
      const parsed   = parseFilename(name, stem);
      const guardian = detectGuardian(`${stem} ${folder}`);
      const fhash    = await fastHash(filePath);
      const dupOf    = hashMap.get(fhash) ?? null;
      if (!dupOf) hashMap.set(fhash, filePath);

      // Suggested name
      const prefix = guardian?.toLowerCase() ?? 'arcanea';
      const slug   = slugify(parsed.description.slice(0, 50));
      const ckey   = `${prefix}-${mtype}`;
      counters[ckey] = (counters[ckey] ?? 0) + 1;
      const n      = String(counters[ckey]).padStart(3, '0');
      const newExt = mtype === 'image' ? '.webp' : ext;
      const suggestedName = slug ? `${prefix}-${slug}-${n}${newExt}` : `${prefix}-${mtype}-${n}${newExt}`;

      const gInfo = guardian ? GUARDIANS[guardian] : null;

      results.push({
        id:             fhash,
        original_path:  filePath,
        original_name:  name,
        suggested_name: suggestedName,
        type:           mtype,
        extension:      ext,
        size_bytes:     stat.size,
        size_mb:        Math.round(stat.size / 1_048_576 * 100) / 100,
        folder,
        guardian,
        gate:           gInfo?.gate       ?? null,
        element:        gInfo?.element    ?? null,
        frequency_hz:   gInfo?.frequency  ?? null,
        godbeast:       gInfo?.godbeast   ?? null,
        source:         parsed.source,
        scene:          parsed.description,
        tags:           autoTags(guardian, folder, parsed.description, mtype, parsed.source),
        status:         'review',
        quality_tier:   null,
        duplicate_of:   dupOf,
        notes:          '',
        thumbnail_path: null,
        webp_path:      null,
        width:          null,
        height:         null,
        duration_s:     null,
      });
    } catch { /* skip unreadable files */ }
  }

  return results;
}
