/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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
} from "./audio-utils";
import { emit, subscribe } from "./lib/intent-bus";
import { AgentVisualizer } from "./components/agent-visualizer";
import { RuntimeLauncher } from "./components/runtime-launcher";
import { WorkflowGrid } from "./components/workflow-grid";
import { LogicStream } from "./components/logic-stream";
import { CommandPalette } from "./components/command-palette";
import { EmbeddedViewer } from "./components/embedded-viewer";
import { VoiceControl } from "./components/voice-control";
import { WORKFLOWS } from "./lib/workflows";
import { RUNTIMES } from "./lib/runtimes";
import { getTenant, type TenantId } from "@/lib/tenants";

/* ------------------------------------------------------------------ */
/*  Personas                                                           */
/* ------------------------------------------------------------------ */

interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  color: string;
  accent: string;
}

type PersonaId =
  | "jarvis"
  | "lumina"
  | "draconia"
  | "lyria"
  | "alera"
  | "shinkami"
  | "nero";

const PERSONAS: Persona[] = [
  {
    id: "lumina",
    name: "Lumina",
    tagline: "The First Light",
    color: "var(--arc-brand-arcanean-gold)",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    id: "jarvis",
    name: "JARVIS",
    tagline: "Concise systems agent",
    color: "var(--arc-text-primary)",
    accent: "var(--arc-text-primary)",
  },
  {
    id: "draconia",
    name: "Draconia",
    tagline: "Guardian of Fire",
    color: "var(--arc-fire)",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    id: "lyria",
    name: "Lyria",
    tagline: "Guardian of Sight",
    color: "var(--arc-void)",
    accent: "var(--arc-text-primary)",
  },
  {
    id: "alera",
    name: "Alera",
    tagline: "Guardian of Voice",
    color: "var(--arc-brand-atlantean-teal)",
    accent: "var(--arc-text-primary)",
  },
  {
    id: "shinkami",
    name: "Shinkami",
    tagline: "The Source",
    color: "var(--arc-text-primary)",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    id: "nero",
    name: "Nero",
    tagline: "The Primordial Darkness",
    color: "var(--arc-void)",
    accent: "var(--arc-void)",
  },
];

type ActivationMode = "click" | "voice" | "clap";

const ACTIVATION_MODES: { id: ActivationMode; label: string; hint: string }[] =
  [
    { id: "click", label: "Click", hint: "Click a persona to summon" },
    {
      id: "voice",
      label: "Voice activation",
      hint: "Mic on, sustained voice triggers summon",
    },
    {
      id: "clap",
      label: "Double clap",
      hint: "Two claps within 600ms summons the selected persona",
    },
  ];

/* Choreographed entry — expoOut over 60ms stagger. */
const stageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface VoiceDashboardClientProps {
  /** Tenant override for alias routes (/voice/sis, /voice/frankx). Default: read ?tenant= or 'arcanea'. */
  tenantId?: TenantId;
}

export default function VoiceDashboardClient({
  tenantId: tenantOverride,
}: VoiceDashboardClientProps = {}) {
  const router = useRouter();
  // Resolve tenant: prop wins, then ?tenant=, then default.
  const [tenantId, setTenantId] = useState<TenantId>(
    tenantOverride ?? "arcanea",
  );
  const tenant = getTenant(tenantId);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>(
    tenant.defaultPersona,
  );
  const [activation, setActivation] = useState<ActivationMode>("click");
  const [micDeviceId, setMicDeviceId] = useState<string>("");
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [noiseFloor, setNoiseFloor] = useState(0.01);
  const [clapCount, setClapCount] = useState(0);
  const [lastClapAt, setLastClapAt] = useState<number | null>(null);
  const [sessionLog, setSessionLog] = useState<SessionLogEntry[]>([]);
  const [sensitivity, setSensitivity] = useState(4.0);
  const [error, setError] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  /* Day 4: local agent discovery */
  const [agentMode, setAgentMode] = useState(false);
  const [agentPort, setAgentPort] = useState<number | null>(null);
  const [agentMemoryMb, setAgentMemoryMb] = useState<number | null>(null);
  const agentTokenRef = useRef<string | null>(null);
  const agentWsRef = useRef<WebSocket | null>(null);

  const sessionRef = useRef<MicSession | null>(null);
  const detectorRef = useRef<ClapDetector | null>(null);
  const rafRef = useRef<number | null>(null);
  const selectedRef = useRef<PersonaId>("lumina");
  const lastVoiceTrigRef = useRef<number>(0);

  useEffect(() => {
    selectedRef.current = selectedPersona;
  }, [selectedPersona]);

  /* Day 4: Discover local agent on mount.
   * Race a 250ms timeout against fetch('/health'). If 200, switch to agent
   * mode. Otherwise stay in v2 (clipboard) mode. Workflows fall back
   * gracefully so the dashboard stays useful when the agent is offline. */
  const discoverAgent = useCallback(async () => {
    if (typeof window === "undefined") return;
    // Only discover when running locally — Vercel-hosted /voice/dashboard
    // can't talk to a user's localhost without a desktop wrapper.
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return;
    try {
      // Resolve port (may be 7777+).
      let port = 7777;
      try {
        const portRes = await fetch("/api/voice/agent-port");
        if (portRes.ok) {
          const data = await portRes.json();
          if (typeof data.port === "number") port = data.port;
        }
      } catch {}
      const ctl = new AbortController();
      const timer = window.setTimeout(() => ctl.abort(), 250);
      const r = await fetch(`http://127.0.0.1:${port}/health`, {
        signal: ctl.signal,
      });
      window.clearTimeout(timer);
      if (!r.ok) return;
      const body = await r.json();
      if (!body.ok) return;
      setAgentMode(true);
      setAgentPort(port);
      // Pull token (local-only route).
      try {
        const tokRes = await fetch("/api/voice/agent-token");
        if (tokRes.ok) {
          const td = await tokRes.json();
          if (td.token) agentTokenRef.current = td.token;
        }
      } catch {}
      // Open WS for events.
      if (agentTokenRef.current) {
        try {
          const ws = new WebSocket(
            `ws://127.0.0.1:${port}/events?token=${encodeURIComponent(agentTokenRef.current)}`,
          );
          ws.onmessage = (e) => {
            try {
              const evt = JSON.parse(e.data);
              if (
                evt.kind === "memory" &&
                typeof evt.payload?.rss === "number"
              ) {
                setAgentMemoryMb(evt.payload.rss);
              }
              emit({
                kind: "workflow",
                workflowId: evt.kind,
                trigger: "click",
                summary: `Agent → ${evt.kind}`,
              });
            } catch {}
          };
          ws.onclose = () => {
            agentWsRef.current = null;
          };
          agentWsRef.current = ws;
        } catch {}
      }
    } catch {
      // Timed out or connection refused — stay in v2 mode silently.
    }
  }, []);

  useEffect(() => {
    void discoverAgent();
    return () => {
      try {
        agentWsRef.current?.close();
      } catch {}
      agentWsRef.current = null;
    };
  }, [discoverAgent]);

  /* Read ?tenant= on mount (only when no explicit prop override) */
  useEffect(() => {
    if (tenantOverride) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tenant");
    if (t === "arcanea" || t === "sis" || t === "frankx") {
      setTenantId(t);
      const next = getTenant(t);
      setSelectedPersona(next.defaultPersona);
    }
  }, [tenantOverride]);

  /* Filter personas + workflows by current tenant */
  const visiblePersonas = useMemo(() => {
    return PERSONAS.filter((p) => tenant.personaAllowlist.includes(p.id));
  }, [tenant]);
  const allowedWorkflowIds = useMemo(
    () => new Set(tenant.workflowAllowlist),
    [tenant],
  );
  const visibleWorkflows = useMemo(() => {
    if (allowedWorkflowIds.size === 0) return WORKFLOWS;
    return WORKFLOWS.filter((w) => allowedWorkflowIds.has(w.id));
  }, [allowedWorkflowIds]);

  /* Load session log + devices */
  useEffect(() => {
    setSessionLog(readSessionLog());
    listAudioDevices()
      .then(({ inputs, outputs }) => {
        setInputDevices(inputs);
        setOutputDevices(outputs);
      })
      .catch(() => {});
  }, []);

  const launchPersona = useCallback(
    (id: PersonaId, trigger: "click" | "clap" | "voice") => {
      const entry: SessionLogEntry = {
        persona: id,
        startedAt: Date.now(),
        trigger,
      };
      appendSessionLog(entry);
      setSessionLog((prev) => [entry, ...prev].slice(0, 20));
      const persona = PERSONAS.find((p) => p.id === id);
      emit({
        kind: "summon",
        persona: id,
        trigger,
        summary: `Summon ${persona?.name ?? id}`,
      });
      // Brief delay so the Logic Stream renders before navigation
      setTimeout(() => {
        router.push(`/room/${id}?tenant=${tenantId}`);
      }, 250);
    },
    [router, tenantId],
  );

  /* Mic + clap detection lifecycle */
  useEffect(() => {
    const wantsMic = activation === "clap" || activation === "voice";

    if (!wantsMic) {
      sessionRef.current?.stop();
      sessionRef.current = null;
      detectorRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setMicActive(false);
      setAudioLevel(0);
      setError(null);
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

        detectorRef.current = createClapDetector(session, {
          sensitivity,
          midHighRatio: 0.3,
          refractoryMs: 100,
          maxAttackMs: 50,
          doubleClapWindow: [150, 650],
          onClap: () => {
            setClapCount((c) => c + 1);
            setLastClapAt(Date.now());
            emit({
              kind: "clap",
              trigger: "clap",
              summary: "Single clap detected",
            });
          },
          onDoubleClap: () => {
            launchPersona(selectedRef.current, "clap");
          },
        });

        const buffer = new Uint8Array(
          new ArrayBuffer(session.analyser.fftSize),
        );
        let voiceSustain: number[] = [];

        const loop = () => {
          if (cancelled || !sessionRef.current) return;
          const rms = readRms(session.analyser, buffer);
          setAudioLevel(rms);

          if (activation === "clap") {
            detectorRef.current?.tick();
            const floor = detectorRef.current?.getNoiseFloor() ?? 0.01;
            setNoiseFloor(floor);
          } else if (activation === "voice") {
            // Simple voice-activation: sustained energy above 0.08 RMS
            // for 400ms triggers a summon. Debounced to once per 4s.
            const now = performance.now();
            if (rms > 0.08 && now - lastVoiceTrigRef.current > 4000) {
              voiceSustain.push(now);
              voiceSustain = voiceSustain.filter((t) => now - t < 400);
              if (voiceSustain.length >= 18) {
                lastVoiceTrigRef.current = now;
                voiceSustain = [];
                launchPersona(selectedRef.current, "voice");
              }
            }
          }

          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Microphone unavailable.";
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
  }, [activation, micDeviceId, sensitivity, launchPersona]);

  /* Output device sink (Chromium) */
  const setSinkId = useCallback(async (sinkId: string) => {
    try {
      const els = document.querySelectorAll("audio, video");
      for (const el of Array.from(els)) {
        const elAny = el as HTMLMediaElement & {
          setSinkId?: (id: string) => Promise<void>;
        };
        if (elAny.setSinkId) await elAny.setSinkId(sinkId);
      }
    } catch {}
  }, []);

  /* Listen on intent bus for embed routes */
  useEffect(() => {
    return subscribe((intent) => {
      if (intent.kind === "embed") setEmbedUrl(intent.url);
    });
  }, []);

  /* Daemon-launched URL: /voice/dashboard?summon=<persona> auto-fires on mount */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const summonId = params.get("summon");
    if (!summonId) return;
    const valid = PERSONAS.find((p) => p.id === summonId);
    if (!valid) return;
    // Defer one tick so the intent bus subscribers are mounted first
    const trigger =
      (params.get("trigger") as "click" | "clap" | "voice" | null) ?? "clap";
    setSelectedPersona(summonId as PersonaId);
    setTimeout(() => {
      launchPersona(
        summonId as PersonaId,
        trigger === "voice" ? "voice" : "clap",
      );
    }, 120);
    // Clean the URL so a refresh doesn't re-fire
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Voice intent handler — bridges classifier output to dashboard actions */
  const handleVoiceIntent = useCallback(
    (
      result: {
        kind: "summon" | "workflow" | "runtime" | "embed" | "unknown";
        targetId: string | null;
        summary: string;
      },
      transcript: string,
    ) => {
      if (!result.targetId) return;
      if (result.kind === "summon") {
        const personaId = result.targetId as PersonaId;
        if (PERSONAS.find((p) => p.id === personaId)) {
          setSelectedPersona(personaId);
          launchPersona(personaId, "voice");
        }
      } else if (result.kind === "workflow") {
        const w = WORKFLOWS.find((wf) => wf.id === result.targetId);
        if (!w) return;
        emit({
          kind: "workflow",
          workflowId: w.id,
          trigger: "voice",
          summary: `Voice → ${w.label}`,
        });
        if (w.action.kind === "route") {
          window.location.href = w.action.href;
        } else if (w.action.kind === "cli") {
          navigator.clipboard?.writeText(w.action.command).catch(() => {});
        } else if (w.action.kind === "external") {
          if (
            /^https:\/\/(www\.)?(youtube|github|vercel|figma)\./.test(
              w.action.url,
            )
          ) {
            setEmbedUrl(w.action.url);
          } else {
            window.open(w.action.url, "_blank", "noopener,noreferrer");
          }
        }
      } else if (result.kind === "runtime") {
        const r = RUNTIMES.find((rt) => rt.id === result.targetId);
        if (!r) return;
        emit({
          kind: "runtime",
          runtimeId: r.id,
          command: r.command,
          trigger: "voice",
          summary: `Voice → ${r.name}`,
        });
        navigator.clipboard?.writeText(r.command).catch(() => {});
      } else if (result.kind === "embed" && result.targetId) {
        setEmbedUrl(result.targetId);
        emit({
          kind: "embed",
          url: result.targetId,
          surface: /youtube/.test(result.targetId) ? "youtube" : "web",
          trigger: "voice",
          summary: `Voice embed → "${transcript.slice(0, 40)}"`,
        });
      }
    },
    [launchPersona],
  );

  const selected =
    visiblePersonas.find((p) => p.id === selectedPersona) ??
    visiblePersonas[0] ??
    PERSONAS[0];

  /* Clap visual pulse */
  const clapPulse = useMemo(() => {
    if (!lastClapAt) return 0;
    const dt = Date.now() - lastClapAt;
    return Math.max(0, 1 - dt / 800);
  }, [lastClapAt, clapCount]);

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white relative">
      {/* BR2049 atmospheric depth haze — cross-fades on persona swap */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[700px] rounded-full blur-[160px]"
            style={{
              background: `radial-gradient(circle, ${selected.color}, transparent 70%)`,
            }}
          />
        </AnimatePresence>
        {/* Subtle film-grain noise — adds materiality, kills banding */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Header bar */}
      <header className="relative px-6 lg:px-10 pt-8 pb-4 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <Link
            href="/voice"
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
          >
            ← Voice
          </Link>
          <span className="w-px h-3 bg-white/10" />
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: `${tenant.color}99` }}
          >
            {tenant.shortName} · Voice Command Center
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          {agentMode ? (
            <button
              type="button"
              onClick={() => void discoverAgent()}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 transition-colors cursor-pointer"
              title={`Local agent on :${agentPort}${agentMemoryMb != null ? ` · ${agentMemoryMb} MB` : ""}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-[0.22em] uppercase">Agent</span>
              {agentMemoryMb != null && (
                <span className="text-emerald-300/60">{agentMemoryMb}MB</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void discoverAgent()}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors cursor-pointer"
              title="Click to retry local agent discovery"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="tracking-[0.22em] uppercase">v2</span>
            </button>
          )}
          <span className="w-px h-3 bg-white/10" />
          <span>⌘K</span>
          <span className="hidden sm:inline">to summon anything</span>
        </div>
      </header>

      {/* Hero strip */}
      <div className="relative px-6 lg:px-10 pt-6 pb-8 max-w-[1600px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
          {tenant.shortName === "Arcanea"
            ? "Voice Dashboard"
            : `${tenant.shortName} Voice`}
        </h1>
        <p className="text-white/40 max-w-2xl mt-2 text-sm">
          The clap, the click, the voice — all equivalent paths to the same
          Guardian. Multi-agent visibility, workflow quick-launch, embedded
          media, and runtime routing in one room.
        </p>
      </div>

      {/* Three-column main — choreographed entry */}
      <motion.main
        variants={stageVariants}
        initial="hidden"
        animate="show"
        className="relative px-6 lg:px-10 pb-20 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_380px] gap-6"
      >
        {/* LEFT — Voice Control + Agents + Runtimes */}
        <motion.div
          variants={panelVariants}
          className="space-y-6 order-2 lg:order-1"
        >
          <VoiceControl onIntent={handleVoiceIntent} />
          <AgentVisualizer />
          <RuntimeLauncher />
        </motion.div>

        {/* CENTER — Stage */}
        <motion.div
          variants={panelVariants}
          className="space-y-6 order-1 lg:order-2 min-w-0"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <PersonaOrb
              persona={selected}
              level={audioLevel}
              active={micActive}
              error={error}
              clapPulse={clapPulse}
              activation={activation}
              noiseFloor={noiseFloor}
            />
            <ActivationCard
              mode={activation}
              onChange={setActivation}
              sensitivity={sensitivity}
              onSensitivityChange={setSensitivity}
              clapCount={clapCount}
              noiseFloor={noiseFloor}
              micActive={micActive}
            />
          </div>

          <PersonaTiles
            personas={visiblePersonas}
            selected={selectedPersona}
            onSelect={setSelectedPersona}
            onLaunch={(id) => launchPersona(id, "click")}
            activation={activation}
          />

          <div className="grid sm:grid-cols-2 gap-6">
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

          <SessionLogCard log={sessionLog} />
        </motion.div>

        {/* RIGHT — Workflows + Logic Stream + Embedded */}
        <motion.div variants={panelVariants} className="space-y-6 order-3">
          <WorkflowGrid onEmbed={setEmbedUrl} workflows={visibleWorkflows} />
          <LogicStream />
          <EmbeddedViewer url={embedUrl} onUrlChange={setEmbedUrl} />
        </motion.div>
      </motion.main>

      {/* Footer */}
      <div className="px-6 lg:px-10 pb-12 max-w-[1600px] mx-auto text-[11px] text-white/25 leading-relaxed">
        Browser-only by design. Mic listens while this tab is open and you have
        granted permission. Always-on system-wide trigger via{" "}
        <code className="text-white/40">arcanea-voice daemon</code> is the next
        track.
      </div>

      {/* Cmd+K palette */}
      <CommandPalette
        onSummon={(id) => launchPersona(id as PersonaId, "click")}
        onEmbed={setEmbedUrl}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PersonaOrb({
  persona,
  level,
  active,
  error,
  clapPulse,
  activation,
  noiseFloor,
}: {
  persona: Persona;
  level: number;
  active: boolean;
  error: string | null;
  clapPulse: number;
  activation: ActivationMode;
  noiseFloor: number;
}) {
  const orbScale = 1 + Math.min(0.18, level * 1.4);
  const ringOpacity = clapPulse;
  const subtitle = error
    ? error
    : activation === "click"
      ? "Idle. Click a persona below or press ⌘K."
      : active
        ? activation === "clap"
          ? `Listening for claps · floor ${(noiseFloor * 100).toFixed(1)}%`
          : "Listening for voice"
        : "Mic initializing…";

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-6 flex flex-col items-center text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 self-start mb-4">
        Selected
      </p>
      <div className="relative w-44 h-44 flex items-center justify-center mb-4">
        {/* Conic rotating light ring — BR2049 light beat */}
        <motion.span
          aria-hidden
          className="absolute inset-[-6px] rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${persona.color}88 60deg, transparent 140deg, transparent 220deg, ${persona.accent}66 280deg, transparent 360deg)`,
            filter: "blur(3px)",
            opacity: 0.55,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <span
          aria-hidden
          className="absolute inset-[-6px] rounded-full pointer-events-none border border-white/[0.04]"
        />
        {/* Outer ring (clap pulse) */}
        <AnimatePresence>
          {ringOpacity > 0.05 ? (
            <motion.span
              key={`ring-${clapPulse}`}
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: persona.color }}
            />
          ) : null}
        </AnimatePresence>
        {/* Outer halo */}
        <span
          className="absolute inset-0 rounded-full blur-2xl transition-opacity"
          style={{
            background: `radial-gradient(circle, ${persona.color}, transparent 70%)`,
            opacity: 0.25 + level * 1.5,
          }}
        />
        {/* Inner orb */}
        <motion.span
          animate={{ scale: orbScale }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="relative w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${persona.color}, ${persona.accent}55 60%, transparent)`,
            boxShadow: `0 0 60px -10px ${persona.color}, inset 0 0 40px rgba(255,255,255,0.08)`,
          }}
        />
        {/* Inner glass shine */}
        <span
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.25), transparent 40%)",
          }}
        />
      </div>
      <p
        className="text-2xl font-bold tracking-tight"
        style={{
          fontFamily:
            "var(--font-instrument-serif), var(--font-display), serif",
          color: persona.color,
        }}
      >
        {persona.name}
      </p>
      <p className="text-[11px] text-white/45 italic">{persona.tagline}</p>
      <div className="mt-4 w-full">
        {/* Audio meter */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full transition-[width] duration-75"
            style={{
              width: `${Math.min(100, Math.round(level * 200))}%`,
              background: persona.color,
              opacity: active ? 0.6 + clapPulse * 0.4 : 0.2,
            }}
          />
        </div>
        <p className="text-[10px] text-white/40 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}

function ActivationCard({
  mode,
  onChange,
  sensitivity,
  onSensitivityChange,
  clapCount,
  noiseFloor,
  micActive,
}: {
  mode: ActivationMode;
  onChange: (m: ActivationMode) => void;
  sensitivity: number;
  onSensitivityChange: (v: number) => void;
  clapCount: number;
  noiseFloor: number;
  micActive: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
        Activation
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {ACTIVATION_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={`text-left rounded-lg px-3 py-2 transition-colors text-sm ${
              mode === m.id
                ? "bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/40 text-white"
                : "bg-white/[0.02] border border-white/[0.05] text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{m.label}</span>
              {mode === m.id ? (
                <span className="text-[10px] uppercase tracking-widest text-[var(--arc-brand-atlantean-teal)]/80">
                  active
                </span>
              ) : null}
            </div>
            <div className="text-[11px] text-white/40 mt-0.5">{m.hint}</div>
          </button>
        ))}
      </div>
      {mode === "clap" ? (
        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <label className="block text-[10px] uppercase tracking-widest text-white/40">
            Sensitivity ({sensitivity.toFixed(1)}× over noise floor)
          </label>
          <input
            type="range"
            min={2}
            max={8}
            step={0.5}
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--arc-brand-atlantean-teal)]"
          />
          <div className="text-[11px] text-white/30 flex justify-between">
            <span>More sensitive</span>
            <span>Less sensitive</span>
          </div>
          <div className="text-xs text-white/55 pt-2 flex items-center justify-between">
            <span>
              Claps:{" "}
              <span className="text-[var(--arc-brand-atlantean-teal)]">
                {clapCount}
              </span>
            </span>
            <span className="text-white/35 text-[10px]">
              Floor {(noiseFloor * 100).toFixed(1)}%
            </span>
          </div>
          {!micActive ? (
            <p className="text-[10px] text-amber-400/70">
              Waiting for mic permission…
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PersonaTiles({
  personas,
  selected,
  onSelect,
  onLaunch,
  activation,
}: {
  personas: Persona[];
  selected: PersonaId;
  onSelect: (id: PersonaId) => void;
  onLaunch: (id: PersonaId) => void;
  activation: ActivationMode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
        Pick a persona to summon
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {personas.map((p) => (
          <PersonaTile
            key={p.id}
            persona={p}
            isSelected={p.id === selected}
            onSelect={() => onSelect(p.id)}
            onLaunch={() => onLaunch(p.id)}
            activation={activation}
          />
        ))}
      </div>
    </div>
  );
}

/** Cursor-follow spotlight tile — Linear/Stripe-class hover. */
function PersonaTile({
  persona: p,
  isSelected,
  onSelect,
  onLaunch,
  activation,
}: {
  persona: Persona;
  isSelected: boolean;
  onSelect: () => void;
  onLaunch: () => void;
  activation: ActivationMode;
}) {
  const tileRef = useRef<HTMLButtonElement | null>(null);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  return (
    <motion.button
      ref={tileRef}
      type="button"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setSpot(null)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`group relative rounded-xl p-4 text-left transition-colors border overflow-hidden ${
        isSelected
          ? "bg-white/[0.05] border-white/25"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.14]"
      }`}
      style={isSelected ? { boxShadow: `0 0 32px -8px ${p.color}` } : undefined}
    >
      {/* Cursor spotlight */}
      <span
        aria-hidden
        className="absolute pointer-events-none transition-opacity duration-300 rounded-full blur-2xl"
        style={{
          left: spot ? spot.x - 90 : "50%",
          top: spot ? spot.y - 90 : "50%",
          width: 180,
          height: 180,
          background: `radial-gradient(circle, ${p.color}38, transparent 70%)`,
          opacity: spot ? 0.8 : 0,
        }}
      />
      {/* Liquid-glass top edge highlight */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-block w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }}
          />
          <h3 className="text-sm font-semibold tracking-wide">{p.name}</h3>
        </div>
        <p className="text-[11px] text-white/45 leading-snug mb-3">
          {p.tagline}
        </p>
        {isSelected && activation === "click" ? (
          <Link
            href={`/room/${p.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onLaunch();
            }}
            className="block w-full text-center text-[10px] uppercase tracking-widest py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors"
          >
            Summon →
          </Link>
        ) : (
          <div className="text-[10px] uppercase tracking-widest text-white/30 text-center py-1.5">
            {isSelected ? "Selected" : "Tap to select"}
          </div>
        )}
      </div>
    </motion.button>
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
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/50"
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
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
          Recent sessions
        </p>
        <p className="text-xs text-white/30">No sessions yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
        Recent sessions
      </p>
      <div className="space-y-1.5">
        {log.slice(0, 8).map((s, i) => (
          <div
            key={`${s.startedAt}-${i}`}
            className="flex items-center justify-between text-xs text-white/60"
          >
            <span className="capitalize">{s.persona}</span>
            <span className="text-white/30">
              <span className="uppercase tracking-widest text-[10px] mr-2">
                {s.trigger}
              </span>
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
