'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  assertManifestMode,
  assertReleaseApproval,
  renderHtml,
  validateSpec,
} = require('../build-cinematic-artbook.cjs');
const { assertSpecificationState, validateManifest } = require('../render-cinematic-artbook.cjs');

const WEB_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(WEB_ROOT, '../..');
const SPEC_PATH = path.join(
  REPO_ROOT,
  'book',
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
  'artbook-spec.json',
);
const SOURCE_FILENAME = 'the-last-free-path-artbook-source.html';
const ASPECTS = [
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
  const sourceHash = sha256(sourceBytes);
  const commit = 'a'.repeat(40);
  return {
    bookId: 'the-last-free-path',
    editionId: 'book-01-founding-cinematic',
    title: 'The Last Free Path',
    author: 'Byline pending approval',
    releaseDate: '2026-08-30',
    draft: true,
    sourceCommit: commit,
    files: [{ filename: SOURCE_FILENAME, sha256: sourceHash, pageCount: 21 }],
    pending: ['cinematic artbook PDF'],
    artbook: {
      status: 'protected-staging',
      titleStatus: 'provisional',
      rightsStatus: 'pending-human-approval',
      humanApprovals: { canon: false, casting: false, rights: false, title: false },
      publication: { byline: null, bylineApprovalReceipt: null, bylineStatus: 'pending' },
      sourceCommit: commit,
      sourceDirty: true,
      spec: { path: 'book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/artbook-spec.json', sha256: 'b'.repeat(64) },
      source: { filename: SOURCE_FILENAME, sha256: sourceHash, expectedPageCount: 21 },
      cover: {
        assetId: 'cover-held-interval-preview-r03',
        path: 'apps/web/public/images/books/the-last-free-path/cover-held-interval-preview.png',
        sha256: 'c'.repeat(64),
        width: 992,
        height: 1586,
        alt: 'Three adult forearms converge above a material workbench.',
        status: 'protected-staging',
        approvalReceipts: { casting: null, rights: null, title: null },
      },
      provenance: {
        generator: 'Disclosed image-generation workflow',
        backendModel: null,
        backendModelNote: 'The exact backend model was not surfaced.',
        selection: 'Editors selected candidates against the manuscript.',
        rightsNote: 'Human commercial-rights approval remains pending.',
      },
      plateCount: 9,
      plates: ASPECTS.map(([primaryAspect, companionAspect], index) => {
        const id = `plate-${String(index + 1).padStart(2, '0')}`;
        const asset = (kind, aspect) => ({
          assetId: `${id}-${kind}`,
          path: `art/plates/${id}-${kind}.webp`,
          sha256: String(index + 1).repeat(64).slice(0, 64),
          width: aspect === '4:5' ? 1122 : aspect === '16:9' ? 1672 : 1536,
          height: aspect === '4:5' ? 1402 : aspect === '16:9' ? 941 : 1024,
          aspect,
        });
        return {
          id,
          mode: [3, 5, 7].includes(index) ? 'editorial-study' : 'scene',
          title: `Plate ${index + 1}`,
          chapter: `Chapter ${index + 1}`,
          caption: 'A material action changes what the characters can do.',
          alt: 'A descriptive image record.',
          frameNote: 'Narrative scene.',
          primary: asset('primary', primaryAspect),
          companion: asset('companion', companionAspect),
        };
      }),
      accessibility: {
        descriptiveCoverAlt: true,
        imageDescriptions: 9,
        semanticHeadings: true,
        expectedPageCount: 21,
        status: 'source-validated',
      },
    },
  };
}

test('the protected-staging specification validates but cannot release', () => {
  const spec = loadSpec();
  assert.doesNotThrow(() => validateSpec(spec));
  assert.doesNotThrow(() => assertReleaseApproval(spec, true, 'Internal proof name'));
  assert.throws(
    () => assertReleaseApproval(spec, false, 'Internal proof name'),
    /not approved|remain open/,
  );
});

test('draft HTML marks all 21 pages and never prints an unapproved byline', () => {
  const spec = loadSpec();
  const plates = spec.plates.map((plate) => ({
    ...plate,
    primaryImage: { dataUrl: 'data:image/webp;base64,AA==' },
    companionImage: { dataUrl: 'data:image/webp;base64,AA==' },
  }));
  const html = renderHtml(
    spec,
    plates,
    { dataUrl: 'data:image/png;base64,AA==' },
    { author: 'Unapproved public name', draft: true, releaseDate: '2026-08-30' },
  );
  assert.equal((html.match(/class="page(?: |")/g) || []).length, 21);
  assert.equal((html.match(/class="draft-mark"/g) || []).length, 21);
  assert.match(html, /Byline pending approval/);
  assert.doesNotMatch(html, /Unapproved public name/);
});

test('specification approval fields reject fail-open types and extra keys', () => {
  const nonBoolean = loadSpec();
  nonBoolean.humanApprovals.canon = 'false';
  assert.throws(() => validateSpec(nonBoolean), /must be a boolean/);

  const extraReceipt = loadSpec();
  extraReceipt.cover.approvalReceipts.publisher = null;
  assert.throws(() => validateSpec(extraReceipt), /must contain exactly/);
});

test('renderer accepts a complete draft manifest and rejects ambiguous draft mode', () => {
  const source = Buffer.from('<!doctype html><title>Artbook proof</title>');
  const manifest = manifestFixture(source);
  assert.doesNotThrow(() => validateManifest(manifest, source));

  const ambiguous = clone(manifest);
  ambiguous.draft = 'false';
  assert.throws(() => validateManifest(ambiguous, source), /must be a boolean/);
  assert.throws(() => assertManifestMode(ambiguous, true), /exactly match/);
});

test('draft metadata must match the committed specification state', () => {
  const source = Buffer.from('<!doctype html><title>Artbook proof</title>');
  const manifest = manifestFixture(source);
  const spec = loadSpec();
  assert.doesNotThrow(() => assertSpecificationState(manifest, spec));
  manifest.artbook.titleStatus = 'approved';
  assert.throws(() => assertSpecificationState(manifest, spec), /does not match/);
});

test('renderer rejects duplicate asset evidence and incomplete release approvals', () => {
  const source = Buffer.from('<!doctype html><title>Artbook proof</title>');
  const duplicate = manifestFixture(source);
  duplicate.artbook.plates[1].primary.path = duplicate.artbook.plates[0].primary.path;
  assert.throws(() => validateManifest(duplicate, source), /asset evidence is invalid/);

  const release = manifestFixture(source);
  release.draft = false;
  release.artbook.sourceDirty = false;
  assert.throws(() => validateManifest(release, source), /not fully approved/);

  const nullByline = manifestFixture(source);
  nullByline.draft = false;
  nullByline.artbook.status = 'approved';
  nullByline.artbook.titleStatus = 'approved';
  nullByline.artbook.rightsStatus = 'approved';
  nullByline.artbook.humanApprovals = { canon: true, casting: true, rights: true, title: true };
  nullByline.artbook.publication = { byline: null, bylineApprovalReceipt: 'receipt', bylineStatus: 'approved' };
  nullByline.artbook.cover.status = 'approved';
  nullByline.artbook.cover.approvalReceipts = { casting: 'a', rights: 'b', title: 'c' };
  nullByline.artbook.sourceDirty = false;
  assert.throws(() => validateManifest(nullByline, source), /byline approval evidence is incomplete/);
});
