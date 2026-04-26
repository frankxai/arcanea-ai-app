'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LuminaPresence, type PresenceState } from '@/components/presence/lumina-presence';
import {
  chatWithGroq,
  getStoredKeys,
  speakWithElevenLabs,
  transcribeWithGroq,
  voiceIdForPersona,
} from './browser-voice';
import { SettingsPanel } from './settings-panel';
import { PERSONAS, PERSONA_ORDER, type Persona, type PersonaId } from './personas';

// Re-export so existing `import { PERSONAS, type PersonaId } from './room-client'`
// sites keep working. The authoritative definition lives in personas.ts
// (server-safe) — see comment in that file for the reasoning.
export { PERSONAS, type Persona, type PersonaId };

const ORDER = PERSONA_ORDER;

// ---------------------------------------------------------------------------
// Room client
// ---------------------------------------------------------------------------

type RoomState = PresenceState;
type MessageTurn = { role: 'user' | 'assistant'; content: string };

type MicPermissionState = 'unknown' | 'prompt' | 'granted' | 'denied';

type RoomError = { message: string; hint?: string; cta?: 'byok' | 'retry' } | null;

export function RoomClient({ persona: initial }: { persona: PersonaId }) {
  const [personaId, setPersonaId] = useState<PersonaId>(initial);
  const [state, setState] = useState<RoomState>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<RoomError>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [history, setHistory] = useState<MessageTurn[]>([]);
  const [recording, setRecording] = useState(false);
  const [hasBYOK, setHasBYOK] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermissionState>('unknown');
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ ctxState: '—', streamTracks: 0, recorderState: '—' });
  const [viaClap, setViaClap] = useState(false);
  const [tenantId, setTenantId] = useState<string>('arcanea');
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null);

  const micStreamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const vadAboveRef = useRef(0);
  const vadSilentRef = useRef(0);
  const hasSpokenRef = useRef(false);
  const vadRafRef = useRef(0);
  const bargeRafRef = useRef(0);
  const bargeAboveRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const recordingRef = useRef(false);
  const busyRef = useRef(false);
  const stateRef = useRef<RoomState>('idle');
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const latencyT0Ref = useRef(0);

  const logStage = useCallback((name: string) => {
    const now = performance.now();
    const total = latencyT0Ref.current ? Math.round(now - latencyT0Ref.current) : 0;
    // eslint-disable-next-line no-console
    console.log(`[VOICE] ${name.padEnd(18)} total=${total}ms`);
  }, []);

  const persona = PERSONAS[personaId];

  // Keep refs in sync
  useEffect(() => { recordingRef.current = recording; }, [recording]);
  useEffect(() => { stateRef.current = state; }, [state]);

  // BYOK: detect stored keys on mount
  useEffect(() => {
    const k = getStoredKeys();
    setHasBYOK(Boolean(k.groq || k.eleven));
  }, []);

  // Day 1 fixes: permission gate + debug + via=clap detection
  // Daemon-launched windows live in a fresh Chromium profile (--user-data-dir
  // ~/.arcanea/voice-room). Without an upfront permission check, getUserMedia
  // rejects silently inside startRecording() and the user thinks Space is
  // broken. Detect early and surface state.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setViaClap(params.get('via') === 'clap-daemon');
    setDebugMode(params.get('debug') === '1');
    const t = params.get('tenant');
    if (t && /^[a-z][a-z0-9-]{0,30}$/.test(t)) setTenantId(t);
    // Try to focus the window — daemon-launched app-window may lack focus.
    try { window.focus(); } catch {}
    // Permissions API isn't on Safari; fall back to 'unknown'.
    if (!navigator.permissions || typeof navigator.permissions.query !== 'function') {
      setMicPermission('unknown');
      return;
    }
    let cancelled = false;
    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((status) => {
        if (cancelled) return;
        const map: Record<string, MicPermissionState> = {
          granted: 'granted',
          prompt: 'prompt',
          denied: 'denied',
        };
        setMicPermission(map[status.state] ?? 'unknown');
        status.onchange = () => {
          if (!cancelled) setMicPermission(map[status.state] ?? 'unknown');
        };
      })
      .catch(() => {
        if (!cancelled) setMicPermission('unknown');
      });
    return () => { cancelled = true; };
  }, []);

  // Debug overlay refresh
  useEffect(() => {
    if (!debugMode) return;
    const id = window.setInterval(() => {
      setDebugInfo({
        ctxState: micCtxRef.current?.state ?? '—',
        streamTracks: micStreamRef.current?.getAudioTracks().length ?? 0,
        recorderState: recorderRef.current?.state ?? '—',
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [debugMode]);

  // Eagerly request mic on mount when arriving via clap (i.e. daemon-launched
  // app-window). The clap itself counts as a user gesture in Chrome's view of
  // the originating tab, but daemon spawn is out-of-process so the gesture
  // doesn't transfer. We still request on mount because:
  //   - if granted in this profile, no prompt fires (silent success)
  //   - if 'prompt', the permission dialog renders immediately so user
  //     doesn't have to discover Space first
  // Stream is held in micStreamRef so first Space press skips the await.
  const primeMic = useCallback(async (): Promise<boolean> => {
    if (micStreamRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      micStreamRef.current = stream;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      micCtxRef.current = new Ctx();
      // Probe #3 fix: AudioContext starts suspended on Chrome's autoplay
      // policy. Resume explicitly before reading samples.
      if (micCtxRef.current.state === 'suspended') {
        try { await micCtxRef.current.resume(); } catch {}
      }
      const src = micCtxRef.current.createMediaStreamSource(stream);
      micAnalyserRef.current = micCtxRef.current.createAnalyser();
      micAnalyserRef.current.fftSize = 512;
      src.connect(micAnalyserRef.current);
      setMicPermission('granted');
      // eslint-disable-next-line no-console
      console.log('[VOICE] mic primed — ctx=' + micCtxRef.current.state + ' tracks=' + stream.getAudioTracks().length);
      return true;
    } catch (e) {
      const err = e as DOMException;
      // eslint-disable-next-line no-console
      console.warn('[VOICE] mic prime failed:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermission('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        setError({ message: 'No microphone found.' });
      }
      return false;
    }
  }, []);

  // Auto-prime on mount when permission is already granted, OR after the user
  // taps the activation overlay.
  useEffect(() => {
    if (micPermission === 'granted' && !micStreamRef.current) {
      void primeMic();
    }
  }, [micPermission, primeMic]);

  // Day 2: Premium activation greeting. Only fires when arriving via clap.
  // Autoplay works because the clap → window-spawn is treated as a user
  // gesture by Chrome in app-window mode. Falls back to a no-op if the audio
  // element rejects play() (NotAllowedError) — the activation overlay still
  // primes mic, so the user gets a working session either way.
  useEffect(() => {
    if (!viaClap || greetingPlayed) return;
    if (typeof window === 'undefined') return;
    const audio = new Audio(`/api/voice/greeting?persona=${personaId}&tenant=${tenantId}`);
    audio.preload = 'auto';
    greetingAudioRef.current = audio;
    setGreetingPlayed(true);
    // Tiny delay lets the BR2049 haze fade-in start first — the orb is mounted
    // by then and reactive elements are in place.
    const t = window.setTimeout(() => {
      audio.play().catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('[VOICE] greeting autoplay blocked:', e?.name || 'unknown');
      });
    }, 350);
    return () => {
      window.clearTimeout(t);
      try { audio.pause(); } catch {}
      greetingAudioRef.current = null;
    };
    // We deliberately ignore personaId/tenantId changes after first play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = `/room/${personaId}`;
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path);
    }
  }, [personaId]);

  const showErr = useCallback((errOrMsg: string | RoomError) => {
    const next: RoomError = typeof errOrMsg === 'string' ? { message: errOrMsg } : errOrMsg;
    setError(next);
    // Sticky errors with a CTA stay until dismissed; transient errors auto-clear.
    if (!next?.cta) {
      setTimeout(() => setError((e) => (e?.message === next?.message ? null : e)), 5000);
    }
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
    if (hasSpokenRef.current && vadSilentRef.current > 900) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      return;
    }
    vadRafRef.current = requestAnimationFrame(runVad);
  }, []);

  const converse = useCallback(async (blob: Blob, mime: string) => {
    busyRef.current = true;
    latencyT0Ref.current = performance.now();
    logStage('mic_stop');
    setState('thinking'); setTranscript(''); setReply('');
    const ctl = new AbortController();
    abortRef.current = ctl;
    try {
      const keys = getStoredKeys();
      const ext = mime.includes('webm') ? 'webm' : mime.includes('mp4') ? 'm4a' : 'wav';

      // 1 — transcribe
      let userText: string;
      if (keys.groq) {
        userText = (await transcribeWithGroq(blob, keys.groq)).trim();
      } else {
        const form = new FormData();
        form.append('audio', blob, `mic.${ext}`);
        const r = await fetch('/api/ai/transcribe', { method: 'POST', body: form, signal: ctl.signal });
        if (!r.ok) {
          // Parse structured error so we can surface a Connect-voice CTA on 503/502.
          const payload = await r.json().catch(() => null) as
            | { error?: string; hint?: string; cta?: 'byok' | 'retry' }
            | null;
          const cta = payload?.cta;
          const msg = payload?.error ?? `transcribe ${r.status}`;
          const hint = payload?.hint;
          if (cta === 'byok') {
            showErr({ message: msg, hint, cta: 'byok' });
          } else {
            showErr({ message: msg, hint });
          }
          return;
        }
        userText = ((await r.json()) as { text?: string }).text?.trim() ?? '';
      }
      if (!userText) { showErr('Nothing heard — try again.'); return; }
      setTranscript(userText);

      const nextHistory: MessageTurn[] = [...history, { role: 'user', content: userText }];

      // 2 — chat
      let full: string;
      if (keys.groq) {
        full = await chatWithGroq({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: persona.prompt, apiKey: keys.groq,
          temperature: persona.temperature, maxTokens: 220,
        });
        setReply(full);
      } else {
        const chatRes = await fetch('/api/ai/chat', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: nextHistory.map((m) => ({ role: m.role, content: m.content })), systemPrompt: persona.prompt, temperature: persona.temperature, maxTokens: 220 }),
          signal: ctl.signal,
        });
        if (!chatRes.ok || !chatRes.body) throw new Error(`chat ${chatRes.status}`);
        const reader = chatRes.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split(/\r?\n/)) {
            if (!line) continue;
            if (line.startsWith('data:')) {
              try { const p = JSON.parse(line.slice(5).trim()); const piece = p?.choices?.[0]?.delta?.content ?? p?.text ?? p?.delta ?? ''; if (typeof piece === 'string') acc += piece; }
              catch { acc += line.replace(/^data:\s?/, ''); }
            } else if (!line.startsWith('event:') && !line.startsWith(':')) { acc += line; }
          }
          setReply(acc);
        }
        full = acc.trim();
      }

      if (!full) throw new Error('empty reply');
      setHistory([...nextHistory, { role: 'assistant', content: full }]);

      // 3 — speak
      let audioBlob: Blob;
      if (keys.eleven) {
        audioBlob = await speakWithElevenLabs({ text: full.slice(0, 4000), voiceId: voiceIdForPersona(persona.voiceKey), apiKey: keys.eleven });
      } else {
        const ttsRes = await fetch('/api/ai/speak', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: full.slice(0, 4000), persona: persona.voiceKey }),
          signal: ctl.signal,
        });
        if (!ttsRes.ok) throw new Error(`speak ${ttsRes.status}`);
        audioBlob = await ttsRes.blob();
      }

      logStage('tts_ready');
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.crossOrigin = 'anonymous'; audio.src = url;
      audioElRef.current = audio;
      setAudioEl(audio); setState('speaking');

      // Barge-in: if the user starts speaking while the agent speaks, pause,
      // abort the pipeline, and kick a new recording.
      const bargeTick = () => {
        const a = audioElRef.current;
        const analyser = micAnalyserRef.current;
        if (!a || a.paused || a.ended || !analyser) return;
        const buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.045) bargeAboveRef.current += 16;
        else bargeAboveRef.current = Math.max(0, bargeAboveRef.current - 24);
        if (bargeAboveRef.current > 150) {
          try { a.pause(); } catch {}
          abortRef.current?.abort();
          return;
        }
        bargeRafRef.current = requestAnimationFrame(bargeTick);
      };
      bargeAboveRef.current = 0;
      bargeRafRef.current = requestAnimationFrame(bargeTick);

      await new Promise<void>((done) => {
        audio.addEventListener('ended', () => done(), { once: true });
        audio.addEventListener('error', () => done(), { once: true });
        audio.addEventListener('pause', () => done(), { once: true });
        audio.play().catch(() => done());
      });
      cancelAnimationFrame(bargeRafRef.current);
      logStage('audio_done');
      URL.revokeObjectURL(url);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') showErr((e as Error).message || 'Something broke.');
    } finally {
      busyRef.current = false;
      audioElRef.current = null;
      setAudioEl(null);
      setState('idle');
    }
  }, [history, persona, showErr, logStage]);

  const startRecording = useCallback(async () => {
    if (busyRef.current || recordingRef.current) return;
    try {
      if (!micStreamRef.current) {
        const ok = await primeMic();
        if (!ok) {
          showErr('Microphone blocked — grant permission in the browser.');
          return;
        }
      }
      // Probe #3 fix: even if context exists, it can transition back to
      // 'suspended' on tab visibility change. Always resume before recording.
      if (micCtxRef.current && micCtxRef.current.state === 'suspended') {
        try { await micCtxRef.current.resume(); } catch {}
      }

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

      const stream = micStreamRef.current;
      if (!stream) {
        showErr('Microphone unavailable.');
        return;
      }
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        setRecording(false);
        cancelAnimationFrame(vadRafRef.current);
        const blob = new Blob(chunksRef.current, { type: mime });
        chunksRef.current = [];
        // eslint-disable-next-line no-console
        console.log(`[VOICE] blob bytes=${blob.size} hasSpoken=${hasSpokenRef.current}`);
        if (!blob.size) { setState('idle'); return; }
        if (blob.size < 4000) {
          showErr('Too short — hold Space and speak for at least half a second.');
          setState('idle');
          return;
        }
        if (!hasSpokenRef.current) {
          showErr('No speech detected — check mic or speak louder.');
          setState('idle');
          return;
        }
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
  }, [converse, runVad, showErr, primeMic]);

  const toggleRecord = useCallback(() => {
    if (busyRef.current) { stopSpeaking(); return; }
    if (recordingRef.current) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    } else {
      void startRecording();
    }
  }, [startRecording, stopSpeaking]);

  useEffect(() => {
    // Hybrid Space: tap = VAD-auto-stop, hold = push-to-talk. e.repeat guard
    // prevents OS autorepeat from thrashing record start/stop (the root cause
    // of the original "nothing heard" bug).
    let spaceDownAt = 0;
    let spaceHeldTriggeredRecord = false;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return;
        spaceDownAt = performance.now();
        setHasInteracted(true);
        if (!recordingRef.current && !busyRef.current) {
          spaceHeldTriggeredRecord = true;
          void startRecording();
        } else {
          spaceHeldTriggeredRecord = false;
        }
      } else if (e.key === 'Escape') { stopSpeaking(); }
      else if (/^[1-7]$/.test(e.key)) { setPersonaId(ORDER[+e.key - 1]); }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const heldMs = performance.now() - spaceDownAt;
      if (spaceHeldTriggeredRecord && heldMs >= 200 && recordingRef.current) {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
      }
      spaceDownAt = 0;
      spaceHeldTriggeredRecord = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [startRecording, stopSpeaking]);

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
        if (!hasInteracted) setHasInteracted(true);
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

      {/* Top: persona + status (refined) */}
      <div
        data-ignore-click
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ top: 'max(2rem, env(safe-area-inset-top, 0px))' }}
      >
        <div
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-md"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: persona.color, boxShadow: `0 0 10px ${persona.color}` }}
          />
          <span className="text-[11px] tracking-[0.32em] uppercase text-white/85">{persona.name}</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="text-[10px] tracking-[0.24em] uppercase text-white/45">{statusCopy}</span>
          <span className="w-px h-3 bg-white/10" />
          <span
            className="text-[9px] tracking-[0.22em] uppercase px-1.5 py-0.5 rounded"
            style={hasBYOK
              ? { backgroundColor: 'rgba(0,188,212,0.15)', color: '#7feaff', border: '1px solid rgba(0,188,212,0.3)' }
              : { backgroundColor: 'rgba(255,191,0,0.12)', color: '#ffd070', border: '1px solid rgba(255,191,0,0.25)' }}
          >
            {hasBYOK ? 'BYOK' : 'Hosted'}
          </span>
        </div>
        {state === 'idle' && (
          <p
            className="text-[13px] italic text-white/35 tracking-[0.01em] transition-opacity duration-500"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            {persona.tagline}
          </p>
        )}
      </div>

      {/* Transcript (what you said) — softer, italic, slightly larger */}
      {transcript && (
        <div
          data-ignore-click
          className="absolute top-[18%] left-1/2 -translate-x-1/2 max-w-md px-6 text-center text-[14px] italic leading-relaxed text-white/45 pointer-events-none"
          style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
        >
          &ldquo;{transcript}&rdquo;
        </div>
      )}

      {/* Reply (what the persona said) — editorial serif, generous */}
      {reply && (
        <div
          data-ignore-click
          className="absolute bottom-[22%] left-1/2 -translate-x-1/2 max-w-2xl px-8 text-center pointer-events-none"
        >
          <p
            className="text-[20px] sm:text-[22px] leading-[1.55] text-white/85 tracking-[0.005em]"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            {reply}
          </p>
        </div>
      )}

      {/* Idle hint — only before any interaction, fades out once user engages */}
      {state === 'idle' && !transcript && !reply && !hasInteracted && (
        <div
          data-ignore-click
          className="absolute bottom-[34%] left-1/2 -translate-x-1/2 text-center pointer-events-none animate-pulse"
          style={{ animationDuration: '3.6s' }}
        >
          <span
            className="text-[11px] tracking-[0.36em] uppercase text-white/30"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            tap or hold space to speak
          </span>
        </div>
      )}

      {/* Bottom: persona switcher — larger touch targets, named */}
      <div
        data-ignore-click
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-2 rounded-2xl bg-white/[0.025] border border-white/[0.05] backdrop-blur-md"
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {ORDER.map((p, idx) => {
          const active = p === personaId;
          const pColor = PERSONAS[p].color;
          return (
            <button
              key={p}
              type="button"
              onClick={(e) => { e.stopPropagation(); setPersonaId(p); }}
              className="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all min-w-[56px]"
              aria-label={`Switch to ${PERSONAS[p].name}`}
              aria-pressed={active}
              style={{
                cursor: 'pointer',
                background: active ? `${pColor}14` : 'transparent',
                opacity: active ? 1 : 0.55,
              }}
            >
              <span
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: pColor,
                  boxShadow: active ? `0 0 14px ${pColor}, 0 0 4px ${pColor}` : `0 0 4px ${pColor}40`,
                  transform: active ? 'scale(1.25)' : 'scale(1)',
                }}
              />
              <span
                className="text-[10px] tracking-[0.24em] uppercase transition-colors"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {PERSONAS[p].name}
              </span>
              <span
                className="text-[8px] tracking-[0.22em] uppercase text-white/25"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hotkey pill — glass, safe-area aware */}
      <div
        data-ignore-click
        className="absolute hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.05] backdrop-blur-md text-[10px] tracking-[0.18em] uppercase text-white/35"
        style={{
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
          right: 'max(1.5rem, env(safe-area-inset-right, 0px))',
          fontFamily: 'var(--font-display)',
        }}
      >
        <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/60">Space</kbd>
        <span className="text-white/30">speak</span>
        <span className="w-px h-3 bg-white/10" />
        <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/60">Esc</kbd>
        <span className="text-white/30">stop</span>
      </div>

      {/* Home link */}
      <Link
        data-ignore-click
        href="/"
        className="absolute text-[10px] tracking-[0.24em] uppercase text-white/30 hover:text-white/70 transition-colors"
        style={{
          top: 'max(1.5rem, env(safe-area-inset-top, 0px))',
          left: 'max(1.5rem, env(safe-area-inset-left, 0px))',
          fontFamily: 'var(--font-display)',
        }}
      >
        ← Arcanea
      </Link>

      {/* BYOK settings gear (controlled) */}
      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onKeysChanged={() => {
          const k = getStoredKeys();
          setHasBYOK(Boolean(k.groq || k.eleven));
        }}
      />

      {/* Error — sticky with action when cta exists, transient otherwise */}
      {error && (
        <div
          data-ignore-click
          role="alert"
          className="absolute top-[22%] left-1/2 -translate-x-1/2 max-w-md w-[min(92vw,28rem)] px-5 py-4 rounded-2xl bg-rose-950/40 border border-rose-400/20 text-rose-100 backdrop-blur-xl shadow-[0_8px_32px_rgba(244,63,94,0.15)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <p className="text-[12px] tracking-[0.04em] leading-relaxed">{error.message}</p>
          {error.hint && (
            <p className="mt-1.5 text-[11px] text-rose-200/60 leading-relaxed">{error.hint}</p>
          )}
          {error.cta === 'byok' && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); setError(null); }}
                className="px-3 py-1.5 rounded-lg text-[11px] tracking-[0.18em] uppercase font-medium transition-colors"
                style={{
                  background: 'rgba(0,188,212,0.18)',
                  color: '#7feaff',
                  border: '1px solid rgba(0,188,212,0.35)',
                  cursor: 'pointer',
                }}
              >
                Connect voice
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setError(null); }}
                className="px-3 py-1.5 rounded-lg text-[11px] tracking-[0.18em] uppercase text-rose-200/60 hover:text-rose-100 border border-white/[0.06] transition-colors"
                style={{ cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Permission activation overlay — only renders when via=clap-daemon and
          mic permission is not granted. Single tap primes the mic + AudioContext
          inside a fresh user gesture, which Chrome's autoplay policy needs. */}
      {viaClap && (micPermission === 'prompt' || micPermission === 'unknown' || micPermission === 'denied') && !micStreamRef.current && (
        <div
          data-ignore-click
          className="absolute inset-0 z-30 grid place-items-center bg-black/40 backdrop-blur-md cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            void primeMic();
          }}
        >
          <div className="text-center px-8 max-w-md">
            <div
              className="mx-auto mb-6 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: persona.color, boxShadow: `0 0 24px ${persona.color}` }}
            />
            <h2 className="text-[14px] tracking-[0.32em] uppercase text-white/90" style={{ fontFamily: 'var(--font-display)' }}>
              {persona.name} is ready
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-white/60">
              {micPermission === 'denied'
                ? 'Microphone is blocked in this profile. Click the lock icon → Site settings → allow Microphone, then tap to retry.'
                : 'Tap anywhere to activate. Grant microphone access when prompted.'}
            </p>
            <p className="mt-6 text-[10px] tracking-[0.22em] uppercase text-white/30">
              Tap → speak → reply
            </p>
          </div>
        </div>
      )}

      {/* Debug overlay — ?debug=1 */}
      {debugMode && (
        <div
          data-ignore-click
          className="absolute top-4 right-4 z-40 px-3 py-2 rounded-lg text-[10px] font-mono bg-black/60 border border-white/10 text-emerald-300 backdrop-blur-md"
        >
          <div>mic={micPermission}</div>
          <div>ctx={debugInfo.ctxState}</div>
          <div>tracks={debugInfo.streamTracks}</div>
          <div>recorder={debugInfo.recorderState}</div>
          <div>via={viaClap ? 'clap-daemon' : 'direct'}</div>
        </div>
      )}
    </main>
  );
}
