import {
  MAX_CINEMATIC_ARTIFACT_BYTES,
  type CinematicArtifactEvidence,
} from './cinematic-artifact-integrity';

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const COMMIT_PATTERN = /^[a-f0-9]{40,64}$/;

const NOVEL_APPROVAL_KEYS = ['canon', 'editorial', 'legal', 'rights', 'title'] as const;
const ARTBOOK_APPROVAL_KEYS = ['canon', 'casting', 'rights', 'title'] as const;
const COVER_APPROVAL_KEYS = ['casting', 'rights', 'title'] as const;

const REQUIRED_FILES = {
  'the-last-free-path.epub': 'EPUB 3',
  'the-last-free-path-screen.pdf': 'Tagged screen PDF — 7.5×10',
  'the-last-free-path-print.pdf': 'Tagged print PDF — 6×9',
  'the-last-free-path-artbook.pdf': 'Tagged cinematic artbook PDF — 8.5×11',
} as const;

type UnknownRecord = Record<string, unknown>;

export type CinematicReleaseFiles = Readonly<Record<string, CinematicArtifactEvidence>>;

export interface CinematicReleaseManifestExpectation {
  actualManifestSha256: string;
  expectedManifestSha256: string;
  expectedSourceCommit: string;
  deployedSourceCommit: string;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() === value && value.length > 0;
}

function hasExactKeys(value: unknown, keys: readonly string[]): value is UnknownRecord {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function allApproved(value: unknown, keys: readonly string[]): boolean {
  return hasExactKeys(value, keys) && keys.every((key) => value[key] === true);
}

function allReceipted(value: unknown, keys: readonly string[]): boolean {
  return hasExactKeys(value, keys) && keys.every((key) => isNonEmptyText(value[key]));
}

function approvedPublication(value: unknown, author: string): boolean {
  if (!isRecord(value)) return false;
  return value.byline === author
    && value.bylineStatus === 'approved'
    && isNonEmptyText(value.bylineApprovalReceipt);
}

function approvedCover(value: unknown): value is UnknownRecord {
  if (!isRecord(value)) return false;
  return value.status === 'approved'
    && isNonEmptyText(value.assetId)
    && isNonEmptyText(value.path)
    && SHA256_PATTERN.test(typeof value.sha256 === 'string' ? value.sha256 : '')
    && typeof value.width === 'number'
    && Number.isInteger(value.width)
    && value.width > 0
    && typeof value.height === 'number'
    && Number.isInteger(value.height)
    && value.height > 0
    && allReceipted(value.approvalReceipts, COVER_APPROVAL_KEYS);
}

function validPdfEvidence(file: UnknownRecord): boolean {
  if (!SHA256_PATTERN.test(typeof file.sourceSha256 === 'string' ? file.sourceSha256 : '')) return false;
  if (!isRecord(file.validation)) return false;
  return file.validation.tagged === true
    && typeof file.validation.pageCount === 'number'
    && Number.isInteger(file.validation.pageCount)
    && file.validation.pageCount > 0
    && typeof file.validation.outlineEntries === 'number'
    && Number.isInteger(file.validation.outlineEntries)
    && file.validation.outlineEntries > 0;
}

function requiredFileRecords(files: unknown): Map<string, UnknownRecord> | null {
  if (!Array.isArray(files)) return null;
  const required = new Map<string, UnknownRecord>();
  const seen = new Set<string>();

  for (const value of files) {
    if (!isRecord(value) || !isNonEmptyText(value.filename) || seen.has(value.filename)) return null;
    seen.add(value.filename);
    if (!Object.hasOwn(REQUIRED_FILES, value.filename)) continue;
    const expectedFormat = REQUIRED_FILES[value.filename as keyof typeof REQUIRED_FILES];
    if (
      value.format !== expectedFormat
      || typeof value.bytes !== 'number'
      || !Number.isInteger(value.bytes)
      || value.bytes <= 0
      || value.bytes > MAX_CINEMATIC_ARTIFACT_BYTES
      || !SHA256_PATTERN.test(typeof value.sha256 === 'string' ? value.sha256 : '')
    ) {
      return null;
    }
    if (value.filename.endsWith('.pdf') && !validPdfEvidence(value)) return null;
    required.set(value.filename, value);
  }

  return required.size === Object.keys(REQUIRED_FILES).length ? required : null;
}

function approvedNovel(manifest: UnknownRecord, author: string): boolean {
  const edition = manifest.edition;
  if (!isRecord(edition)) return false;
  if (
    edition.status !== 'approved'
    || edition.manuscriptStatus !== 'approved'
    || edition.titleStatus !== 'approved'
    || edition.rightsStatus !== 'approved'
    || edition.approvedManuscriptSha256 !== manifest.manuscriptSha256
    || !SHA256_PATTERN.test(typeof edition.approvedManuscriptSha256 === 'string' ? edition.approvedManuscriptSha256 : '')
    || !allApproved(edition.humanApprovals, NOVEL_APPROVAL_KEYS)
    || !allReceipted(edition.approvalReceipts, NOVEL_APPROVAL_KEYS)
    || !approvedPublication(edition.publication, author)
  ) {
    return false;
  }

  if (!Array.isArray(edition.chapters) || edition.chapters.length !== 32) return false;
  return edition.chapters.every((value, index) => {
    if (!isRecord(value)) return false;
    return value.number === index + 1
      && value.status === 'release-approved'
      && isNonEmptyText(value.filename)
      && isNonEmptyText(value.path)
      && SHA256_PATTERN.test(typeof value.sha256 === 'string' ? value.sha256 : '');
  });
}

function approvedArtbook(
  manifest: UnknownRecord,
  author: string,
  sourceCommit: string,
  files: Map<string, UnknownRecord>,
): boolean {
  const artbook = manifest.artbook;
  if (!isRecord(artbook)) return false;
  if (
    artbook.status !== 'approved'
    || artbook.titleStatus !== 'approved'
    || artbook.rightsStatus !== 'approved'
    || artbook.sourceCommit !== sourceCommit
    || artbook.sourceDirty !== false
    || !allApproved(artbook.humanApprovals, ARTBOOK_APPROVAL_KEYS)
    || !approvedPublication(artbook.publication, author)
    || !approvedCover(artbook.cover)
    || artbook.plateCount !== 9
    || !Array.isArray(artbook.plates)
    || artbook.plates.length !== 9
  ) {
    return false;
  }

  const pdf = artbook.pdf;
  const file = files.get('the-last-free-path-artbook.pdf');
  if (!isRecord(pdf) || !file) return false;
  return pdf.filename === file.filename
    && pdf.sha256 === file.sha256
    && pdf.tagged === true
    && typeof pdf.pageCount === 'number'
    && Number.isInteger(pdf.pageCount)
    && pdf.pageCount > 0;
}

export function validateCinematicReleaseManifest(
  value: unknown,
  expectation: CinematicReleaseManifestExpectation,
): boolean {
  if (
    !SHA256_PATTERN.test(expectation.actualManifestSha256)
    || !SHA256_PATTERN.test(expectation.expectedManifestSha256)
    || expectation.actualManifestSha256 !== expectation.expectedManifestSha256
    || !COMMIT_PATTERN.test(expectation.expectedSourceCommit)
    || !COMMIT_PATTERN.test(expectation.deployedSourceCommit)
    || expectation.expectedSourceCommit !== expectation.deployedSourceCommit
    || !isRecord(value)
  ) {
    return false;
  }

  const manifest = value;
  const author = manifest.author;
  if (
    manifest.bookId !== 'the-last-free-path'
    || manifest.editionId !== 'book-01-founding-cinematic'
    || manifest.title !== 'The Last Free Path'
    || manifest.series !== 'Chronicles of Arcanea'
    || manifest.draft !== false
    || manifest.sourceDirty !== false
    || manifest.sourceCommit !== expectation.expectedSourceCommit
    || manifest.chapterCount !== 32
    || !SHA256_PATTERN.test(typeof manifest.manuscriptSha256 === 'string' ? manifest.manuscriptSha256 : '')
    || !isNonEmptyText(author)
    || author === 'Byline pending approval'
    || !approvedCover(manifest.cover)
    || !Array.isArray(manifest.pending)
    || manifest.pending.length !== 0
  ) {
    return false;
  }

  const files = requiredFileRecords(manifest.files);
  if (!files || !approvedNovel(manifest, author)) return false;
  if (!approvedArtbook(manifest, author, expectation.expectedSourceCommit, files)) return false;

  const artbook = manifest.artbook as UnknownRecord;
  const novelCover = manifest.cover as UnknownRecord;
  const artbookCover = artbook.cover as UnknownRecord;
  return artbookCover.assetId === novelCover.assetId
    && artbookCover.sha256 === novelCover.sha256;
}

export function verifiedCinematicReleaseFiles(
  value: unknown,
  expectation: CinematicReleaseManifestExpectation,
): CinematicReleaseFiles | null {
  if (!validateCinematicReleaseManifest(value, expectation) || !isRecord(value)) return null;
  const files = requiredFileRecords(value.files);
  if (!files) return null;
  return Object.fromEntries([...files].map(([filename, file]) => [filename, {
    bytes: file.bytes as number,
    sha256: file.sha256 as string,
  }]));
}
