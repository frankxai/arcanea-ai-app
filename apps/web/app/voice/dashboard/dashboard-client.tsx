'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  type ClapDetector,
  type MicSession,
  type SessionLogEntry,
  appendSessionLog,
  createClapDetector,
  listAudioDevices,
  openMic,
  readRms,
  readSessionLog,
} from './audio-utils';

/* ------------------------------------------------------------------ */
/*  Personas — mirrors packages/arcanea-voice/src/persona.mjs          */
/* ------------------------------------------------------------------ */

interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  color: string;
  accent: string;
}

type PersonaId = 'jarvis' | 'lumina' | 'draconia' | 'lyria' | 'alera' | 'shinkami' | 'nero';

const PERSONAS: Persona[] = [
  { id: 'lumina', name: 'Lumina', tagline: 'The First Light', color: '#ffd700', accent: '#00bcd4' },
  { id: 'jarvis', name: 'JARVIS', tagline: 'Just A Rather Very Intelligent System', color: '#7fdfff', accent: '#ffffff' },
  { id: 'draconia', name: 'Draconia', tagline: 'Guardian of Fire', color: '#ef4444', accent: '#ffd700' },
  { id: 'lyria', name: 'Lyria', tagline: 'Guardian of Sight', color: '#a78bfa', accent: '#ffffff' },
  { id: 'alera', name: 'Alera', tagline: 'Guardian of Voice', color: '#00bcd4', accent: '#ffffff' },
  { id: 'shinkami', name: 'Shinkami', tagline: 'The Source', color: '#e0e0e0', accent: '#ffd700' },
  { id: 'nero', name: 'Nero', tagline: 'The Primordial Darkness', color: '#6366f1', accent: '#a78bfa' },
];

type ActivationMode = 'click' | 'voice' | 'clap';

const ACTIVATION_MODES: { id: ActivationMode; label: string; hint: string }[] = [
  { id: 'click', label: 'Click', hint: 'Click a persona to summon' },
  { id: 'voice', label: 'Voice activation', hint: 'Mic on, threshold-triggered (coming)' },
  { id: 'clap', label: 'Double clap', hint: 'Two claps within 600ms summon the selected persona' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VoiceDashboardClient() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('lumina');
  const [activation, setActivation] = useState<ActivationMode>('click');
  const [micDeviceId, setMicDeviceId] = useState<string>('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [clapCount, setClapCount] = useState(0);
  const [lastClapAt, setLastClapAt] = useState<number | null>(null);
  const [sessionLog, setSessionLog] = useState<SessionLogEntry[]>([]);
  const [peakThreshold, setPeakThreshold] = useState(0.18);
  const [error, setError] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);

  const sessionRef = useRef<MicSession | null>(null);
  const detectorRef = useRef<ClapDetector | null>(null);
  const rafRef = useRef<number | null>(null);
  const selectedRef = useRef<PersonaId>('lumina');

  // Keep ref in sync so the detector closure always uses the latest selection.
  useEffect(() => {
    selectedRef.current = selectedPersona;
  }, [selectedPersona]);

  /* Load session log + initial devices */
  useEffect(() => {
    setSessionLog(readSessionLog());
    listAudioDevices()
      .then(({ inputs, outputs }) => {
        setInputDevices(inputs);
        setOutputDevices(outputs);
      })
      .catch(() => setError('Microphone permission required to list devices.'));
  }, []);

  const launchPersona = useCallback(
    (id: PersonaId, trigger: 'click' | 'clap' | 'voice') => {
      const entry: SessionLogEntry = { persona: id, startedAt: Date.now(), trigger };
      appendSessionLog(entry);
      setSessionLog((prev) => [entry, ...prev].slice(0, 20));
      window.location.href = `/room/${id}`;
    },
    [],
  );

  /* Mic + clap detection lifecycle */
  useEffect(() => {
    const wantsMic = activation === 'clap' || activation === 'voice';

    if (!wantsMic) {
      sessionRef.current?.stop();
      sessionRef.current = null;
      detectorRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setMicActive(false);
      setAudioLevel(0);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setError(null);
        const session = await openMic(micDeviceId || undefined);
        if (cancelled) {
          session.stop();
          return;
        }
        sessionRef.current = session;
        setMicActive(true);

        // Build clap detector (only used in clap mode but cheap).
        detectorRef.current = createClapDetector(session, {
          peakThreshold,
          midHighRatio: 0.3,
          refractoryMs: 100,
          doubleClapWindow: [150, 650],
          onClap: () => {
            setClapCount((c) => c + 1);
            setLastClapAt(Date.now());
          },
          onDoubleClap: () => {
            launchPersona(selectedRef.current, 'clap');
          },
        });

        const buffer = new Uint8Array(session.analyser.fftSize);

        const loop = () => {
          if (cancelled || !sessionRef.current) return;
          const rms = readRms(session.analyser, buffer);
          setAudioLevel(rms);
          if (activation === 'clap') {
            detectorRef.current?.tick();
          }
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Microphone unavailable.';
        setError(msg);
        setMicActive(false);
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      sessionRef.current?.stop();
      sessionRef.current = null;
      detectorRef.current = null;
      setMicActive(false);
    };
  }, [activation, micDeviceId, peakThreshold, launchPersona]);

  /* Set output device when supported (Chromium-only). */
  const setSinkId = useCallback(async (sinkId: string) => {
    try {
      const els = document.querySelectorAll('audio, video');
      for (const el of Array.from(els)) {
        const elAny = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
        if (elAny.setSinkId) await elAny.setSinkId(sinkId);
      }
    } catch {}
  }, []);

  const selected = PERSONAS.find((p) => p.id === selectedPersona) ?? PERSONAS[0];

  /* Visual feedback for last clap (fades in 800ms). */
  const clapPulse = useMemo(() => {
    if (!lastClapAt) return 0;
    const dt = Date.now() - lastClapAt;
    return Math.max(0, 1 - dt / 800);
  }, [lastClapAt, clapCount]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, ${selected.color}, transparent 70%)` }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/voice"
            className="inline-block text-xs text-white/30 hover:text-white/60 transition-colors mb-6"
          >
            &larr; Voice
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00bcd4]/60 mb-3">
            Voice Command Center
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-3">
            Voice Dashboard
          </h1>
          <p className="text-white/40 max-w-xl">
            Pick a persona. Pick how you want to summon them. The clap, the click, the voice — all
            equivalent paths to the same Guardian.
          </p>
        </div>

        {/* Top row: Audio meter + Activation mode */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <AudioMeterCard
            level={audioLevel}
            active={micActive}
            error={error}
            color={selected.color}
            clapPulse={clapPulse}
          />
          <ActivationCard
            mode={activation}
            onChange={setActivation}
            peakThreshold={peakThreshold}
            onPeakThresholdChange={setPeakThreshold}
            clapCount={clapCount}
          />
        </div>

        {/* Persona tiles */}
        <div className="mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            Personas — pick the one to summon
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PERSONAS.map((p) => (
              <PersonaTile
                key={p.id}
                persona={p}
                selected={p.id === selectedPersona}
                onSelect={() => setSelectedPersona(p.id)}
                onLaunch={() => launchPersona(p.id, 'click')}
                activationMode={activation}
              />
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <DeviceCard
            label="Microphone"
            devices={inputDevices}
            value={micDeviceId}
            onChange={setMicDeviceId}
            placeholder="System default"
          />
          <DeviceCard
            label="Output device"
            devices={outputDevices}
            value=""
            onChange={setSinkId}
            placeholder="System default"
            note="Chromium browsers only."
          />
        </div>

        {/* Session log */}
        <SessionLogCard log={sessionLog} />

        {/* Footer note */}
        <div className="mt-16 text-[11px] text-white/25 leading-relaxed max-w-2xl">
          The clap detector is browser-based — it listens only while this tab is open and you have
          granted microphone permission. For an always-on system-wide trigger, the{' '}
          <code className="text-white/40">arcanea-voice daemon</code> CLI mode is the next track —
          a desktop background listener that survives tab close.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AudioMeterCard({
  level,
  active,
  error,
  color,
  clapPulse,
}: {
  level: number;
  active: boolean;
  error: string | null;
  color: string;
  clapPulse: number;
}) {
  const pct = Math.min(100, Math.round(level * 200));
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">Audio level</p>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-3">
        <div
          className="h-full transition-[width] duration-75"
          style={{
            width: `${pct}%`,
            background: active ? color : 'rgba(255,255,255,0.15)',
            boxShadow: clapPulse > 0 ? `0 0 24px ${color}` : undefined,
            opacity: clapPulse > 0 ? 0.6 + clapPulse * 0.4 : 1,
          }}
        />
      </div>
      <p className="text-xs text-white/40">
        {error ? (
          <span className="text-red-400/70">{error}</span>
        ) : active ? (
          <span>Listening — {pct}%</span>
        ) : (
          <span>Mic off. Switch to Voice or Double-clap mode to enable.</span>
        )}
      </p>
    </div>
  );
}

function ActivationCard({
  mode,
  onChange,
  peakThreshold,
  onPeakThresholdChange,
  clapCount,
}: {
  mode: ActivationMode;
  onChange: (m: ActivationMode) => void;
  peakThreshold: number;
  onPeakThresholdChange: (v: number) => void;
  clapCount: number;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">Activation mode</p>
      <div className="flex flex-col gap-2 mb-4">
        {ACTIVATION_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={`text-left rounded-lg px-3 py-2 transition-colors text-sm ${
              mode === m.id
                ? 'bg-[#00bcd4]/15 border border-[#00bcd4]/40 text-white'
                : 'bg-white/[0.02] border border-white/[0.05] text-white/60 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{m.label}</span>
              {mode === m.id ? (
                <span className="text-[10px] uppercase tracking-widest text-[#00bcd4]/80">
                  active
                </span>
              ) : null}
            </div>
            <div className="text-[11px] text-white/40 mt-0.5">{m.hint}</div>
          </button>
        ))}
      </div>
      {mode === 'clap' ? (
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <label className="block text-[10px] uppercase tracking-widest text-white/40">
            Sensitivity ({peakThreshold.toFixed(2)})
          </label>
          <input
            type="range"
            min={0.08}
            max={0.4}
            step={0.01}
            value={peakThreshold}
            onChange={(e) => onPeakThresholdChange(parseFloat(e.target.value))}
            className="w-full accent-[#00bcd4]"
          />
          <div className="text-[11px] text-white/30 flex justify-between">
            <span>More sensitive</span>
            <span>Less sensitive</span>
          </div>
          <div className="text-xs text-white/50 pt-2">
            Single claps detected: <span className="text-[#00bcd4]">{clapCount}</span>
            <span className="text-white/30"> · double-clap to summon</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PersonaTile({
  persona,
  selected,
  onSelect,
  onLaunch,
  activationMode,
}: {
  persona: Persona;
  selected: boolean;
  onSelect: () => void;
  onLaunch: () => void;
  activationMode: ActivationMode;
}) {
  return (
    <div
      className={`group rounded-xl p-4 cursor-pointer transition-all border ${
        selected
          ? 'bg-white/[0.05] border-white/20'
          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
      }`}
      onClick={onSelect}
      style={selected ? { boxShadow: `0 0 32px -8px ${persona.color}` } : undefined}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="inline-block w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: persona.color, boxShadow: `0 0 8px ${persona.color}` }}
        />
        <h3 className="text-sm font-semibold tracking-wide">{persona.name}</h3>
      </div>
      <p className="text-[11px] text-white/40 leading-snug mb-3">{persona.tagline}</p>
      {activationMode === 'click' ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLaunch();
          }}
          className="w-full text-[10px] uppercase tracking-widest py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
        >
          Summon &rarr;
        </button>
      ) : (
        <div className="text-[10px] uppercase tracking-widest text-white/30 text-center py-1.5">
          {selected ? 'Selected' : 'Tap to select'}
        </div>
      )}
    </div>
  );
}

function DeviceCard({
  label,
  devices,
  value,
  onChange,
  placeholder,
  note,
}: {
  label: string;
  devices: MediaDeviceInfo[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00bcd4]/50"
      >
        <option value="">{placeholder}</option>
        {devices.map((d) => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || `${label} ${d.deviceId.slice(0, 6)}`}
          </option>
        ))}
      </select>
      {note ? <p className="text-[11px] text-white/30 mt-2">{note}</p> : null}
    </div>
  );
}

function SessionLogCard({ log }: { log: SessionLogEntry[] }) {
  if (log.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">Recent sessions</p>
        <p className="text-xs text-white/30">No sessions yet. Summon a Guardian above.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Recent sessions</p>
      <div className="space-y-2">
        {log.slice(0, 8).map((s, i) => (
          <div
            key={`${s.startedAt}-${i}`}
            className="flex items-center justify-between text-xs text-white/60"
          >
            <span className="capitalize">{s.persona}</span>
            <span className="text-white/30">
              <span className="uppercase tracking-widest text-[10px] mr-2">{s.trigger}</span>
              {timeAgo(s.startedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
