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

test('published Luminor reads carry an abort signal below five seconds', () => {
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
});

test('the public route exposes a retryable failure instead of a function timeout', () => {
  assert.match(route, /status:\s*503/);
  assert.match(route, /'Retry-After':\s*'30'/);
  assert.match(route, /'Cache-Control':\s*'no-store'/);
  assert.match(
    route,
    /Published Luminors are temporarily unavailable\. Please retry\./,
  );
});
