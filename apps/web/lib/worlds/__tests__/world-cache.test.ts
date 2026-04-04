/**
 * World Cache Tests
 *
 * Tests TTL cache get/set/withCache behavior.
 * Run with: npx tsx apps/web/lib/worlds/__tests__/world-cache.test.ts
 */

import { getCached, setCached, withCache } from '../world-cache';

// ---------------------------------------------------------------------------
// Minimal test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

function describe(suite: string, fn: () => void | Promise<void>) {
  console.log(`\n${suite}`);
  const result = fn();
  if (result instanceof Promise) return result;
}

// ---------------------------------------------------------------------------
// getCached / setCached
// ---------------------------------------------------------------------------

describe('getCached: returns null for missing key', () => {
  const result = getCached('nonexistent-key-' + Date.now());
  assert(result === null, 'returns null');
});

describe('setCached + getCached: stores and retrieves', () => {
  const key = 'test-store-' + Date.now();
  setCached(key, { name: 'Test World' });
  const result = getCached<{ name: string }>(key);
  assert(result !== null, 'returns non-null');
  assert(result?.name === 'Test World', 'returns correct data');
});

describe('setCached: TTL expiry', () => {
  const key = 'test-ttl-' + Date.now();
  setCached(key, 'value', 1); // 1ms TTL
  // Busy-wait for expiry
  const start = Date.now();
  while (Date.now() - start < 5) { /* wait */ }
  const result = getCached(key);
  assert(result === null, 'returns null after TTL expires');
});

describe('setCached: overwrite existing key', () => {
  const key = 'test-overwrite-' + Date.now();
  setCached(key, 'first');
  setCached(key, 'second');
  const result = getCached<string>(key);
  assert(result === 'second', 'overwrites with new value');
});

describe('getCached: type safety with generics', () => {
  const key = 'test-typed-' + Date.now();
  setCached(key, [1, 2, 3]);
  const result = getCached<number[]>(key);
  assert(Array.isArray(result), 'returns array');
  assert(result?.length === 3, 'correct length');
  assert(result?.[0] === 1, 'correct first element');
});

// ---------------------------------------------------------------------------
// withCache
// ---------------------------------------------------------------------------

async function runAsyncTests() {
  await describe('withCache: calls fetcher on miss', async () => {
    let fetchCount = 0;
    const key = 'test-withcache-miss-' + Date.now();
    const result = await withCache(key, async () => {
      fetchCount++;
      return 'fresh-data';
    });
    assert(result === 'fresh-data', 'returns fetcher result');
    assert(fetchCount === 1, 'fetcher called once');
  });

  await describe('withCache: uses cache on hit', async () => {
    let fetchCount = 0;
    const key = 'test-withcache-hit-' + Date.now();
    setCached(key, 'cached-data', 60_000);

    const result = await withCache(key, async () => {
      fetchCount++;
      return 'fresh-data';
    });
    assert(result === 'cached-data', 'returns cached data');
    assert(fetchCount === 0, 'fetcher NOT called');
  });

  await describe('withCache: refetches after expiry', async () => {
    let fetchCount = 0;
    const key = 'test-withcache-expiry-' + Date.now();
    setCached(key, 'old-data', 1); // 1ms TTL
    const start = Date.now();
    while (Date.now() - start < 5) { /* wait */ }

    const result = await withCache(key, async () => {
      fetchCount++;
      return 'new-data';
    });
    assert(result === 'new-data', 'returns fresh data after expiry');
    assert(fetchCount === 1, 'fetcher called once');
  });

  await describe('withCache: caches the fetched result', async () => {
    let fetchCount = 0;
    const key = 'test-withcache-persist-' + Date.now();

    await withCache(key, async () => {
      fetchCount++;
      return 'fetched';
    });
    const cached = getCached<string>(key);
    assert(cached === 'fetched', 'fetched result is cached');

    await withCache(key, async () => {
      fetchCount++;
      return 'should-not-use';
    });
    assert(fetchCount === 1, 'fetcher not called second time');
  });

  // Print summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('='.repeat(50));
  if (failed > 0) process.exit(1);
}

runAsyncTests();
