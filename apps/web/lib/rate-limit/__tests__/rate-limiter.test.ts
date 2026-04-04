/**
 * Rate Limiter Tests
 *
 * Run with: npx tsx apps/web/lib/rate-limit/__tests__/rate-limiter.test.ts
 */

import { checkRateLimit, getClientIdentifier } from '../rate-limiter';

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

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ---------------------------------------------------------------------------
// checkRateLimit
// ---------------------------------------------------------------------------

describe('checkRateLimit: first request in window', () => {
  const result = checkRateLimit('test-first-req-' + Date.now(), {
    maxRequests: 5,
    windowMs: 60_000,
  });
  assert(result.allowed === true, 'first request is allowed');
  assert(result.remaining === 4, 'remaining is maxRequests - 1');
  assert(result.resetTime > Date.now(), 'resetTime is in the future');
});

describe('checkRateLimit: exhausting the limit', () => {
  const id = 'test-exhaust-' + Date.now();
  const config = { maxRequests: 3, windowMs: 60_000 };

  const r1 = checkRateLimit(id, config);
  assert(r1.allowed === true, 'request 1 allowed');
  assert(r1.remaining === 2, 'remaining is 2');

  const r2 = checkRateLimit(id, config);
  assert(r2.allowed === true, 'request 2 allowed');
  assert(r2.remaining === 1, 'remaining is 1');

  const r3 = checkRateLimit(id, config);
  assert(r3.allowed === true, 'request 3 allowed');
  assert(r3.remaining === 0, 'remaining is 0');

  const r4 = checkRateLimit(id, config);
  assert(r4.allowed === false, 'request 4 blocked (over limit)');
  assert(r4.remaining === 0, 'remaining stays 0 after block');
});

describe('checkRateLimit: different identifiers are independent', () => {
  const config = { maxRequests: 1, windowMs: 60_000 };
  const id1 = 'test-indep-a-' + Date.now();
  const id2 = 'test-indep-b-' + Date.now();

  checkRateLimit(id1, config);
  const r1 = checkRateLimit(id1, config);
  assert(r1.allowed === false, 'id1 is blocked after 1 request');

  const r2 = checkRateLimit(id2, config);
  assert(r2.allowed === true, 'id2 is still allowed (independent)');
});

describe('checkRateLimit: window expiry resets count', () => {
  const id = 'test-expiry-' + Date.now();
  // Use a 1ms window so it expires immediately
  const config = { maxRequests: 1, windowMs: 1 };

  checkRateLimit(id, config);
  // Wait tiny bit for window to expire
  const start = Date.now();
  while (Date.now() - start < 5) { /* busy-wait 5ms */ }

  const result = checkRateLimit(id, config);
  assert(result.allowed === true, 'allowed again after window expires');
  assert(result.remaining === 0, 'remaining resets correctly');
});

// ---------------------------------------------------------------------------
// getClientIdentifier
// ---------------------------------------------------------------------------

describe('getClientIdentifier: with userId', () => {
  const mockReq = {
    headers: { get: () => null },
  } as unknown as import('next/server').NextRequest;

  const id = getClientIdentifier(mockReq, 'user-123');
  assert(id === 'user:user-123', 'returns user: prefix with userId');
});

describe('getClientIdentifier: from x-forwarded-for', () => {
  const mockReq = {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8';
        return null;
      },
    },
  } as unknown as import('next/server').NextRequest;

  const id = getClientIdentifier(mockReq);
  assert(id === 'ip:1.2.3.4', 'takes first IP from x-forwarded-for');
});

describe('getClientIdentifier: from x-real-ip', () => {
  const mockReq = {
    headers: {
      get: (name: string) => {
        if (name === 'x-real-ip') return '9.8.7.6';
        return null;
      },
    },
  } as unknown as import('next/server').NextRequest;

  const id = getClientIdentifier(mockReq);
  assert(id === 'ip:9.8.7.6', 'uses x-real-ip when no x-forwarded-for');
});

describe('getClientIdentifier: fallback to unknown', () => {
  const mockReq = {
    headers: { get: () => null },
  } as unknown as import('next/server').NextRequest;

  const id = getClientIdentifier(mockReq);
  assert(id === 'ip:unknown', 'falls back to ip:unknown when no headers');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

// Exit explicitly — the rate-limiter module has a setInterval that keeps the process alive
process.exit(failed > 0 ? 1 : 0);
