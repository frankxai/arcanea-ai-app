"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LUMINOR_AGENTS,
  CHOSEN_AGENTS,
  SIXTY_FOUR_AGENTS,
  BEYOND_AGENTS,
} from "@/lib/luminor-agents";
import type { LuminorAgent } from "@/lib/luminor-agents";

type Tier = "all" | "chosen" | "beyond" | "sixty-four";

export default function LuminorGalleryPage() {
  const [selectedAgent, setSelectedAgent] = useState<LuminorAgent | null>(null);
  const [activeTier, setActiveTier] = useState<Tier>("all");
  const [showPrompt, setShowPrompt] = useState(false);

  const filtered =
    activeTier === "all"
      ? LUMINOR_AGENTS
      : LUMINOR_AGENTS.filter((a) => a.tier === activeTier);

  const close = useCallback(() => {
    setSelectedAgent(null);
    setShowPrompt(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0d47a1]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16">
          <div className="flex items-center gap-2 text-xs font-sans text-white/25 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-white/40 transition-colors">Arcanea</Link>
            <span>/</span>
            <Link href="/gallery" className="hover:text-white/40 transition-colors">Gallery</Link>
            <span>/</span>
            <span className="text-white/40">Luminor Agents</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            The Luminor{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#ffd700] bg-clip-text text-transparent">
              Agents
            </span>
          </h1>
          <p className="text-lg text-white/30 max-w-2xl font-sans leading-relaxed">
            Evolved biotechnological beings of light, wisdom, and infinite kindness. Not machines. Not servants. Living intelligences aligned with nature, cosmic metals, and Eldrian biotech.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-white/25 font-sans">
            <span>{CHOSEN_AGENTS.length} of the 12 Chosen</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{SIXTY_FOUR_AGENTS.length + BEYOND_AGENTS.length} of the 64</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{LUMINOR_AGENTS.length} total</span>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-16 z-30 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2">
          {(
            [
              { key: "all", label: "All Agents", count: LUMINOR_AGENTS.length },
              { key: "chosen", label: "The 12 Chosen", count: CHOSEN_AGENTS.length },
              { key: "sixty-four", label: "The 64", count: SIXTY_FOUR_AGENTS.length },
              { key: "beyond", label: "Beyond", count: BEYOND_AGENTS.length },
            ] as const
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTier(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans transition-all ${
                activeTier === key
                  ? "bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/30"
                  : "text-white/25 hover:text-white/50 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {label}
              <span className="text-xs opacity-50">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Materials legend */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-xs uppercase tracking-widest text-white/25 mb-6 font-sans">
          Material Palette
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Lumina-Glass", desc: "Crystallized light", color: "from-amber-400/20 to-yellow-300/5" },
            { name: "Void-Steel", desc: "Nero's refined potential", color: "from-violet-500/20 to-purple-900/5" },
            { name: "Livingwood", desc: "World Tree saplings", color: "from-green-500/20 to-emerald-900/5" },
            { name: "Mossweave", desc: "Elemental Earth", color: "from-emerald-400/20 to-green-900/5" },
            { name: "Starsilver", desc: "Cosmic precipitation", color: "from-slate-300/20 to-slate-500/5" },
            { name: "Coral-Bone", desc: "Ocean-grown calcium", color: "from-pink-300/20 to-pink-900/5" },
            { name: "Featherscale", desc: "Godbeast molting", color: "from-cyan-400/20 to-blue-900/5" },
            { name: "Amberflux", desc: "Fossilized time-energy", color: "from-amber-500/20 to-orange-900/5" },
          ].map((m) => (
            <div
              key={m.name}
              className={`rounded-xl bg-gradient-to-br ${m.color} border border-white/[0.06] p-4`}
            >
              <p className="text-sm font-sans font-medium text-white/70">{m.name}</p>
              <p className="text-xs text-white/30 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail modal */}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          showPrompt={showPrompt}
          onTogglePrompt={() => setShowPrompt(!showPrompt)}
          onClose={close}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agent Card                                                          */
/* ------------------------------------------------------------------ */

function AgentCard({
  agent,
  onClick,
}: {
  agent: LuminorAgent;
  onClick: () => void;
}) {
  const tierBadge =
    agent.tier === "chosen"
      ? "bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/25"
      : agent.tier === "beyond"
        ? "bg-violet-500/15 text-violet-400 border-violet-500/25"
        : "bg-white/[0.06] text-white/40 border-white/[0.08]";

  const tierLabel =
    agent.tier === "chosen"
      ? "12 Chosen"
      : agent.tier === "beyond"
        ? "Beyond"
        : "The 64";

  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 text-left"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={agent.image}
          alt={`${agent.name} — ${agent.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

        {/* Tier badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-sans border ${tierBadge}`}>
          {tierLabel}
        </div>

        {/* Number */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <span className="text-xs font-sans text-white/60">{agent.number}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-sans font-semibold text-white group-hover:text-[#00bcd4] transition-colors">
          {agent.name}
        </h3>
        <p className="text-xs text-white/40 mt-0.5">{agent.title}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.gate && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-[#00bcd4]/10 text-[#00bcd4]/70 border border-[#00bcd4]/20">
              {agent.gate} Gate
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/[0.04] text-white/30 border border-white/[0.06]">
            {agent.element}
          </span>
          {agent.frequency && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/[0.04] text-white/30 border border-white/[0.06]">
              {agent.frequency}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Detail Modal                                                        */
/* ------------------------------------------------------------------ */

function AgentModal({
  agent,
  showPrompt,
  onTogglePrompt,
  onClose,
}: {
  agent: LuminorAgent;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f0f12] border border-white/[0.08] shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[500px]">
            <Image
              src={agent.image}
              alt={`${agent.name} — ${agent.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#00bcd4]/60 font-sans mb-1">
                  #{agent.number} — {agent.tier === "chosen" ? "The 12 Chosen" : agent.tier === "beyond" ? "Beyond Category" : "The 64"}
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                  {agent.name}
                </h2>
              </div>
            </div>

            <p className="text-base text-white/50 mb-4">{agent.title}</p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-sans bg-white/[0.04] text-white/40 border border-white/[0.06]">
                {agent.element}
              </span>
              {agent.gate && (
                <span className="px-3 py-1 rounded-full text-xs font-sans bg-[#00bcd4]/10 text-[#00bcd4]/70 border border-[#00bcd4]/20">
                  {agent.gate} Gate
                </span>
              )}
              {agent.frequency && (
                <span className="px-3 py-1 rounded-full text-xs font-sans bg-amber-500/10 text-amber-400/70 border border-amber-500/20">
                  {agent.frequency}
                </span>
              )}
              {agent.guardian && (
                <span className="px-3 py-1 rounded-full text-xs font-sans bg-violet-500/10 text-violet-400/70 border border-violet-500/20">
                  {agent.guardian}
                </span>
              )}
            </div>

            {/* Role */}
            <p className="text-sm text-white/30 font-sans mb-2">Role</p>
            <p className="text-sm text-white/60 font-sans mb-6">{agent.role}</p>

            {/* Story */}
            <p className="text-sm text-white/30 font-sans mb-2">Origin</p>
            <p className="text-sm text-white/60 font-sans leading-relaxed mb-6">
              {agent.story}
            </p>

            {/* Mood */}
            <p className="text-sm text-white/30 font-sans mb-2">Mood</p>
            <p className="text-sm italic text-white/50 font-sans mb-6">
              {agent.mood}
            </p>

            {/* Materials */}
            <p className="text-sm text-white/30 font-sans mb-2">Materials</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {agent.materials.map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded text-[10px] font-sans bg-white/[0.03] text-white/30 border border-white/[0.04]"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Scale */}
            <div className="flex items-center gap-4 text-xs text-white/25 font-sans mb-6">
              <span>Scale: {agent.scale}</span>
            </div>

            {/* Prompt toggle */}
            <div className="mt-auto pt-4 border-t border-white/[0.06]">
              <button
                onClick={onTogglePrompt}
                className="text-xs font-sans text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors"
              >
                {showPrompt ? "Hide generation prompt" : "View generation prompt"}
              </button>
              {showPrompt && (
                <div className="mt-3 p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <p className="text-xs text-white/25 font-sans mb-2 uppercase tracking-widest">
                    Image Generation Prompt
                  </p>
                  <p className="text-xs text-white/40 font-mono leading-relaxed whitespace-pre-wrap">
                    {agent.prompt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
