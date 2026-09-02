import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scripts = [
  'scripts/nft-v5-sacred-gear.js',
  'scripts/nft-scale-test.js',
];
const googleKeyLiteralPattern = /\x41\x49\x7a\x61[0-9A-Za-z_-]{20,}/;

for (const relativePath of scripts) {
  test(`${relativePath} uses an environment-only Gemini credential`, () => {
    const source = readFileSync(path.join(repoRoot, relativePath), 'utf8');
    const keyGuard = source.indexOf('if (!API_KEY)');
    const filesystemWrite = source.indexOf('fs.mkdirSync');
    const networkRequest = source.indexOf('fetch(');

    assert.doesNotMatch(source, googleKeyLiteralPattern);
    assert.match(source, /process\.env\.GEMINI_API_KEY\?\.trim\(\)/);
    assert.doesNotMatch(source, /\?key=\$\{API_KEY\}/);
    assert.match(source, /['"]x-goog-api-key['"]\s*:\s*API_KEY/);
    assert.ok(keyGuard >= 0);
    assert.ok(keyGuard < filesystemWrite);
    assert.ok(keyGuard < networkRequest);
  });

  test(`${relativePath} fails closed before work when the key is absent`, () => {
    const env = { ...process.env };
    delete env.GEMINI_API_KEY;

    const result = spawnSync(process.execPath, [path.join(repoRoot, relativePath)], {
      cwd: repoRoot,
      encoding: 'utf8',
      env,
      timeout: 3_000,
    });

    assert.equal(result.signal, null);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr.trim(), 'GEMINI_API_KEY is required');
  });
}
