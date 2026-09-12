import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { validateAuthBuildEnvironment } from '../check-auth-env.mjs';

const url = 'https://demo-ref.supabase.co';
const anon = `e30.${Buffer.from(JSON.stringify({ role: 'anon', ref: 'demo-ref' })).toString('base64url')}.signature`;
const configured = {
  VERCEL_ENV: 'production',
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
};

test('production refuses the missing public binding that disabled Google sign-in', () => {
  assert.deepEqual(validateAuthBuildEnvironment({ VERCEL_ENV: 'production' }).errors, [
    'NEXT_PUBLIC_SUPABASE_URL is required.',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY is required.',
  ]);
});
test('server-only credentials cannot substitute for browser configuration', () => {
  assert.equal(validateAuthBuildEnvironment({ VERCEL_ENV: 'production', SUPABASE_URL: url, SUPABASE_ANON_KEY: anon }).errors.length, 2);
});
test('offline and unconfigured preview builds remain available', () => {
  assert.equal(validateAuthBuildEnvironment({}).required, false);
  assert.equal(validateAuthBuildEnvironment({ VERCEL_ENV: 'preview' }).required, false);
  assert.equal(validateAuthBuildEnvironment({ VERCEL_ENV: 'preview', CHECK_AUTH_ENV: '1' }).errors.length, 2);
});
test('existing anon and modern publishable keys are accepted in the app binding', () => {
  assert.deepEqual(validateAuthBuildEnvironment(configured).errors, []);
  assert.deepEqual(validateAuthBuildEnvironment({ ...configured, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_examplevalidkey123456789' }).errors, []);
});
test('placeholder, malformed, and privileged keys never pass a public build gate', () => {
  const privileged = `e30.${Buffer.from(JSON.stringify({ role: 'service_role', ref: 'demo-ref' })).toString('base64url')}.signature`;
  for (const key of ['preview-build-placeholder', 'malformed', 'sb_secret_neverpublic', privileged, ` ${anon}`]) {
    const result = validateAuthBuildEnvironment({ ...configured, NEXT_PUBLIC_SUPABASE_ANON_KEY: key });
    assert.ok(result.errors.length > 0);
    assert.ok(!JSON.stringify(result).includes(key), 'diagnostics never contain credential values');
  }
});
test('example, insecure, credential-bearing, or non-origin URLs are rejected', () => {
  for (const value of ['https://example.supabase.co', 'http://demo-ref.supabase.co', 'https://user:pass@demo-ref.supabase.co', `${url}/auth`, `${url}?x=1`, `${url}#fragment`, 'broken']) {
    assert.ok(validateAuthBuildEnvironment({ ...configured, NEXT_PUBLIC_SUPABASE_URL: value }).errors.length > 0);
  }
});
test('legacy anon keys must belong to the configured Supabase project', () => {
  assert.ok(validateAuthBuildEnvironment({ ...configured, NEXT_PUBLIC_SUPABASE_URL: 'https://different-ref.supabase.co' }).errors.length > 0);
});
test('the command fails before a production build and never prints secrets', () => {
  const result = spawnSync(process.execPath, ['scripts/check-auth-env.mjs'], {
    cwd: new URL('../../', import.meta.url), encoding: 'utf8',
    env: { VERCEL_ENV: 'production', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_secret_donotprint' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes('sb_secret_donotprint'));
});
