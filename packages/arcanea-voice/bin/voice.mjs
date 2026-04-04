#!/usr/bin/env node
/**
 * @arcanea/voice — CLI
 * npx @arcanea/voice [mode] [duration]
 */

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, appendFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir, platform } from 'os';
import { fileURLToPath } from 'url';

import { MODES, ALIASES } from '../src/config.mjs';
import { detectBestMic, ffmpegInputArgs } from '../src/mic.mjs';
import { transcribe, getKey } from '../src/transcribe.mjs';
import { speak } from '../src/tts.mjs';
import { analyze, coachSummary, extractActions } from '../src/coach.mjs';

const isWin = platform() === 'win32';
const args = process.argv.slice(2);
let mode = args[0] || 'note';
const duration = parseInt(args[1]) || 0;

if (ALIASES[mode]) mode = ALIASES[mode];

// Detect voice output dir (project-local or home)
const voiceDir = existsSync(join(process.cwd(), 'content'))
  ? join(process.cwd(), 'content', 'voice')
  : join(process.cwd(), 'voice-captures');

const mic = detectBestMic();
const groqKey = getKey('GROQ_API_KEY');
const elevenKey = getKey('ELEVENLABS_API_KEY');

// ─── Commands ────────────────────────────────────────────────────────

if (mode === 'help' || mode === 'h') {
  const micInfo = mic ? `${mic.name} (${mic.tier})` : 'none';
  console.log(`
  @arcanea/voice v0.1.0
  Mic: ${micInfo}
  ---
  THINKING          PUBLISHING           WORKFLOW
  n  Note (1m)      nl Newsletter (5m)   i  Linear Issue
  s  Strategy (5m)  v  Voiceover (3m)    t  Task
  a  Agent (2m)     c  Arcanea (5m)      id Idea
  r  Reading (10m)                       su Standup
                                         cm Commit Msg
  MANAGE
  mic  Microphones    rev  QC last    play  Listen
  l    List recent    init Setup      help  This

  Groq: ${groqKey ? 'yes' : 'no'} | ElevenLabs: ${elevenKey ? 'yes' : 'no'}
  `);
  process.exit(0);
}

if (mode === 'mic') {
  const { listMics } = await import('../src/mic.mjs');
  const mics = listMics();
  console.log('\n  Microphones:');
  mics.forEach(m => {
    const active = mic && m === mic.name ? ' [ACTIVE]' : '';
    console.log(`  ${m}${active}`);
  });
  console.log(`\n  Selected: ${mic?.name || 'none'} (${mic?.tier || '?'})\n`);
  process.exit(0);
}

if (mode === 'init') {
  for (const m of Object.values(MODES)) {
    mkdirSync(join(voiceDir, m.dir), { recursive: true });
    mkdirSync(join(voiceDir, 'transcripts', m.dir), { recursive: true });
  }
  console.log(`\n  Voice system initialized at ${voiceDir}\n`);
  process.exit(0);
}

if (mode === 'list' || mode === 'l') {
  console.log('\n  Recent recordings:');
  try {
    const all = [];
    for (const m of Object.values(MODES)) {
      const d = join(voiceDir, m.dir);
      if (!existsSync(d)) continue;
      for (const f of readdirSync(d).filter(f => f.endsWith('.wav'))) {
        const stat = statSync(join(d, f));
        all.push({ name: `${m.dir}/${f}`, size: stat.size, time: stat.mtime });
      }
    }
    all.sort((a, b) => b.time - a.time).slice(0, 10).forEach(f => {
      const kb = Math.round(f.size / 1024);
      console.log(`  ${f.time.toISOString().slice(5, 16).replace('T', ' ')}  ${f.name}  ${kb}KB`);
    });
  } catch {}
  console.log('');
  process.exit(0);
}

// ─── Record ──────────────────────────────────────────────────────────

if (!MODES[mode]) {
  console.log(`  Unknown mode: ${mode}. Use 'voice help' for commands.`);
  process.exit(1);
}

if (!mic) {
  console.log('  No microphone detected. Connect one and try again.');
  process.exit(1);
}

const m = MODES[mode];
const dur = duration > 0 ? Math.min(duration, m.max) : m.dur;
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join(voiceDir, m.dir);
const transDir = join(voiceDir, 'transcripts', m.dir);
mkdirSync(outDir, { recursive: true });
mkdirSync(transDir, { recursive: true });

const file = join(outDir, `${mode}_${ts}.wav`);
const codec = m.bit === 24 ? 'pcm_s24le' : 'pcm_s16le';
const useGroq = groqKey && mode !== 'reading';
const src = useGroq ? 'groq' : 'whisper';

const durMin = Math.floor(dur / 60);
const durStr = durMin > 0 ? `${durMin}m${dur % 60 ? dur % 60 + 's' : ''}` : `${dur}s`;

console.log(`\n  ${m.name} | ${durStr} | ${m.rate/1000}kHz | ${mic.tier} | ${src}`);
console.log(`  Ctrl+C to stop | ${mic.name}`);
if (m.family === 'publishing' && mic.tier === 'LAPTOP') {
  console.log('  [WARN] Laptop mic for publishing. Connect a better mic.');
}
console.log('');

// Record
const ffArgs = [...ffmpegInputArgs(mic.name),
  '-acodec', codec, '-ar', String(m.rate), '-ac', String(m.ch), '-t', String(dur), file];
spawnSync('ffmpeg', ['-y', ...ffArgs], { stdio: ['inherit', 'pipe', 'pipe'] });

if (!existsSync(file) || statSync(file).size < 2000) {
  console.log('  No audio captured.');
  process.exit(1);
}
console.log(`  Captured ${Math.round(statSync(file).size / 1024)}KB`);

// Transcribe
process.stdout.write('  Transcribing...');
const result = transcribe(file, useGroq);
if (!result) {
  console.log(` failed. Audio: ${file}`);
  process.exit(1);
}
console.log(` [${result.backend}]`);

const display = result.text.length > 300 ? result.text.slice(0, 300) + '...' : result.text;
console.log(`  ---\n  ${display}\n  ---`);

// Save transcript
writeFileSync(join(transDir, `${mode}_${ts}.md`), `# ${m.name} - ${ts}\n\n${result.text}\n`);

// Coach
const coaching = analyze(result.text);
if (coaching) {
  console.log(`  [COACH] ${coaching.wc}w ${coaching.sentences}s ${coaching.fillers}f`);
}

// Clipboard
try {
  if (isWin) {
    spawnSync('powershell', ['-Command', `Set-Clipboard '${result.text.replace(/'/g, "''")}'`], { timeout: 3000, stdio: 'pipe' });
  } else {
    spawnSync('pbcopy', [], { input: result.text, timeout: 3000 });
  }
  console.log('  Copied to clipboard');
} catch {}

// Voice coach response
const isPremium = ['strategy', 'newsletter', 'voiceover', 'arcanea'].includes(mode);
const summary = coachSummary(coaching);
if (summary) {
  const backend = speak(summary, { persona: 'lumina', premium: isPremium });
  if (backend) console.log(`  [VOICE] ${summary} [${backend}]`);
}

// Workflow routing
if (mode === 'strategy') {
  const actions = extractActions(result.text);
  if (actions.length > 0) {
    console.log(`  [ACTIONS] ${actions.length} items extracted:`);
    actions.forEach((a, i) => console.log(`  ${i + 1}. ${a}`));
  }
}
if (mode === 'agent') console.log('  Paste as prompt into Claude Code.');
if (mode === 'commit') console.log('  Commit message on clipboard.');
if (mode === 'issue') console.log('  Paste into Linear or: gh issue create --body "..."');

console.log('');
