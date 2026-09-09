'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  SPEC_REPO_PATH,
  assertReleaseApproval,
  ensureOutputDirectory,
  validateReleaseDate,
  validateSpec,
  workingTreeRecord,
} = require('../cinematic-edition-contract.cjs');
const { contentOpf, loadCover, parseArgs, printHtml, renderParagraphs } = require('../build-cinematic-edition.cjs');
const { validateManifest } = require('../render-cinematic-pdfs.cjs');

const WEB_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(WEB_ROOT, '../..');
const SPEC_PATH = path.join(
  REPO_ROOT,
  'book',
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
  'edition-spec.json',
);
const SOURCE_FILENAME = 'the-last-free-path-print-source.html';
const EPUB_BYTES = Buffer.from('PK\u0003\u0004application/epub+zip');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function loadSpec() {
  return JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
}

function manifestFixture(sourceBytes) {
  const spec = loadSpec();
  const chapters = Array.from({ length: 32 }, (_, index) => {
    const number = index + 1;
    const filename = `chapter-${String(number).padStart(2, '0')}-fixture.md`;
    return {
      number,
      filename,
      path: `book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/chapters/${filename}`,
      status: 'revised-draft',
      sha256: String((number % 9) + 1).repeat(64),
    };
  });
  return {
    bookId: 'the-last-free-path',
    editionId: 'book-01-founding-cinematic',
    title: 'The Last Free Path',
    series: 'Chronicles of Arcanea',
    author: 'Byline pending approval',
    draft: true,
    releaseDate: '2026-08-30',
    sourceCommit: 'a'.repeat(40),
    sourceDirty: true,
    manuscriptSha256: 'b'.repeat(64),
    chapterCount: 32,
    cover: {
      assetId: spec.cover.assetId,
      filename: 'cover.png',
      path: spec.cover.path,
      sha256: spec.cover.sha256,
      width: spec.cover.width,
      height: spec.cover.height,
      status: spec.cover.status,
      approvalReceipts: { ...spec.cover.approvalReceipts },
    },
    edition: {
      status: spec.status,
      manuscriptStatus: spec.manuscriptStatus,
      titleStatus: spec.titleStatus,
      rightsStatus: spec.rightsStatus,
      approvedManuscriptSha256: spec.approvedManuscriptSha256,
      humanApprovals: { ...spec.humanApprovals },
      approvalReceipts: { ...spec.approvalReceipts },
      publication: { ...spec.publication },
      spec: { path: SPEC_REPO_PATH, sha256: 'c'.repeat(64) },
      requiredReleaseChapterStatus: 'release-approved',
      chapters,
    },
    files: [
      {
        filename: SOURCE_FILENAME,
        bytes: sourceBytes.length,
        sha256: sha256(sourceBytes),
        format: 'HTML print source',
      },
      {
        filename: 'the-last-free-path.epub',
        bytes: EPUB_BYTES.length,
        sha256: sha256(EPUB_BYTES),
        format: 'EPUB 3',
      },
    ],
    pending: ['screen PDF render', 'print PDF render'],
  };
}

test('protected staging validates for drafts and blocks release mode', () => {
  const spec = loadSpec();
  assert.doesNotThrow(() => validateSpec(spec));
  assert.doesNotThrow(() => assertReleaseApproval(spec, true, 'Internal proof name'));
  assert.throws(
    () => assertReleaseApproval(spec, false, 'Internal proof name'),
    /not approved|requires an approved|remain open/,
  );
});

test('approval fields reject fail-open values and extra keys', () => {
  const nonBoolean = loadSpec();
  nonBoolean.humanApprovals.editorial = 'false';
  assert.throws(() => validateSpec(nonBoolean), /must be a boolean/);

  const extraReceipt = loadSpec();
  extraReceipt.approvalReceipts.publisher = null;
  assert.throws(() => validateSpec(extraReceipt), /must contain exactly/);

  const escapedCover = loadSpec();
  escapedCover.cover.path = '../../outside.png';
  assert.throws(() => validateSpec(escapedCover), /cinematic book asset directory/);
});

test('release dates reject impossible calendar values', () => {
  assert.equal(validateReleaseDate('2026-08-30'), '2026-08-30');
  assert.throws(() => validateReleaseDate('2026-02-30'), /real calendar date/);
  assert.throws(
    () => parseArgs(['--out', 'proof', '--author', 'Internal proof name', '--release-date', '2026-13-01', '--draft']),
    /real calendar date/,
  );
});

test('renderer accepts a complete draft manifest and rejects ambiguous mode', () => {
  const source = Buffer.from('<!doctype html><title>Edition proof</title>');
  const manifest = manifestFixture(source);
  assert.doesNotThrow(() => validateManifest(manifest, source, EPUB_BYTES));

  const ambiguous = clone(manifest);
  ambiguous.draft = 'false';
  assert.throws(() => validateManifest(ambiguous, source, EPUB_BYTES), /must be a boolean/);

  const failOpenApproval = clone(manifest);
  failOpenApproval.edition.humanApprovals.canon = 'false';
  assert.throws(() => validateManifest(failOpenApproval, source, EPUB_BYTES), /must be a boolean/);
});

test('output and cover paths cannot escape the approved roots', async () => {
  await assert.rejects(
    () => ensureOutputDirectory(path.join(REPO_ROOT, 'tmp-edition-output')),
    /outside the source repository/,
  );
  await assert.rejects(
    () => loadCover(path.join(REPO_ROOT, 'README.md'), loadSpec(), true),
    /must use the edition specification asset/,
  );
  const specRecord = await workingTreeRecord(SPEC_PATH, 'Edition specification');
  assert.equal(specRecord.relative.endsWith('/edition-spec.json'), true);
  await assert.rejects(
    () => workingTreeRecord(path.resolve(REPO_ROOT, '..', 'outside.md'), 'Outside source'),
    /escapes the source repository/,
  );
});

test('release approval is bound to the exact approved manuscript hash', () => {
  const spec = loadSpec();
  spec.status = 'approved';
  spec.manuscriptStatus = 'approved';
  spec.titleStatus = 'approved';
  spec.rightsStatus = 'approved';
  spec.approvedManuscriptSha256 = 'd'.repeat(64);
  spec.humanApprovals = { canon: true, editorial: true, legal: true, rights: true, title: true };
  spec.approvalReceipts = { canon: 'c', editorial: 'e', legal: 'l', rights: 'r', title: 't' };
  spec.publication = { byline: 'Approved Author', bylineStatus: 'approved', bylineApprovalReceipt: 'b' };
  spec.cover.status = 'approved';
  spec.cover.approvalReceipts = { casting: 'c', rights: 'r', title: 't' };
  assert.throws(
    () => assertReleaseApproval(spec, false, 'Approved Author', 'e'.repeat(64)),
    /does not match the approved manuscript/,
  );
  assert.doesNotThrow(() => assertReleaseApproval(spec, false, 'Approved Author', 'd'.repeat(64)));
});

test('renderer binds the canonical print source hash and chapter sequence', () => {
  const source = Buffer.from('<!doctype html><title>Edition proof</title>');
  const wrongSource = Buffer.from('<!doctype html><title>Tampered proof</title>');
  const manifest = manifestFixture(source);
  assert.throws(() => validateManifest(manifest, wrongSource, EPUB_BYTES), /does not match the canonical print source/);

  const brokenSequence = manifestFixture(source);
  brokenSequence.edition.chapters[4].number = 9;
  assert.throws(() => validateManifest(brokenSequence, source, EPUB_BYTES), /invalid at chapter 5/);
});

test('release manifests require approvals, receipts, cover, and release-approved chapters', () => {
  const source = Buffer.from('<!doctype html><title>Edition proof</title>');
  const manifest = manifestFixture(source);
  manifest.draft = false;
  manifest.sourceDirty = false;
  manifest.author = 'Approved Author';
  manifest.edition.approvedManuscriptSha256 = manifest.manuscriptSha256;
  assert.throws(() => validateManifest(manifest, source, EPUB_BYTES), /not fully approved/);

  manifest.edition.status = 'approved';
  manifest.edition.manuscriptStatus = 'approved';
  manifest.edition.titleStatus = 'approved';
  manifest.edition.rightsStatus = 'approved';
  manifest.edition.humanApprovals = { canon: true, editorial: true, legal: true, rights: true, title: true };
  manifest.edition.approvalReceipts = { canon: 'c', editorial: 'e', legal: 'l', rights: 'r', title: 't' };
  manifest.edition.publication = {
    byline: 'Approved Author',
    bylineStatus: 'approved',
    bylineApprovalReceipt: 'byline-receipt',
  };
  manifest.cover.status = 'approved';
  manifest.cover.approvalReceipts = { casting: 'casting', rights: 'rights', title: 'title' };
  assert.throws(() => validateManifest(manifest, source, EPUB_BYTES), /not release-approved/);
});

test('renderer refuses a missing or replaced EPUB before PDF finalization', () => {
  const source = Buffer.from('<!doctype html><title>Edition proof</title>');
  const manifest = manifestFixture(source);
  assert.throws(() => validateManifest(manifest, source, Buffer.from('not-an-epub')), /ZIP container header/);
  assert.throws(
    () => validateManifest(manifest, source, Buffer.from('PK\u0003\u0004replaced')),
    /does not match the canonical EPUB/,
  );
});

test('edition rendering rejects unsupported block Markdown and fixes the modification timestamp', () => {
  assert.throws(() => renderParagraphs('> unsupported', 'chapter.md'), /block Markdown/);
  assert.match(renderParagraphs('1. First\n2. Second', 'chapter.md'), /<ol class="story-list">/);
  const opf = contentOpf([], 'Internal proof name', '2026-08-30', null);
  assert.match(opf, /2026-08-30T00:00:00Z/);
});

test('protected draft artifacts expose staging status and never print the requested byline', () => {
  const opf = contentOpf([], 'Byline pending approval', '2026-08-30', null, true);
  assert.match(opf, /protected staging proof/i);
  assert.match(opf, /Byline pending approval/);
  assert.match(opf, /Arcanea internal proof/);
  assert.doesNotMatch(opf, /<dc:date>/);
  const html = printHtml([], 'Byline pending approval', { dataUrl: 'data:image/png;base64,AA==' }, true);
  assert.match(html, /Protected staging proof · Not for distribution/);
  assert.match(html, /Founding cinematic edition · protected proof/);
  assert.match(html, /class="draft"/);
  assert.doesNotMatch(html, /Internal proof name/);
});
