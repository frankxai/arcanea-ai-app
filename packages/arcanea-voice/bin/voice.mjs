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

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { PERSONAS, resolvePersona } from '../src/persona.mjs';
import { getKey } from '../src/transcribe.mjs';

const PRESENCE_COMMANDS = new Set(['jarvis', 'lumina', 'draconia', 'lyria', 'alera', 'shinkami', 'nero', 'presence', 'room']);
const args = process.argv.slice(2);
const mode = (args[0] || 'help').toLowerCase();
const groqKey = getKey('GROQ_API_KEY');
const elevenKey = getKey('ELEVENLABS_API_KEY');

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
  @arcanea/voice — Presence Rooms
  ---
${list}

  Flags:
    --local           Boot on-device server + orb at http://127.0.0.1:7777
                      (default: open the hosted room at arcanea.ai/room/<persona>)

  Env overrides:
    ARCANEA_VOICE_PORT       local server port (default 7777)
    ARCANEA_VOICE_LLM        Groq model (default llama-3.3-70b-versatile)
    ARCANEA_CLAUDE_BIN       path to claude CLI (default: claude on PATH)
    ARCANEA_VOICE_WEB        hosted room base URL (default https://arcanea.ai)

  Keys (read from process env or Windows user registry):
    groq:       ${groqKey ? 'set' : 'missing'}
    elevenlabs: ${elevenKey ? 'set' : 'missing'}

  Legacy recording modes (voice n/s/a/v/…) are handled by the PowerShell
  script at .arcanea/scripts/voice/voice.ps1 — still work the same.
  `);
  process.exit(0);
}

if (!PRESENCE_COMMANDS.has(mode)) {
  console.error(`\n  unknown presence command: "${mode}"`);
  console.error('  run `voice help` to see available persona rooms.\n');
  process.exit(1);
}

const persona = (mode === 'presence' || mode === 'room') ? 'lumina' : mode;
const personaName = resolvePersona(persona).name;
const useLocal = args.includes('--local') || process.env.ARCANEA_VOICE_LOCAL === '1';
const webBase = process.env.ARCANEA_VOICE_WEB || 'https://arcanea.ai';

if (!useLocal) {
  const target = `${webBase}/room/${persona}`;
  console.log(`\n  Arcanea Presence Room — ${personaName}`);
  console.log(`  ${target}`);
  console.log(`  (hosted room — no local server needed.)`);
  console.log(`  pass --local for the on-device server.\n`);
  openBrowser(target);
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
    openBrowser(target);
  },
});

process.stdin.resume();
process.on('SIGINT', () => { console.log('\n  presence closed.'); process.exit(0); });
await new Promise(() => {});
