import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute as isAbsolutePath, join, resolve } from 'node:path';
import { test, mock } from 'node:test';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
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

test('media_scan passes shell metacharacters as one argv value', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'media-test-'));
  const root = join(tempDir, 'scene; echo injected & scene');
  const manifest = resolve(tempDir, 'manifest with spaces.json');
  mkdirSync(root);
  const shell = mock.method(childProcess, 'execSync', () => { throw new Error('Shell execution forbidden'); });
  const run = mock.method(childProcess, 'execFileSync', () => 'scan complete');
  syncBuiltinESMExports();
  try {
    assert.equal(await handleMediaTool('media_scan', {
      root_path: root, manifest_path: manifest,
    }), 'scan complete');
    assert.equal(run.mock.callCount(), 1);
    const [command, argv, options] = run.mock.calls[0].arguments;
    assert.equal(command, process.execPath);
    assert.deepEqual(argv.slice(1), ['scan', root, '--manifest', manifest]);
    assert.equal(isAbsolutePath(argv[0]), true);
    assert.notEqual(options.shell, true);
  } finally {
    run.mock.restore();
    shell.mock.restore();
    syncBuiltinESMExports();
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test('media_scan fallback uses a script argument array and reads its manifest', async () => {
  const root = mkdtempSync(join(tmpdir(), 'media-fallback-'));
  const manifest = join(root, 'manifest.json');
  const shell = mock.method(childProcess, 'execSync', () => { throw new Error('Shell execution forbidden'); });
  const run = mock.method(childProcess, 'execFileSync', (command) => {
    if (command === process.execPath) throw new Error('scanner unavailable');
    writeFileSync(manifest, JSON.stringify({ total_files: 2, total_size_mb: 3 }));
    return '';
  });
  syncBuiltinESMExports();
  try {
    assert.match(await handleMediaTool('media_scan', {
      root_path: root, manifest_path: manifest,
    }), /Scanned 2 files/);
    assert.equal(run.mock.callCount(), 2);
    const [command, argv, options] = run.mock.calls[1].arguments;
    assert.equal(command, 'powershell.exe');
    assert.deepEqual(argv.slice(0, 3), ['-ExecutionPolicy', 'Bypass', '-File']);
    assert.equal(isAbsolutePath(argv[3]), true);
    assert.deepEqual(argv.slice(4), ['-Root', root, '-Output', manifest]);
    assert.notEqual(options.shell, true);
  } finally {
    run.mock.restore();
    shell.mock.restore();
    syncBuiltinESMExports();
    rmSync(root, { recursive: true, force: true });
  }
});
