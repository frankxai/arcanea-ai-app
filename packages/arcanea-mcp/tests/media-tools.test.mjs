import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { handleMediaTool } from '../dist/tools/media-tools.js';

test('media_scan input validation rejects non-absolute paths and NUL bytes', async () => {
  const result1 = await handleMediaTool('media_scan', { root_path: 'relative/path' });
  assert.match(result1, /ERROR: Invalid root_path/);

  const result2 = await handleMediaTool('media_scan', { root_path: '/abs/path\0with-nul' });
  assert.match(result2, /ERROR: Invalid root_path/);

  const result3 = await handleMediaTool('media_scan', {
    root_path: '/valid/abs/path',
    manifest_path: 'relative/manifest.json',
  });
  assert.match(result3, /ERROR: Invalid manifest_path/);

  const result4 = await handleMediaTool('media_scan', {
    root_path: '/valid/abs/path',
    manifest_path: '/abs/manifest\0.json',
  });
  assert.match(result4, /ERROR: Invalid manifest_path/);
});

test('media_scan safely passes root_path containing "; rm -rf /" as a single argv entry without shell execution', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'media-test-'));
  const injectionPath = resolve(tempDir, 'dir; rm -rf /');

  try {
    // Non-existent path check
    const nonExistentResult = await handleMediaTool('media_scan', {
      root_path: injectionPath,
      manifest_path: resolve(tempDir, 'manifest.json'),
    });
    assert.equal(nonExistentResult, `ERROR: Path not found: ${injectionPath}`);

    // Existing path check
    mkdirSync(injectionPath);
    const existingResult = await handleMediaTool('media_scan', {
      root_path: injectionPath,
      manifest_path: resolve(tempDir, 'manifest.json'),
    });

    // execFileSync runs node or powershell directly with argv array [..., injectionPath, ...].
    // Since powershell.exe is not installed on Linux, it throws ENOENT in the fallback block,
    // and returns "Scan error: Error: spawnSync powershell.exe ENOENT...".
    // Crucially, the string `dir; rm -rf /` was passed strictly as an argument value, not executed in a shell.
    assert.match(existingResult, /Scan error: Error: spawnSync/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
