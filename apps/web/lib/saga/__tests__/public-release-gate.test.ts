/**
 * Fail-closed proof for the public saga release boundary.
 *
 * These tests exist because `/api/saga/[bookId]/[chapterSlug]` previously
 * returned full chapter markdown to any unauthenticated caller. They assert the
 * gate denies by default rather than asserting a hardcoded 404, so they keep
 * their meaning after a book is legitimately allowlisted.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  PUBLIC_RELEASE_REGISTRY,
  isAllowlisted,
  isPublicBook,
  isPublicDocument,
  notPublicPayload,
} from '../public-release-registry';
import { getBookRoot } from '@/lib/content/book-path';
import { GET as getSagaIndex } from '@/app/api/saga/route';
import { GET as getSagaBookRoute } from '@/app/api/saga/[bookId]/route';
import { GET as getSagaChapterRoute } from '@/app/api/saga/[bookId]/[chapterSlug]/route';
import { GET as getSagaDocsRoute } from '@/app/api/saga/docs/[category]/route';

type RouteRequest = Parameters<typeof getSagaDocsRoute>[0];

function req(url: string): RouteRequest {
  return new Request(url) as unknown as RouteRequest;
}

const NON_STRING_IDS: unknown[] = [
  undefined,
  null,
  0,
  1,
  true,
  false,
  {},
  [],
  ['book1'],
  Symbol('book1'),
  () => 'book1',
];

const HOSTILE_IDS = [
  '',
  ' ',
  '../../etc/passwd',
  '../book1',
  'book1/../book2',
  '..%2f..%2fbook1',
  '/book1',
  'book1/',
  'BOOK1',
  'Book1',
  'book',
  'book10',
  ' book1',
  'book1 ',
  '__proto__',
  'constructor',
  'prototype',
  'toString',
  'hasOwnProperty',
];

// ── Registry invariants ──────────────────────────────────────────────

test('registry policy is default-deny', () => {
  assert.equal(PUBLIC_RELEASE_REGISTRY.policy, 'default-deny');
});

test('allowlists contain only non-empty strings', () => {
  for (const list of [
    PUBLIC_RELEASE_REGISTRY.publicBookIds,
    PUBLIC_RELEASE_REGISTRY.publicDocumentSlugs,
  ]) {
    assert.ok(Array.isArray(list), 'allowlist must be an array, not an object map');
    for (const id of list) {
      assert.equal(typeof id, 'string');
      assert.ok(id.length > 0);
    }
  }
});

test('no release in the registry claims a public manuscript while story lock is pending', () => {
  for (const release of PUBLIC_RELEASE_REGISTRY.releases) {
    const storyLock: string = release.storyLock;
    const publicManuscript: boolean = release.publicManuscript;

    if (storyLock !== 'approved') {
      assert.equal(
        publicManuscript,
        false,
        `${release.id} exposes a manuscript without an approved story lock`,
      );
    }
  }
});

// ── isAllowlisted: the primitive every route depends on ──────────────

test('an empty allowlist denies every identifier', () => {
  for (const id of ['book1', 'book2', 'anything', ...HOSTILE_IDS]) {
    assert.equal(isAllowlisted([], id), false, `empty allowlist admitted "${String(id)}"`);
  }
  for (const id of NON_STRING_IDS) {
    assert.equal(isAllowlisted([], id), false);
  }
});

test('a non-empty allowlist admits only exact string matches', () => {
  const list = ['book1'];
  assert.equal(isAllowlisted(list, 'book1'), true);
  for (const id of HOSTILE_IDS) {
    assert.equal(isAllowlisted(list, id), false, `allowlist admitted "${id}" via non-exact match`);
  }
  for (const id of NON_STRING_IDS) {
    assert.equal(isAllowlisted(list, id), false);
  }
});

test('non-string identifiers are denied and never coerced', () => {
  for (const id of NON_STRING_IDS) {
    assert.equal(isPublicBook(id), false);
    assert.equal(isPublicDocument(id), false);
  }
});

test('identifiers absent from the live allowlist are denied', () => {
  for (const id of HOSTILE_IDS) {
    if ((PUBLIC_RELEASE_REGISTRY.publicBookIds as string[]).includes(id)) continue;
    assert.equal(isPublicBook(id), false, `live registry admitted "${id}"`);
  }
});

// ── No environment variable can open the gate ────────────────────────

test('environment variables cannot open the gate', () => {
  const before = isPublicBook('book1');
  const injected = {
    PUBLIC_BOOK_IDS: 'book1,book2',
    SAGA_PUBLIC_BOOK_IDS: 'book1',
    ARCANEA_PUBLIC_BOOKS: '*',
    PUBLIC_RELEASE_POLICY: 'allow',
    NEXT_PUBLIC_SAGA_PUBLIC: 'true',
    NODE_ENV: 'development',
  };
  const saved: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(injected)) {
    saved[key] = process.env[key];
    process.env[key] = value;
  }

  try {
    assert.equal(
      isPublicBook('book1'),
      before,
      'an environment variable changed the publication decision',
    );
    assert.equal(PUBLIC_RELEASE_REGISTRY.policy, 'default-deny');
  } finally {
    for (const key of Object.keys(injected)) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

// ── Denial payload carries no content ────────────────────────────────

test('the denial payload exposes no manuscript fields', () => {
  for (const resource of ['book', 'chapter', 'document'] as const) {
    const payload = notPublicPayload(resource);
    assert.equal(payload.success, false);
    assert.equal(payload.error.code, 'NOT_PUBLIC');
    assert.ok(!('data' in payload), 'denial payload must not carry a data field');
    assert.ok(!JSON.stringify(payload).includes('content'));
  }
});

// ── Route contracts ──────────────────────────────────────────────────

test('GET /api/saga lists only allowlisted books', async () => {
  const res = await getSagaIndex();
  assert.equal(res.status, 200);

  const body = await res.json();
  const ids: string[] = body.data.books.map((b: { id: string }) => b.id);
  const allowed = PUBLIC_RELEASE_REGISTRY.publicBookIds as string[];

  for (const id of ids) {
    assert.ok(allowed.includes(id), `/api/saga enumerated non-allowlisted book "${id}"`);
  }
  assert.equal(body.meta.policy, 'default-deny');
});

test('GET /api/saga/[bookId] denies books that are not allowlisted', async () => {
  for (const bookId of ['book1', 'book2', 'dragonborne', '../../etc/passwd']) {
    if ((PUBLIC_RELEASE_REGISTRY.publicBookIds as string[]).includes(bookId)) continue;

    const res = await getSagaBookRoute(req(`http://t/api/saga/${bookId}`), {
      params: Promise.resolve({ bookId }),
    });

    assert.equal(res.status, 404, `book "${bookId}" was not denied`);
    const body = await res.json();
    assert.equal(body.error.code, 'NOT_PUBLIC');
    assert.ok(!('data' in body));
  }
});

test('GET /api/saga/[bookId]/[chapterSlug] denies chapters of non-allowlisted books', async () => {
  for (const bookId of ['book1', 'book2', '../../etc/passwd']) {
    if ((PUBLIC_RELEASE_REGISTRY.publicBookIds as string[]).includes(bookId)) continue;

    const res = await getSagaChapterRoute(req(`http://t/api/saga/${bookId}/x`), {
      params: Promise.resolve({ bookId, chapterSlug: '01-the-storm-that-remembered' }),
    });

    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.error.code, 'NOT_PUBLIC');
    assert.ok(!('data' in body));
  }
});

test('GET /api/saga/docs/[category] denies unreleased documents in both modes', async () => {
  for (const category of ['worldbuilding', 'characters', 'legends', 'reference']) {
    const listRes = await getSagaDocsRoute(req(`http://t/api/saga/docs/${category}`), {
      params: Promise.resolve({ category }),
    });
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    const allowed = PUBLIC_RELEASE_REGISTRY.publicDocumentSlugs as string[];
    for (const doc of listBody.data.documents as { slug: string }[]) {
      assert.ok(allowed.includes(doc.slug), `listed non-allowlisted document "${doc.slug}"`);
    }

    const singleRes = await getSagaDocsRoute(
      req(`http://t/api/saga/docs/${category}?slug=series-bible`),
      { params: Promise.resolve({ category }) },
    );
    if (!allowed.includes('series-bible')) {
      assert.equal(singleRes.status, 404);
      assert.equal((await singleRes.json()).error.code, 'NOT_PUBLIC');
    }
  }
});

// ── End-to-end: real manuscript text must not appear in a response ───

test('no unreleased chapter text is returned by the public chapter route', async () => {
  const chaptersRoot = join(getBookRoot(), 'chapters');

  let bookDirs: string[];
  try {
    const entries = await readdir(chaptersRoot, { withFileTypes: true });
    bookDirs = entries.filter((e) => e.isDirectory() && e.name.startsWith('book')).map((e) => e.name);
  } catch {
    assert.fail(
      `book content root not found at ${chaptersRoot}; this test must run with real content present`,
    );
  }

  assert.ok(bookDirs.length > 0, 'expected at least one book directory to test against');

  let checked = 0;

  for (const bookId of bookDirs) {
    if ((PUBLIC_RELEASE_REGISTRY.publicBookIds as string[]).includes(bookId)) continue;

    const files = (await readdir(join(chaptersRoot, bookId))).filter((f) => f.endsWith('.md'));

    for (const filename of files) {
      const raw = await readFile(join(chaptersRoot, bookId, filename), 'utf-8');
      const slug = filename.replace(/\.md$/, '').toLowerCase();

      const res = await getSagaChapterRoute(req(`http://t/api/saga/${bookId}/${slug}`), {
        params: Promise.resolve({ bookId, chapterSlug: slug }),
      });
      const text = await res.text();

      assert.equal(res.status, 404, `${bookId}/${slug} was served instead of denied`);

      const longestLine = raw
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 40 && !l.startsWith('#'))
        .sort((a, b) => b.length - a.length)[0];

      if (longestLine) {
        assert.ok(
          !text.includes(longestLine.slice(0, 60)),
          `manuscript text from ${bookId}/${filename} leaked into the response`,
        );
      }
      checked += 1;
    }
  }

  assert.ok(checked > 0, 'expected to check at least one unreleased chapter');
});
