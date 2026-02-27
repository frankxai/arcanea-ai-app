/**
 * @arcanea/media — Catalog
 * Manifest persistence and query layer.
 * Guardian: Lyria (Sight Gate, 639 Hz) — Vision, knowledge
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { MediaEntry, MediaManifest, MediaStatus, QualityTier, GuardianName } from './types.js';

const VERSION = '1.0.0';

export class MediaCatalog {
  private manifest: MediaManifest;

  constructor(private manifestPath: string) {
    this.manifest = this.load();
  }

  private load(): MediaManifest {
    if (existsSync(this.manifestPath)) {
      try {
        return JSON.parse(readFileSync(this.manifestPath, 'utf-8')) as MediaManifest;
      } catch { /* fall through */ }
    }
    return {
      generated:     new Date().toISOString(),
      version:       VERSION,
      root_path:     '',
      total_files:   0,
      total_size_mb: 0,
      duplicates:    0,
      by_type:       {},
      by_guardian:   {},
      by_source:     {},
      media:         [],
    };
  }

  save(): void {
    mkdirSync(dirname(this.manifestPath), { recursive: true });
    this.manifest.generated = new Date().toISOString();
    writeFileSync(this.manifestPath, JSON.stringify(this.manifest, null, 2), 'utf-8');
  }

  // ── Populate from scan results ─────────────────────────────────────────────

  fromScan(entries: MediaEntry[], rootPath: string): void {
    const dupes = entries.filter(e => e.duplicate_of).length;
    const totalMB = entries.reduce((s, e) => s + e.size_mb, 0);

    const byType: Record<string, number> = {};
    const byGuardian: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    for (const e of entries) {
      byType[e.type] = (byType[e.type] ?? 0) + 1;
      const g = e.guardian ?? 'Unassigned';
      byGuardian[g] = (byGuardian[g] ?? 0) + 1;
      bySource[e.source] = (bySource[e.source] ?? 0) + 1;
    }

    this.manifest = {
      generated:     new Date().toISOString(),
      version:       VERSION,
      root_path:     rootPath,
      total_files:   entries.length,
      total_size_mb: Math.round(totalMB * 10) / 10,
      duplicates:    dupes,
      by_type:       byType,
      by_guardian:   Object.fromEntries(
        Object.entries(byGuardian).sort(([,a],[,b]) => b - a)
      ),
      by_source:     bySource,
      media:         entries,
    };
  }

  // ── Query ──────────────────────────────────────────────────────────────────

  get all(): MediaEntry[]           { return this.manifest.media; }
  get stats(): Omit<MediaManifest, 'media'> {
    const { media: _, ...rest } = this.manifest;
    return rest;
  }

  find(id: string): MediaEntry | undefined {
    return this.manifest.media.find(e => e.id === id);
  }

  filter(predicate: (e: MediaEntry) => boolean): MediaEntry[] {
    return this.manifest.media.filter(predicate);
  }

  byGuardian(name: GuardianName): MediaEntry[] {
    return this.filter(e => e.guardian === name);
  }

  byStatus(status: MediaStatus): MediaEntry[] {
    return this.filter(e => e.status === status);
  }

  approved(): MediaEntry[]  { return this.byStatus('approved'); }
  duplicates(): MediaEntry[] { return this.filter(e => !!e.duplicate_of); }

  search(query: string): MediaEntry[] {
    const q = query.toLowerCase();
    return this.filter(e =>
      e.scene.toLowerCase().includes(q) ||
      e.original_name.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q)) ||
      (e.guardian ?? '').toLowerCase().includes(q)
    );
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  updateStatus(id: string, status: MediaStatus): boolean {
    const e = this.find(id);
    if (!e) return false;
    e.status = status;
    return true;
  }

  setQualityTier(id: string, tier: QualityTier): boolean {
    const e = this.find(id);
    if (!e) return false;
    e.quality_tier = tier;
    return true;
  }

  addTag(id: string, tag: string): boolean {
    const e = this.find(id);
    if (!e) return false;
    if (!e.tags.includes(tag)) e.tags.push(tag);
    return true;
  }

  updateFromProcessResult(id: string, updates: Partial<MediaEntry>): boolean {
    const idx = this.manifest.media.findIndex(e => e.id === id);
    if (idx < 0) return false;
    this.manifest.media[idx] = { ...this.manifest.media[idx], ...updates };
    return true;
  }

  // ── Bulk operations ───────────────────────────────────────────────────────

  archiveAllDuplicates(): number {
    let count = 0;
    for (const e of this.manifest.media) {
      if (e.duplicate_of && e.status !== 'archived') {
        e.status = 'archived';
        count++;
      }
    }
    return count;
  }

  exportForSite(): MediaEntry[] {
    return this.filter(e =>
      e.status === 'approved' &&
      !e.duplicate_of &&
      (e.quality_tier === 1 || e.quality_tier === 2)
    );
  }
}
