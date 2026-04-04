/**
 * World Analytics Tests
 *
 * Tests the client-side analytics tracking functions.
 * Run with: npx tsx apps/web/lib/worlds/__tests__/world-analytics.test.ts
 */

import { trackWorldView, trackWorldInteraction } from '../world-analytics';

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
// trackWorldView (server environment — no navigator)
// ---------------------------------------------------------------------------

describe('trackWorldView: no-op without navigator', () => {
  // In Node.js, navigator is undefined — should not throw
  let threw = false;
  try {
    trackWorldView('test-world-id');
  } catch {
    threw = true;
  }
  assert(!threw, 'does not throw when navigator is undefined');
});

// ---------------------------------------------------------------------------
// trackWorldInteraction (server environment — no navigator)
// ---------------------------------------------------------------------------

describe('trackWorldInteraction: no-op without navigator', () => {
  let threw = false;
  try {
    trackWorldInteraction('test-world-id', 'star');
  } catch {
    threw = true;
  }
  assert(!threw, 'star action does not throw');
});

describe('trackWorldInteraction: all action types', () => {
  const actions: Array<'star' | 'fork' | 'chat' | 'generate'> = ['star', 'fork', 'chat', 'generate'];
  let allOk = true;
  for (const action of actions) {
    try {
      trackWorldInteraction('test-world-id', action);
    } catch {
      allOk = false;
    }
  }
  assert(allOk, 'all action types execute without throwing');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
