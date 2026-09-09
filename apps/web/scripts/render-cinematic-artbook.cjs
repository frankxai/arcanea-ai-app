'use strict';

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { lstat, readFile, realpath, stat, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { assertReleaseApproval, loadCommittedArtbook, renderHtml } = require('./build-cinematic-artbook.cjs');

const BOOK_ID = 'the-last-free-path';
const EDITION_ID = 'book-01-founding-cinematic';
const SOURCE_FILENAME = 'the-last-free-path-artbook-source.html';
const PDF_FILENAME = 'the-last-free-path-artbook.pdf';
const EXPECTED_PAGE_COUNT = 21;
const APPROVAL_KEYS = ['canon', 'casting', 'rights', 'title'];
const COVER_APPROVAL_KEYS = ['casting', 'rights', 'title'];
const PUBLICATION_KEYS = ['byline', 'bylineApprovalReceipt', 'bylineStatus'];
const SPEC_REPO_PATH = 'book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/artbook-spec.json';
const EXPECTED_ASPECTS = [
  ['16:9', '4:5'],
  ['3:2', '4:5'],
  ['3:2', '4:5'],
  ['3:2', '16:9'],
  ['16:9', '4:5'],
  ['16:9', '3:2'],
  ['16:9', '4:5'],
  ['16:9', '4:5'],
  ['3:2', '4:5'],
];

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
  if (!result.source) fail('Pass the generated artbook source HTML with --source.');
  if (!result.out) fail('Pass the edition output directory with --out.');
  return result;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) {
    fail(`${label} must contain exactly: ${required.join(', ')}.`);
  }
}

function normalizedPath(value) {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function assertContained(root, candidate, label) {
  const relative = path.relative(root, candidate);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail(`${label} escapes the edition output directory.`);
  }
}

async function assertRegularFile(filename, label) {
  const evidence = await lstat(filename).catch(() => null);
  if (!evidence?.isFile() || evidence.isSymbolicLink()) fail(`${label} must be a regular file, not a link.`);
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
  const expectedSourcePath = path.join(outReal, SOURCE_FILENAME);
  if (normalizedPath(options.source) !== normalizedPath(expectedSourcePath)) {
    fail(`Render only the canonical source inside the edition output directory: ${SOURCE_FILENAME}.`);
  }
  await assertRegularFile(expectedSourcePath, 'Artbook source');
  const sourceReal = await realpath(expectedSourcePath);
  assertContained(outReal, sourceReal, 'Artbook source');
  const manifestPath = path.join(outReal, 'manifest.json');
  await assertRegularFile(manifestPath, 'Edition manifest');
  const manifestReal = await realpath(manifestPath);
  assertContained(outReal, manifestReal, 'Edition manifest');
  const manifestStat = await stat(manifestPath).catch(() => null);
  if (!manifestStat?.isFile()) fail(`Edition manifest not found: ${manifestPath}`);
  const [sourceBytes, manifestRaw] = await Promise.all([
    readFile(sourceReal),
    readFile(manifestPath, 'utf8'),
  ]);
  const manifest = JSON.parse(manifestRaw);
  validateManifest(manifest, sourceBytes);
  await verifyCommittedBinding(manifest, sourceBytes);
  return { outReal, sourceReal, sourceBytes, manifestPath, manifest };
}

function validateManifest(manifest, sourceBytes) {
  if (manifest.bookId !== BOOK_ID || manifest.editionId !== EDITION_ID) {
    fail('Manifest does not belong to the cinematic book edition.');
  }
  if (!manifest.artbook || manifest.artbook.plateCount !== 9) fail('Manifest is missing the nine-plate artbook record.');
  if (manifest.title !== 'The Last Free Path') fail('Manifest title does not match the cinematic edition.');
  if (typeof manifest.author !== 'string' || !manifest.author || manifest.author !== manifest.author.trim()) {
    fail('Manifest author must be non-empty normalized text.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.releaseDate || '')) fail('Manifest release date is invalid.');
  if (!/^[a-f0-9]{40,64}$/.test(manifest.sourceCommit || '')) fail('Manifest source commit is invalid.');
  if (manifest.artbook.source?.filename !== SOURCE_FILENAME) fail('Manifest artbook source filename is not canonical.');
  if (manifest.artbook.source.expectedPageCount !== EXPECTED_PAGE_COUNT) fail('Manifest artbook page contract is not 21 pages.');
  const sourceHash = sha256(sourceBytes);
  if (manifest.artbook.source.sha256 !== sourceHash) fail('Artbook source hash does not match the manifest.');
  const sourceFiles = (manifest.files || []).filter((file) => file.filename === SOURCE_FILENAME);
  const sourceFile = sourceFiles[0];
  if (sourceFiles.length !== 1 || sourceFile.sha256 !== sourceHash || sourceFile.pageCount !== EXPECTED_PAGE_COUNT) {
    fail('Manifest file evidence does not match the canonical artbook source.');
  }
  if (!(manifest.pending || []).includes('cinematic artbook PDF')) {
    fail('Manifest does not mark the cinematic artbook PDF as pending. Rebuild the source before rendering.');
  }
  assertExactKeys(manifest.artbook.humanApprovals, APPROVAL_KEYS, 'manifest human approvals');
  assertExactKeys(manifest.artbook.cover?.approvalReceipts, COVER_APPROVAL_KEYS, 'manifest cover approval receipts');
  assertExactKeys(manifest.artbook.publication, PUBLICATION_KEYS, 'manifest publication approval');
  if (
    manifest.artbook.spec?.path !== SPEC_REPO_PATH
    || !/^[a-f0-9]{64}$/.test(manifest.artbook.spec?.sha256 || '')
  ) {
    fail('Manifest committed artbook specification evidence is incomplete.');
  }
  if (
    typeof manifest.artbook.cover?.assetId !== 'string'
    || !manifest.artbook.cover.assetId
    || typeof manifest.artbook.cover.path !== 'string'
    || !manifest.artbook.cover.path
    || !/^[a-f0-9]{64}$/.test(manifest.artbook.cover.sha256 || '')
    || !Number.isInteger(manifest.artbook.cover.width)
    || manifest.artbook.cover.width <= 0
    || !Number.isInteger(manifest.artbook.cover.height)
    || manifest.artbook.cover.height <= 0
  ) {
    fail('Manifest cover asset evidence is incomplete.');
  }
  if (typeof manifest.artbook.cover?.alt !== 'string' || !manifest.artbook.cover.alt.trim()) {
    fail('Manifest cover description is incomplete.');
  }
  for (const field of ['generator', 'backendModelNote', 'selection', 'rightsNote']) {
    if (typeof manifest.artbook.provenance?.[field] !== 'string' || !manifest.artbook.provenance[field].trim()) {
      fail(`Manifest artbook provenance is missing ${field}.`);
    }
  }
  if (manifest.artbook.provenance.backendModel !== null && typeof manifest.artbook.provenance.backendModel !== 'string') {
    fail('Manifest backend model provenance must be text or null.');
  }
  if (typeof manifest.draft !== 'boolean') fail('Manifest draft mode must be a boolean.');
  if (manifest.draft && manifest.author !== 'Byline pending approval') {
    fail('Protected draft manifests must use the pending-byline marker.');
  }
  if (
    !/^[a-f0-9]{40,64}$/.test(manifest.artbook.sourceCommit || '')
    || manifest.artbook.sourceCommit !== manifest.sourceCommit
    || typeof manifest.artbook.sourceDirty !== 'boolean'
  ) {
    fail('Manifest artbook commit provenance is incomplete.');
  }
  if (manifest.artbook.publication.byline !== null && typeof manifest.artbook.publication.byline !== 'string') {
    fail('Manifest publication byline must be text or null.');
  }
  if (
    manifest.artbook.publication.bylineApprovalReceipt !== null
    && typeof manifest.artbook.publication.bylineApprovalReceipt !== 'string'
  ) {
    fail('Manifest publication byline receipt must be text or null.');
  }
  if (typeof manifest.artbook.publication.bylineStatus !== 'string' || !manifest.artbook.publication.bylineStatus.trim()) {
    fail('Manifest publication byline status is incomplete.');
  }
  if (
    !manifest.artbook.accessibility?.descriptiveCoverAlt
    || manifest.artbook.accessibility.imageDescriptions !== 9
    || manifest.artbook.accessibility.semanticHeadings !== true
    || manifest.artbook.accessibility.expectedPageCount !== EXPECTED_PAGE_COUNT
    || manifest.artbook.accessibility.status !== 'source-validated'
  ) {
    fail('Manifest accessibility evidence is incomplete.');
  }
  if (!Array.isArray(manifest.artbook.plates) || manifest.artbook.plates.length !== 9) {
    fail('Manifest plate evidence is incomplete.');
  }
  const plateIds = new Set();
  const assetIds = new Set();
  const assetPaths = new Set();
  manifest.artbook.plates.forEach((plate, index) => {
    const expectedId = `plate-${String(index + 1).padStart(2, '0')}`;
    if (plate.id !== expectedId || plateIds.has(plate.id) || !['scene', 'editorial-study'].includes(plate.mode)) {
      fail(`Manifest plate sequence or mode is invalid at ${expectedId}.`);
    }
    plateIds.add(plate.id);
    for (const field of ['title', 'chapter', 'caption', 'alt', 'frameNote']) {
      if (typeof plate[field] !== 'string' || !plate[field].trim()) fail(`Manifest ${plate.id} is missing ${field}.`);
    }
    for (const [kindIndex, kind] of ['primary', 'companion'].entries()) {
      const asset = plate[kind];
      if (
        !asset
        || typeof asset.assetId !== 'string'
        || !asset.assetId
        || assetIds.has(asset.assetId)
        || typeof asset.path !== 'string'
        || !asset.path
        || assetPaths.has(asset.path)
        || !/^[a-f0-9]{64}$/.test(asset.sha256 || '')
        || !Number.isInteger(asset.width)
        || asset.width <= 0
        || !Number.isInteger(asset.height)
        || asset.height <= 0
        || asset.aspect !== EXPECTED_ASPECTS[index][kindIndex]
      ) {
        fail(`Manifest ${plate.id} ${kind} asset evidence is invalid.`);
      }
      assetIds.add(asset.assetId);
      assetPaths.add(asset.path);
    }
  });
  if (manifest.draft === false) {
    if (manifest.artbook.status !== 'approved' || manifest.artbook.titleStatus !== 'approved' || manifest.artbook.rightsStatus !== 'approved') {
      fail('Release artbook state is not fully approved.');
    }
    const missing = APPROVAL_KEYS.filter((gate) => manifest.artbook.humanApprovals[gate] !== true);
    if (missing.length) fail(`Release artbook approvals remain open: ${missing.join(', ')}.`);
    if (
      typeof manifest.artbook.publication.byline !== 'string'
      || !manifest.artbook.publication.byline
      || manifest.artbook.publication.byline !== manifest.artbook.publication.byline.trim()
      || manifest.artbook.publication.bylineStatus !== 'approved'
      || typeof manifest.artbook.publication.bylineApprovalReceipt !== 'string'
      || !manifest.artbook.publication.bylineApprovalReceipt.trim()
    ) {
      fail('Release byline approval evidence is incomplete.');
    }
    if (manifest.author !== manifest.artbook.publication.byline) fail('Manifest author does not match the approved artbook byline.');
    if (
      manifest.artbook.sourceDirty !== false
      || !/^[a-f0-9]{40,64}$/.test(manifest.artbook.sourceCommit || '')
      || manifest.artbook.sourceCommit !== manifest.sourceCommit
    ) {
      fail('Release artbook commit provenance is incomplete.');
    }
    if (manifest.artbook.cover?.status !== 'approved') fail('Release cover status is not approved.');
    const missingCover = COVER_APPROVAL_KEYS.filter(
      (gate) => typeof manifest.artbook.cover.approvalReceipts[gate] !== 'string' || !manifest.artbook.cover.approvalReceipts[gate].trim(),
    );
    if (missingCover.length) fail(`Release cover receipts remain open: ${missingCover.join(', ')}.`);
  }
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
    fail(`${label} does not match the committed artbook specification and assets.`);
  }
}

function assertSpecificationState(manifest, spec) {
  equalRecord(
    {
      status: manifest.artbook.status,
      titleStatus: manifest.artbook.titleStatus,
      rightsStatus: manifest.artbook.rightsStatus,
    },
    { status: spec.status, titleStatus: spec.titleStatus, rightsStatus: spec.rightsStatus },
    'Artbook release state',
  );
}

function currentRepositoryState() {
  const repositoryRoot = path.resolve(__dirname, '../../..');
  try {
    return {
      commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
      changes: execFileSync(
        'git',
        ['status', '--porcelain', '--untracked-files=normal'],
        { cwd: repositoryRoot, encoding: 'utf8' },
      ).trim(),
    };
  } catch {
    fail('Unable to verify the repository state for artbook rendering.');
  }
}

async function verifyCommittedBinding(manifest, sourceBytes) {
  const committed = await loadCommittedArtbook();
  const repository = currentRepositoryState();
  if (repository.commit !== manifest.sourceCommit || repository.commit !== manifest.artbook.sourceCommit) {
    fail('Artbook manifest does not match the current committed source revision.');
  }
  if (manifest.draft === false && repository.changes) {
    fail('Release artbook rendering requires a clean git worktree.');
  }
  equalRecord(
    manifest.artbook.spec,
    { path: committed.specReceipt.relative, sha256: committed.specReceipt.sha256 },
    'Artbook specification receipt',
  );
  assertSpecificationState(manifest, committed.spec);
  equalRecord(manifest.artbook.humanApprovals, committed.spec.humanApprovals, 'Artbook approval state');
  equalRecord(manifest.artbook.publication, committed.spec.publication, 'Artbook publication approval');
  equalRecord(manifest.artbook.provenance, committed.spec.provenance, 'Artbook provenance');
  equalRecord(
    manifest.artbook.cover,
    {
      assetId: committed.cover.assetId,
      path: committed.cover.repoPath,
      sha256: committed.cover.sha256,
      width: committed.cover.width,
      height: committed.cover.height,
      alt: committed.spec.cover.alt,
      status: committed.spec.cover.status,
      approvalReceipts: { ...committed.spec.cover.approvalReceipts },
    },
    'Artbook cover receipt',
  );
  const expectedPlates = committed.plates.map((plate) => ({
    id: plate.id,
    mode: plate.mode,
    title: plate.title,
    chapter: plate.chapter,
    caption: plate.caption,
    alt: plate.alt,
    frameNote: plate.frameNote,
    primary: {
      assetId: plate.primaryImage.assetId,
      path: plate.primaryImage.repoPath,
      sha256: plate.primaryImage.sha256,
      width: plate.primaryImage.width,
      height: plate.primaryImage.height,
      aspect: plate.primaryImage.aspect,
    },
    companion: {
      assetId: plate.companionImage.assetId,
      path: plate.companionImage.repoPath,
      sha256: plate.companionImage.sha256,
      width: plate.companionImage.width,
      height: plate.companionImage.height,
      aspect: plate.companionImage.aspect,
    },
  }));
  equalRecord(manifest.artbook.plates, expectedPlates, 'Artbook plate receipts');
  assertReleaseApproval(committed.spec, manifest.draft, manifest.author);
  const expectedHtml = renderHtml(committed.spec, committed.plates, committed.cover, {
    author: manifest.author,
    draft: manifest.draft,
    releaseDate: manifest.releaseDate,
  });
  if (!Buffer.from(expectedHtml, 'utf8').equals(sourceBytes)) {
    fail('Artbook source is not the deterministic output of the committed specification and assets.');
  }
}

function countOutlineEntries(entries) {
  return (entries || []).reduce((total, entry) => total + 1 + countOutlineEntries(entry.items), 0);
}

async function validatePdf(bytes) {
  const { getDocumentProxy } = await import('unpdf');
  const document = await getDocumentProxy(new Uint8Array(bytes));
  try {
    if (document.numPages !== EXPECTED_PAGE_COUNT) {
      fail(`Artbook PDF has ${document.numPages} pages; expected ${EXPECTED_PAGE_COUNT}.`);
    }
    const [markInfo, outline] = await Promise.all([document.getMarkInfo(), document.getOutline()]);
    if (!markInfo?.Marked || markInfo.Suspects) fail('Artbook PDF is not a clean tagged-structure candidate.');
    const outlineEntries = countOutlineEntries(outline);
    if (outlineEntries < 10) fail(`Artbook PDF outline is incomplete: ${outlineEntries} entries.`);
    let pagesWithText = 0;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => (typeof item.str === 'string' ? item.str : ''))
        .join(' ')
        .trim();
      if (text.length < 8) fail(`Artbook PDF page ${pageNumber} has no readable text layer.`);
      pagesWithText += 1;
    }
    return {
      pageCount: document.numPages,
      tagged: true,
      outlineEntries,
      pagesWithText,
      validatedAt: new Date().toISOString(),
    };
  } finally {
    await document.destroy();
  }
}

async function updateManifest(manifestPath, manifest, output, validation) {
  manifest.files = [
    ...(manifest.files || []).filter((file) => file.filename !== output.filename),
    { ...output, validation },
  ];
  manifest.pending = (manifest.pending || []).filter((item) => item !== 'cinematic artbook PDF');
  manifest.artbook.pdf = { filename: output.filename, sha256: output.sha256, ...validation };
  manifest.artbookRenderedAt = new Date().toISOString();
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
      const page = await context.newPage({ viewport: { width: 1020, height: 1320 }, deviceScaleFactor: 1 });
      const sourceUrl = pathToFileURL(inputs.sourceReal).href;
      await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (url === sourceUrl || url.startsWith('data:') || url === 'about:blank') await route.continue();
        else await route.abort('blockedbyclient');
      });
      await page.goto(sourceUrl, { waitUntil: 'load' });
      await page.emulateMedia({ media: 'print', colorScheme: 'light', reducedMotion: 'reduce' });
      const bytes = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
        outline: true,
      });
      const validation = await validatePdf(bytes);
      const pdfPath = path.join(inputs.outReal, PDF_FILENAME);
      const existingPdf = await lstat(pdfPath).catch(() => null);
      if (existingPdf && (!existingPdf.isFile() || existingPdf.isSymbolicLink())) {
        fail('Refusing to replace a non-regular artbook PDF output path.');
      }
      await writeFile(pdfPath, bytes);
      const output = {
        filename: PDF_FILENAME,
        bytes: bytes.length,
        sha256: sha256(bytes),
        sourceSha256: sha256(inputs.sourceBytes),
        format: 'Tagged cinematic artbook PDF — 8.5×11',
      };
      await updateManifest(inputs.manifestPath, inputs.manifest, output, validation);
      process.stdout.write(`Rendered ${output.filename} pages=${validation.pageCount} tagged=${validation.tagged}\n`);
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

module.exports = { assertSpecificationState, validateManifest };
