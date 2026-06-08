/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Pages — unit tests for the pure helpers.
 *
 * Covers slug generation, source extraction, row→view/summary mapping, and the
 * graceful no-provider-key degradation path. No network or DB is touched: the
 * LLM-key tests clear the provider env vars so behaviour is deterministic.
 *
 * Run: npx tsx apps/web/lib/pages/__tests__/pages.test.ts
 */

import { strict as assert } from 'node:assert';
import { slugify, extractSources, hasPageModel, formatThreadToPage, isHttpUrl, type ThreadMessage } from '../format';
import { rowToView, rowToSummary, type PageRow } from '../types';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  try {
    const r = fn();
    if (r instanceof Promise) {
      // Caller awaits via the queue below.
      return r.then(
        () => {
          passed += 1;
          console.log(`PASS  ${name}`);
        },
        (error) => {
          failed += 1;
          console.error(`FAIL  ${name}`);
          console.error(error);
        },
      );
    }
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

function makeRow(overrides: Partial<PageRow> = {}): PageRow {
  return {
    id: 'id-1',
    slug: 'my-page-abc123',
    owner_id: 'owner-1',
    title: 'My Page',
    summary: 'A deck.',
    cover_image_url: null,
    sections: [{ id: 's1', heading: 'Intro', markdown: 'Hello', imageUrl: null }],
    sources: [{ title: 'Example', url: 'https://example.com', domain: 'example.com' }],
    source_session_id: 'sess-1',
    visibility: 'unlisted',
    view_count: 5,
    created_at: '2026-06-03T00:00:00.000Z',
    updated_at: '2026-06-03T01:00:00.000Z',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

test('slugify lowercases, hyphenates, and appends a suffix', () => {
  const slug = slugify('Hello, World! A Title');
  assert.match(slug, /^hello-world-a-title-[a-z0-9]{6}$/);
});

test('slugify output is URL-safe (only [a-z0-9-])', () => {
  const slug = slugify('Café — Über Naïve?? ##');
  assert.match(slug, /^[a-z0-9-]+$/, `slug not url-safe: ${slug}`);
  assert.equal(slug.includes('--'), false);
  assert.equal(slug.startsWith('-'), false);
  assert.equal(slug.endsWith('-'), false);
});

test('slugify falls back to "page" for empty/symbol-only titles', () => {
  assert.match(slugify(''), /^page-[a-z0-9]{6}$/);
  assert.match(slugify('!!!'), /^page-[a-z0-9]{6}$/);
});

test('slugify caps the base length (excludes the 6-char suffix + hyphen)', () => {
  const long = 'a'.repeat(200);
  const slug = slugify(long);
  const base = slug.slice(0, slug.lastIndexOf('-'));
  assert.equal(base.length <= 60, true, `base too long: ${base.length}`);
});

test('slugify produces a different suffix across calls', () => {
  assert.notEqual(slugify('Same Title'), slugify('Same Title'));
});

// ---------------------------------------------------------------------------
// extractSources
// ---------------------------------------------------------------------------

test('extractSources harvests URLs and derives www-stripped domains', () => {
  const msgs: ThreadMessage[] = [
    { role: 'assistant', content: 'See https://www.example.com/path and http://docs.foo.io/x.' },
  ];
  const sources = extractSources(msgs);
  assert.equal(sources.length, 2);
  assert.equal(sources[0].url, 'https://www.example.com/path');
  assert.equal(sources[0].domain, 'example.com');
  assert.equal(sources[1].domain, 'docs.foo.io');
});

test('extractSources strips trailing punctuation from URLs', () => {
  const sources = extractSources([{ role: 'user', content: 'Link: https://example.com/page.' }]);
  assert.equal(sources[0].url, 'https://example.com/page');
});

test('extractSources dedupes repeated URLs', () => {
  const sources = extractSources([
    { role: 'user', content: 'https://a.com https://a.com' },
    { role: 'assistant', content: 'again https://a.com' },
  ]);
  assert.equal(sources.length, 1);
});

test('extractSources returns [] when there are no URLs', () => {
  assert.deepEqual(extractSources([{ role: 'user', content: 'no links here' }]), []);
});

test('extractSources caps the result at 24', () => {
  const content = Array.from({ length: 40 }, (_, i) => `https://site${i}.com`).join(' ');
  assert.equal(extractSources([{ role: 'user', content }]).length, 24);
});

// ---------------------------------------------------------------------------
// isHttpUrl — the source/cover safety gate
// ---------------------------------------------------------------------------

test('isHttpUrl accepts http and https only', () => {
  assert.equal(isHttpUrl('https://example.com'), true);
  assert.equal(isHttpUrl('http://example.com/x'), true);
  assert.equal(isHttpUrl('HTTPS://EXAMPLE.COM'), true);
});

test('isHttpUrl rejects dangerous and non-web schemes', () => {
  assert.equal(isHttpUrl('javascript:alert(1)'), false);
  assert.equal(isHttpUrl('data:text/html,<script>'), false);
  assert.equal(isHttpUrl('ftp://example.com'), false);
  assert.equal(isHttpUrl('//evil.com'), false);
  assert.equal(isHttpUrl('  https://example.com'), false); // no leading-space bypass
  assert.equal(isHttpUrl(''), false);
  assert.equal(isHttpUrl(null), false); // non-string input guarded at runtime
});

// ---------------------------------------------------------------------------
// rowToView / rowToSummary
// ---------------------------------------------------------------------------

test('rowToView maps snake_case to camelCase and carries isOwner', () => {
  const view = rowToView(makeRow({ cover_image_url: 'https://img/x.png' }), true);
  assert.equal(view.slug, 'my-page-abc123');
  assert.equal(view.coverImageUrl, 'https://img/x.png');
  assert.equal(view.viewCount, 5);
  assert.equal(view.isOwner, true);
  assert.equal(view.sections.length, 1);
});

test('rowToView guards non-array sections/sources into []', () => {
  const view = rowToView(makeRow({ sections: undefined as any, sources: null as any }), false);
  assert.deepEqual(view.sections, []);
  assert.deepEqual(view.sources, []);
});

test('rowToView defaults a missing view_count to 0', () => {
  const view = rowToView(makeRow({ view_count: undefined as any }), false);
  assert.equal(view.viewCount, 0);
});

test('rowToSummary exposes only the compact listing fields', () => {
  const summary = rowToSummary(makeRow());
  assert.deepEqual(Object.keys(summary).sort(), [
    'coverImageUrl',
    'slug',
    'summary',
    'title',
    'updatedAt',
    'viewCount',
    'visibility',
  ]);
  assert.equal((summary as any).ownerId, undefined);
});

// ---------------------------------------------------------------------------
// Graceful no-key degradation (deterministic: clear provider env)
// ---------------------------------------------------------------------------

const PROVIDER_KEYS = [
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'GEMINI_API_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
];

async function withoutProviderKeys<T>(fn: () => Promise<T> | T): Promise<T> {
  const saved: Record<string, string | undefined> = {};
  for (const k of PROVIDER_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  try {
    return await fn();
  } finally {
    for (const k of PROVIDER_KEYS) {
      if (saved[k] !== undefined) process.env[k] = saved[k];
    }
  }
}

// ---------------------------------------------------------------------------
// Async queue
// ---------------------------------------------------------------------------

async function run() {
  await test('hasPageModel is false when no provider key is configured', async () => {
    await withoutProviderKeys(() => {
      assert.equal(hasPageModel(), false);
    });
  });

  await test('formatThreadToPage returns null with no provider key (graceful 503 path)', async () => {
    await withoutProviderKeys(async () => {
      const result = await formatThreadToPage([{ role: 'user', content: 'Summarise our chat.' }]);
      assert.equal(result, null);
    });
  });

  await test('formatThreadToPage returns null for an empty transcript', async () => {
    await withoutProviderKeys(async () => {
      const result = await formatThreadToPage([{ role: 'user', content: '   ' }]);
      assert.equal(result, null);
    });
  });

  if (failed > 0) {
    console.error(`\n${failed} pages test(s) failed`);
    process.exit(1);
  }
  console.log(`\n${passed} pages test(s) passed`);
}

run();
