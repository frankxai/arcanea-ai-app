"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type NodeKind = "start" | "action" | "gate" | "milestone" | "end";

interface Step {
  id: string;
  icon: string;
  label: string;
  sub: string;
  detail: string;
  url?: string;
  kind: NodeKind;
}

interface Flow {
  id: string;
  title: string;
  tagline: string;
  guardian: string;
  gate: string;
  hz: number;
  steps: Step[];
}

/* ─── Flow Data ──────────────────────────────────────────────────────────── */
const FLOWS: Flow[] = [
  {
    id: "creator",
    title: "Creator Journey",
    tagline: "From curious visitor to Luminor status",
    guardian: "Shinkami",
    gate: "Source",
    hz: 1111,
    steps: [
      {
        id: "landing", icon: "✦", kind: "start",
        label: "Discover", sub: "arcanea.ai landing",
        detail: "Visitor arrives at arcanea.ai — sees the living mythology, Guardian portraits, and studio teaser. First impression of the Arcanea universe.",
        url: "/",
      },
      {
        id: "guardians", icon: "◈", kind: "action",
        label: "Guardians", sub: "Find your Gate",
        detail: "Browse the Ten Guardians and their Gates. Each Guardian resonates with an element — Fire, Water, Earth, Wind, or Void. The visitor feels pulled toward one.",
        url: "/lore/guardians",
      },
      {
        id: "signup", icon: "◉", kind: "gate",
        label: "Sign Up", sub: "First Gate opens",
        detail: "Create an account. Guardian affinity is recorded. Gate 1 opens — the creator becomes an Apprentice and gains access to Studio and Prompt Books.",
        url: "/auth/signup",
      },
      {
        id: "studio", icon: "⬡", kind: "action",
        label: "Studio", sub: "First creation",
        detail: "Use the AI Studio to generate a first image, story, or world element. Guided by their Guardian's element and tone. The creation is stored in their profile.",
        url: "/studio",
      },
      {
        id: "gallery", icon: "▣", kind: "milestone",
        label: "Gallery", sub: "Go public",
        detail: "Submit the first creation to the community gallery. It appears tagged with their Guardian and credited to their profile. The social loop begins.",
        url: "/gallery",
      },
      {
        id: "academy", icon: "☽", kind: "action",
        label: "Academy", sub: "Open more Gates",
        detail: "Complete Academy lessons across multiple Guardians. Each completed Gate unlocks new abilities, creation types, and lore. Rank rises from Apprentice → Mage → Master.",
        url: "/academy",
      },
      {
        id: "luminor", icon: "★", kind: "end",
        label: "Luminor", sub: "All 10 Gates open",
        detail: "Luminor status — all Ten Gates mastered. The creator becomes a co-author of the Arcanea universe. They can mentor others and unlock leadership Academy roles.",
      },
    ],
  },
  {
    id: "vault",
    title: "Vault Import",
    tagline: "From any AI conversation to organized Prompt Books",
    guardian: "Alera",
    gate: "Voice",
    hz: 528,
    steps: [
      {
        id: "install", icon: "⬇", kind: "start",
        label: "Install", sub: "Arcanea Vault extension",
        detail: "Install the Arcanea Vault Chrome extension from arcanea.ai/arcanea-vault. Works on ChatGPT, Claude, Gemini, Grok, Perplexity, and DeepSeek.",
        url: "/arcanea-vault",
      },
      {
        id: "browse", icon: "◌", kind: "action",
        label: "Browse AI", sub: "Use any AI platform",
        detail: "Have a creative session on any AI platform. The Vault extension icon appears in the Chrome toolbar — silent and unobtrusive until needed.",
      },
      {
        id: "capture", icon: "⬡", kind: "action",
        label: "Capture", sub: "Click the Vault",
        detail: "Hit the Vault button — the extension scrapes the current conversation and presents a selection UI. Choose which prompts and responses to keep.",
      },
      {
        id: "import", icon: "✦", kind: "gate",
        label: "Import", sub: "Send to Prompt Books",
        detail: "One click sends selected prompts directly to arcanea.ai/prompt-books. Each entry is tagged with source platform, date, and auto-detected Guardian affinity.",
        url: "/prompt-books",
      },
      {
        id: "organize", icon: "◈", kind: "action",
        label: "Organize", sub: "Collections & tags",
        detail: "Create collections per project or Guardian. Tag prompts by technique, element, creative intent, or use case. The library grows with every session.",
      },
      {
        id: "reuse", icon: "★", kind: "end",
        label: "Reuse", sub: "Search & deploy",
        detail: "Cmd+K to instantly search the prompt library. Copy, remix, or chain prompts into new creations. The best prompts compound in value over time.",
      },
    ],
  },
  {
    id: "gallery",
    title: "Gallery Contribution",
    tagline: "From private creation to public inspiration",
    guardian: "Lyria",
    gate: "Sight",
    hz: 639,
    steps: [
      {
        id: "create", icon: "◌", kind: "start",
        label: "Create", sub: "Studio or external AI",
        detail: "Creator makes an image, video, or world element in Arcanea Studio — or imports from external AI tools (Midjourney, DALL·E, Sora) via the Vault extension.",
        url: "/studio",
      },
      {
        id: "tag", icon: "◈", kind: "action",
        label: "Tag", sub: "Guardian + category",
        detail: "Tag the creation with a Guardian affinity and category: portrait, world scene, concept art, sacred geometry, or character. Optional: add a caption and technique notes.",
      },
      {
        id: "submit", icon: "⬡", kind: "gate",
        label: "Submit", sub: "Auto-moderation",
        detail: "Submitted to the community gallery queue. Auto-moderation checks for NSFW content. Safe creations auto-approve within seconds. Borderline cases go to human review.",
      },
      {
        id: "published", icon: "▣", kind: "milestone",
        label: "Published", sub: "Live in gallery",
        detail: "Creation appears in /gallery filtered by Guardian. Credited with creator name and a link to their profile. Discoverable by all visitors — including unauthenticated browsers.",
        url: "/gallery",
      },
      {
        id: "attributed", icon: "✦", kind: "action",
        label: "Attributed", sub: "Profile grows",
        detail: "Viewers click the creator's name → visit their profile → see all their creations. Likes and saves accumulate. The creator's reputation in the Arcanea universe builds.",
      },
      {
        id: "inspire", icon: "★", kind: "end",
        label: "Inspire", sub: "Community creates",
        detail: "Other creators are inspired. They remix, respond, or build worlds around the original. The gallery grows as a living, shared mythology archive — not a static portfolio.",
      },
    ],
  },
  {
    id: "community",
    title: "Community Loop",
    tagline: "How creators find, connect, and grow together",
    guardian: "Ino",
    gate: "Unity",
    hz: 963,
    steps: [
      {
        id: "discover", icon: "◌", kind: "start",
        label: "Discover", sub: "Browse the Stream",
        detail: "Find the Community Stream at /community — a TikTok-style vertical scroll of creations, prompts, world snippets, and studio recordings from all Guardians.",
        url: "/community",
      },
      {
        id: "engage", icon: "◈", kind: "action",
        label: "Engage", sub: "Like, save, remix",
        detail: "Like creations, save them to Prompt Books, or remix them with your own Guardian's elemental touch. Each engagement is a signal that shapes your feed.",
      },
      {
        id: "connect", icon: "⬡", kind: "gate",
        label: "Connect", sub: "Follow creators",
        detail: "Follow creators whose Guardian affinities resonate with yours. Build a creative circle that spans multiple Gates and elements.",
      },
      {
        id: "collaborate", icon: "▣", kind: "milestone",
        label: "Co-Create", sub: "Shared worlds",
        detail: "Join world-building sessions where multiple creators contribute chapters, characters, and imagery to a shared mythology. The universe expands through collaboration.",
      },
      {
        id: "lead", icon: "★", kind: "end",
        label: "Lead", sub: "Mentor as Luminor",
        detail: "Luminor-tier creators mentor newcomers through their Gate journeys. They unlock leadership roles in the Academy and become guides for the next generation of creators.",
      },
    ],
  },
];

/* ─── Kind styling ───────────────────────────────────────────────────────── */
const KIND: Record<NodeKind, { border: string; bg: string; icon: string; badge: string; badgeText: string }> = {
  start:     { border: "border-arcane-crystal/50", bg: "bg-arcane-crystal/8",  icon: "text-arcane-crystal",    badge: "bg-arcane-crystal/15 text-arcane-crystal",    badgeText: "Start" },
  action:    { border: "border-white/10",           bg: "bg-white/4",           icon: "text-text-secondary",    badge: "bg-white/8 text-text-muted",                  badgeText: "Step" },
  gate:      { border: "border-arcane-gold/50",     bg: "bg-arcane-gold/8",     icon: "text-arcane-gold",       badge: "bg-arcane-gold/15 text-arcane-gold",          badgeText: "Gate" },
  milestone: { border: "border-arcane-cosmic/50",   bg: "bg-arcane-cosmic/8",   icon: "text-arcane-cosmic",     badge: "bg-arcane-cosmic/15 text-arcane-cosmic",      badgeText: "Milestone" },
  end:       { border: "border-arcane-crystal/70",  bg: "bg-arcane-crystal/15", icon: "text-arcane-crystal",    badge: "bg-arcane-crystal/20 text-arcane-crystal",    badgeText: "Outcome" },
};

/* ─── Flow tab ───────────────────────────────────────────────────────────── */
const HZ_COLOR: Record<number, string> = {
  528:  "text-sky-300",
  639:  "text-violet-300",
  963:  "text-fuchsia-300",
  1111: "text-arcane-crystal",
};

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function UserFlowsPage() {
  const [activeId, setActiveId] = useState(FLOWS[0].id);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const flow = FLOWS.find((f) => f.id === activeId) ?? FLOWS[0];
  const activeStep = flow.steps.find((s) => s.id === activeStepId) ?? null;

  return (
    <div className="min-h-screen bg-cosmic-deep">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-xs font-sans text-text-muted uppercase tracking-widest mb-4">
            <span>Arcanea</span>
            <span>/</span>
            <span>User Flows</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            Journey Maps
          </h1>
          <p className="text-text-secondary font-sans max-w-xl">
            How creators move through Arcanea — from first visit to Luminor.
            Each path is a Gate opening.
          </p>
        </div>
      </div>

      {/* Flow tabs */}
      <div className="sticky top-0 z-10 bg-cosmic-deep/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {FLOWS.map((f) => (
              <button
                key={f.id}
                onClick={() => { setActiveId(f.id); setActiveStepId(null); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-sans transition-all ${
                  activeId === f.id
                    ? "bg-arcane-crystal/20 text-arcane-crystal border border-arcane-crystal/30"
                    : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {f.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Flow meta */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{flow.title}</h2>
            <p className="text-text-secondary font-sans">{flow.tagline}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-text-muted text-xs font-sans uppercase tracking-widest mb-1">Guardian</p>
            <p className="font-display font-semibold text-text-primary">{flow.guardian}</p>
            <p className={`text-xs font-mono mt-0.5 ${HZ_COLOR[flow.hz] ?? "text-text-muted"}`}>
              {flow.gate} Gate · {flow.hz} Hz
            </p>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="overflow-x-auto pb-4 mb-10">
          <div
            className="flex items-start gap-0"
            style={{ minWidth: `${flow.steps.length * 196}px` }}
          >
            {flow.steps.map((step, i) => {
              const s = KIND[step.kind];
              const isActive = step.id === activeStepId;
              return (
                <div key={step.id} className="flex items-center">
                  {/* Node */}
                  <button
                    onClick={() => setActiveStepId(isActive ? null : step.id)}
                    className={`group relative w-44 rounded-2xl border p-4 text-left transition-all duration-200 ${s.border} ${s.bg} ${
                      isActive
                        ? "ring-2 ring-arcane-crystal/40 scale-[1.03] shadow-lg shadow-arcane-crystal/10"
                        : "hover:scale-[1.02] hover:border-white/20"
                    }`}
                  >
                    {/* Step number */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xl ${s.icon}`}>{step.icon}</span>
                      <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full ${s.badge}`}>
                        {s.badgeText}
                      </span>
                    </div>
                    <p className="font-display font-semibold text-text-primary text-sm mb-0.5">
                      {step.label}
                    </p>
                    <p className="text-text-muted text-xs font-sans leading-snug">{step.sub}</p>

                    {/* Step index */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-cosmic-deep border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-text-muted">{i + 1}</span>
                    </div>
                  </button>

                  {/* Arrow connector */}
                  {i < flow.steps.length - 1 && (
                    <div className="flex-shrink-0 flex items-center w-8">
                      <div className="w-full h-px bg-white/10 relative">
                        <span className="absolute -right-1 -top-2 text-text-muted text-sm">›</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {activeStep ? (
          <div className="glass rounded-2xl border border-white/5 p-6 md:p-8 mb-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${KIND[activeStep.kind].icon}`}>{activeStep.icon}</span>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">{activeStep.label}</h3>
                  <p className="text-text-muted text-sm font-sans">{activeStep.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-sans px-2 py-1 rounded-full ${KIND[activeStep.kind].badge}`}>
                  {KIND[activeStep.kind].badgeText}
                </span>
                {activeStep.url && (
                  <Link
                    href={activeStep.url}
                    className="text-xs font-sans px-3 py-1.5 rounded-lg bg-arcane-crystal/10 text-arcane-crystal border border-arcane-crystal/20 hover:bg-arcane-crystal/20 transition-all"
                  >
                    Visit →
                  </Link>
                )}
              </div>
            </div>
            <p className="text-text-secondary font-sans leading-relaxed max-w-2xl">
              {activeStep.detail}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/8 p-6 mb-10 text-center">
            <p className="text-text-muted font-sans text-sm">
              Click any step to see detail and links
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-16">
          <p className="text-text-muted text-xs font-sans self-center mr-2">Node types:</p>
          {(Object.entries(KIND) as [NodeKind, typeof KIND[NodeKind]][]).map(([kind, s]) => (
            <span key={kind} className={`inline-flex items-center gap-1.5 text-xs font-sans px-3 py-1 rounded-full border ${s.border} ${s.bg}`}>
              <span className={s.icon}>•</span>
              <span className="text-text-secondary">{s.badgeText}</span>
            </span>
          ))}
        </div>

        {/* All flows summary */}
        <div className="border-t border-white/5 pt-12">
          <h3 className="text-text-muted text-xs font-sans uppercase tracking-widest mb-6">All Journey Maps</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLOWS.map((f) => (
              <button
                key={f.id}
                onClick={() => { setActiveId(f.id); setActiveStepId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`text-left glass rounded-2xl border p-5 hover:border-white/20 transition-all hover-lift ${
                  activeId === f.id ? "border-arcane-crystal/30 bg-arcane-crystal/5" : "border-white/5"
                }`}
              >
                <p className={`text-xs font-mono mb-1 ${HZ_COLOR[f.hz] ?? "text-text-muted"}`}>
                  {f.guardian} · {f.hz} Hz
                </p>
                <p className="font-display font-semibold text-text-primary text-sm mb-1">{f.title}</p>
                <p className="text-text-muted text-xs font-sans">{f.steps.length} steps</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
