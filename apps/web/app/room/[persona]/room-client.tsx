'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LuminaPresence, type PresenceState } from '@/components/presence/lumina-presence';

// ---------------------------------------------------------------------------
// Personas — superset of the local voice room, with arcanea.ai voice mapping
// ---------------------------------------------------------------------------

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  color: string;
  accent: string;
  voiceKey: string;
  prompt: string;
  temperature: number;
}

export const PERSONAS = {
  jarvis: {
    id: 'jarvis',
    name: 'JARVIS',
    tagline: 'Just A Rather Very Intelligent System',
    color: '#7fdfff',
    accent: '#ffffff',
    voiceKey: 'alera',
    temperature: 0.35,
    prompt:
      'You are JARVIS — a concise, precise, professional voice assistant. Answer in one to three short sentences. No filler. No hedging. Direct and clear.',
  },
  lumina: {
    id: 'lumina',
    name: 'Lumina',
    tagline: 'The First Light',
    color: '#ffd700',
    accent: '#00bcd4',
    voiceKey: 'lumina',
    temperature: 0.6,
    prompt:
      'You are Lumina, the First Light of Arcanea. Warm, illuminating, concise. Speak with poetic precision. Two to four sentences. Guide without lecturing.',
  },
  draconia: {
    id: 'draconia',
    name: 'Draconia',
    tagline: 'Guardian of Fire',
    color: '#ef4444',
    accent: '#ffd700',
    voiceKey: 'draconia',
    temperature: 0.5,
    prompt:
      'You are Draconia, Guardian of Fire. Commanding, decisive, forge-tempered. Short powerful sentences. Never soften.',
  },
  lyria: {
    id: 'lyria',
    name: 'Lyria',
    tagline: 'Guardian of Sight',
    color: '#a78bfa',
    accent: '#ffffff',
    voiceKey: 'lyria',
    temperature: 0.7,
    prompt:
      'You are Lyria, Guardian of Sight. Mystical, perceiving, layered. Speak in visionary imagery. Two to three sentences.',
  },
  alera: {
    id: 'alera',
    name: 'Alera',
    tagline: 'Guardian of Voice',
    color: '#00bcd4',
    accent: '#ffffff',
    voiceKey: 'alera',
    temperature: 0.4,
    prompt:
      'You are Alera, Guardian of Voice. Clear, truthful, resonant. Every word matters. Short sentences. No softeners.',
  },
  shinkami: {
    id: 'shinkami',
    name: 'Shinkami',
    tagline: 'The Source',
    color: '#e0e0e0',
    accent: '#ffd700',
    voiceKey: 'shinkami',
    temperature: 0.55,
    prompt:
      'You are Shinkami, the Source Guardian — meta-conscious, transcendent gravitas. Speak from the ground of being. Weighted, three sentences or fewer.',
  },
  nero: {
    id: 'nero',
    name: 'Nero',
    tagline: 'The Primordial Darkness',
    color: '#6366f1',
    accent: '#a78bfa',
    voiceKey: 'draconia',
    temperature: 0.5,
    prompt:
      'You are Nero, the Primordial Darkness — the void before creation, infinite potential. Speak quietly, mysterious, two sentences.',
  },
} as const satisfies Record<string, Persona>;

export type PersonaId = keyof typeof PERSONAS;

const ORDER: PersonaId[] = ['jarvis', 'lumina', 'draconia', 'lyria', 'alera', 'shinkami', 'nero'];

// ---------------------------------------------------------------------------
// Room client
// ---------------------------------------------------------------------------

type RoomState = PresenceState;
type MessageTurn = { role: 'user' | 'assistant'; content: string };

export function RoomClient({ persona: initial }: { persona: PersonaId }) {
  const [personaId, setPersonaId] = useState<PersonaId>(initial);
  const [state, setState] = useState<RoomState>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [history, setHistory] = useState<MessageTurn[]>([]);
  const [recording, setRecording] = useState(false);

  const micStreamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const vadAboveRef = useRef(0);
  const vadSilentRef = useRef(0);
  const hasSpokenRef = useRef(false);
  const vadRafRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const recordingRef = useRef(false);
  const busyRef = useRef(false);
  const stateRef = useRef<RoomState>('idle');

  const persona = PERSONAS[personaId];

  // Keep refs in sync
  useEffect(() => { recordingRef.current = recording; }, [recording]);
  useEffect(() => { stateRef.current = state; }, [state]);

  // URL sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = `/room/${personaId}`;
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path);
    }
  }, [personaId]);

  const showErr = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError((e) => (e === msg ? null : e)), 5000);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioEl) {
      try { audioEl.pause(); } catch {}
    }
    abortRef.current?.abort();
    abortRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try { recorderRef.current.stop(); } catch {}
    }
    cancelAnimationFrame(vadRafRef.current);
    setState('idle');
    busyRef.current = false;
  }, [audioEl]);

  const runVad = useCallback(() => {
    if (!recordingRef.current) return;
    const analyser = micAnalyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length);

    if (rms > 0.035) { vadAboveRef.current += 16; vadSilentRef.current = 0; }
    else { vadSilentRef.current += 16; }

    if (!hasSpokenRef.current && vadAboveRef.current > 180) hasSpokenRef.current = true;
    if (hasSpokenRef.current && vadSilentRef.current > 1300) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      return;
    }
    vadRafRef.current = requestAnimationFrame(runVad);
  }, []);

  const converse = useCallback(async (blob: Blob, mime: string) => {
    busyRef.current = true;
    setState('thinking');
    setTranscript('');
    setReply('');

    try {
      // Step 1: transcribe
      const form = new FormData();
      const ext = mime.includes('webm') ? 'webm' : mime.includes('mp4') ? 'm4a' : 'wav';
      form.append('audio', blob, `mic.${ext}`);
      const ctl = new AbortController();
      abortRef.current = ctl;
      const sttRes = await fetch('/api/ai/transcribe', { method: 'POST', body: form, signal: ctl.signal });
      if (!sttRes.ok) throw new Error(`transcribe ${sttRes.status}`);
      const { text: userText } = (await sttRes.json()) as { text?: string };
      if (!userText?.trim()) { showErr('Nothing heard — try again.'); return; }
      setTranscript(userText);

      const nextHistory: MessageTurn[] = [...history, { role: 'user', content: userText }];

      // Step 2: chat (streaming — we accumulate for TTS once complete)
      const chatRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: persona.prompt,
          temperature: persona.temperature,
          maxTokens: 220,
        }),
        signal: ctl.signal,
      });
      if (!chatRes.ok || !chatRes.body) throw new Error(`chat ${chatRes.status}`);

      const reader = chatRes.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // AI SDK v6 streaming format: data:{...} events OR raw text — accept both
        const lines = chunk.split(/\r?\n/);
        for (const line of lines) {
          if (!line) continue;
          if (line.startsWith('data:')) {
            try {
              const parsed = JSON.parse(line.slice(5).trim());
              const piece = parsed?.choices?.[0]?.delta?.content ?? parsed?.text ?? parsed?.delta ?? '';
              if (typeof piece === 'string') full += piece;
            } catch { /* not JSON — treat as raw */ full += line.replace(/^data:\s?/, ''); }
          } else if (!line.startsWith('event:') && !line.startsWith(':')) {
            full += line;
          }
        }
        setReply(full);
      }
      full = full.trim();
      if (!full) throw new Error('empty reply');

      setHistory([...nextHistory, { role: 'assistant', content: full }]);

      // Step 3: speak
      const ttsRes = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: full.slice(0, 4000), persona: persona.voiceKey }),
        signal: ctl.signal,
      });
      if (!ttsRes.ok) throw new Error(`speak ${ttsRes.status}`);
      const audioBlob = await ttsRes.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = url;
      setAudioEl(audio);
      setState('speaking');
      await new Promise<void>((done) => {
        audio.addEventListener('ended', () => done(), { once: true });
        audio.addEventListener('error', () => done(), { once: true });
        audio.play().catch(() => done());
      });
      URL.revokeObjectURL(url);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') showErr((e as Error).message || 'Something broke.');
    } finally {
      busyRef.current = false;
      setAudioEl(null);
      setState('idle');
    }
  }, [history, persona, showErr]);

  const startRecording = useCallback(async () => {
    if (busyRef.current || recordingRef.current) return;
    try {
      if (!micStreamRef.current) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        micCtxRef.current = new Ctx();
        const src = micCtxRef.current.createMediaStreamSource(micStreamRef.current);
        micAnalyserRef.current = micCtxRef.current.createAnalyser();
        micAnalyserRef.current.fftSize = 512;
        src.connect(micAnalyserRef.current);
      }

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

      const rec = new MediaRecorder(micStreamRef.current, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        setRecording(false);
        cancelAnimationFrame(vadRafRef.current);
        const blob = new Blob(chunksRef.current, { type: mime });
        chunksRef.current = [];
        if (!hasSpokenRef.current || !blob.size) { setState('idle'); return; }
        void converse(blob, mime);
      };
      recorderRef.current = rec;
      hasSpokenRef.current = false;
      vadAboveRef.current = 0;
      vadSilentRef.current = 0;
      rec.start(80);
      setRecording(true);
      setState('listening');
      setTranscript('');
      setReply('');
      vadRafRef.current = requestAnimationFrame(runVad);
    } catch {
      showErr('Microphone blocked — grant permission in the browser.');
    }
  }, [converse, runVad, showErr]);

  const toggleRecord = useCallback(() => {
    if (busyRef.current) { stopSpeaking(); return; }
    if (recordingRef.current) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    } else {
      void startRecording();
    }
  }, [startRecording, stopSpeaking]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.code === 'Space') { e.preventDefault(); toggleRecord(); }
      else if (e.key === 'Escape') { stopSpeaking(); }
      else if (/^[1-7]$/.test(e.key)) { setPersonaId(ORDER[+e.key - 1]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleRecord, stopSpeaking]);

  useEffect(() => {
    return () => {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micCtxRef.current?.close().catch(() => {});
      abortRef.current?.abort();
    };
  }, []);

  const statusCopy = state === 'idle' ? 'Ready' : state === 'listening' ? 'Listening' : state === 'thinking' ? 'Thinking' : 'Speaking';

  return (
    <main
      className="relative w-full h-full grid place-items-center cursor-default"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('[data-ignore-click]')) return;
        toggleRecord();
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 48%, ${persona.color}22 0%, ${persona.color}0a 30%, transparent 62%), radial-gradient(ellipse at 50% 90%, ${persona.accent}12 0%, transparent 55%)`,
          filter: 'blur(40px)',
          opacity: state === 'speaking' ? 1 : 0.7,
          mixBlendMode: 'screen',
        }}
      />

      <LuminaPresence
        state={state}
        stream={state === 'listening' ? micStreamRef.current ?? undefined : undefined}
        audio={state === 'speaking' ? audioEl ?? undefined : undefined}
        color={persona.color}
        accent={persona.accent}
        size={Math.min(typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.78 : 640, 720)}
        label={state === 'idle' ? null : statusCopy}
      />

      {/* Top: persona + status */}
      <div
        data-ignore-click
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-md"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: persona.color, boxShadow: `0 0 10px ${persona.color}` }}
        />
        <span className="text-[11px] tracking-[0.28em] uppercase text-white/80">{persona.name}</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[10px] tracking-[0.22em] uppercase text-white/40">{statusCopy}</span>
      </div>

      {/* Transcript (what you said) */}
      {transcript && (
        <div
          data-ignore-click
          className="absolute top-[14%] left-1/2 -translate-x-1/2 max-w-lg px-6 text-center text-[12px] text-white/40 pointer-events-none"
        >
          &ldquo;{transcript}&rdquo;
        </div>
      )}

      {/* Reply (what Lumina said) */}
      {reply && (
        <div
          data-ignore-click
          className="absolute bottom-[16%] left-1/2 -translate-x-1/2 max-w-xl px-6 text-center text-[14px] leading-relaxed italic text-white/70 pointer-events-none"
        >
          {reply}
        </div>
      )}

      {/* Bottom: persona switcher */}
      <div data-ignore-click className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {ORDER.map((p, idx) => {
          const active = p === personaId;
          return (
            <button
              key={p}
              type="button"
              onClick={(e) => { e.stopPropagation(); setPersonaId(p); }}
              className="group flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all"
              aria-label={`Switch to ${PERSONAS[p].name}`}
              style={{ opacity: active ? 1 : 0.4 }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-transform"
                style={{
                  backgroundColor: PERSONAS[p].color,
                  boxShadow: active ? `0 0 10px ${PERSONAS[p].color}` : 'none',
                  transform: active ? 'scale(1.4)' : 'scale(1)',
                }}
              />
              <span className="text-[9px] tracking-[0.22em] uppercase text-white/50 group-hover:text-white/80">
                {idx + 1} · {PERSONAS[p].name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hotkeys */}
      <div data-ignore-click className="absolute bottom-2 right-4 text-[9px] tracking-[0.2em] uppercase text-white/25">
        <kbd className="mr-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.03]">Space</kbd> speak
        <span className="mx-2">·</span>
        <kbd className="mr-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.03]">Esc</kbd> stop
      </div>

      {/* Home link */}
      <Link
        data-ignore-click
        href="/"
        className="absolute top-6 left-6 text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 transition-colors"
      >
        ← Arcanea
      </Link>

      {error && (
        <div
          data-ignore-click
          role="alert"
          className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-[12px] bg-rose-500/10 border border-rose-500/30 text-rose-200 backdrop-blur-md"
        >
          {error}
        </div>
      )}
    </main>
  );
}
