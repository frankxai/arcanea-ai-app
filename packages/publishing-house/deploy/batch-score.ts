/**
 * Batch TASTE Scoring — Run the quality gate across all markdown files in book/
 *
 * Reports a fleet-wide quality dashboard:
 *   - Total chapters scored
 *   - Distribution by tier (hero / gallery / thumbnail / reject)
 *   - Top 10 heroes
 *   - Bottom 10 needing revision
 *   - Average scores per dimension
 *
 * Usage: node packages/publishing-house/dist/deploy/batch-score.js [directory]
 * Default directory: book/
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { scoreTASTE } from '../quality/taste-gate.js';
import type { TasteResult } from '../quality/types.js';

const ARCANEA_WORLD_CONTEXT = {
  characters: [
    'Lumina', 'Nero', 'Arcanea', 'Shinkami', 'Lyria', 'Draconia',
    'Lyssandria', 'Maylinn', 'Elara', 'Alera', 'Aiyami', 'Ino',
    'Ismael', 'Leyla', 'Pyreth', 'Taelith', 'Kaelith', 'Veloura',
    'Laeylinn', 'Kyuro',
  ],
  factions: [
    'Starlight Corps', 'Void Ascendant', 'Academy', 'Draconian Academy',
    'Arcanean Assembly', 'Gate Watchers',
  ],
  locations: [
    'Academy', 'Thalmaris', 'Arcanea', 'Crystalpeak', 'The Ten Gates',
  ],
};

interface Scored {
  path: string;
  wordCount: number;
  result: TasteResult;
}

async function walkMarkdown(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        results.push(...(await walkMarkdown(full)));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(full);
      }
    }
  } catch {
    // Directory not accessible, skip
  }
  return results;
}

async function scoreFile(path: string): Promise<Scored | null> {
  try {
    const content = await readFile(path, 'utf-8');
    if (content.length < 200) return null; // skip stubs

    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    const collectionMatch = content.match(/^series:\s*["']?([^"'\n]+)["']?/m);
    const title = titleMatch?.[1] ?? path.split(/[\\/]/).pop() ?? 'Untitled';
    const collection = collectionMatch?.[1] ?? undefined;

    const result = await scoreTASTE({
      content,
      metadata: {
        title,
        author: 'FrankX',
        language: 'en',
        collection,
      },
      worldContext: ARCANEA_WORLD_CONTEXT,
    });

    return {
      path,
      wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
      result,
    };
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const targetDir = resolve(process.argv[2] ?? 'book');
  const startedAt = Date.now();

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        Arcanea Publishing House — Batch TASTE Score     ║');
  console.log('║        Fleet-wide Quality Dashboard                      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`► Scanning: ${targetDir}`);

  const files = await walkMarkdown(targetDir);
  console.log(`  found: ${files.length} markdown files`);
  console.log('');

  console.log('► Scoring...');
  const scored: Scored[] = [];
  let skipped = 0;

  let i = 0;
  for (const file of files) {
    i++;
    if (i % 50 === 0) {
      console.log(`  ${i}/${files.length} scored, ${skipped} skipped`);
    }
    const result = await scoreFile(file);
    if (result) {
      scored.push(result);
    } else {
      skipped++;
    }
  }

  console.log(`  ${scored.length} scored, ${skipped} skipped`);
  console.log('');

  // Tier distribution
  const tiers = { hero: 0, gallery: 0, thumbnail: 0, reject: 0 };
  for (const s of scored) tiers[s.result.tier]++;

  // Average dimensions
  const totals = { technical: 0, aesthetic: 0, canon: 0, impact: 0, uniqueness: 0, total: 0 };
  for (const s of scored) {
    totals.technical += s.result.technical;
    totals.aesthetic += s.result.aesthetic;
    totals.canon += s.result.canon;
    totals.impact += s.result.impact;
    totals.uniqueness += s.result.uniqueness;
    totals.total += s.result.total;
  }
  const n = scored.length || 1;
  const avg = {
    technical: Math.round(totals.technical / n),
    aesthetic: Math.round(totals.aesthetic / n),
    canon: Math.round(totals.canon / n),
    impact: Math.round(totals.impact / n),
    uniqueness: Math.round(totals.uniqueness / n),
    total: Math.round(totals.total / n),
  };

  // Sort for top/bottom
  const sortedDesc = [...scored].sort((a, b) => b.result.total - a.result.total);
  const top10 = sortedDesc.slice(0, 10);
  const bottom10 = sortedDesc.slice(-10).reverse();

  // Render report
  console.log('═══════════════════════════════════════════════════════════');
  console.log('TIER DISTRIBUTION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  HERO      (80+):  ${String(tiers.hero).padStart(4)}  ${'█'.repeat(Math.round(tiers.hero / n * 40))}`);
  console.log(`  GALLERY   (60-79): ${String(tiers.gallery).padStart(4)}  ${'█'.repeat(Math.round(tiers.gallery / n * 40))}`);
  console.log(`  THUMBNAIL (40-59): ${String(tiers.thumbnail).padStart(4)}  ${'█'.repeat(Math.round(tiers.thumbnail / n * 40))}`);
  console.log(`  REJECT    (<40):   ${String(tiers.reject).padStart(4)}  ${'█'.repeat(Math.round(tiers.reject / n * 40))}`);
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('AVERAGE DIMENSIONS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  T  Technical:  ${String(avg.technical).padStart(3)}/100`);
  console.log(`  A  Aesthetic:  ${String(avg.aesthetic).padStart(3)}/100`);
  console.log(`  S  Canon:      ${String(avg.canon).padStart(3)}/100`);
  console.log(`  T  Impact:     ${String(avg.impact).padStart(3)}/100`);
  console.log(`  E  Uniqueness: ${String(avg.uniqueness).padStart(3)}/100`);
  console.log(`  ─────────────────`);
  console.log(`  TOTAL:         ${String(avg.total).padStart(3)}/100`);
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('TOP 10 HEROES');
  console.log('═══════════════════════════════════════════════════════════');
  for (const s of top10) {
    const rel = relative(targetDir, s.path);
    const trimmed = rel.length > 50 ? '...' + rel.slice(-47) : rel.padEnd(50);
    console.log(`  ${String(s.result.total).padStart(3)}/100  ${trimmed}`);
  }
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('BOTTOM 10 (Needs Revision)');
  console.log('═══════════════════════════════════════════════════════════');
  for (const s of bottom10) {
    const rel = relative(targetDir, s.path);
    const trimmed = rel.length > 50 ? '...' + rel.slice(-47) : rel.padEnd(50);
    console.log(`  ${String(s.result.total).padStart(3)}/100  ${trimmed}`);
  }
  console.log('');

  const durationMs = Date.now() - startedAt;
  const filesPerSec = scored.length / (durationMs / 1000);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Processed ${scored.length} files in ${(durationMs / 1000).toFixed(1)}s (${filesPerSec.toFixed(1)} files/sec)`);
  console.log(`Hero rate: ${((tiers.hero / n) * 100).toFixed(1)}%`);
  console.log(`Publishable (hero + gallery): ${(((tiers.hero + tiers.gallery) / n) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main().catch(err => {
  console.error('Batch scoring failed:', err);
  process.exit(1);
});
