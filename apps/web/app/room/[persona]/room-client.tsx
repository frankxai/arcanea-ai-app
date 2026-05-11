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

// Cognition bridge — when the room runs on the local cockpit (next dev at
// :3000 alongside SIS voice-operator at :7373), the chat round-trip can
// route through voice-operator instead of /api/ai/chat. Gives access to the
// dispatch fleet (claude/codex/gemini/opencode), packet logging, and the
// approval gate. Activated by ?via=local in the URL; falls back silently
// to cloud chat when the bridge GET probe says it's not configured.
type CognitionPacket = {
  intent?: string;
  target_system?: string;
  approval_tier?: 'A' | 'B' | 'C';
  approval_required?: boolean;
  packet_id?: string;
};

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
  const [micArmed, setMicArmed] = useState(true);
  const [briefing, setBriefing] = useState<string>('');
  const [viaLocal, setViaLocal] = useState(false);
  const [bridgeAvailable, setBridgeAvailable] = useState(false);
  const [packet, setPacket] = useState<CognitionPacket | null>(null);
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null);
  // useBridge is derived — local mode + bridge configured server-side.
  const useBridge = viaLocal && bridgeAvailable;

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
    const viaParam = params.get('via');
    setViaClap(viaParam === 'clap-daemon');
    // ?via=local routes chat through SIS voice-operator bridge instead of
    // cloud /api/ai/chat. Falls back to cloud if /api/voice/cognition GET
    // probe reports bridge_configured:false. clap-daemon also implies local.
    setViaLocal(viaParam === 'local' || viaParam === 'clap-daemon');
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

  // Daily briefing — fetched once per session for situational awareness.
  // The route runs Node-side (not edge) so it has git + filesystem access in
  // local dev. On Vercel it returns a remote-mode placeholder. Either way the
  // result is prepended to the persona's system prompt at chat time so the
  // model can answer "what was I working on" without tool calls.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/voice/briefing', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { brief?: string } | null) => {
        if (cancelled || !data?.brief) return;
        setBriefing(data.brief);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Bridge probe — fires once on mount, regardless of via=local, so we can
  // upgrade the user from cloud chat to bridge chat the moment they flip the
  // URL flag. GET is cheap (server reads one env var) and result is cached.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/voice/cognition', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { bridge_configured?: boolean } | null) => {
        if (cancelled) return;
        setBridgeAvailable(Boolean(data?.bridge_configured));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Compose the system prompt at call time: briefing block (if any) +
  // persona instructions. Briefing first because it grounds the model in
  // *current* state; persona second because behavioral rules win on conflict.
  const composeSystemPrompt = useCallback(() => {
    if (!briefing) return persona.prompt;
    return `${briefing}\n\n---\n\n${persona.prompt}`;
  }, [briefing, persona.prompt]);

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
      const systemPrompt = composeSystemPrompt();
      // Jarvis persona gets server-side live tools (system_status, git_today,
      // open PRs, repo search, file reads, brand brief). The BYOK Groq path
      // hits Groq direct and skips them — those users get persona reasoning
      // only. Inline [OPEN: url] markers handle browser actions on both paths.
      const enabledTools = persona.id === 'jarvis' ? ['jarvis'] : undefined;
      // Bridge mode wins over both cloud paths when ?via=local is set AND
      // /api/voice/cognition reports the bridge is configured. SIS voice-
      // operator owns cognition + dispatch; the room just renders + speaks.
      if (useBridge) {
        const cogRes = await fetch('/api/voice/cognition', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: userText, persona: persona.id, source: 'arcanea-room' }),
          signal: ctl.signal,
        });
        if (!cogRes.ok) {
          const payload = await cogRes.json().catch(() => null) as
            | { error?: string; hint?: string; cta?: 'no-bridge' | 'retry' | 'auth' }
            | null;
          showErr({
            message: payload?.error ?? `cognition ${cogRes.status}`,
            hint: payload?.hint ?? 'Falling back to cloud chat would help — drop ?via=local from the URL.',
          });
          return;
        }
        const cog = (await cogRes.json()) as {
          text?: string;
          intent?: string;
          target_system?: string;
          approval_tier?: 'A' | 'B' | 'C';
          approval_required?: boolean;
          packet_id?: string;
        };
        full = (cog.text ?? '').trim();
        setReply(full);
        setPacket({
          intent: cog.intent,
          target_system: cog.target_system,
          approval_tier: cog.approval_tier,
          approval_required: cog.approval_required,
          packet_id: cog.packet_id,
        });
      } else if (keys.groq) {
        full = await chatWithGroq({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt, apiKey: keys.groq,
          temperature: persona.temperature, maxTokens: 240,
        });
        setReply(full);
      } else {
        const chatRes = await fetch('/api/ai/chat', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
            systemPrompt,
            temperature: persona.temperature,
            maxTokens: 240,
            ...(enabledTools ? { enabledTools } : {}),
          }),
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
              const body = line.slice(5).trim();
              if (!body || body === '[DONE]') continue;
              try {
                const p = JSON.parse(body);
                if (p?.type && !['text-delta'].includes(p.type) &&
                    p?.choices === undefined && p?.text === undefined) {
                  continue;
                }
                const piece = p?.choices?.[0]?.delta?.content ?? p?.text ?? p?.delta ?? '';
                if (typeof piece === 'string') acc += piece;
              } catch { acc += body; }
            } else if (!line.startsWith('event:') && !line.startsWith(':')) { acc += line; }
          }
          setReply(acc);
        }
        full = acc.trim();
      }

      if (!full) throw new Error('empty reply');

      // Parse inline action markers — currently only [OPEN: url] is supported.
      // Pattern: [OPEN: https://arcanea.ai] or [OPEN:https://arcanea.ai].
      // Execute browser-side, strip from displayed reply + TTS payload so the
      // model never speaks "open square bracket open colon".
      const actionRe = /\[OPEN:\s*(https?:\/\/[^\s\]]+)\s*\]/gi;
      const urls = Array.from(full.matchAll(actionRe), (m) => m[1]);
      if (urls.length > 0) {
        for (const url of urls) {
          try {
            window.open(url, '_blank', 'noopener,noreferrer');
            // eslint-disable-next-line no-console
            console.log('[VOICE] opened', url);
          } catch (e) {
            console.warn('[VOICE] window.open failed', e);
          }
        }
        full = full.replace(actionRe, '').replace(/\s{2,}/g, ' ').trim();
        setReply(full);
      }

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
  }, [history, persona, showErr, logStage, composeSystemPrompt, useBridge]);

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

  // Mic disarm: a hard switch the user can flip when they want quiet. Stops any
  // active recording immediately, prevents new ones, and keeps Space/click
  // inert until re-armed. Speech playback still finishes — disarming is about
  // input, not output.
  const toggleMicArmed = useCallback(() => {
    setMicArmed((prev) => {
      const next = !prev;
      if (!next && recorderRef.current && recorderRef.current.state !== 'inactive') {
        try { recorderRef.current.stop(); } catch {}
      }
      return next;
    });
  }, []);

  const toggleRecord = useCallback(() => {
    if (!micArmed) {
      showErr({
        message: 'Mic is off.',
        hint: 'Tap MIC at the top — or press M — to enable.',
      });
      return;
    }
    if (busyRef.current) { stopSpeaking(); return; }
    if (recordingRef.current) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    } else {
      void startRecording();
    }
  }, [startRecording, stopSpeaking, micArmed, showErr]);

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
        if (!micArmed) return;
        if (!recordingRef.current && !busyRef.current) {
          spaceHeldTriggeredRecord = true;
          void startRecording();
        } else {
          spaceHeldTriggeredRecord = false;
        }
      } else if (e.key === 'Escape') { stopSpeaking(); }
      else if (e.key === 'm' || e.key === 'M') { toggleMicArmed(); }
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
  }, [startRecording, stopSpeaking, micArmed, toggleMicArmed]);

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
          opacity: state === 'speaking' ? 1 : (micArmed ? 0.7 : 0.32),
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
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }}
            className="text-[9px] tracking-[0.22em] uppercase px-1.5 py-0.5 rounded transition-colors pointer-events-auto cursor-pointer"
            style={hasBYOK
              ? { backgroundColor: 'rgba(0,188,212,0.15)', color: '#7feaff', border: '1px solid rgba(0,188,212,0.3)' }
              : { backgroundColor: 'rgba(255,191,0,0.12)', color: '#ffd070', border: '1px solid rgba(255,191,0,0.25)' }}
            aria-label={hasBYOK ? 'Voice keys connected — open settings' : 'Connect voice keys'}
          >
            {hasBYOK ? 'BYOK' : 'Connect voice'}
          </button>
          <span className="w-px h-3 bg-white/10" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleMicArmed(); }}
            className="text-[9px] tracking-[0.22em] uppercase px-2 py-0.5 rounded-md transition-all pointer-events-auto cursor-pointer flex items-center gap-1.5"
            style={micArmed
              ? { color: '#a7f3d0', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.28)' }
              : { color: '#fda4af', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)' }}
            aria-label={micArmed ? 'Mute microphone (press M)' : 'Unmute microphone (press M)'}
            aria-pressed={!micArmed}
            title="Press M to toggle"
          >
            <span
              className={micArmed ? 'animate-pulse' : ''}
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: micArmed ? '#22c55e' : '#ef4444',
                boxShadow: micArmed ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
              }}
              aria-hidden
            />
            {micArmed ? 'Mic' : 'Off'}
          </button>
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

      {/* Idle hint — only before any interaction, fades out once user engages.
          Three states: mic disarmed → re-enable hint; BYOK missing → connect
          voice CTA; everything ready → canonical speak prompt. After keys land
          in localStorage (or hosted keys ship), the hint reverts to the
          canonical speak prompt. */}
      {state === 'idle' && !transcript && !reply && !hasInteracted && (
        <div
          data-ignore-click
          className="absolute bottom-[34%] left-1/2 -translate-x-1/2 text-center animate-pulse"
          style={{ animationDuration: '3.6s' }}
        >
          {!micArmed ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMicArmed(); }}
              className="px-4 py-2 rounded-full text-[11px] tracking-[0.32em] uppercase transition-colors pointer-events-auto cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                color: '#fda4af',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              Mic off — tap to enable
            </button>
          ) : hasBYOK ? (
            <span
              className="text-[11px] tracking-[0.36em] uppercase text-white/30 pointer-events-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              tap or hold space to speak
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }}
              className="px-4 py-2 rounded-full text-[11px] tracking-[0.32em] uppercase transition-colors pointer-events-auto cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                color: '#7feaff',
                background: 'rgba(0,188,212,0.10)',
                border: '1px solid rgba(0,188,212,0.28)',
                boxShadow: '0 0 24px rgba(0,188,212,0.10)',
              }}
            >
              Connect voice to speak
            </button>
          )}
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

      {/* Bridge indicator — shows when cognition is going through SIS voice-
          operator instead of cloud /api/ai/chat. Static chip when idle (just
          identifies the path); expands with packet metadata once a turn lands. */}
      {useBridge && (
        <div
          data-ignore-click
          className="absolute flex flex-col items-end gap-1 pointer-events-none"
          style={{
            top: 'max(1.5rem, env(safe-area-inset-top, 0px))',
            right: 'max(1.5rem, env(safe-area-inset-right, 0px))',
            fontFamily: 'var(--font-display)',
          }}
        >
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-md">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--arc-brand-atlantean-teal)', boxShadow: '0 0 8px var(--arc-brand-atlantean-teal)' }}
            />
            <span className="text-[10px] tracking-[0.24em] uppercase text-white/70">Local · SIS</span>
          </div>
          {packet && (packet.intent || packet.target_system || packet.approval_tier) && (
            <div
              className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-md text-right"
              style={{ minWidth: '11rem' }}
            >
              {packet.intent && (
                <div className="text-[9px] tracking-[0.22em] uppercase text-white/40">
                  intent <span className="text-white/80">{packet.intent}</span>
                </div>
              )}
              {packet.target_system && (
                <div className="mt-0.5 text-[9px] tracking-[0.22em] uppercase text-white/40">
                  target <span className="text-white/80">{packet.target_system}</span>
                </div>
              )}
              {packet.approval_tier && (
                <div className="mt-0.5 text-[9px] tracking-[0.22em] uppercase text-white/40">
                  tier{' '}
                  <span
                    className="px-1 py-px rounded"
                    style={{
                      color: packet.approval_required ? 'var(--arc-brand-arcanean-gold)' : 'var(--arc-text-primary)',
                      background: packet.approval_required ? 'rgba(255,191,0,0.12)' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {packet.approval_tier}{packet.approval_required ? ' · approval' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
        <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/60">M</kbd>
        <span className="text-white/30">mute</span>
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
