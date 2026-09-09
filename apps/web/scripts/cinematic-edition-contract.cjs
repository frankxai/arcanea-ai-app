'use strict';

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { lstat, mkdir, readFile, realpath } = require('node:fs/promises');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const BOOK_DIR = path.join(
  REPO_ROOT,
  'book',
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
);
const SPEC_PATH = path.join(BOOK_DIR, 'edition-spec.json');
const SPEC_REPO_PATH = 'book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/edition-spec.json';
const EXPECTED_BOOK_ID = 'the-last-free-path';
const EXPECTED_EDITION_ID = 'book-01-founding-cinematic';
const EXPECTED_TITLE = 'The Last Free Path';
const EXPECTED_SERIES = 'Chronicles of Arcanea';
const APPROVAL_KEYS = ['canon', 'editorial', 'legal', 'rights', 'title'];
const COVER_APPROVAL_KEYS = ['casting', 'rights', 'title'];
const PUBLICATION_KEYS = ['byline', 'bylineApprovalReceipt', 'bylineStatus'];
const SPEC_KEYS = [
  'approvalReceipts',
  'approvedManuscriptSha256',
  'bookId',
  'cover',
  'editionId',
  'expectedChapterCount',
  'humanApprovals',
  'manuscriptStatus',
  'publication',
  'rightsStatus',
  'schemaVersion',
  'series',
  'status',
  'title',
  'titleStatus',
];
const COVER_KEYS = ['approvalReceipts', 'assetId', 'height', 'path', 'sha256', 'status', 'width'];

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
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

function validateReleaseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) fail('--release-date must be YYYY-MM-DD.');
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    fail('--release-date must be a real calendar date.');
  }
  return value;
}

function validateSpec(spec) {
  assertExactKeys(spec, SPEC_KEYS, 'edition specification');
  if (spec.schemaVersion !== 1) fail(`Unsupported edition schema: ${spec.schemaVersion}.`);
  if (spec.bookId !== EXPECTED_BOOK_ID || spec.editionId !== EXPECTED_EDITION_ID) {
    fail('Edition specification identity is not canonical.');
  }
  if (spec.title !== EXPECTED_TITLE || spec.series !== EXPECTED_SERIES) {
    fail('Edition specification title or series is not canonical.');
  }
  for (const field of ['status', 'manuscriptStatus', 'titleStatus', 'rightsStatus']) assertText(spec[field], field);
  if (spec.expectedChapterCount !== 32) fail('Edition specification must require exactly 32 chapters.');
  if (spec.approvedManuscriptSha256 !== null && !/^[a-f0-9]{64}$/.test(spec.approvedManuscriptSha256)) {
    fail('approvedManuscriptSha256 must be a lowercase SHA-256 hash or null.');
  }

  assertExactKeys(spec.humanApprovals, APPROVAL_KEYS, 'human approvals');
  assertExactKeys(spec.approvalReceipts, APPROVAL_KEYS, 'approval receipts');
  for (const key of APPROVAL_KEYS) {
    if (typeof spec.humanApprovals[key] !== 'boolean') fail(`humanApprovals.${key} must be a boolean.`);
    if (spec.approvalReceipts[key] !== null && typeof spec.approvalReceipts[key] !== 'string') {
      fail(`approvalReceipts.${key} must be text or null.`);
    }
  }

  assertExactKeys(spec.publication, PUBLICATION_KEYS, 'publication approval');
  if (spec.publication.byline !== null && typeof spec.publication.byline !== 'string') {
    fail('publication.byline must be text or null.');
  }
  if (spec.publication.bylineApprovalReceipt !== null && typeof spec.publication.bylineApprovalReceipt !== 'string') {
    fail('publication.bylineApprovalReceipt must be text or null.');
  }
  assertText(spec.publication.bylineStatus, 'publication.bylineStatus');

  assertExactKeys(spec.cover, COVER_KEYS, 'cover specification');
  assertExactKeys(spec.cover.approvalReceipts, COVER_APPROVAL_KEYS, 'cover approval receipts');
  for (const field of ['assetId', 'path', 'sha256', 'status']) assertText(spec.cover[field], `cover.${field}`);
  if (!/^[a-f0-9]{64}$/.test(spec.cover.sha256)) fail('cover.sha256 must be a lowercase SHA-256 hash.');
  if (path.isAbsolute(spec.cover.path) || spec.cover.path.includes('\\')) {
    fail('cover.path must be a normalized repository-relative path.');
  }
  const coverAbsolute = path.resolve(REPO_ROOT, spec.cover.path);
  const approvedCoverRoot = path.join(REPO_ROOT, 'apps', 'web', 'public', 'images', 'books', EXPECTED_BOOK_ID);
  if (!isContained(approvedCoverRoot, coverAbsolute)) {
    fail('cover.path must remain inside the cinematic book asset directory.');
  }
  if (!/\.(?:png|jpe?g)$/i.test(spec.cover.path)) fail('cover.path must name a PNG or JPEG asset.');
  if (!Number.isInteger(spec.cover.width) || spec.cover.width <= 0 || !Number.isInteger(spec.cover.height) || spec.cover.height <= 0) {
    fail('cover dimensions must be positive integers.');
  }
  for (const key of COVER_APPROVAL_KEYS) {
    const receipt = spec.cover.approvalReceipts[key];
    if (receipt !== null && typeof receipt !== 'string') fail(`cover.approvalReceipts.${key} must be text or null.`);
  }
}

function assertReleaseApproval(spec, draft, requestedAuthor, manuscriptSha256 = null) {
  validateSpec(spec);
  if (draft) return;
  if (spec.status !== 'approved') fail(`Edition release status is ${spec.status}, not approved.`);
  if (spec.manuscriptStatus !== 'approved') fail('Edition release requires an approved manuscript.');
  if (spec.titleStatus !== 'approved') fail('Edition release requires an approved title.');
  if (spec.rightsStatus !== 'approved') fail('Edition release requires approved commercial-use rights.');
  if (!/^[a-f0-9]{64}$/.test(spec.approvedManuscriptSha256 || '')) {
    fail('Edition release requires an approved manuscript SHA-256.');
  }
  if (spec.approvedManuscriptSha256 !== manuscriptSha256) {
    fail('Current manuscript does not match the approved manuscript SHA-256.');
  }
  const missing = APPROVAL_KEYS.filter((key) => spec.humanApprovals[key] !== true);
  if (missing.length) fail(`Edition release approvals remain open: ${missing.join(', ')}.`);
  const missingReceipts = APPROVAL_KEYS.filter(
    (key) => typeof spec.approvalReceipts[key] !== 'string' || !spec.approvalReceipts[key].trim(),
  );
  if (missingReceipts.length) fail(`Edition release receipts remain open: ${missingReceipts.join(', ')}.`);
  if (
    typeof spec.publication.byline !== 'string'
    || !spec.publication.byline
    || spec.publication.byline !== spec.publication.byline.trim()
    || spec.publication.bylineStatus !== 'approved'
    || typeof spec.publication.bylineApprovalReceipt !== 'string'
    || !spec.publication.bylineApprovalReceipt.trim()
  ) {
    fail('Edition release requires a complete approved publication byline.');
  }
  if (requestedAuthor !== spec.publication.byline) fail('Requested publication name does not match the approved edition byline.');
  if (spec.cover.status !== 'approved') fail('Edition release requires an approved cover.');
  const missingCover = COVER_APPROVAL_KEYS.filter(
    (key) => typeof spec.cover.approvalReceipts[key] !== 'string' || !spec.cover.approvalReceipts[key].trim(),
  );
  if (missingCover.length) fail(`Edition cover receipts remain open: ${missingCover.join(', ')}.`);
}

function normalizedPath(value) {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function lstatIfExists(filename) {
  try {
    return await lstat(filename);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

async function ensureOutputDirectory(outputDirectory) {
  const resolvedOutput = path.resolve(outputDirectory);
  if (isContained(REPO_ROOT, resolvedOutput)) {
    fail('Edition output must remain outside the source repository.');
  }
  let existingAncestor = resolvedOutput;
  while (!(await lstatIfExists(existingAncestor))) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) fail('Edition output directory has no readable existing ancestor.');
    existingAncestor = parent;
  }
  const ancestorEvidence = await lstat(existingAncestor);
  if (!ancestorEvidence.isDirectory() || ancestorEvidence.isSymbolicLink()) {
    fail('Edition output parent must be a regular directory, not a link.');
  }
  const realAncestor = await realpath(existingAncestor);
  if (normalizedPath(realAncestor) !== normalizedPath(existingAncestor)) {
    fail('Edition output parent resolves through an alias or linked parent.');
  }
  await mkdir(resolvedOutput, { recursive: true });
  const evidence = await lstat(resolvedOutput);
  if (!evidence.isDirectory() || evidence.isSymbolicLink()) {
    fail('Edition output directory must be a regular directory, not a link.');
  }
  const resolvedReal = await realpath(resolvedOutput);
  if (normalizedPath(resolvedReal) !== normalizedPath(resolvedOutput)) {
    fail('Edition output directory resolves through an alias or linked parent.');
  }
  return resolvedReal;
}

async function assertOutputFile(filename, label, required = false) {
  const evidence = await lstatIfExists(filename);
  if (!evidence) {
    if (required) fail(`${label} not found: ${filename}`);
    return;
  }
  if (!evidence.isFile() || evidence.isSymbolicLink()) fail(`${label} must be a regular file, not a link.`);
}

function repoRelative(absolute) {
  return path.relative(REPO_ROOT, absolute).split(path.sep).join('/');
}

async function trackedHeadRecord(absolute, label) {
  const working = await workingTreeRecord(absolute, label);
  const { relative } = working;
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
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    fail(`${label} cannot be read from HEAD: ${relative}.`);
  }
  if (!working.bytes.equals(committed)) fail(`${label} differs from the committed HEAD blob: ${relative}.`);
  return working;
}

async function workingTreeRecord(absolute, label) {
  const resolved = path.resolve(absolute);
  if (!isContained(REPO_ROOT, resolved)) fail(`${label} escapes the source repository.`);
  const evidence = await lstatIfExists(resolved);
  if (!evidence?.isFile() || evidence.isSymbolicLink()) fail(`${label} must be a regular file, not a link.`);
  const real = await realpath(resolved);
  if (!isContained(REPO_ROOT, real)) fail(`${label} resolves outside the source repository.`);
  if (normalizedPath(real) !== normalizedPath(resolved)) fail(`${label} resolves through an alias or linked parent.`);
  const bytes = await readFile(real);
  return { absolute: real, relative: repoRelative(real), bytes, sha256: sha256(bytes) };
}

function repositoryState(draft) {
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    const changes = execFileSync(
      'git',
      ['status', '--porcelain', '--untracked-files=normal'],
      { cwd: REPO_ROOT, encoding: 'utf8' },
    ).trim();
    if (changes && !draft) fail('Release builds require a clean git worktree.');
    return { commit, dirty: Boolean(changes) };
  } catch (error) {
    if (error instanceof Error && /clean git worktree/.test(error.message)) throw error;
    if (!draft) fail('Release builds require readable git provenance.');
    return { commit: null, dirty: true };
  }
}

async function loadSpecification(draft) {
  const record = draft
    ? await workingTreeRecord(SPEC_PATH, 'Edition specification')
    : await trackedHeadRecord(SPEC_PATH, 'Edition specification');
  const spec = JSON.parse(record.bytes.toString('utf8'));
  validateSpec(spec);
  return { spec, receipt: { path: record.relative, sha256: record.sha256 } };
}

module.exports = {
  APPROVAL_KEYS,
  BOOK_DIR,
  COVER_APPROVAL_KEYS,
  EXPECTED_BOOK_ID,
  EXPECTED_EDITION_ID,
  EXPECTED_SERIES,
  EXPECTED_TITLE,
  PUBLICATION_KEYS,
  REPO_ROOT,
  SPEC_PATH,
  SPEC_REPO_PATH,
  assertExactKeys,
  assertOutputFile,
  assertReleaseApproval,
  ensureOutputDirectory,
  fail,
  isContained,
  loadSpecification,
  normalizedPath,
  repositoryState,
  sha256,
  trackedHeadRecord,
  validateReleaseDate,
  validateSpec,
  workingTreeRecord,
};
