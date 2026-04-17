import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execa } from 'execa';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, '..', 'dist', 'cli.js');

test('cli --version returns 1.x.x', async () => {
  const res = await execa('node', [CLI, '--version'], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /^1\.\d+\.\d+$/);
});

test('cli list-tasks prints task classes', async () => {
  const res = await execa('node', [CLI, 'list-tasks'], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /orchestrate/);
  assert.match(res.stdout, /code\.debug/);
  assert.match(res.stdout, /world\.canon/);
});

test('cli list-models prints models', async () => {
  const res = await execa('node', [CLI, 'list-models'], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /claude-opus-4-7/);
});

test('cli explain shows routing decision', async () => {
  const res = await execa('node', [CLI, 'explain', 'world.canon'], { reject: false });
  assert.equal(res.exitCode, 0);
  assert.match(res.stdout, /Task: world\.canon/);
  assert.match(res.stdout, /claude-opus-4-7/);
});

test('cli explain with unknown task exits non-zero', async () => {
  const res = await execa('node', [CLI, 'explain', 'totally.not.a.real.task'], { reject: false });
  assert.notEqual(res.exitCode, 0);
  assert.match(res.stderr, /Unknown task/);
});

test('cli run --dry-run shows exec plan without invoking runtime', async () => {
  const res = await execa(
    'node',
    [CLI, 'run', '--task', 'nav.fast', '--dry-run', 'hello'],
    { reject: false },
  );
  assert.equal(res.exitCode, 0);
  assert.match(res.stderr, /dry-run/);
  assert.match(res.stderr, /claude-haiku-4-5/);
});
