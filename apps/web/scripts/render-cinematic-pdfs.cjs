'use strict';

const { createHash } = require('node:crypto');
const { readFile, writeFile, stat } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (!token.startsWith('--') || !value || value.startsWith('--')) fail(`Invalid argument near ${token}.`);
    index += 1;
    if (token === '--source') result.source = path.resolve(value);
    else if (token === '--out') result.out = path.resolve(value);
    else fail(`Unknown argument: ${token}`);
  }
  if (!result.source) fail('Pass the generated print-source HTML with --source.');
  if (!result.out) fail('Pass the edition output directory with --out.');
  return result;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function updateManifest(out, files) {
  const manifestPath = path.join(out, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const retained = (manifest.files || []).filter((file) => !files.some((next) => next.filename === file.filename));
  manifest.files = [...retained, ...files];
  manifest.pending = (manifest.pending || []).filter((item) => !['screen PDF render', 'print PDF render'].includes(item));
  manifest.pdfRenderedAt = new Date().toISOString();
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourceStat = await stat(options.source).catch(() => null);
  if (!sourceStat?.isFile()) fail(`Print source not found: ${options.source}`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(options.source).href, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print', colorScheme: 'light', reducedMotion: 'reduce' });

    const printPath = path.join(options.out, 'the-last-free-path-print.pdf');
    await page.pdf({
      path: printPath,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });

    await page.addStyleTag({
      content: `
        @page { size: 7.5in 10in; margin: .72in .8in .76in; }
        @page:first { margin: 0; }
        body { font-size: 12pt; line-height: 1.55; }
        .cover-page { width: 7.5in; height: 10in; }
        .title-page { height: 8.5in; }
        .chapter-header { min-height: 2.35in; }
        .prose { text-align: left; }
      `,
    });

    const screenPath = path.join(options.out, 'the-last-free-path-screen.pdf');
    await page.pdf({
      path: screenPath,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });

    const outputs = [];
    for (const [filename, format] of [
      [path.basename(printPath), 'PDF/UA candidate — 6×9 print'],
      [path.basename(screenPath), 'Tagged screen PDF — 7.5×10'],
    ]) {
      const bytes = await readFile(path.join(options.out, filename));
      outputs.push({ filename, bytes: bytes.length, sha256: sha256(bytes), format });
    }
    await updateManifest(options.out, outputs);
    process.stdout.write(`Rendered ${outputs.map((file) => file.filename).join(', ')}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
