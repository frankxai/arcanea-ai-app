#!/usr/bin/env node
/**
 * @arcanea/voice — Presence Room CLI
 *
 * Scope: persona rooms (jarvis/lumina/draconia/lyria/alera/shinkami/nero).
 * Legacy recording modes (note/strategy/agent/voiceover/…) are owned by the
 * PowerShell script at .arcanea/scripts/voice/voice.ps1; that script
 * delegates presence commands here.
 *
 * Usage:
 *   voice jarvis               → open hosted room (arcanea.ai/room/jarvis)
 *   voice jarvis --local       → boot on-device server + orb on localhost
 *   voice lumina               → opens Lumina room (default persona)
 *   voice help                 → this help
 */

import { spawnSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { PERSONAS, resolvePersona } from '../src/persona.mjs';
import { getKey } from '../src/transcribe.mjs';

const PRESENCE_COMMANDS = new Set(['jarvis', 'lumina', 'draconia', 'lyria', 'alera', 'shinkami', 'nero', 'presence', 'room']);
const args = process.argv.slice(2);
const mode = (args[0] || 'help').toLowerCase();
const groqKey = getKey('GROQ_API_KEY');
const elevenKey = getKey('ELEVENLABS_API_KEY');

function findChromiumBinary() {
  const p = process.platform;
  const override = process.env.ARCANEA_BROWSER_BIN;
  if (override && existsSync(override)) return override;
  if (p === 'win32') {
    const candidates = [
      join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(process.env['LOCALAPPDATA'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    ];
    for (const c of candidates) { if (c && existsSync(c)) return c; }
  } else if (p === 'darwin') {
    const candidates = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    ];
    for (const c of candidates) { if (existsSync(c)) return c; }
  } else {
    for (const c of ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge']) {
      const r = spawnSync('which', [c], { encoding: 'utf-8' });
      if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    }
  }
  return null;
}

function openAppWindow(url, persona) {
  const bin = findChromiumBinary();
  if (!bin) return { ok: false, reason: 'no Chromium-class browser found (tried Chrome, Edge, Brave)' };
  // Dedicated user-data-dir per persona keeps each room as its own "app"
  // with independent icon, history, and localStorage — just like a native app.
  const udd = join(homedir(), '.arcanea', 'app-windows', persona || 'room');
  try {
    spawn(bin, [
      `--app=${url}`,
      `--user-data-dir=${udd}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-features=TranslateUI',
      '--window-size=1100,800',
    ], { stdio: 'ignore', detached: true }).unref();
    return { ok: true, bin };
  } catch (e) {
    return { ok: false, reason: String(e?.message || e) };
  }
}

function openBrowser(url) {
  const p = process.platform;
  try {
    if (p === 'win32') spawnSync('cmd', ['/c', 'start', '""', url], { stdio: 'ignore' });
    else if (p === 'darwin') spawnSync('open', [url], { stdio: 'ignore' });
    else spawnSync('xdg-open', [url], { stdio: 'ignore' });
  } catch {}
}

if (mode === 'help' || mode === 'h' || mode === '--help' || mode === '-h') {
  const list = Object.entries(PERSONAS)
    .map(([id, p]) => `  voice ${id.padEnd(10)} ${p.name} — ${p.tagline}`)
    .join('\n');
  console.log(`
  @arcanea/voice — Presence Rooms + Voice Command Center
  ---
${list}
  voice dashboard   Voice Command Center — clap, click, voice, ⌘K
                    (opens arcanea.ai/voice/dashboard)

  Flags:
    --local           Boot on-device server + orb at http://127.0.0.1:7777
                      (default: open the hosted room at arcanea.ai/room/<persona>)
    --app             Open in a standalone Chrome/Edge "app" window (no browser
                      chrome). Works with or without --local. Per-persona user
                      data dir, so each room is its own installable-feeling app.

  Env overrides:
    ARCANEA_VOICE_PORT       local server port (default 7777)
    ARCANEA_VOICE_LLM        Groq model (default llama-3.3-70b-versatile)
    ARCANEA_CLAUDE_BIN       path to claude CLI (default: claude on PATH)
    ARCANEA_VOICE_WEB        hosted room base URL (default https://arcanea.ai)
    ARCANEA_BROWSER_BIN      override the Chrome/Edge binary for --app mode

  Keys (read from process env or Windows user registry):
    groq:       ${groqKey ? 'set' : 'missing'}
    elevenlabs: ${elevenKey ? 'set' : 'missing'}

  Legacy recording modes (voice n/s/a/v/…) are handled by the PowerShell
  script at .arcanea/scripts/voice/voice.ps1 — still work the same.
  `);
  process.exit(0);
}

// `voice dashboard` opens the command center at /voice/dashboard.
if (mode === 'dashboard') {
  const webBase = process.env.ARCANEA_VOICE_WEB || 'https://arcanea.ai';
  const url = `${webBase}/voice/dashboard`;
  const useApp = args.includes('--app') || process.env.ARCANEA_VOICE_APP === '1';
  if (useApp) {
    const r = openAppWindow(url, 'dashboard');
    if (r.ok) {
      console.log(`  voice dashboard launched in app window (${r.bin})`);
      process.exit(0);
    }
    console.log(`  [WARN] app window failed: ${r.reason} — falling back to default browser`);
  }
  openBrowser(url);
  console.log(`  voice dashboard → ${url}`);
  process.exit(0);
}

if (!PRESENCE_COMMANDS.has(mode)) {
  console.error(`\n  unknown command: "${mode}"`);
  console.error('  run `voice help` to see available commands.\n');
  process.exit(1);
}

const persona = (mode === 'presence' || mode === 'room') ? 'lumina' : mode;
const personaName = resolvePersona(persona).name;
const useLocal = args.includes('--local') || process.env.ARCANEA_VOICE_LOCAL === '1';
const useApp = args.includes('--app') || process.env.ARCANEA_VOICE_APP === '1';
const webBase = process.env.ARCANEA_VOICE_WEB || 'https://arcanea.ai';

function launch(url) {
  if (useApp) {
    const r = openAppWindow(url, persona);
    if (r.ok) { console.log(`  launched in app window (${r.bin})`); return; }
    console.log(`  [WARN] app window failed: ${r.reason} — falling back to default browser`);
  }
  openBrowser(url);
}

if (!useLocal) {
  const target = `${webBase}/room/${persona}`;
  console.log(`\n  Arcanea Presence Room — ${personaName}`);
  console.log(`  ${target}`);
  console.log(`  (hosted room — no local server needed.)`);
  console.log(`  pass --local for on-device server, --app for a standalone window.\n`);
  launch(target);
  process.exit(0);
}

const { startServer } = await import('../src/server.mjs');
const port = parseInt(process.env.ARCANEA_VOICE_PORT || '7777', 10);
const host = process.env.ARCANEA_VOICE_HOST || '127.0.0.1';

if (!groqKey) {
  console.log('\n  [WARN] GROQ_API_KEY not set — transcription + LLM unavailable.');
  console.log('         get a free key: https://console.groq.com\n');
}

startServer({
  port, host,
  onReady: ({ url }) => {
    const target = `${url}/?persona=${persona}`;
    console.log(`\n  Arcanea Presence (local) — ${personaName}`);
    console.log(`  ${target}`);
    console.log(`  groq: ${groqKey ? 'yes' : 'no'}   eleven: ${elevenKey ? 'yes' : 'no'}`);
    console.log(`  Tools: shell_run, file_write, claude_prompt, claude_code_launch, open_url, linear_issue`);
    console.log(`  Multi-round: up to 4 rounds / 8 total tool calls per turn.`);
    console.log(`  Ctrl+C to stop.\n`);
    launch(target);
  },
});

process.stdin.resume();
process.on('SIGINT', () => { console.log('\n  presence closed.'); process.exit(0); });
await new Promise(() => {});
