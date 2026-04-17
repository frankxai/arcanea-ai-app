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
let vadAbove = 0;
let vadSilent = 0;
let hasSpoken = false;
let recording = false;
let busy = false;
let replyBins = new Uint8Array(128);

// ---------------------------------------------------------------------------

setStatus('Ready', 'idle');
orb.setState('idle');

window.addEventListener('keydown', (e) => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); toggleRecord(); }
  else if (e.key === 'Escape') { stopSpeaking(); }
  else if (/^[1-7]$/.test(e.key)) { switchPersona(PERSONA_ORDER[+e.key - 1]); }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('#hotkeys,#status-line')) return;
  if (!recording && !busy) toggleRecord();
});

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
  if (hasSpoken && vadSilent > 1300) { stopRecording(); return; }
  if (!hasSpoken && performance.now() % 1 < 16 && vadAbove === 0 && performance.now() > 8000) {
    // no-op — let user decide when to speak
  }
  vadRaf = requestAnimationFrame(vadLoop);
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
  if (!hasSpoken) { resetToIdle('Nothing heard — try again.'); return; }

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

  try {
    const r = await fetch(`/api/converse?persona=${persona}&ext=${ext}`, { method: 'POST', body: blob });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.error || `server ${r.status}`);
    }
    const transcript = decodeURIComponent(r.headers.get('x-voice-transcript') || '');
    const reply = decodeURIComponent(r.headers.get('x-voice-reply') || '');
    if (transcript) { transcriptEl.textContent = `"${transcript}"`; transcriptEl.classList.add('visible'); }
    if (reply) { replyEl.textContent = reply; replyEl.classList.add('visible'); }

    const audioBuf = await r.blob();
    const url = URL.createObjectURL(audioBuf);
    await playResponse(url);
    URL.revokeObjectURL(url);
  } catch (e) {
    showError(e.message || 'Something broke.');
  } finally {
    busy = false;
    resetToIdle();
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
