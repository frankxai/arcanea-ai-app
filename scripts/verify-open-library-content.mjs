import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const bookRoot = join(repoRoot, 'book');

const requiredDrafts = [
  'das-maedchen-drei-sprachen',
  'forge-of-ruin',
  'heart-of-pyrathis',
  'las-tierras-de-luz',
  'lumara-valle-de-los-destellos',
  'russian-from-tashkent',
  'song-of-van-linh',
  'tides-of-silence',
];

function fail(message) {
  console.error(`[open-library] ${message}`);
  process.exit(1);
}

if (!existsSync(bookRoot)) {
  fail(`Missing book directory: ${bookRoot}`);
}

const manifestSlugs = readdirSync(bookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((slug) => existsSync(join(bookRoot, slug, 'book.yaml')))
  .sort();

const missingDrafts = requiredDrafts.filter((slug) => !manifestSlugs.includes(slug));
if (missingDrafts.length > 0) {
  fail(`Missing required draft manifests: ${missingDrafts.join(', ')}`);
}

let chapterCount = 0;
let wordCount = 0;

for (const slug of manifestSlugs) {
  const chaptersDir = join(bookRoot, slug, 'chapters');
  if (!existsSync(chaptersDir)) continue;

  for (const filename of readdirSync(chaptersDir)) {
    if (!filename.endsWith('.md')) continue;
    chapterCount += 1;
    const raw = readFileSync(join(chaptersDir, filename), 'utf8');
    wordCount += raw.split(/\s+/).filter(Boolean).length;
  }
}

if (manifestSlugs.length < requiredDrafts.length) {
  fail(`Expected at least ${requiredDrafts.length} draft manifests, found ${manifestSlugs.length}`);
}

if (chapterCount < 40) {
  fail(`Expected at least 40 draft chapters, found ${chapterCount}`);
}

if (wordCount < 100000) {
  fail(`Expected at least 100,000 draft words, found ${wordCount.toLocaleString()}`);
}

console.log(
  `[open-library] OK: ${manifestSlugs.length} draft manifests, ${chapterCount} chapters, ${wordCount.toLocaleString()} words`,
);
