import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { validateCinematicReleaseManifest, verifiedCinematicReleaseFiles } from '../../lib/books/cinematic-release-manifest-contract.ts';

const SOURCE_COMMIT = 'a'.repeat(40);
const AUTHOR = 'Approved Author';

function sha(character) {
  return character.repeat(64);
}

function publication() {
  return {
    byline: AUTHOR,
    bylineStatus: 'approved',
    bylineApprovalReceipt: 'release-lead:byline:approved',
  };
}

function cover() {
  return {
    assetId: 'cover-approved-r04',
    path: 'apps/web/public/images/books/the-last-free-path/cover-approved.png',
    sha256: sha('c'),
    width: 1800,
    height: 2880,
    status: 'approved',
    approvalReceipts: {
      casting: 'editor:casting:approved',
      rights: 'rights:cover:approved',
      title: 'release-lead:title-lock:approved',
    },
  };
}

function pdfFile(filename, format, hashCharacter) {
  return {
    filename,
    bytes: 4096,
    sha256: sha(hashCharacter),
    sourceSha256: sha('8'),
    format,
    validation: {
      pageCount: 320,
      tagged: true,
      outlineEntries: 32,
      pagesWithText: 320,
    },
  };
}

function manifestFixture() {
  const approvedCover = cover();
  const artbookFile = pdfFile(
    'the-last-free-path-artbook.pdf',
    'Tagged cinematic artbook PDF — 8.5×11',
    '4',
  );
  return {
    bookId: 'the-last-free-path',
    editionId: 'book-01-founding-cinematic',
    title: 'The Last Free Path',
    series: 'Chronicles of Arcanea',
    author: AUTHOR,
    draft: false,
    sourceCommit: SOURCE_COMMIT,
    sourceDirty: false,
    manuscriptSha256: sha('b'),
    chapterCount: 32,
    cover: approvedCover,
    edition: {
      status: 'approved',
      manuscriptStatus: 'approved',
      titleStatus: 'approved',
      rightsStatus: 'approved',
      approvedManuscriptSha256: sha('b'),
      humanApprovals: {
        canon: true,
        editorial: true,
        legal: true,
        rights: true,
        title: true,
      },
      approvalReceipts: {
        canon: 'canon:approved',
        editorial: 'editorial:approved',
        legal: 'legal:approved',
        rights: 'rights:approved',
        title: 'title:approved',
      },
      publication: publication(),
      chapters: Array.from({ length: 32 }, (_, index) => ({
        number: index + 1,
        filename: `chapter-${String(index + 1).padStart(2, '0')}.md`,
        path: `book/chapters/chapter-${String(index + 1).padStart(2, '0')}.md`,
        status: 'release-approved',
        sha256: sha(String((index % 8) + 1)),
      })),
    },
    files: [
      {
        filename: 'the-last-free-path.epub',
        bytes: 2048,
        sha256: sha('1'),
        format: 'EPUB 3',
      },
      pdfFile('the-last-free-path-screen.pdf', 'Tagged screen PDF — 7.5×10', '2'),
      pdfFile('the-last-free-path-print.pdf', 'Tagged print PDF — 6×9', '3'),
      artbookFile,
    ],
    artbook: {
      status: 'approved',
      titleStatus: 'approved',
      rightsStatus: 'approved',
      humanApprovals: {
        canon: true,
        casting: true,
        rights: true,
        title: true,
      },
      publication: publication(),
      sourceCommit: SOURCE_COMMIT,
      sourceDirty: false,
      cover: approvedCover,
      plateCount: 9,
      plates: Array.from({ length: 9 }, (_, index) => ({ id: `plate-${index + 1}` })),
      pdf: {
        filename: artbookFile.filename,
        sha256: artbookFile.sha256,
        tagged: true,
        pageCount: 21,
      },
    },
    pending: [],
  };
}

function bytesAndHash(manifest) {
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  return {
    bytes,
    hash: createHash('sha256').update(bytes).digest('hex'),
  };
}

function expectation(manifest) {
  const { hash } = bytesAndHash(manifest);
  return {
    actualManifestSha256: hash,
    expectedManifestSha256: hash,
    expectedSourceCommit: SOURCE_COMMIT,
    deployedSourceCommit: SOURCE_COMMIT,
  };
}

test('an exact fully approved manifest opens the release gate', () => {
  const manifest = manifestFixture();
  assert.equal(validateCinematicReleaseManifest(manifest, expectation(manifest)), true);
  const files = verifiedCinematicReleaseFiles(manifest, expectation(manifest));
  assert.deepEqual(Object.keys(files).sort(), manifest.files.map((file) => file.filename).sort());
  assert.deepEqual(files['the-last-free-path.epub'], { bytes: 2048, sha256: sha('1') });
});

test('tampered manifest bytes fail the recorded manifest receipt', () => {
  const manifest = manifestFixture();
  const approved = expectation(manifest);
  manifest.author = 'Tampered Author';
  const tampered = expectation(manifest);
  assert.equal(validateCinematicReleaseManifest(manifest, {
    ...approved,
    actualManifestSha256: tampered.actualManifestSha256,
  }), false);
});

test('stale manifest and deployed revisions fail closed', () => {
  const manifest = manifestFixture();
  const expected = expectation(manifest);
  manifest.sourceCommit = 'd'.repeat(40);
  assert.equal(validateCinematicReleaseManifest(manifest, expectation(manifest)), false);
  assert.equal(validateCinematicReleaseManifest(manifestFixture(), {
    ...expected,
    deployedSourceCommit: 'e'.repeat(40),
  }), false);
});

test('draft and incomplete approval states fail even with matching bytes', () => {
  const draft = manifestFixture();
  draft.draft = true;
  assert.equal(validateCinematicReleaseManifest(draft, expectation(draft)), false);

  const unapproved = manifestFixture();
  unapproved.edition.humanApprovals.editorial = false;
  assert.equal(validateCinematicReleaseManifest(unapproved, expectation(unapproved)), false);
});

test('missing or invalid required artifact records fail closed', () => {
  const missing = manifestFixture();
  missing.files = missing.files.filter((file) => file.filename !== 'the-last-free-path.epub');
  assert.equal(validateCinematicReleaseManifest(missing, expectation(missing)), false);

  const invalidHash = manifestFixture();
  invalidHash.files[1].sha256 = 'not-a-hash';
  assert.equal(validateCinematicReleaseManifest(invalidHash, expectation(invalidHash)), false);

  const tooLarge = manifestFixture();
  tooLarge.files[0].bytes = 128 * 1024 * 1024 + 1;
  assert.equal(verifiedCinematicReleaseFiles(tooLarge, expectation(tooLarge)), null);
});

test('release-blocking pending work fails closed', () => {
  const manifest = manifestFixture();
  manifest.pending.push('accessibility audit');
  assert.equal(validateCinematicReleaseManifest(manifest, expectation(manifest)), false);
});
