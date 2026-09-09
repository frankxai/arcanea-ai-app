'use strict';

const { lstat, readFile, realpath, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const {
  APPROVAL_KEYS,
  COVER_APPROVAL_KEYS,
  EXPECTED_BOOK_ID,
  EXPECTED_EDITION_ID,
  EXPECTED_SERIES,
  EXPECTED_TITLE,
  PUBLICATION_KEYS,
  REPO_ROOT,
  SPEC_REPO_PATH,
  assertExactKeys,
  assertOutputFile,
  assertReleaseApproval,
  fail,
  loadSpecification,
  normalizedPath,
  repositoryState,
  sha256,
  validateReleaseDate,
} = require('./cinematic-edition-contract.cjs');
const { loadChapters, loadCover, printHtml } = require('./build-cinematic-edition.cjs');

const SOURCE_FILENAME = 'the-last-free-path-print-source.html';
const EPUB_FILENAME = 'the-last-free-path.epub';
const PRINT_FILENAME = 'the-last-free-path-print.pdf';
const SCREEN_FILENAME = 'the-last-free-path-screen.pdf';
const EXPECTED_CHAPTER_COUNT = 32;

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

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function assertRegularFile(filename, label) {
  const evidence = await lstat(filename).catch(() => null);
  if (!evidence?.isFile() || evidence.isSymbolicLink()) fail(`${label} must be a regular file, not a link.`);
}

function equalRecord(actual, expected, label) {
  const normalize = (value) => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]));
    }
    return value;
  };
  if (JSON.stringify(normalize(actual)) !== JSON.stringify(normalize(expected))) {
    fail(`${label} does not match the current edition specification and sources.`);
  }
}

function validateCoverRecord(cover) {
  if (!cover || typeof cover !== 'object' || Array.isArray(cover)) fail('Manifest cover evidence is missing.');
  for (const field of ['assetId', 'filename', 'path', 'sha256', 'status']) {
    if (typeof cover[field] !== 'string' || !cover[field].trim()) fail(`Manifest cover is missing ${field}.`);
  }
  if (!/^[a-f0-9]{64}$/.test(cover.sha256)) fail('Manifest cover hash is invalid.');
  if (!Number.isInteger(cover.width) || cover.width <= 0 || !Number.isInteger(cover.height) || cover.height <= 0) {
    fail('Manifest cover dimensions are invalid.');
  }
  assertExactKeys(cover.approvalReceipts, COVER_APPROVAL_KEYS, 'manifest cover approval receipts');
  for (const key of COVER_APPROVAL_KEYS) {
    const receipt = cover.approvalReceipts[key];
    if (receipt !== null && typeof receipt !== 'string') {
      fail(`Manifest cover approval receipt ${key} must be text or null.`);
    }
  }
}

function validateManifest(manifest, sourceBytes, epubBytes) {
  if (manifest.bookId !== EXPECTED_BOOK_ID || manifest.editionId !== EXPECTED_EDITION_ID) {
    fail('Manifest does not belong to the cinematic book edition.');
  }
  if (manifest.title !== EXPECTED_TITLE || manifest.series !== EXPECTED_SERIES) {
    fail('Manifest title or series is not canonical.');
  }
  if (typeof manifest.author !== 'string' || !manifest.author || manifest.author !== manifest.author.trim()) {
    fail('Manifest author must be non-empty normalized text.');
  }
  validateReleaseDate(manifest.releaseDate);
  if (typeof manifest.draft !== 'boolean') fail('Manifest draft mode must be a boolean.');
  if (manifest.draft && manifest.author !== 'Byline pending approval') {
    fail('Protected draft manifests must use the pending-byline marker.');
  }
  if (typeof manifest.sourceDirty !== 'boolean') fail('Manifest sourceDirty must be a boolean.');
  if (!/^[a-f0-9]{40,64}$/.test(manifest.sourceCommit || '')) fail('Manifest source commit is invalid.');
  if (manifest.chapterCount !== EXPECTED_CHAPTER_COUNT) fail('Manifest chapter count is not 32.');
  if (!/^[a-f0-9]{64}$/.test(manifest.manuscriptSha256 || '')) fail('Manifest manuscript hash is invalid.');

  if (!manifest.edition || typeof manifest.edition !== 'object') fail('Manifest edition approval evidence is missing.');
  for (const field of ['status', 'manuscriptStatus', 'titleStatus', 'rightsStatus']) {
    if (typeof manifest.edition[field] !== 'string' || !manifest.edition[field].trim()) {
      fail(`Manifest edition is missing ${field}.`);
    }
  }
  if (
    manifest.edition.approvedManuscriptSha256 !== null
    && !/^[a-f0-9]{64}$/.test(manifest.edition.approvedManuscriptSha256 || '')
  ) {
    fail('Manifest approved manuscript hash must be a SHA-256 or null.');
  }
  assertExactKeys(manifest.edition.humanApprovals, APPROVAL_KEYS, 'manifest human approvals');
  assertExactKeys(manifest.edition.approvalReceipts, APPROVAL_KEYS, 'manifest approval receipts');
  assertExactKeys(manifest.edition.publication, PUBLICATION_KEYS, 'manifest publication approval');
  for (const key of APPROVAL_KEYS) {
    if (typeof manifest.edition.humanApprovals[key] !== 'boolean') {
      fail(`Manifest humanApprovals.${key} must be a boolean.`);
    }
    const receipt = manifest.edition.approvalReceipts[key];
    if (receipt !== null && typeof receipt !== 'string') {
      fail(`Manifest approvalReceipts.${key} must be text or null.`);
    }
  }
  if (
    manifest.edition.publication.byline !== null
    && typeof manifest.edition.publication.byline !== 'string'
  ) {
    fail('Manifest publication byline must be text or null.');
  }
  if (
    manifest.edition.publication.bylineApprovalReceipt !== null
    && typeof manifest.edition.publication.bylineApprovalReceipt !== 'string'
  ) {
    fail('Manifest publication byline receipt must be text or null.');
  }
  if (
    typeof manifest.edition.publication.bylineStatus !== 'string'
    || !manifest.edition.publication.bylineStatus.trim()
  ) {
    fail('Manifest publication byline status is incomplete.');
  }
  if (
    manifest.edition.spec?.path !== SPEC_REPO_PATH
    || !/^[a-f0-9]{64}$/.test(manifest.edition.spec?.sha256 || '')
  ) {
    fail('Manifest edition specification receipt is incomplete.');
  }
  if (manifest.edition.requiredReleaseChapterStatus !== 'release-approved') {
    fail('Manifest release chapter status contract is invalid.');
  }
  if (!Array.isArray(manifest.edition.chapters) || manifest.edition.chapters.length !== EXPECTED_CHAPTER_COUNT) {
    fail('Manifest chapter receipts are incomplete.');
  }
  const chapterPaths = new Set();
  manifest.edition.chapters.forEach((chapter, index) => {
    const number = index + 1;
    if (
      chapter.number !== number
      || typeof chapter.filename !== 'string'
      || !new RegExp(`^chapter-${String(number).padStart(2, '0')}-.+\\.md$`).test(chapter.filename)
      || typeof chapter.path !== 'string'
      || !chapter.path.endsWith(`/chapters/${chapter.filename}`)
      || chapterPaths.has(chapter.path)
      || typeof chapter.status !== 'string'
      || !/^[a-f0-9]{64}$/.test(chapter.sha256 || '')
    ) {
      fail(`Manifest chapter receipt is invalid at chapter ${number}.`);
    }
    chapterPaths.add(chapter.path);
  });

  const sourceHash = sha256(sourceBytes);
  const sourceFiles = (manifest.files || []).filter((file) => file.filename === SOURCE_FILENAME);
  if (
    sourceFiles.length !== 1
    || sourceFiles[0].sha256 !== sourceHash
    || sourceFiles[0].bytes !== sourceBytes.length
    || sourceFiles[0].format !== 'HTML print source'
  ) {
    fail('Manifest file evidence does not match the canonical print source.');
  }
  if (!Buffer.isBuffer(epubBytes) || epubBytes.length < 4 || epubBytes[0] !== 0x50 || epubBytes[1] !== 0x4b) {
    fail('Canonical EPUB bytes are missing or do not have a ZIP container header.');
  }
  const epubHash = sha256(epubBytes);
  const epubFiles = (manifest.files || []).filter((file) => file.filename === EPUB_FILENAME);
  if (
    epubFiles.length !== 1
    || epubFiles[0].sha256 !== epubHash
    || epubFiles[0].bytes !== epubBytes.length
    || epubFiles[0].format !== 'EPUB 3'
  ) {
    fail('Manifest file evidence does not match the canonical EPUB.');
  }
  for (const pending of ['screen PDF render', 'print PDF render']) {
    if (!(manifest.pending || []).includes(pending)) fail(`Manifest does not mark ${pending} as pending.`);
  }

  if (manifest.cover !== null) validateCoverRecord(manifest.cover);
  if (manifest.draft === false) {
    if (manifest.sourceDirty) fail('Release PDF rendering requires clean source provenance.');
    if (!manifest.cover) fail('Release PDF rendering requires the approved cover.');
    if (manifest.edition.approvedManuscriptSha256 !== manifest.manuscriptSha256) {
      fail('Release manifest does not match the approved manuscript SHA-256.');
    }
    if (
      manifest.edition.status !== 'approved'
      || manifest.edition.manuscriptStatus !== 'approved'
      || manifest.edition.titleStatus !== 'approved'
      || manifest.edition.rightsStatus !== 'approved'
    ) {
      fail('Release edition state is not fully approved.');
    }
    const missing = APPROVAL_KEYS.filter((key) => manifest.edition.humanApprovals[key] !== true);
    if (missing.length) fail(`Release edition approvals remain open: ${missing.join(', ')}.`);
    const missingReceipts = APPROVAL_KEYS.filter(
      (key) => typeof manifest.edition.approvalReceipts[key] !== 'string' || !manifest.edition.approvalReceipts[key].trim(),
    );
    if (missingReceipts.length) fail(`Release edition receipts remain open: ${missingReceipts.join(', ')}.`);
    const publication = manifest.edition.publication;
    if (
      publication.byline !== manifest.author
      || publication.bylineStatus !== 'approved'
      || typeof publication.bylineApprovalReceipt !== 'string'
      || !publication.bylineApprovalReceipt.trim()
    ) {
      fail('Release publication byline evidence is incomplete.');
    }
    if (manifest.cover.status !== 'approved') fail('Release cover status is not approved.');
    const missingCover = COVER_APPROVAL_KEYS.filter(
      (key) => typeof manifest.cover.approvalReceipts[key] !== 'string' || !manifest.cover.approvalReceipts[key].trim(),
    );
    if (missingCover.length) fail(`Release cover receipts remain open: ${missingCover.join(', ')}.`);
    const unreleasedChapters = manifest.edition.chapters.filter((chapter) => chapter.status !== 'release-approved');
    if (unreleasedChapters.length) fail('Release manifest contains chapters that are not release-approved.');
  }
}

async function verifySourceBinding(manifest, sourceBytes) {
  const repository = repositoryState(manifest.draft);
  if (repository.commit !== manifest.sourceCommit) fail('Edition manifest does not match the current source commit.');
  const { spec, receipt } = await loadSpecification(manifest.draft);
  assertReleaseApproval(spec, manifest.draft, manifest.author, manifest.manuscriptSha256);
  if (manifest.draft && manifest.author !== 'Byline pending approval') {
    fail('Protected draft manifests must not expose an unapproved publication byline.');
  }
  equalRecord(manifest.edition.spec, receipt, 'Edition specification receipt');
  equalRecord(
    {
      status: manifest.edition.status,
      manuscriptStatus: manifest.edition.manuscriptStatus,
      titleStatus: manifest.edition.titleStatus,
      rightsStatus: manifest.edition.rightsStatus,
      approvedManuscriptSha256: manifest.edition.approvedManuscriptSha256,
      humanApprovals: manifest.edition.humanApprovals,
      approvalReceipts: manifest.edition.approvalReceipts,
      publication: manifest.edition.publication,
    },
    {
      status: spec.status,
      manuscriptStatus: spec.manuscriptStatus,
      titleStatus: spec.titleStatus,
      rightsStatus: spec.rightsStatus,
      approvedManuscriptSha256: spec.approvedManuscriptSha256,
      humanApprovals: spec.humanApprovals,
      approvalReceipts: spec.approvalReceipts,
      publication: spec.publication,
    },
    'Edition approval state',
  );
  const chapters = await loadChapters(manifest.draft);
  const chapterReceipts = chapters.map((chapter) => ({
    number: chapter.number,
    filename: chapter.filename,
    path: chapter.repoPath,
    status: chapter.status,
    sha256: chapter.sourceSha256,
  }));
  equalRecord(manifest.edition.chapters, chapterReceipts, 'Edition chapter receipts');
  const manuscriptHash = sha256(chapters.map((chapter) => `${chapter.number}:${chapter.sourceSha256}`).join('\n'));
  if (manifest.manuscriptSha256 !== manuscriptHash) fail('Manifest manuscript hash does not match the current chapter sources.');

  const coverPath = manifest.cover ? path.resolve(REPO_ROOT, spec.cover.path) : null;
  const cover = await loadCover(coverPath, spec, manifest.draft);
  if (cover) {
    equalRecord(
      manifest.cover,
      {
        assetId: cover.assetId,
        filename: cover.filename,
        path: cover.repoPath,
        sha256: cover.sha256,
        width: cover.width,
        height: cover.height,
        status: cover.status,
        approvalReceipts: cover.approvalReceipts,
      },
      'Edition cover receipt',
    );
  }
  const expectedHtml = printHtml(chapters, manifest.author, cover, manifest.draft);
  if (!Buffer.from(expectedHtml, 'utf8').equals(sourceBytes)) {
    fail('Print source is not the deterministic output of the current edition sources.');
  }
}

async function loadCanonicalInputs(options) {
  const outEvidence = await lstat(options.out).catch(() => null);
  if (!outEvidence?.isDirectory() || outEvidence.isSymbolicLink()) {
    fail('Edition output directory must be a regular directory, not a link.');
  }
  const outReal = await realpath(options.out);
  if (normalizedPath(outReal) !== normalizedPath(options.out)) {
    fail('Edition output directory resolves through an alias or linked parent.');
  }
  if (isContained(REPO_ROOT, outReal)) fail('Edition output must remain outside the source repository.');
  const expectedSource = path.join(outReal, SOURCE_FILENAME);
  if (normalizedPath(options.source) !== normalizedPath(expectedSource)) {
    fail(`Render only the canonical source inside the edition output directory: ${SOURCE_FILENAME}.`);
  }
  await assertRegularFile(expectedSource, 'Edition print source');
  const sourceReal = await realpath(expectedSource);
  if (!isContained(outReal, sourceReal)) fail('Edition print source escapes the output directory.');
  const manifestPath = path.join(outReal, 'manifest.json');
  await assertRegularFile(manifestPath, 'Edition manifest');
  const manifestReal = await realpath(manifestPath);
  if (!isContained(outReal, manifestReal)) fail('Edition manifest escapes the output directory.');
  const [sourceBytes, manifestRaw] = await Promise.all([readFile(sourceReal), readFile(manifestReal, 'utf8')]);
  let manifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch {
    fail('Edition manifest is not valid JSON.');
  }
  const epubPath = path.join(outReal, EPUB_FILENAME);
  await assertRegularFile(epubPath, 'Edition EPUB');
  const epubReal = await realpath(epubPath);
  if (!isContained(outReal, epubReal)) fail('Edition EPUB escapes the output directory.');
  const epubBytes = await readFile(epubReal);
  validateManifest(manifest, sourceBytes, epubBytes);
  await verifySourceBinding(manifest, sourceBytes);
  return { outReal, sourceReal, sourceBytes, epubBytes, manifestPath: manifestReal, manifest };
}

function countOutlineEntries(entries) {
  return (entries || []).reduce((total, entry) => total + 1 + countOutlineEntries(entry.items), 0);
}

async function validatePdf(bytes, label, author) {
  const { getDocumentProxy } = await import('unpdf');
  const document = await getDocumentProxy(new Uint8Array(bytes));
  try {
    if (document.numPages <= EXPECTED_CHAPTER_COUNT || document.numPages > 1000) {
      fail(`${label} PDF page count is implausible: ${document.numPages}.`);
    }
    const [markInfo, outline] = await Promise.all([document.getMarkInfo(), document.getOutline()]);
    if (!markInfo?.Marked || markInfo.Suspects) fail(`${label} PDF is not a clean tagged-structure candidate.`);
    const outlineEntries = countOutlineEntries(outline);
    if (outlineEntries < EXPECTED_CHAPTER_COUNT) fail(`${label} PDF outline is incomplete: ${outlineEntries} entries.`);
    const blankTextPages = [];
    const textParts = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items.map((item) => (typeof item.str === 'string' ? item.str : '')).join(' ').trim();
      if (text.length < 8) blankTextPages.push(pageNumber);
      else textParts.push(text);
    }
    if (blankTextPages.length > 2) fail(`${label} PDF has too many pages without a readable text layer.`);
    const fullText = textParts.join(' ').toLowerCase();
    for (const required of [EXPECTED_TITLE, author, 'The house that leaned', 'What no one owns']) {
      if (!fullText.includes(required.toLowerCase())) fail(`${label} PDF text layer is missing ${required}.`);
    }
    return {
      pageCount: document.numPages,
      tagged: true,
      outlineEntries,
      pagesWithText: document.numPages - blankTextPages.length,
      blankTextPages,
      validatedAt: new Date().toISOString(),
    };
  } finally {
    await document.destroy();
  }
}

async function updateManifest(manifestPath, manifest, outputs) {
  const outputNames = new Set(outputs.map((output) => output.filename));
  manifest.files = [...(manifest.files || []).filter((file) => !outputNames.has(file.filename)), ...outputs];
  manifest.pending = (manifest.pending || []).filter((item) => !['screen PDF render', 'print PDF render'].includes(item));
  manifest.pdfRenderedAt = new Date().toISOString();
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputs = await loadCanonicalInputs(options);
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
      const sourceUrl = pathToFileURL(inputs.sourceReal).href;
      await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (url === sourceUrl || url.startsWith('data:') || url === 'about:blank') await route.continue();
        else await route.abort('blockedbyclient');
      });
      await page.goto(sourceUrl, { waitUntil: 'load' });
      await page.emulateMedia({ media: 'print', colorScheme: 'light', reducedMotion: 'reduce' });

      const printBytes = await page.pdf({ printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
      const printValidation = await validatePdf(printBytes, 'Print', inputs.manifest.author);
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
      const screenBytes = await page.pdf({ printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
      const screenValidation = await validatePdf(screenBytes, 'Screen', inputs.manifest.author);

      const printPath = path.join(inputs.outReal, PRINT_FILENAME);
      const screenPath = path.join(inputs.outReal, SCREEN_FILENAME);
      await Promise.all([
        assertOutputFile(printPath, 'Print PDF output'),
        assertOutputFile(screenPath, 'Screen PDF output'),
      ]);
      await Promise.all([writeFile(printPath, printBytes), writeFile(screenPath, screenBytes)]);
      const outputs = [
        {
          filename: PRINT_FILENAME,
          bytes: printBytes.length,
          sha256: sha256(printBytes),
          sourceSha256: sha256(inputs.sourceBytes),
          format: 'Tagged print PDF — 6×9',
          validation: printValidation,
        },
        {
          filename: SCREEN_FILENAME,
          bytes: screenBytes.length,
          sha256: sha256(screenBytes),
          sourceSha256: sha256(inputs.sourceBytes),
          format: 'Tagged screen PDF — 7.5×10',
          validation: screenValidation,
        },
      ];
      await updateManifest(inputs.manifestPath, inputs.manifest, outputs);
      process.stdout.write(`Rendered ${outputs.map((output) => output.filename).join(', ')}\n`);
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

module.exports = { validateManifest };
