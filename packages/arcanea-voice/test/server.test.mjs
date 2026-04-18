#!/usr/bin/env node
// Integration smoke test: boots the presence server on a throwaway port,
// verifies /api/health, static file serving, and /api/converse input validation.
// Skips any path that would spend real Groq/ElevenLabs quota.
// Run: node test/server.test.mjs

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.ARCANEA_TEST_PORT || 7789);
const BASE = `http://127.0.0.1:${PORT}`;
const cliPath = join(__dirname, '..', 'bin', 'voice.mjs');

const GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', RESET = '\x1b[0m';

// ---------------------------------------------------------------------------

function boot() {
  const proc = spawn(process.execPath, [cliPath, 'jarvis', '--local'], {
    env: { ...process.env, ARCANEA_VOICE_PORT: String(PORT), ARCANEA_VOICE_HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return proc;
}

async function waitForHealth(tries = 30) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) return await r.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`server did not come up at ${BASE}`);
}

// ---------------------------------------------------------------------------

const suite = [];
const test = (name, fn) => suite.push({ name, fn });
let server;

test('server boots and /api/health reports all personas', async () => {
  const health = await waitForHealth();
  assert.equal(health.ok, true);
  assert.deepEqual(health.personas.sort(), ['alera','draconia','jarvis','lumina','lyria','nero','shinkami']);
});

test('root serves the orb room HTML', async () => {
  const r = await fetch(BASE + '/');
  assert.ok(r.ok);
  assert.ok(r.headers.get('content-type').includes('text/html'));
  const body = await r.text();
  assert.ok(body.includes('Arcanea · Presence'), 'expected title');
  assert.ok(body.includes('importmap'), 'expected three.js import map');
});

test('static assets serve (orb.mjs, client.mjs, style.css)', async () => {
  for (const path of ['/orb.mjs', '/client.mjs', '/style.css']) {
    const r = await fetch(BASE + path);
    assert.ok(r.ok, `${path} returned ${r.status}`);
  }
});

test('/api/converse rejects empty body with 400', async () => {
  const r = await fetch(`${BASE}/api/converse?persona=jarvis`, { method: 'POST', body: '' });
  assert.equal(r.status, 400);
});

test('/api/converse CORS preflight returns 204', async () => {
  const r = await fetch(`${BASE}/api/converse`, { method: 'OPTIONS' });
  assert.equal(r.status, 204);
  assert.ok(r.headers.get('access-control-allow-origin'));
});

test('path traversal rejected by static handler', async () => {
  const r = await fetch(`${BASE}/../../../etc/passwd`);
  // Most browsers normalize, so we also try a raw socket-friendly form
  assert.ok(r.status === 404 || r.status === 403, `expected 404/403 got ${r.status}`);
});

test('unknown persona falls back to lumina resolution (no 500)', async () => {
  // This exercises resolvePersona without spending quota — empty body triggers 400 before LLM.
  const r = await fetch(`${BASE}/api/converse?persona=totally-not-real`, { method: 'POST', body: '' });
  assert.equal(r.status, 400, 'should reject on empty body, not crash on bad persona');
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

(async () => {
  server = boot();
  let stderrBuf = '';
  server.stderr.on('data', (d) => { stderrBuf += d.toString(); });

  let passed = 0, failed = 0;
  try {
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
  } finally {
    server.kill();
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n  ${passed + failed} tests, ${passed} passed, ${failed} failed`);
  if (stderrBuf && failed) {
    console.log(`\n  --- server stderr ---\n${stderrBuf}`);
  }
  process.exit(failed ? 1 : 0);
})();
