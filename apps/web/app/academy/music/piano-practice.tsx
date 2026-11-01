'use client';

import { useEffect, useRef, useState } from 'react';
import { evaluateRhythm, type RhythmResult } from '@/lib/music-mentor/rhythm';

const BPM = 90;
const INTERVAL_MS = 60000 / BPM;

export function PianoPractice() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<RhythmResult | null>(null);
  const [previous, setPrevious] = useState<RhythmResult | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(track => track.stop());
    void audioContext.current?.close();
  }, []);

  async function reference() {
    try {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      await context.resume();
      for (let i = 0; i < 4; i++) {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc.frequency.value = [261.63, 293.66, 329.63, 392][i];
        const start = context.currentTime + 0.12 + i * INTERVAL_MS / 1000;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
        osc.connect(gain).connect(context.destination);
        osc.start(start);
        osc.stop(start + 0.34);
      }
    } catch { setError('Audio playback is unavailable in this browser.'); }
  }

  async function analyze(blob: Blob) {
    setStatus('analyzing');
    try {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      const buffer = await context.decodeAudioData(await blob.arrayBuffer());
      const samples = new Float32Array(buffer.length);
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) samples[i] += data[i] / buffer.numberOfChannels;
      }
      setResult(current => { setPrevious(current); return evaluateRhythm(samples, buffer.sampleRate, BPM); });
    } catch { setError('Could not decode this recording. Try another recording or browser.'); }
    finally { setStatus('idle'); }
  }

  async function start() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Microphone recording is not supported. You can upload an audio file instead.'); return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      chunks.current = [];
      const next = new MediaRecorder(stream.current);
      recorder.current = next;
      next.ondataavailable = event => { if (event.data.size) chunks.current.push(event.data); };
      next.onstop = () => {
        stream.current?.getTracks().forEach(track => track.stop());
        stream.current = null;
        void analyze(new Blob(chunks.current, { type: next.mimeType || 'audio/webm' }));
      };
      next.start(); setStatus('recording');
    } catch { setError('Microphone permission was denied or recording failed. Upload an audio file instead.'); }
  }

  function stop() { if (recorder.current?.state === 'recording') recorder.current.stop(); }

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-foreground">
      <p className="mb-3 text-sm uppercase tracking-widest opacity-70">Arcanea Academy / Music Mentor · experimental</p>
      <h1 className="mb-4 text-4xl font-semibold">Master your first piano motif</h1>
      <p className="mb-8 max-w-2xl opacity-80">Play four evenly spaced notes at 90 BPM. Listen to the reference, record your piano, and compare the spacing between notes. This prototype measures rhythm only, not pitch, technique or musical expression.</p>
      <section aria-label="Practice exercise" className="rounded-2xl border p-6">
        <p className="mb-5 text-xl font-medium">C4 · D4 · E4 · G4</p>
        <p className="mb-5 text-sm opacity-70">Four quarter notes · 90 BPM · approximately 2 seconds</p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg border px-4 py-3" onClick={() => void reference()} disabled={status !== 'idle'}>Play reference</button>
          {status === 'recording' ? <button className="rounded-lg border px-4 py-3" onClick={stop}>Stop recording</button> : <button className="rounded-lg border px-4 py-3" onClick={() => void start()} disabled={status !== 'idle'}>Record practice</button>}
        </div>
        <label className="mt-6 block text-sm">Or upload a short audio recording
          <input className="mt-2 block w-full" type="file" accept="audio/*" disabled={status !== 'idle'} onChange={event => { const file = event.target.files?.[0]; if (file) void analyze(file); event.target.value = ''; }} />
        </label>
        <p className="mt-4 text-sm opacity-70" role="status">{status === 'recording' ? 'Recording locally. Play four notes, then stop.' : status === 'analyzing' ? 'Analyzing locally…' : 'Recordings are processed in this browser and are not uploaded or saved.'}</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}
      </section>
      {result && <section className="mt-8 rounded-2xl border p-6" aria-live="polite">
        <h2 className="mb-3 text-2xl font-medium">Your rhythm feedback</h2>
        {result.status === 'measured' ? <>
          <p>Mean interval error: <strong>{result.meanAbsoluteIntervalErrorMs} ms</strong></p>
          <p className="mt-2 text-sm opacity-70">Detected 4 note attacks. This is an approximate transient measurement, not a certified performance grade. Confidence: moderate.</p>
          {previous?.meanAbsoluteIntervalErrorMs != null && <p className="mt-2">Change from last attempt: {previous.meanAbsoluteIntervalErrorMs - (result.meanAbsoluteIntervalErrorMs ?? 0)} ms (positive means closer to the target).</p>}
          <p className="mt-4">Next drill: practice four notes with a metronome at 70 BPM, then retry at 90 BPM.</p>
        </> : <p>Insufficient signal for reliable feedback. Detected {result.detectedOnsetsMs.length} attacks; exactly four clear, separated attacks are needed. Try a quieter room or a cleaner recording.</p>}
      </section>}
    </main>
  );
}
