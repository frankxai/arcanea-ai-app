#!/usr/bin/env node
/**
 * @arcanea/voice — System Daemon (Tier 1 always-on listener)
 *
 * Captures system mic via FFmpeg, runs amplitude + attack-time + double-clap
 * detection in pure JS, opens the Voice Dashboard pre-summoned on a match.
 *
 * Why FFmpeg instead of `mic` / `naudiodon`: FFmpeg is already installed for
 * the @arcanea/voice recording pipeline, ships cross-platform, has zero
 * native compile, and auto-discovers the default audio input on every OS.
 *
 * Design choices vs the browser detector:
 *  - Amplitude + attack-time only (no FFT) — keeps the daemon dep-free.
 *    Double-clap pattern (two transients within 150-650ms) is itself the
 *    primary discriminator — random environmental claps are rare, paired
 *    ones rarer. False-positives are rate-limited by the 8s cooldown.
 *  - Adaptive noise floor EMA (~2s tau) — adapts to ambient.
 *  - 8-second cooldown after a fired summon — prevents accidental re-fires.
 *
 * Usage:
 *   node voice-daemon.mjs [--persona lumina] [--device <ffmpeg-input>]
 *                        [--web https://arcanea.ai] [--threshold 4.5]
 *                        [--silent]
 *
 * Env:
 *   ARCANEA_VOICE_WEB        hosted dashboard base (default https://arcanea.ai)
 *   ARCANEA_VOICE_PERSONA    default persona for summon (default lumina)
 *   ARCANEA_BROWSER_BIN      override browser binary
 *   FFMPEG_BIN               override ffmpeg binary path
 */

import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/* ------------------------------------------------------------------ */
/*  Args + config                                                      */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);

const persona = arg('persona', process.env.ARCANEA_VOICE_PERSONA || 'lumina');
const webBase = arg('web', process.env.ARCANEA_VOICE_WEB || 'https://arcanea.ai');
const sensitivity = parseFloat(arg('threshold', '4.5')); // multiplier over noise floor
const inputDevice = arg('device', null); // platform-specific override
const silent = flag('silent') || flag('quiet');

const PERSONAS = ['lumina', 'jarvis', 'draconia', 'lyria', 'alera', 'shinkami', 'nero'];
if (!PERSONAS.includes(persona)) {
  console.error(`unknown persona: "${persona}". choose one of: ${PERSONAS.join(', ')}`);
  process.exit(1);
}

const SAMPLE_RATE = 16000; // Hz, mono, s16le
const FRAME_MS = 25; // ~400 samples per frame
const FRAME_SAMPLES = Math.floor((SAMPLE_RATE * FRAME_MS) / 1000);
const FRAME_BYTES = FRAME_SAMPLES * 2;

// Detection params
const FLOOR_ALPHA = 0.05; // EMA alpha at FRAME_MS — ~tau 500ms; faster than browser version
const FLOOR_MIN = 0.0015; // floor is in [0..1] domain after normalize
const REFRACTORY_MS = 100;
const MAX_ATTACK_MS = 60;
const DOUBLE_CLAP_MIN_MS = 150;
const DOUBLE_CLAP_MAX_MS = 650;
const COOLDOWN_AFTER_FIRE_MS = 8000;

const log = (...args) => {
  if (!silent) console.log('[voice-daemon]', ...args);
};
const warn = (...args) => console.warn('[voice-daemon]', ...args);

/* ------------------------------------------------------------------ */
/*  FFmpeg invocation per platform                                     */
/* ------------------------------------------------------------------ */

function findFfmpeg() {
  if (process.env.FFMPEG_BIN && existsSync(process.env.FFMPEG_BIN)) {
    return process.env.FFMPEG_BIN;
  }
  // Try PATH
  const probe = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['ffmpeg'], {
    encoding: 'utf-8',
  });
  if (probe.status === 0 && probe.stdout.trim()) {
    return probe.stdout.trim().split(/\r?\n/)[0];
  }
  return null;
}

function ffmpegArgs() {
  const base = ['-loglevel', 'error', '-nostdin'];
  if (process.platform === 'win32') {
    // dshow with default device. Override via --device "Microphone (USB)"
    const device = inputDevice || 'audio=Microphone';
    base.push('-f', 'dshow', '-i', device);
  } else if (process.platform === 'darwin') {
    // avfoundation: ":0" = default audio input on Mac
    const device = inputDevice || ':0';
    base.push('-f', 'avfoundation', '-i', device);
  } else {
    // Linux — pulse default
    const device = inputDevice || 'default';
    base.push('-f', 'pulse', '-i', device);
  }
  base.push(
    '-ac',
    '1',
    '-ar',
    String(SAMPLE_RATE),
    '-f',
    's16le',
    '-acodec',
    'pcm_s16le',
    'pipe:1',
  );
  return base;
}

/* ------------------------------------------------------------------ */
/*  Browser launch                                                      */
/* ------------------------------------------------------------------ */

function findChromium() {
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
    for (const c of candidates) if (c && existsSync(c)) return c;
  } else if (p === 'darwin') {
    const candidates = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    ];
    for (const c of candidates) if (existsSync(c)) return c;
  } else {
    for (const c of ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge']) {
      const r = spawnSync('which', [c], { encoding: 'utf-8' });
      if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    }
  }
  return null;
}

function openSummon(persona) {
  // Direct to the persona room — no dashboard intermediary. Avoids
  // Chromium app-window's same-origin navigation bounce that was
  // closing the window when the dashboard's auto-summon redirected.
  const url = `${webBase}/room/${persona}?via=clap-daemon&t=${Date.now()}`;
  log(`SUMMON ${persona.toUpperCase()} → ${url}`);

  // Prefer app-window mode for a kiosk-feel persona room.
  const bin = findChromium();
  if (bin) {
    const udd = join(homedir(), '.arcanea', 'app-windows', `daemon-${persona}`);
    try {
      spawn(bin, [
        `--app=${url}`,
        `--user-data-dir=${udd}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-features=TranslateUI',
        '--window-size=1300,900',
      ], { stdio: 'ignore', detached: true }).unref();
      return;
    } catch (e) {
      warn('app-window launch failed, falling back to default browser:', e.message);
    }
  }

  // Default-browser fallback
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '""', url], { stdio: 'ignore', detached: true }).unref();
  } else if (process.platform === 'darwin') {
    spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
  } else {
    spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
  }
}

/* ------------------------------------------------------------------ */
/*  Detection state                                                     */
/* ------------------------------------------------------------------ */

let noiseFloor = 0.005;
let attackStartTs = null;
let lastPeakTs = 0;
let lastClapTs = 0;
let lastFireTs = 0;
let clapCount = 0;
let frameCount = 0;

function processFrame(samples) {
  frameCount++;
  const now = performance.now();

  // Compute frame RMS (samples are normalized -1..1)
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSquares += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sumSquares / samples.length);

  const dynamicThreshold = Math.max(noiseFloor * sensitivity, FLOOR_MIN * 4);

  // Periodic floor heartbeat for visibility
  if (frameCount % 200 === 0 && !silent) {
    log(`floor=${(noiseFloor * 100).toFixed(2)}% rms=${(rms * 100).toFixed(2)}% threshold=${(dynamicThreshold * 100).toFixed(2)}%`);
  }

  // Below floor band — track noise floor, reset attack
  if (rms < noiseFloor * 1.5) {
    noiseFloor = noiseFloor * (1 - FLOOR_ALPHA) + rms * FLOOR_ALPHA;
    if (noiseFloor < FLOOR_MIN) noiseFloor = FLOOR_MIN;
    attackStartTs = null;
    return;
  }

  // Above floor but below threshold — start attack timer
  if (rms < dynamicThreshold) {
    if (attackStartTs === null) attackStartTs = now;
    return;
  }

  // Refractory check
  if (now - lastPeakTs < REFRACTORY_MS) {
    attackStartTs = null;
    return;
  }

  // Cooldown after a fired summon — ignore everything for 8s
  if (now - lastFireTs < COOLDOWN_AFTER_FIRE_MS) {
    attackStartTs = null;
    return;
  }

  // Attack-time gate
  const attackMs = attackStartTs === null ? 0 : now - attackStartTs;
  if (attackMs > MAX_ATTACK_MS) {
    // Slow build = speech/music/wind. Reject.
    attackStartTs = null;
    return;
  }

  // Confirmed clap candidate
  lastPeakTs = now;
  attackStartTs = null;
  clapCount++;
  log(`CLAP #${clapCount} (rms=${(rms * 100).toFixed(2)}%, attack=${attackMs.toFixed(0)}ms)`);

  const dt = now - lastClapTs;
  if (dt >= DOUBLE_CLAP_MIN_MS && dt <= DOUBLE_CLAP_MAX_MS) {
    lastClapTs = 0;
    lastFireTs = now;
    log(`✓ DOUBLE CLAP CONFIRMED (gap=${dt.toFixed(0)}ms) — summoning ${persona}`);
    try {
      openSummon(persona);
    } catch (e) {
      warn('summon failed:', e.message);
    }
  } else {
    lastClapTs = now;
  }
}

/* ------------------------------------------------------------------ */
/*  PCM frame parser                                                    */
/* ------------------------------------------------------------------ */

let pcmBuffer = Buffer.alloc(0);

function onPcmChunk(chunk) {
  pcmBuffer = pcmBuffer.length === 0 ? chunk : Buffer.concat([pcmBuffer, chunk]);
  while (pcmBuffer.length >= FRAME_BYTES) {
    const frame = pcmBuffer.subarray(0, FRAME_BYTES);
    pcmBuffer = pcmBuffer.subarray(FRAME_BYTES);
    const samples = new Float32Array(FRAME_SAMPLES);
    for (let i = 0; i < FRAME_SAMPLES; i++) {
      const sample = frame.readInt16LE(i * 2);
      samples[i] = sample / 32768;
    }
    processFrame(samples);
  }
}

/* ------------------------------------------------------------------ */
/*  Main loop                                                           */
/* ------------------------------------------------------------------ */

function start() {
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) {
    console.error(`
[voice-daemon] ffmpeg not found.

Install:
  Windows : winget install Gyan.FFmpeg  (or  scoop install ffmpeg)
  macOS   : brew install ffmpeg
  Linux   : sudo apt install ffmpeg
`);
    process.exit(2);
  }

  const args = ffmpegArgs();
  log(`starting — persona=${persona}  threshold=${sensitivity}×floor  device=${inputDevice ?? 'default'}`);
  log(`ffmpeg=${ffmpeg}`);
  log(`web=${webBase}`);
  log(`(double-clap to summon. Ctrl+C to stop.)`);

  const child = spawn(ffmpeg, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  child.stdout.on('data', onPcmChunk);

  child.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    // Only surface real errors, not the routine ffmpeg banner
    if (/error|cannot|no such|denied/i.test(text)) {
      warn('ffmpeg:', text.trim());
    }
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[voice-daemon] ffmpeg exited with code ${code}`);
    }
    process.exit(code ?? 0);
  });

  process.on('SIGINT', () => {
    log('shutting down…');
    child.kill('SIGTERM');
    setTimeout(() => process.exit(0), 200);
  });
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    setTimeout(() => process.exit(0), 200);
  });
}

start();
