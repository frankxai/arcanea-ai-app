/**
 * Supabase Middleware Tests — matchesPrefix utility
 *
 * The full updateSession requires Supabase SSR which can't be unit-tested
 * without mocking the entire Next.js request pipeline.
 * We test the pure routing logic via the matchesPrefix helper.
 * Run with: npx tsx apps/web/lib/supabase/__tests__/middleware.test.ts
 */

// ---------------------------------------------------------------------------
// Inline the pure function (not exported from middleware.ts)
// ---------------------------------------------------------------------------

function matchesPrefix(pathname: string, prefixes: string[] = []) {
  return prefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

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
// matchesPrefix
// ---------------------------------------------------------------------------

describe('matchesPrefix: exact match', () => {
  assert(
    matchesPrefix('/dashboard', ['/dashboard']),
    'exact match returns true'
  );
});

describe('matchesPrefix: prefix with subpath', () => {
  assert(
    matchesPrefix('/dashboard/settings', ['/dashboard']),
    'subpath matches prefix'
  );
});

describe('matchesPrefix: no match', () => {
  assert(
    !matchesPrefix('/login', ['/dashboard', '/settings']),
    'returns false for non-matching path'
  );
});

describe('matchesPrefix: empty prefixes', () => {
  assert(
    !matchesPrefix('/anything', []),
    'empty prefixes array always returns false'
  );
});

describe('matchesPrefix: undefined prefixes', () => {
  assert(
    !matchesPrefix('/anything'),
    'undefined prefixes returns false'
  );
});

describe('matchesPrefix: partial string match should NOT match', () => {
  // /dashboardX should not match /dashboard
  assert(
    !matchesPrefix('/dashboardX', ['/dashboard']),
    '/dashboardX does not match /dashboard (no slash boundary)'
  );
});

describe('matchesPrefix: multiple prefixes', () => {
  assert(
    matchesPrefix('/settings/profile', ['/dashboard', '/settings']),
    'matches second prefix in list'
  );
});

describe('matchesPrefix: root path', () => {
  assert(
    matchesPrefix('/', ['/']),
    'root path matches root prefix'
  );
  // /anything does NOT match ['/'] because '/' is exact or '//' prefix
  // matchesPrefix checks pathname === prefix || pathname.startsWith(prefix + '/')
  // '/anything'.startsWith('//') is false, but '/anything' !== '/'
  // Actually '/'.concat('/') = '//' — so /anything does NOT match
  assert(
    !matchesPrefix('/anything', ['/']),
    '/anything does not match ["/"] (no slash boundary after /)'
  );
});

// ---------------------------------------------------------------------------
// Routing logic tests (simulated)
// ---------------------------------------------------------------------------

describe('routing: protected page routes', () => {
  const protectedPrefixes = ['/dashboard', '/worlds/create', '/profile'];
  const authPrefixes = ['/auth/login', '/auth/signup'];

  // Unauthenticated user on protected route
  assert(
    matchesPrefix('/dashboard', protectedPrefixes),
    '/dashboard is protected'
  );
  assert(
    matchesPrefix('/worlds/create', protectedPrefixes),
    '/worlds/create is protected'
  );
  assert(
    matchesPrefix('/profile/settings', protectedPrefixes),
    '/profile/settings is protected'
  );

  // Public routes
  assert(
    !matchesPrefix('/chat', protectedPrefixes),
    '/chat is not protected'
  );
  assert(
    !matchesPrefix('/', protectedPrefixes),
    '/ is not protected'
  );

  // Auth routes (for redirect-if-already-authenticated)
  assert(
    matchesPrefix('/auth/login', authPrefixes),
    '/auth/login is an auth route'
  );
  assert(
    !matchesPrefix('/auth-something', authPrefixes),
    '/auth-something does not match auth prefixes'
  );
});

describe('routing: API route protection', () => {
  const protectedApiPrefixes = ['/api/projects', '/api/bonds'];
  const publicApiPrefixes = ['/api/ai/chat', '/api/worlds'];

  // Protected API
  assert(
    matchesPrefix('/api/projects/123', protectedApiPrefixes),
    '/api/projects/123 is protected API'
  );
  assert(
    matchesPrefix('/api/bonds', protectedApiPrefixes),
    '/api/bonds is protected API'
  );

  // Public API
  assert(
    matchesPrefix('/api/ai/chat', publicApiPrefixes),
    '/api/ai/chat is public API'
  );
  assert(
    matchesPrefix('/api/worlds/search', publicApiPrefixes),
    '/api/worlds/search is public API'
  );

  // API route not in either list
  assert(
    !matchesPrefix('/api/random', protectedApiPrefixes),
    '/api/random is not in protected list'
  );
  assert(
    !matchesPrefix('/api/random', publicApiPrefixes),
    '/api/random is not in public list'
  );
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
