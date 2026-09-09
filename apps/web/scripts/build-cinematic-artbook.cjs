'use strict';

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { lstat, mkdir, readFile, realpath, writeFile } = require('node:fs/promises');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const BOOK_DIR = path.join(
  REPO_ROOT,
  'book',
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
);
const SPEC_PATH = path.join(BOOK_DIR, 'artbook-spec.json');
const OUTPUT_FILENAME = 'the-last-free-path-artbook-source.html';
const EXPECTED_BOOK_ID = 'the-last-free-path';
const EXPECTED_EDITION_ID = 'book-01-founding-cinematic';
const EXPECTED_TITLE = 'The Last Free Path';
const EXPECTED_SERIES = 'Chronicles of Arcanea';
const EXPECTED_PAGE_COUNT = 21;
const APPROVAL_KEYS = ['canon', 'casting', 'rights', 'title'];
const COVER_APPROVAL_KEYS = ['casting', 'rights', 'title'];
const PUBLICATION_KEYS = ['byline', 'bylineApprovalReceipt', 'bylineStatus'];
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
  const result = { draft: false, releaseDate: new Date().toISOString().slice(0, 10) };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--draft') {
      result.draft = true;
      continue;
    }
    if (!token.startsWith('--')) fail(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`Missing value for ${token}`);
    index += 1;
    if (token === '--out') result.out = path.resolve(value);
    else if (token === '--author') result.author = value.trim();
    else if (token === '--release-date') result.releaseDate = value.trim();
    else fail(`Unknown argument: ${token}`);
  }
  if (!result.out) fail('Pass an explicit output directory with --out.');
  if (!result.author) fail('Pass the approved publication name with --author.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.releaseDate)) fail('--release-date must be YYYY-MM-DD.');
  if (!result.draft && /pending|placeholder|tbd/i.test(result.author)) {
    fail('Release builds require an approved publication name, not a placeholder.');
  }
  return result;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sourceState(draft) {
  let commit;
  let changes;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    changes = execFileSync(
      'git',
      ['status', '--porcelain', '--untracked-files=normal'],
      { cwd: REPO_ROOT, encoding: 'utf8' },
    ).trim();
  } catch {
    if (!draft) fail('Release builds require readable git provenance.');
    return { commit: null, dirty: true };
  }
  if (changes && !draft) fail('Release builds require a clean git worktree.');
  return { commit, dirty: Boolean(changes) };
}

function assertReleaseApproval(spec, draft, requestedAuthor) {
  assertExactKeys(spec.humanApprovals, APPROVAL_KEYS, 'human approvals');
  assertExactKeys(spec.cover?.approvalReceipts, COVER_APPROVAL_KEYS, 'cover approval receipts');
  assertExactKeys(spec.publication, PUBLICATION_KEYS, 'publication approval');
  if (draft) return;
  if (spec.status !== 'approved') fail(`Artbook release status is ${spec.status || 'missing'}, not approved.`);
  if (spec.titleStatus !== 'approved') fail('Artbook release requires an approved title.');
  if (spec.rightsStatus !== 'approved') fail('Artbook release requires approved commercial-use rights.');
  const missing = APPROVAL_KEYS.filter((gate) => spec.humanApprovals[gate] !== true);
  if (missing.length) fail(`Artbook release approvals remain open: ${missing.join(', ')}.`);
  if (typeof spec.publication.byline !== 'string' || !spec.publication.byline || spec.publication.byline !== spec.publication.byline.trim()) {
    fail('Artbook release requires an approved publication byline.');
  }
  if (spec.publication.bylineStatus !== 'approved') fail('Artbook release requires an approved publication byline.');
  if (spec.publication.byline !== requestedAuthor) {
    fail('Requested publication name does not match the approved artbook byline.');
  }
  if (typeof spec.publication.bylineApprovalReceipt !== 'string' || !spec.publication.bylineApprovalReceipt.trim()) {
    fail('Artbook release requires a byline approval receipt.');
  }
  if (spec.cover.status !== 'approved') fail('Artbook release requires an approved cover asset.');
  const missingCoverReceipts = COVER_APPROVAL_KEYS.filter(
    (gate) => typeof spec.cover.approvalReceipts[gate] !== 'string' || !spec.cover.approvalReceipts[gate].trim(),
  );
  if (missingCoverReceipts.length) {
    fail(`Artbook cover approval receipts remain open: ${missingCoverReceipts.join(', ')}.`);
  }
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) {
    fail(`${label} must contain exactly: ${required.join(', ')}.`);
  }
}

function assertText(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be non-empty text.`);
}

function aspectRatio(label) {
  const match = /^(\d+):(\d+)$/.exec(label || '');
  if (!match) fail(`Invalid aspect ratio label: ${label || 'missing'}.`);
  return Number(match[1]) / Number(match[2]);
}

function validateAssetSpec(asset, label, expectedAspect) {
  if (!asset || typeof asset !== 'object' || Array.isArray(asset)) fail(`${label} must be an asset object.`);
  for (const field of ['assetId', 'path', 'aspect']) assertText(asset[field], `${label}.${field}`);
  if (!Number.isInteger(asset.width) || asset.width <= 0 || !Number.isInteger(asset.height) || asset.height <= 0) {
    fail(`${label} requires positive integer dimensions.`);
  }
  if (asset.aspect !== expectedAspect) fail(`${label} must use ${expectedAspect}, found ${asset.aspect}.`);
  const delta = Math.abs(asset.width / asset.height - aspectRatio(asset.aspect));
  if (delta > 0.015) fail(`${label} dimensions do not match ${asset.aspect}.`);
}

function validateSpec(spec) {
  if (spec.schemaVersion !== 1) fail(`Unsupported artbook schema: ${spec.schemaVersion}.`);
  if (spec.bookId !== EXPECTED_BOOK_ID) fail(`Unexpected artbook book ID: ${spec.bookId}.`);
  if (spec.editionId !== EXPECTED_EDITION_ID) fail(`Unexpected artbook edition ID: ${spec.editionId}.`);
  if (spec.title !== EXPECTED_TITLE || spec.series !== EXPECTED_SERIES) fail('Artbook title or series is not canonical for this edition.');
  for (const field of ['subtitle', 'status', 'titleStatus', 'rightsStatus']) assertText(spec[field], field);
  assertExactKeys(spec.humanApprovals, APPROVAL_KEYS, 'human approvals');
  assertExactKeys(spec.cover?.approvalReceipts, COVER_APPROVAL_KEYS, 'cover approval receipts');
  for (const [gate, approved] of Object.entries(spec.humanApprovals)) {
    if (typeof approved !== 'boolean') fail(`humanApprovals.${gate} must be a boolean.`);
  }
  assertExactKeys(spec.publication, PUBLICATION_KEYS, 'publication approval');
  for (const field of ['bylineStatus']) assertText(spec.publication[field], `publication.${field}`);
  if (spec.publication.byline !== null && typeof spec.publication.byline !== 'string') fail('publication.byline must be text or null.');
  if (spec.publication.bylineApprovalReceipt !== null && typeof spec.publication.bylineApprovalReceipt !== 'string') {
    fail('publication.bylineApprovalReceipt must be text or null.');
  }
  if (!spec.cover || typeof spec.cover !== 'object') fail('cover must be an object.');
  for (const field of ['assetId', 'path', 'sha256', 'alt', 'status']) assertText(spec.cover[field], `cover.${field}`);
  for (const [gate, receipt] of Object.entries(spec.cover.approvalReceipts)) {
    if (receipt !== null && typeof receipt !== 'string') fail(`cover.approvalReceipts.${gate} must be text or null.`);
  }
  if (!/^[a-f0-9]{64}$/.test(spec.cover.sha256)) fail('cover.sha256 must be a lowercase SHA-256 hash.');
  if (!Number.isInteger(spec.cover.width) || spec.cover.width <= 0 || !Number.isInteger(spec.cover.height) || spec.cover.height <= 0) {
    fail('cover dimensions must be positive integers.');
  }
  if (!spec.provenance || typeof spec.provenance !== 'object') fail('provenance must be an object.');
  for (const field of ['generator', 'backendModelNote', 'selection', 'rightsNote']) {
    assertText(spec.provenance[field], `provenance.${field}`);
  }
  if (spec.provenance.backendModel !== null && typeof spec.provenance.backendModel !== 'string') {
    fail('provenance.backendModel must be text or null.');
  }
  if (!Array.isArray(spec.plates) || spec.plates.length !== 9) {
    fail(`Expected exactly 9 artbook plates, found ${spec.plates?.length ?? 0}.`);
  }
  const expectedIds = Array.from({ length: 9 }, (_, index) => `plate-${String(index + 1).padStart(2, '0')}`);
  const assetPaths = new Set();
  const assetIds = new Set();
  spec.plates.forEach((plate, index) => {
    if (plate.id !== expectedIds[index]) fail(`Artbook plate sequence breaks at ${plate.id || index}.`);
    for (const field of ['mode', 'title', 'chapter', 'caption', 'materialNote', 'alt', 'frameNote', 'primaryLabel', 'companionLabel']) {
      assertText(plate[field], `${plate.id}.${field}`);
    }
    if (!['scene', 'editorial-study'].includes(plate.mode)) fail(`${plate.id} has invalid mode ${plate.mode}.`);
    validateAssetSpec(plate.primary, `${plate.id}.primary`, EXPECTED_ASPECTS[index][0]);
    validateAssetSpec(plate.companion, `${plate.id}.companion`, EXPECTED_ASPECTS[index][1]);
    for (const asset of [plate.primary, plate.companion]) {
      if (assetPaths.has(asset.path)) fail(`Duplicate artbook asset path: ${asset.path}.`);
      if (assetIds.has(asset.assetId)) fail(`Duplicate artbook asset ID: ${asset.assetId}.`);
      assetPaths.add(asset.path);
      assetIds.add(asset.assetId);
    }
  });
}

function normalizedPath(value) {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function assertContained(root, candidate, label) {
  const relative = path.relative(root, candidate);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail(`${label} escapes its approved source root.`);
  }
}

async function lstatIfExists(filename) {
  try {
    return await lstat(filename);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

async function resolveContained(root, candidate, label) {
  const declaredRoot = path.resolve(root);
  const declaredCandidate = path.resolve(candidate);
  assertContained(declaredRoot, declaredCandidate, label);
  const evidence = await lstatIfExists(declaredCandidate);
  if (!evidence?.isFile() || evidence.isSymbolicLink()) {
    fail(`${label} must be a regular file at its declared path, not a link.`);
  }
  const [realRoot, realCandidate] = await Promise.all([realpath(declaredRoot), realpath(declaredCandidate)]);
  assertContained(realRoot, realCandidate, label);
  if (normalizedPath(realCandidate) !== normalizedPath(declaredCandidate)) {
    fail(`${label} resolves through an alias or linked parent.`);
  }
  return realCandidate;
}

async function ensureOutputDirectory(outputDirectory) {
  let existingAncestor = path.resolve(outputDirectory);
  while (!(await lstatIfExists(existingAncestor))) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) fail('Artbook output directory has no readable existing ancestor.');
    existingAncestor = parent;
  }
  const ancestorEvidence = await lstat(existingAncestor);
  if (!ancestorEvidence.isDirectory() || ancestorEvidence.isSymbolicLink()) {
    fail('Artbook output parent must be a regular directory, not a link.');
  }
  const realAncestor = await realpath(existingAncestor);
  if (normalizedPath(realAncestor) !== normalizedPath(existingAncestor)) {
    fail('Artbook output parent resolves through an alias or linked parent.');
  }
  await mkdir(outputDirectory, { recursive: true });
  const evidence = await lstat(outputDirectory);
  if (!evidence.isDirectory() || evidence.isSymbolicLink()) {
    fail('Artbook output directory must be a regular directory, not a link.');
  }
  const resolved = await realpath(outputDirectory);
  if (normalizedPath(resolved) !== normalizedPath(outputDirectory)) {
    fail('Artbook output directory resolves through an alias or linked parent.');
  }
  return resolved;
}

function assertManifestMode(manifest, expectedDraft) {
  if (typeof manifest.draft !== 'boolean' || manifest.draft !== expectedDraft) {
    fail('Artbook draft mode must exactly match the boolean novel edition manifest mode.');
  }
}

async function assertOutputFile(filename, label, required) {
  const evidence = await lstatIfExists(filename);
  if (!evidence) {
    if (required) fail(`${label} not found: ${filename}`);
    return;
  }
  if (!evidence.isFile() || evidence.isSymbolicLink()) {
    fail(`${label} must be a regular file, not a link.`);
  }
}

function repoRelative(absolute) {
  return path.relative(REPO_ROOT, absolute).split(path.sep).join('/');
}

async function trackedHeadRecord(absolute, label) {
  const resolved = await resolveContained(REPO_ROOT, absolute, label);
  const relative = repoRelative(resolved);
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', relative], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    fail(`${label} is not tracked at HEAD: ${relative}.`);
  }
  let committed;
  try {
    committed = execFileSync('git', ['show', `HEAD:${relative}`], {
      cwd: REPO_ROOT,
      encoding: null,
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    fail(`${label} cannot be read from HEAD: ${relative}.`);
  }
  const bytes = await readFile(resolved);
  if (!bytes.equals(committed)) fail(`${label} differs from the committed HEAD blob: ${relative}.`);
  return { absolute: resolved, relative, bytes, sha256: sha256(bytes) };
}

function mediaType(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === '.webp') return 'image/webp';
  if (extension === '.png') return 'image/png';
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  fail(`Unsupported artbook image type: ${filename}`);
}

function webpDimensions(bytes) {
  if (bytes.length < 30 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    fail('Invalid WebP header.');
  }
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const chunk = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > bytes.length) fail('Truncated WebP chunk.');
    if (chunk === 'VP8X' && size >= 10) {
      return { width: 1 + bytes.readUIntLE(data + 4, 3), height: 1 + bytes.readUIntLE(data + 7, 3) };
    }
    if (chunk === 'VP8 ' && size >= 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
      return { width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff };
    }
    if (chunk === 'VP8L' && size >= 5 && bytes[data] === 0x2f) {
      const b1 = bytes[data + 1];
      const b2 = bytes[data + 2];
      const b3 = bytes[data + 3];
      const b4 = bytes[data + 4];
      return {
        width: 1 + b1 + ((b2 & 0x3f) << 8),
        height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      };
    }
    offset = data + size + (size % 2);
  }
  fail('WebP dimensions are unavailable.');
}

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) fail('Invalid JPEG header.');
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) fail('Truncated JPEG segment.');
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  fail('JPEG dimensions are unavailable.');
}

function imageDimensions(bytes, type) {
  if (type === 'image/webp') return webpDimensions(bytes);
  if (type === 'image/png') {
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) fail('Invalid PNG header.');
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (type === 'image/jpeg') return jpegDimensions(bytes);
  fail(`Dimensions are unsupported for ${type}.`);
}

async function imageRecord(root, asset, label) {
  const candidate = path.resolve(root, asset.path);
  const resolved = await resolveContained(root, candidate, label);
  const tracked = await trackedHeadRecord(resolved, label);
  const type = mediaType(resolved);
  const dimensions = imageDimensions(tracked.bytes, type);
  if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
    fail(`${label} dimensions are ${dimensions.width}×${dimensions.height}, expected ${asset.width}×${asset.height}.`);
  }
  if (asset.sha256 && tracked.sha256 !== asset.sha256) fail(`${label} does not match its approved SHA-256.`);
  return {
    assetId: asset.assetId,
    filename: resolved,
    repoPath: tracked.relative,
    bytes: tracked.bytes,
    sha256: tracked.sha256,
    width: dimensions.width,
    height: dimensions.height,
    aspect: asset.aspect || null,
    dataUrl: `data:${type};base64,${tracked.bytes.toString('base64')}`,
  };
}

async function loadPlate(plate) {
  const [primary, companion] = await Promise.all([
    imageRecord(BOOK_DIR, plate.primary, `${plate.id} primary asset`),
    imageRecord(BOOK_DIR, plate.companion, `${plate.id} companion asset`),
  ]);
  return { ...plate, primaryImage: primary, companionImage: companion };
}

function platePages(plate, index, draftMark) {
  const number = String(index + 1).padStart(2, '0');
  return `<section class="page plate-page" aria-labelledby="${plate.id}-title">
  ${draftMark}
  <div class="plate-heading">
    <p class="folio">Plate ${number}</p>
    <p class="chapter-ref">${escapeHtml(plate.chapter)}</p>
  </div>
  <figure class="hero-figure">
    <img src="${plate.primaryImage.dataUrl}" alt="${escapeHtml(plate.alt)}" />
  </figure>
  <div class="plate-copy">
    <h2 id="${plate.id}-title">${escapeHtml(plate.title)}</h2>
    <p class="caption">${escapeHtml(plate.caption)}</p>
  </div>
</section>
<section class="page study-page" aria-labelledby="${plate.id}-study-title">
  ${draftMark}
  <header class="study-heading">
    <p class="folio">Composition study · Plate ${number}</p>
    <h2 id="${plate.id}-study-title">One scene, two reading distances</h2>
  </header>
  <div class="study-grid">
    <figure>
      <div class="study-frame"><img src="${plate.primaryImage.dataUrl}" alt="" /></div>
      <figcaption>${escapeHtml(plate.primaryLabel)}</figcaption>
    </figure>
    <figure>
      <div class="study-frame"><img src="${plate.companionImage.dataUrl}" alt="" /></div>
      <figcaption>${escapeHtml(plate.companionLabel)}</figcaption>
    </figure>
  </div>
  <div class="material-note">
    <p class="note-label">Material decision</p>
    <p>${escapeHtml(plate.materialNote)}</p>
  </div>
  <p class="access-note"><span>Image description:</span> ${escapeHtml(plate.alt)}</p>
  <p class="frame-note"><span>Frame status:</span> ${escapeHtml(plate.frameNote)}</p>
</section>`;
}

const CSS = `
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; }
html { color: #1e211f; background: #d9d4c8; font-family: Georgia, "Times New Roman", serif; }
body { margin: 0; }
.page { position: relative; width: 8.5in; height: 11in; overflow: hidden; break-after: page; background: #f2eee5; }
.page:last-child { break-after: auto; }
.draft-mark { position: absolute; z-index: 5; top: .32in; right: .34in; padding: .07in .12in; border: 1px solid rgba(238,218,162,.5); color: #eedaa2; background: rgba(8,12,16,.78); font: 600 7.5pt/1.1 Arial, sans-serif; letter-spacing: .04em; border-radius: 999px; }
.cover-sheet { padding: .52in; display: grid; grid-template-columns: 4.7in 1fr; gap: .46in; color: #f2ead9; background: radial-gradient(circle at 72% 24%, #21303a 0, #10171d 33%, #080c10 72%); }
.cover-sheet::after { content: ""; position: absolute; inset: .28in; border: 1px solid rgba(210,180,112,.28); pointer-events: none; }
.cover-art { margin: 0; height: 9.96in; display: flex; align-items: center; justify-content: center; }
.cover-art img { display: block; max-width: 100%; max-height: 100%; box-shadow: 0 .18in .52in rgba(0,0,0,.52); }
.cover-copy { align-self: end; padding: 0 .08in .4in 0; }
.eyebrow, .folio, .chapter-ref, .note-label, figcaption, .provenance-term { font-family: Arial, sans-serif; }
.eyebrow { margin: 0 0 .24in; color: #c8a75f; font-size: 8.5pt; line-height: 1.4; letter-spacing: .06em; }
h1 { margin: 0; font-size: 31pt; line-height: 1.02; font-weight: 500; }
.subtitle { margin: .23in 0 .62in; color: #c8d2d4; font-size: 13pt; line-height: 1.35; font-style: italic; }
.byline { margin: 0; font-size: 11pt; }
.intro-page { padding: .86in .82in; background: linear-gradient(145deg, #f5f1e8 0, #e7e0d1 100%); }
.intro-page h2, .provenance-page h2 { max-width: 5.9in; margin: 1.24in 0 .3in; font-size: 30pt; line-height: 1.05; font-weight: 500; }
.intro-lede { max-width: 5.9in; margin: 0 0 .46in; font-size: 16pt; line-height: 1.45; color: #394246; }
.principles { width: 5.9in; margin: .7in 0 0 1in; padding: 0; list-style: none; counter-reset: artbook-principle; }
.principles li { position: relative; margin: 0 0 .38in; padding-left: .58in; font-size: 11.5pt; line-height: 1.52; }
.principles li::before { counter-increment: artbook-principle; content: counter(artbook-principle); position: absolute; left: 0; top: -.03in; width: .34in; height: .34in; display: grid; place-items: center; border: 1px solid #9a793a; border-radius: 50%; color: #735b2d; font: 9pt Arial, sans-serif; }
.plate-page { padding: .44in .54in .52in; display: grid; grid-template-rows: .4in 7.05in 1fr; gap: .2in; background: #0c1115; color: #f0eadc; }
.plate-heading { display: flex; align-items: baseline; justify-content: space-between; color: #b9c2c4; }
.folio, .chapter-ref { margin: 0; font-size: 7.5pt; letter-spacing: .045em; }
.hero-figure { margin: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #05080a; border: 1px solid rgba(218,190,126,.22); }
.hero-figure img { display: block; width: 100%; height: 100%; object-fit: contain; }
.plate-copy { display: grid; grid-template-columns: 2.2in 1fr; gap: .45in; align-items: start; padding-top: .17in; }
.plate-copy h2 { margin: 0; font-size: 21pt; line-height: 1.05; font-weight: 500; color: #e4c982; }
.caption { margin: 0; font-size: 12.2pt; line-height: 1.48; }
.study-page { padding: .7in .68in .62in; background: #f2eee5; }
.study-heading { display: grid; grid-template-columns: 1.9in 1fr; gap: .25in; align-items: end; border-bottom: 1px solid #b8ad99; padding-bottom: .18in; }
.study-heading .folio { color: #76633b; }
.study-heading h2 { margin: 0; font-size: 22pt; line-height: 1.08; font-weight: 500; }
.study-grid { height: 6.15in; display: grid; grid-template-columns: 1fr 1fr; gap: .36in; margin-top: .38in; }
.study-grid figure { min-width: 0; margin: 0; display: grid; grid-template-rows: 1fr .28in; gap: .11in; }
.study-frame { display: flex; align-items: center; justify-content: center; overflow: hidden; background: #151a1d; border: 1px solid #c4b89f; }
.study-frame img { display: block; width: 100%; height: 100%; object-fit: contain; }
figcaption { color: #695a3c; font-size: 7.5pt; letter-spacing: .04em; }
.material-note { display: grid; grid-template-columns: 1.35in 1fr; gap: .3in; margin-top: .42in; padding-top: .22in; border-top: 1px solid #b8ad99; }
.material-note p { margin: 0; font-size: 10.5pt; line-height: 1.45; }
.material-note .note-label { color: #76633b; font-size: 7.5pt; letter-spacing: .04em; }
.access-note, .frame-note { margin: .28in 0 0; color: #4d5556; font-size: 8.5pt; line-height: 1.42; }
.access-note span, .frame-note span { color: #765f31; }
.frame-note { margin-top: .14in; }
.provenance-page { padding: .78in .8in; background: linear-gradient(145deg, #ede7da, #d9d1c1); }
.provenance-page h2 { margin-top: .5in; }
.provenance-lede { max-width: 6.1in; font-size: 13pt; line-height: 1.5; color: #3f484a; }
.provenance-grid { margin-top: .62in; display: grid; grid-template-columns: 1.5in 1fr; gap: .2in .34in; }
.provenance-term { color: #715b2f; font-size: 8pt; letter-spacing: .04em; }
.provenance-value { font-size: 10.5pt; line-height: 1.48; }
.provenance-value, .provenance-term { margin: 0; padding-top: .13in; border-top: 1px solid rgba(113,91,47,.27); }
@media screen {
  body { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px 0; }
  .page { box-shadow: 0 8px 32px rgba(20,18,14,.25); }
}
@media print {
  body { background: white; }
  .page { box-shadow: none; }
}
`;

function renderHtml(spec, plates, cover, options) {
  const draftMark = options.draft ? '<p class="draft-mark">Protected staging proof</p>' : '';
  const displayByline = spec.publication.bylineStatus === 'approved'
    && typeof spec.publication.byline === 'string'
    && spec.publication.byline.trim()
    ? spec.publication.byline
    : 'Byline pending approval';
  const pages = plates.map((plate, index) => platePages(plate, index, draftMark)).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(spec.title)} · Cinematic artbook</title>
  <style>${CSS}</style>
</head>
<body>
<section class="page cover-sheet">
  ${draftMark}
  <figure class="cover-art"><img src="${cover.dataUrl}" alt="${escapeHtml(spec.cover.alt)}" /></figure>
  <div class="cover-copy">
    <p class="eyebrow">${escapeHtml(spec.series)} · Founding cinematic edition</p>
    <h1>${escapeHtml(spec.title)}</h1>
    <p class="subtitle">${escapeHtml(spec.subtitle)}</p>
    <p class="byline">${escapeHtml(displayByline)}</p>
  </div>
</section>
<section class="page intro-page">
  ${draftMark}
  <p class="eyebrow">About these plates</p>
  <h2>Nine scenes and studies from ${escapeHtml(spec.title)}</h2>
  <p class="intro-lede">Each plate returns to a moment or material decision that changes what a character can do: a wet seam, a sealed vial, a manual release, a page kept separate.</p>
  <ol class="principles">
    <li>Captions mark the human turn without summarizing the chapter.</li>
    <li>Water, brass, stone, paper, and cloth retain the physical limits established in the manuscript.</li>
    <li>Each scene or editorial study appears at two reading distances; every interpretive departure is labeled beside the image.</li>
    <li>The production record distinguishes disclosed tool output, editorial selection, and approvals still pending human review.</li>
  </ol>
</section>
${pages}
<section class="page provenance-page">
  ${draftMark}
  <p class="eyebrow">Image provenance</p>
  <h2>A record of generation and selection</h2>
  <p class="provenance-lede">The plates began as generated candidates, then were selected and corrected against the manuscript, art direction, and character-continuity records. The entries below state what the image tool disclosed and what remains unresolved.</p>
  <div class="provenance-grid">
    <p class="provenance-term">Generation</p><p class="provenance-value">${escapeHtml(spec.provenance.generator)}. ${escapeHtml(spec.provenance.backendModelNote)}</p>
    <p class="provenance-term">Selection</p><p class="provenance-value">${escapeHtml(spec.provenance.selection)}</p>
    <p class="provenance-term">Sources</p><p class="provenance-value">Arcanea manuscript, book bible, art direction, character-continuity records, and earlier Arcanea image candidates. No third-party visual reference was provided.</p>
    <p class="provenance-term">Disclosure</p><p class="provenance-value">The buyer's Creator's Ledger may include task-prompt summaries, model roles, and editorial changes. It omits private operational data and third-party protected material.</p>
    <p class="provenance-term">Rights</p><p class="provenance-value">${escapeHtml(spec.provenance.rightsNote)}</p>
    <p class="provenance-term">Edition state</p><p class="provenance-value">${escapeHtml(options.draft ? 'Protected staging proof; not for public or commercial distribution.' : `Released ${options.releaseDate}.`)}</p>
  </div>
</section>
</body>
</html>`;
}

async function updateManifest(options, spec, specReceipt, provenance, cover, plates, htmlPath, html) {
  const manifestPath = path.join(options.out, 'manifest.json');
  await assertOutputFile(manifestPath, 'Edition manifest', true);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8').catch(() => {
    fail(`Build the novel edition manifest first: ${manifestPath}`);
  }));
  if (manifest.bookId !== spec.bookId || manifest.editionId !== spec.editionId) {
    fail('Artbook specification does not match the edition manifest.');
  }
  const expectedManifestAuthor = options.draft ? 'Byline pending approval' : options.author;
  if (manifest.title !== spec.title || manifest.author !== expectedManifestAuthor) {
    fail('Artbook title and publication name must match the novel edition manifest.');
  }
  if (manifest.releaseDate !== options.releaseDate) {
    fail('Artbook and novel manifest must use the same release date.');
  }
  assertManifestMode(manifest, options.draft);
  if (manifest.sourceCommit && provenance.commit && manifest.sourceCommit !== provenance.commit) {
    fail('Artbook and novel manifest must come from the same source commit.');
  }
  if (!manifest.cover || manifest.cover.sha256 !== cover.sha256) {
    fail('Artbook cover does not match the novel edition manifest.');
  }
  const sourceFile = {
    filename: path.basename(htmlPath),
    bytes: Buffer.byteLength(html),
    sha256: sha256(html),
    format: 'HTML artbook source',
    pageCount: EXPECTED_PAGE_COUNT,
  };
  manifest.files = [
    ...(manifest.files || []).filter(
      (file) => ![sourceFile.filename, 'the-last-free-path-artbook.pdf'].includes(file.filename),
    ),
    sourceFile,
  ];
  manifest.pending = [...new Set([...(manifest.pending || []), 'cinematic artbook PDF'])];
  manifest.artbook = {
    status: spec.status,
    titleStatus: spec.titleStatus,
    rightsStatus: spec.rightsStatus,
    humanApprovals: { ...spec.humanApprovals },
    publication: { ...spec.publication },
    sourceCommit: provenance.commit,
    sourceDirty: provenance.dirty,
    spec: { path: specReceipt.relative, sha256: specReceipt.sha256 },
    source: { filename: sourceFile.filename, sha256: sourceFile.sha256, expectedPageCount: EXPECTED_PAGE_COUNT },
    cover: {
      assetId: cover.assetId,
      path: cover.repoPath,
      sha256: cover.sha256,
      width: cover.width,
      height: cover.height,
      alt: spec.cover.alt,
      status: spec.cover.status,
      approvalReceipts: { ...spec.cover.approvalReceipts },
    },
    provenance: { ...spec.provenance },
    plateCount: plates.length,
    plates: plates.map((plate) => ({
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
    })),
    accessibility: {
      descriptiveCoverAlt: true,
      imageDescriptions: plates.length,
      semanticHeadings: true,
      expectedPageCount: EXPECTED_PAGE_COUNT,
      status: 'source-validated',
    },
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { specReceipt, spec, cover, plates } = await loadCommittedArtbook();
  assertReleaseApproval(spec, options.draft, options.author);
  const provenance = sourceState(options.draft);
  const html = renderHtml(spec, plates, cover, options);
  options.out = await ensureOutputDirectory(options.out);
  const htmlPath = path.join(options.out, OUTPUT_FILENAME);
  await assertOutputFile(htmlPath, 'Artbook source output', false);
  await assertOutputFile(path.join(options.out, 'manifest.json'), 'Edition manifest', true);
  await writeFile(htmlPath, html, 'utf8');
  await updateManifest(options, spec, specReceipt, provenance, cover, plates, htmlPath, html);
  process.stdout.write(`Built artbook draft=${options.draft} plates=${plates.length} out=${htmlPath}\n`);
}

async function loadCommittedArtbook() {
  const specReceipt = await trackedHeadRecord(SPEC_PATH, 'artbook specification');
  const spec = JSON.parse(specReceipt.bytes.toString('utf8'));
  validateSpec(spec);
  const cover = await imageRecord(REPO_ROOT, spec.cover, 'cover asset');
  const plates = [];
  for (const plate of spec.plates) plates.push(await loadPlate(plate));
  return { specReceipt, spec, cover, plates };
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  assertManifestMode,
  assertReleaseApproval,
  loadCommittedArtbook,
  renderHtml,
  validateSpec,
};
