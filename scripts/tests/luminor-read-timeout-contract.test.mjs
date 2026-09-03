import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const service = readFileSync(
  'apps/web/lib/luminors/luminor-service.ts',
  'utf8',
);
const route = readFileSync(
  'apps/web/app/api/luminors/route.ts',
  'utf8',
);
const publicClient = readFileSync(
  'apps/web/lib/supabase/public.ts',
  'utf8',
);
const supabaseEnv = readFileSync(
  'apps/web/lib/supabase/env.ts',
  'utf8',
);

test('published Luminor reads carry abort and application deadlines below five seconds', () => {
  const timeoutMatch = service.match(
    /export const LUMINOR_READ_TIMEOUT_MS\s*=\s*([\d_]+);/,
  );

  assert.ok(timeoutMatch, 'missing the public-read timeout constant');
  const timeoutMs = Number(timeoutMatch[1].replaceAll('_', ''));
  assert.ok(timeoutMs > 0 && timeoutMs <= 5_000);
  assert.match(
    service,
    /AbortSignal\.timeout\(LUMINOR_READ_TIMEOUT_MS\)/,
  );
  assert.match(service, /query\.abortSignal\(signal\)/);
  assert.match(service, /Promise\.race\(\[/);
  assert.match(
    service,
    /setTimeout\([\s\S]*LUMINOR_READ_TIMEOUT_MS/,
  );
  assert.match(service, /clearTimeout\(timeoutId\)/);
});

test('the public route exposes a retryable failure instead of a function timeout', () => {
  assert.match(route, /async function withPublicReadDeadline/);
  assert.match(
    route,
    /Promise\.race\(\[operation\(\), deadline\]\)/,
  );
  assert.match(
    route,
    /withPublicReadDeadline\(\(\) =>\s*getPublishedLuminors/,
  );
  assert.match(route, /status:\s*503/);
  assert.match(route, /'Retry-After':\s*'30'/);
  assert.match(route, /'Cache-Control':\s*'no-store'/);
  assert.match(
    route,
    /Published Luminors are temporarily unavailable\. Please retry\./,
  );
});

test('public discovery is stateless, RLS-bound, and never uses service role', () => {
  const publicRead = service.slice(
    service.indexOf('export async function getPublishedLuminors'),
    service.indexOf('export async function incrementUsage'),
  );

  assert.match(publicRead, /createPublicClient\(\)/);
  assert.doesNotMatch(publicRead, /await createClient\(\)/);
  assert.match(publicClient, /getPublicSupabaseBinding\(\)/);
  assert.match(publicClient, /persistSession:\s*false/);
  assert.match(publicClient, /autoRefreshToken:\s*false/);
  assert.doesNotMatch(publicClient, /SERVICE_ROLE/);
});

test('deployed public reads reject incomplete and placeholder bindings', () => {
  assert.match(
    supabaseEnv,
    /SUPABASE_PUBLIC_BINDING_MISSING/,
  );
  assert.match(
    supabaseEnv,
    /SUPABASE_PUBLIC_BINDING_INVALID/,
  );
  assert.match(supabaseEnv, /containsPlaceholder/);
  assert.match(supabaseEnv, /parsedUrl\.protocol !== 'https:'/);
});

test('public route emits bounded operational receipts and caches only success', () => {
  assert.match(route, /crypto\.randomUUID\(\)/);
  assert.match(route, /getPublishedLuminorErrorCode\(error\)/);
  assert.match(route, /\[api\/luminors\] public_read/);
  assert.match(route, /'Server-Timing'/);
  assert.match(route, /'X-Request-Id'/);
  assert.match(
    route,
    /public, s-maxage=60, stale-while-revalidate=300/,
  );
  assert.match(route, /Number\.isFinite\(parsed\)/);
});
