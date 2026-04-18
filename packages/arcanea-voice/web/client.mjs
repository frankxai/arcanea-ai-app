// Orb room client — mic capture, voice-activity-detected auto-stop,
// persona switching, and streaming audio response wired to the orb.

import { LuminaOrb } from './orb.mjs';

const PERSONA_PALETTES = {
  jarvis:   { color: '#7fdfff', accent: '#ffffff' },
  lumina:   { color: '#ffd700', accent: '#00bcd4' },
  draconia: { color: '#ef4444', accent: '#ffd700' },
  lyria:    { color: '#a78bfa', accent: '#ffffff' },
  alera:    { color: '#00bcd4', accent: '#ffffff' },
  shinkami: { color: '#e0e0e0', accent: '#ffd700' },
  nero:     { color: '#6366f1', accent: '#a78bfa' },
};
const PERSONA_ORDER = ['jarvis', 'lumina', 'draconia', 'lyria', 'alera', 'shinkami', 'nero'];

const params = new URLSearchParams(location.search);
let persona = (params.get('persona') || 'lumina').toLowerCase();
if (!PERSONA_PALETTES[persona]) persona = 'lumina';

const mountEl = document.getElementById('orb');
const personaEl = document.getElementById('persona-name');
const statusEl = document.getElementById('status-label');
const transcriptEl = document.getElementById('transcript');
const replyEl = document.getElementById('reply');
const errorEl = document.getElementById('error');
const glowEl = document.getElementById('glow');
const body = document.body;

const orb = new LuminaOrb(mountEl, PERSONA_PALETTES[persona]);
applyPaletteCss(persona);
personaEl.textContent = capitalize(persona);

let micStream = null;
let micAnalyser = null;
let micCtx = null;
let mediaRecorder = null;
let recordChunks = [];
let audioEl = null;
let audioCtx = null;
let audioAnalyser = null;
let audioSource = null;
let vadRaf = 0;
let bargeRaf = 0;
let vadAbove = 0;
let vadSilent = 0;
let bargeAbove = 0;
let hasSpoken = false;
let recording = false;
let busy = false;
let currentAbortController = null;
let replyBins = new Uint8Array(128);

// Latency instrumentation — log each stage so we can spot regressions.
const latency = { stages: [], t0: 0 };
function logStage(name) {
  const now = performance.now();
  const delta = latency.t0 ? (now - latency.t0).toFixed(0) : '0';
  const prev = latency.stages[latency.stages.length - 1];
  const sincePrev = prev ? (now - prev.at).toFixed(0) : '0';
  latency.stages.push({ name, at: now });
  console.log(`[VOICE] ${name.padEnd(18)} total=${delta}ms  delta=${sincePrev}ms`);
}
function resetLatency() {
  latency.t0 = performance.now();
  latency.stages = [];
}

// ---------------------------------------------------------------------------

setStatus('Ready', 'idle');
orb.setState('idle');

// Hybrid Space semantics:
//   tap (<200ms hold) → toggle (start recording, auto-stop on silence)
//   hold (>=200ms)    → push-to-talk (release stops recording immediately)
// e.repeat guard is critical — without it, OS autorepeat fires keydown 30x/s
// and we thrash start/stop, producing "nothing heard" every time.
let spaceDownAt = 0;
let spaceHeldTriggeredRecord = false;

window.addEventListener('keydown', (e) => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (e.repeat) return;
    spaceDownAt = performance.now();
    if (!recording && !busy) {
      spaceHeldTriggeredRecord = true;
      startRecording();
    } else {
      spaceHeldTriggeredRecord = false;
    }
  } else if (e.key === 'Escape') { stopSpeaking(); }
  else if (/^[1-7]$/.test(e.key)) { switchPersona(PERSONA_ORDER[+e.key - 1]); }
});

window.addEventListener('keyup', (e) => {
  if (e.code !== 'Space') return;
  const heldMs = performance.now() - spaceDownAt;
  if (spaceHeldTriggeredRecord && heldMs >= 200 && recording) {
    // True push-to-talk release — stop immediately, don't wait for VAD.
    stopRecording();
  }
  // Taps (<200ms) leave recording running; VAD auto-stops on silence.
  spaceDownAt = 0;
  spaceHeldTriggeredRecord = false;
});

document.addEventListener('click', (e) => {
  if (e.target.closest('#hotkeys,#status-line')) return;
  if (!recording && !busy) toggleRecord();
});

// Startup health ping — confirms server is reachable + keys present
fetch('/api/health')
  .then(r => r.ok ? r.json() : null)
  .then(j => {
    if (!j?.ok) { showError('Local server unreachable — restart with "voice jarvis".'); return; }
    if (!j.groq) showError('GROQ_API_KEY missing — transcription disabled.');
  })
  .catch(() => showError('Local server offline — restart with "voice jarvis".'));

// ---------------------------------------------------------------------------

async function toggleRecord() {
  if (busy) return;
  if (recording) return stopRecording();
  await startRecording();
}

async function startRecording() {
  try {
    if (!micStream) {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = micCtx.createMediaStreamSource(micStream);
      micAnalyser = micCtx.createAnalyser();
      micAnalyser.fftSize = 512;
      src.connect(micAnalyser);
    }

    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

    mediaRecorder = new MediaRecorder(micStream, { mimeType: mime });
    recordChunks = [];
    mediaRecorder.ondataavailable = (e) => { if (e.data.size) recordChunks.push(e.data); };
    mediaRecorder.onstop = () => void handleRecordedBlob(mime);
    mediaRecorder.start(80);

    recording = true;
    hasSpoken = false;
    vadAbove = 0;
    vadSilent = 0;
    setStatus('Listening', 'listening');
    orb.setState('listening');
    feedMicToOrb();
    vadLoop();
  } catch (e) {
    showError('Mic unavailable — grant permission or plug a mic in.');
    console.warn(e);
  }
}

function stopRecording() {
  if (!recording) return;
  recording = false;
  cancelAnimationFrame(vadRaf);
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
}

function vadLoop() {
  if (!recording) return;
  const buf = new Uint8Array(micAnalyser.fftSize);
  micAnalyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / buf.length);

  if (rms > 0.035) { vadAbove += 16; vadSilent = 0; }
  else { vadSilent += 16; }

  if (!hasSpoken && vadAbove > 180) hasSpoken = true;
  // Tightened from 1300ms to 900ms — closer to ElevenLabs/LiveKit feel.
  if (hasSpoken && vadSilent > 900) { stopRecording(); return; }
  vadRaf = requestAnimationFrame(vadLoop);
}

// Barge-in detector — polls mic RMS while the agent is speaking.
// If the user starts talking for >150ms, we interrupt the agent:
// pause audio, abort pending fetch, flip back to listening.
function startBargeInWatcher() {
  if (!micAnalyser) return;
  bargeAbove = 0;
  const buf = new Uint8Array(micAnalyser.fftSize);
  const loop = () => {
    if (!audioEl || audioEl.paused || audioEl.ended) return;
    micAnalyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length);
    if (rms > 0.045) bargeAbove += 16;
    else bargeAbove = Math.max(0, bargeAbove - 24);
    if (bargeAbove > 150) {
      console.log('[VOICE] barge-in detected');
      bargeIn();
      return;
    }
    bargeRaf = requestAnimationFrame(loop);
  };
  bargeRaf = requestAnimationFrame(loop);
}

function bargeIn() {
  cancelAnimationFrame(bargeRaf);
  if (audioEl && !audioEl.paused) { try { audioEl.pause(); } catch {} }
  if (currentAbortController) { try { currentAbortController.abort(); } catch {} }
  // Fire a fresh recording immediately — user is already speaking.
  setStatus('Listening', 'listening');
  orb.setState('listening');
  startRecording();
}

function feedMicToOrb() {
  if (!micAnalyser) return;
  const buf = new Uint8Array(micAnalyser.frequencyBinCount);
  const tick = () => {
    micAnalyser.getByteFrequencyData(buf);
    let sum = 0, low = 0, high = 0;
    const binCount = buf.length;
    const lowEnd = Math.floor(binCount * 0.15);
    const highStart = Math.floor(binCount * 0.55);
    for (let i = 0; i < binCount; i++) {
      sum += buf[i];
      if (i < lowEnd) low += buf[i];
      else if (i >= highStart) high += buf[i];
    }
    orb.setAudioSnapshot({
      amp: sum / (binCount * 255),
      low: low / (lowEnd * 255),
      high: high / ((binCount - highStart) * 255),
    });
    if (recording) requestAnimationFrame(tick);
  };
  tick();
}

async function handleRecordedBlob(mime) {
  if (!recordChunks.length) { resetToIdle(); return; }
  const blobSize = recordChunks.reduce((s, c) => s + c.size, 0);
  console.log(`[VOICE] blob bytes=${blobSize} hasSpoken=${hasSpoken}`);
  // webm opus at 48kHz averages ~4 KB per 100ms. Require ~400ms of actual audio.
  if (blobSize < 4000) {
    resetToIdle('Too short — hold Space and speak for at least half a second.');
    return;
  }
  if (!hasSpoken) {
    resetToIdle('No speech detected — check mic or speak louder.');
    return;
  }

  busy = true;
  setStatus('Thinking', 'thinking');
  orb.setState('thinking');
  orb.setAudioSnapshot({ amp: 0, low: 0, high: 0 });
  transcriptEl.textContent = '';
  replyEl.textContent = '';
  transcriptEl.classList.remove('visible');
  replyEl.classList.remove('visible');

  const blob = new Blob(recordChunks, { type: mime });
  const ext = mime.includes('webm') ? 'webm' : mime.includes('mp4') ? 'm4a' : 'bin';

  resetLatency();
  logStage('mic_stop');
  currentAbortController = new AbortController();
  try {
    let r;
    try {
      r = await fetch(`/api/converse?persona=${persona}&ext=${ext}`, {
        method: 'POST', body: blob, signal: currentAbortController.signal,
      });
    } catch (netErr) {
      if (netErr.name === 'AbortError') return;
      throw new Error('Server offline — the voice jarvis terminal was closed. Run "voice jarvis" again.');
    }
    logStage('server_response');
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.error || `server ${r.status}`);
    }
    const transcript = decodeURIComponent(r.headers.get('x-voice-transcript') || '');
    const reply = decodeURIComponent(r.headers.get('x-voice-reply') || '');
    const toolsUsed = (r.headers.get('x-voice-tools-used') || '').split(',').filter(Boolean);
    const tStt = r.headers.get('x-voice-t-stt-ms');
    const tLlm = r.headers.get('x-voice-t-llm-ms');
    const tTts = r.headers.get('x-voice-t-tts-ms');
    if (tStt || tLlm || tTts) console.log(`[VOICE] server stages  stt=${tStt||'?'}ms  llm=${tLlm||'?'}ms  tts=${tTts||'?'}ms`);
    if (transcript) { transcriptEl.textContent = `"${transcript}"`; transcriptEl.classList.add('visible'); }
    if (reply) {
      replyEl.textContent = reply;
      replyEl.classList.add('visible');
      if (toolsUsed.length) {
        const pill = document.createElement('div');
        pill.className = 'tool-pill';
        pill.textContent = 'Executed: ' + toolsUsed.join(', ');
        replyEl.appendChild(pill);
      }
    }

    const audioBuf = await r.blob();
    logStage('tts_ready');
    const url = URL.createObjectURL(audioBuf);
    await playResponse(url);
    logStage('audio_done');
    URL.revokeObjectURL(url);
  } catch (e) {
    if (e.name !== 'AbortError') showError(e.message || 'Something broke.');
  } finally {
    busy = false;
    currentAbortController = null;
    if (!recording) resetToIdle();
  }
}

async function playResponse(url) {
  if (audioEl) { try { audioEl.pause(); } catch {} }
  audioEl = new Audio();
  audioEl.crossOrigin = 'anonymous';
  audioEl.src = url;
  audioEl.preload = 'auto';

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  audioSource = audioCtx.createMediaElementSource(audioEl);
  audioAnalyser = audioCtx.createAnalyser();
  audioAnalyser.fftSize = 512;
  audioSource.connect(audioAnalyser);
  audioSource.connect(audioCtx.destination);

  setStatus('Speaking', 'speaking');
  orb.setState('speaking');
  startBargeInWatcher();

  const bins = new Uint8Array(audioAnalyser.frequencyBinCount);
  const tick = () => {
    if (!audioEl || audioEl.paused || audioEl.ended) return;
    audioAnalyser.getByteFrequencyData(bins);
    let sum = 0, low = 0, high = 0;
    const lowEnd = Math.floor(bins.length * 0.15);
    const highStart = Math.floor(bins.length * 0.55);
    for (let i = 0; i < bins.length; i++) {
      sum += bins[i];
      if (i < lowEnd) low += bins[i];
      else if (i >= highStart) high += bins[i];
    }
    orb.setAudioSnapshot({
      amp: sum / (bins.length * 255),
      low: low / (lowEnd * 255),
      high: high / ((bins.length - highStart) * 255),
    });
    requestAnimationFrame(tick);
  };

  return new Promise((done) => {
    audioEl.addEventListener('playing', tick, { once: true });
    audioEl.addEventListener('ended', () => done(), { once: true });
    audioEl.addEventListener('error', () => done(), { once: true });
    audioEl.play().catch(() => done());
  });
}

function stopSpeaking() {
  if (audioEl && !audioEl.paused) {
    try { audioEl.pause(); } catch {}
  }
  if (recording) stopRecording();
  resetToIdle();
}

function resetToIdle(message) {
  if (message) showError(message);
  setStatus('Ready', 'idle');
  orb.setState('idle');
}

function switchPersona(next) {
  if (!PERSONA_PALETTES[next] || next === persona) return;
  persona = next;
  orb.setPalette(PERSONA_PALETTES[next].color, PERSONA_PALETTES[next].accent);
  applyPaletteCss(next);
  personaEl.textContent = capitalize(next);
  const url = new URL(location.href);
  url.searchParams.set('persona', next);
  history.replaceState(null, '', url);
}

function applyPaletteCss(id) {
  const p = PERSONA_PALETTES[id];
  document.documentElement.style.setProperty('--core', p.color);
  document.documentElement.style.setProperty('--accent', p.accent);
}

function setStatus(label, state) {
  statusEl.textContent = label;
  body.dataset.state = state;
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  clearTimeout(showError._t);
  showError._t = setTimeout(() => { errorEl.hidden = true; }, 4000);
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
