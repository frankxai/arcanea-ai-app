/**
 * End-to-End Demo — TASTE Gate → Pandoc Format → Artifacts
 *
 * Runs the full Scribe Claw pipeline on a real markdown file:
 *   1. Load content
 *   2. Score via TASTE 5D gate
 *   3. Decide: HERO → proceed, REJECT → stop with feedback
 *   4. Format via Pandoc (EPUB, PDF, DOCX, HTML)
 *   5. Report all artifacts with sizes and paths
 *
 * This is the script Frank runs for the client demo.
 * Usage:
 *   node packages/publishing-house/dist/deploy/e2e-demo.js <markdown-file>
 *
 * Env vars:
 *   PANDOC_PATH  — path to pandoc binary (defaults to ./pandoc or $PATH lookup)
 *   OUTPUT_DIR   — where to write artifacts (defaults to ./dist/e2e-output)
 */

import { readFile, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, extname, join, resolve } from 'node:path';

import { scoreTASTE } from '../quality/taste-gate.js';
import { loadClawKernel } from '../agents/kernel-loader.js';
import { PUBLISHING_LUMINORS, detectRuntime } from '../agents/hierarchy.js';

const execFileAsync = promisify(execFile);

const ARCANEA_WORLD_CONTEXT = {
  characters: [
    'Lumina', 'Nero', 'Arcanea', 'Shinkami', 'Lyria', 'Draconia',
    'Lyssandria', 'Maylinn', 'Elara', 'Alera', 'Aiyami', 'Ino',
    'Ismael', 'Leyla', 'Pyreth', 'Taelith',
  ],
  factions: ['Starlight Corps', 'Void Ascendant', 'Academy', 'Draconian Academy'],
  locations: ['Academy', 'Thalmaris', 'Arcanea', 'Crystalpeak'],
};

interface DemoResult {
  status: 'success' | 'rejected' | 'partial';
  sourcePath: string;
  wordCount: number;
  qualityScore: {
    technical: number;
    aesthetic: number;
    canon: number;
    impact: number;
    uniqueness: number;
    total: number;
    tier: string;
    passesGate: boolean;
  };
  artifacts: Array<{ format: string; path: string; sizeBytes: number }>;
  durationMs: number;
  feedback: string[];
}

function findPandocBinary(): string {
  // Priority: env var > common Windows install path > system PATH
  if (process.env.PANDOC_PATH) return process.env.PANDOC_PATH;

  const candidates = [
    'C:\\Users\\frank\\AppData\\Local\\Pandoc\\pandoc.exe',
    'C:\\Program Files\\Pandoc\\pandoc.exe',
    '/usr/local/bin/pandoc',
    'pandoc', // system PATH fallback
  ];

  return candidates[0] ?? 'pandoc';
}

async function runPandoc(
  pandocPath: string,
  sourcePath: string,
  outputPath: string,
  format: string,
): Promise<void> {
  await execFileAsync(pandocPath, [
    '--standalone',
    `--to=${format}`,
    '--output', outputPath,
    sourcePath,
  ]);
}

async function main(): Promise<void> {
  const sourceArg = process.argv[2];
  if (!sourceArg) {
    console.error('Usage: node e2e-demo.js <markdown-file>');
    console.error('Example: node e2e-demo.js book/luminor-rising/the-first-bonding/chapter-01-the-warmth-before-the-name.md');
    process.exit(1);
  }

  const sourcePath = resolve(sourceArg);
  const startedAt = Date.now();

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        Arcanea Publishing House — E2E Demo               ║');
  console.log('║        Scribe Claw (Shinkami, Source Gate)              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  // 1. Load kernel + hierarchy
  console.log('► Loading Claw Kernel...');
  const kernel = await loadClawKernel();
  console.log(`  kernel: ${kernel.length} bytes, contains "CANONICAL": ${kernel.includes('CANONICAL')}`);
  console.log(`  runtime: ${detectRuntime()}`);
  const scribe = PUBLISHING_LUMINORS['scribe-claw'];
  console.log(`  scribe claw: channeled by ${scribe.name} (${scribe.gate} Gate)`);
  console.log('');

  // 2. Load content
  console.log(`► Reading source: ${sourcePath}`);
  const content = await readFile(sourcePath, 'utf-8');
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  console.log(`  bytes: ${content.length}`);
  console.log(`  words: ${wordCount}`);
  console.log('');

  // 3. TASTE gate
  console.log('► Running TASTE 5D Quality Gate...');
  const titleFromFrontMatter = content.match(/^title:\s*["']?([^"'\n]+)["']?/m)?.[1] ?? basename(sourcePath, extname(sourcePath));
  const tasteResult = await scoreTASTE({
    content,
    metadata: {
      title: titleFromFrontMatter,
      author: 'FrankX',
      language: 'en',
      collection: 'Luminor Rising',
    },
    worldContext: ARCANEA_WORLD_CONTEXT,
  });

  console.log(`  T (Technical):  ${tasteResult.technical}/100`);
  console.log(`  A (Aesthetic):  ${tasteResult.aesthetic}/100`);
  console.log(`  S (Canon):      ${tasteResult.canon}/100`);
  console.log(`  T (Impact):     ${tasteResult.impact}/100`);
  console.log(`  E (Uniqueness): ${tasteResult.uniqueness}/100`);
  console.log(`  ─────────────────────`);
  console.log(`  TOTAL:          ${tasteResult.total}/100`);
  console.log(`  TIER:           ${tasteResult.tier.toUpperCase()}`);
  console.log(`  GATE:           ${tasteResult.passesGate ? 'PASSED ✓' : 'FAILED ✗'}`);
  console.log('');

  if (!tasteResult.passesGate) {
    console.log('✗ Gate failed. Content below TASTE 60. Feedback:');
    for (const fb of tasteResult.feedback) console.log(`  - ${fb}`);
    const result: DemoResult = {
      status: 'rejected',
      sourcePath,
      wordCount,
      qualityScore: tasteResult,
      artifacts: [],
      durationMs: Date.now() - startedAt,
      feedback: tasteResult.feedback,
    };
    console.log('');
    console.log(JSON.stringify(result, null, 2));
    process.exit(2);
  }

  // 4. Format via Pandoc
  const outputDir = resolve(process.env.OUTPUT_DIR ?? './dist/e2e-output');
  await mkdir(outputDir, { recursive: true });
  const pandocPath = findPandocBinary();
  console.log(`► Formatting via Pandoc: ${pandocPath}`);
  console.log(`  output dir: ${outputDir}`);

  const baseName = basename(sourcePath, extname(sourcePath));
  const formats: Array<{ format: string; ext: string }> = [
    { format: 'html', ext: 'html' },
    { format: 'epub3', ext: 'epub' },
    { format: 'docx', ext: 'docx' },
  ];

  const artifacts: DemoResult['artifacts'] = [];
  for (const { format, ext } of formats) {
    const outputPath = join(outputDir, `${baseName}.${ext}`);
    try {
      await runPandoc(pandocPath, sourcePath, outputPath, format);
      const s = await stat(outputPath);
      artifacts.push({ format: ext, path: outputPath, sizeBytes: s.size });
      console.log(`  ✓ ${ext.padEnd(5)} ${s.size.toString().padStart(8)} bytes → ${outputPath}`);
    } catch (err) {
      console.log(`  ✗ ${ext.padEnd(5)} failed: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  const durationMs = Date.now() - startedAt;
  const result: DemoResult = {
    status: artifacts.length === formats.length ? 'success' : 'partial',
    sourcePath,
    wordCount,
    qualityScore: tasteResult,
    artifacts,
    durationMs,
    feedback: tasteResult.feedback,
  };

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log(`║  ${result.status === 'success' ? 'SUCCESS ✓' : 'PARTIAL ⚠'}${' '.repeat(58 - (result.status === 'success' ? 9 : 9))}║`);
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`  Duration: ${durationMs}ms`);
  console.log(`  Artifacts: ${artifacts.length}/${formats.length}`);
  console.log(`  Quality: ${tasteResult.total}/100 (${tasteResult.tier.toUpperCase()})`);
  console.log('');
}

main().catch(err => {
  console.error('E2E demo failed:', err);
  process.exit(1);
});
