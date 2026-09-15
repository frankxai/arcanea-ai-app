/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeading } from "./models-arena-components";

interface DataProvenanceProps {
  lastFetched?: string;
  liveModelCount?: number;
  providerCount?: number;
}

export function DataProvenance({
  lastFetched,
  liveModelCount,
  providerCount,
}: DataProvenanceProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "openrouter" | "lmsys" | "arcanea-lab" | "byok"
  >("overview");

  return (
    <section className="mb-24" id="data-provenance">
      <SectionHeading
        tag="Data Transparency & Provenance"
        title="Where We Get Our Data"
        subtitle="Pricing and context data come live from provider APIs. Public leaderboards are cited where they exist. WorldCraft scores are editorial ratings, not a published benchmark run."
      />

      {/* Quick Source Pill Nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: "overview", label: "Pipeline Overview", icon: "🌐" },
          { id: "openrouter", label: "OpenRouter Live API", icon: "⚡" },
          { id: "lmsys", label: "LMSYS Creative Elo", icon: "🏆" },
          { id: "arcanea-lab", label: "Arcanea WorldCraft Lab", icon: "🔮" },
          { id: "byok", label: "Direct BYOK Gateways", icon: "🔑" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/30 shadow-[0_0_15px_rgba(127,255,212,0.1)]"
                : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/80 hover:border-white/12"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--arc-brand-atlantean-teal)]/25 transition-all">
            <div className="w-9 h-9 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] flex items-center justify-center text-lg mb-4">
              ⚡
            </div>
            <h3 className="text-sm font-semibold text-white mb-2 font-[family-name:var(--font-display)]">
              1. OpenRouter Live Feed
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Hourly synchronization directly from{" "}
              <code className="text-white/70 bg-white/[0.04] px-1 py-0.5 rounded">
                openrouter.ai/api/v1/models
              </code>
              . Powers live pricing, context window lengths, token limits, and free tier status.
            </p>
            <div className="text-[11px] text-[var(--arc-brand-atlantean-teal)] font-mono">
              {liveModelCount ? `Live: ${liveModelCount} models tracked` : "Live feed unavailable — showing curated list"}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--arc-brand-arcanean-gold)]/25 transition-all">
            <div className="w-9 h-9 rounded-xl bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)] flex items-center justify-center text-lg mb-4">
              🏆
            </div>
            <h3 className="text-sm font-semibold text-white mb-2 font-[family-name:var(--font-display)]">
              2. LMSYS Creative Arena
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Human blind double-blind evaluation from the Chatbot Arena Creative Writing & Storytelling category. Measures subjective prose charm, cadence, and emotional connection.
            </p>
            <div className="text-[11px] text-[var(--arc-brand-arcanean-gold)] font-mono">
              Elo scale: 1150 – 1400+
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--arc-brand-cosmic-blue)]/25 transition-all">
            <div className="w-9 h-9 rounded-xl bg-[var(--arc-brand-cosmic-blue)]/10 text-[var(--arc-brand-cosmic-blue)] flex items-center justify-center text-lg mb-4">
              📜
            </div>
            <h3 className="text-sm font-semibold text-white mb-2 font-[family-name:var(--font-display)]">
              3. IFEval & RULER Recall
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Instruction Following Evaluation (IFEval) for strict negative constraint execution (e.g. banning clichés) plus RULER benchmark for needle-in-haystack recall across 1M tokens.
            </p>
            <div className="text-[11px] text-[var(--arc-brand-cosmic-blue)] font-mono">
              Public leaderboard reference
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--arc-void)]/25 transition-all">
            <div className="w-9 h-9 rounded-xl bg-[var(--arc-void)]/10 text-[var(--arc-void)] flex items-center justify-center text-lg mb-4">
              🔮
            </div>
            <h3 className="text-sm font-semibold text-white mb-2 font-[family-name:var(--font-display)]">
              4. Arcanea WorldCraft Lab
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Editorial ratings for canon consistency, magic-system logic, and anti-slop prose. Assigned by hand from model use, not produced by an automated test run.
            </p>
            <div className="text-[11px] text-[var(--arc-void)] font-mono">
              Scores: 0 – 100 editorial rating
            </div>
          </div>
        </div>
      )}

      {activeTab === "openrouter" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                Live OpenRouter Data Ingestion
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Real-time API ingestion point with 1-hour ISR revalidation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--arc-brand-atlantean-teal)] font-mono bg-[var(--arc-brand-atlantean-teal)]/10 px-3 py-1.5 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/20">
                <span className="w-2 h-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-ping" />
                Live Sync Active
              </span>
              <a
                href="https://openrouter.ai/models"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-colors"
              >
                Inspect OpenRouter ↗
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">
                Endpoint URL
              </span>
              <div className="text-xs font-mono text-white/80 mt-1 truncate">
                https://openrouter.ai/api/v1/models
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">
                App Route Fallback
              </span>
              <div className="text-xs font-mono text-white/80 mt-1">
                /api/models/openrouter?free=true
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">
                Revalidation Frequency
              </span>
              <div className="text-xs font-mono text-[var(--arc-brand-atlantean-teal)] mt-1">
                Every 3600 seconds (1 hour)
              </div>
            </div>
          </div>

          <div className="text-xs text-white/60 space-y-2 leading-relaxed">
            <p>
              • <strong>Prompt & Completion Pricing:</strong> Sourced directly from provider rate sheets normalized to USD per million tokens.
            </p>
            <p>
              • <strong>Context Window:</strong> Verified context length metadata reported by the top provider for each model architecture.
            </p>
            <p>
              • <strong>Free Tier Detection:</strong> Models with prompt and completion rates set to $0.00 are dynamically grouped into our Zen Free Tier radar.
            </p>
          </div>
        </div>
      )}

      {activeTab === "lmsys" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                LMSYS Chatbot Arena — Creative Writing Category
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Crowdsourced human double-blind evaluations specifically for prose style and storytelling.
              </p>
            </div>
            <a
              href="https://chat.lmsys.org/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-colors"
            >
              LMSYS Leaderboard ↗
            </a>
          </div>

          <div className="space-y-4 text-xs text-white/60 leading-relaxed">
            <p>
              Traditional benchmarks (like MMLU or HumanEval) score models on multiple choice trivia or Python scripts. For high fantasy fiction, raw math ability tells you very little about whether a model writes gripping, atmospheric prose or flat corporate summaries.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h4 className="text-xs font-semibold text-[var(--arc-brand-arcanean-gold)] mb-1">
                  How Elo is Calculated
                </h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Anonymous side-by-side human votes, published by LMArena. Users submit creative prompts (e.g. &ldquo;Write the dying speech of an ancient dragon&rdquo;) and vote on which model sounds more natural, evocative, and compelling.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <h4 className="text-xs font-semibold text-[var(--arc-brand-atlantean-teal)] mb-1">
                  Read the Live Leaderboard
                </h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Rankings move with every model release. Check the current creative-writing standings on the leaderboard itself rather than relying on a snapshot here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "arcanea-lab" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                The Arcanea WorldCraft Rating
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Editorial criteria for epic worldbuilding. These are judgments, not measured benchmark results.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <div className="text-xs font-bold text-white mb-1">1. Canon Continuity</div>
              <p className="text-[11px] text-white/50">
                Feeding a 100K-word universe bible and testing if model remembers minor sibling lineages in Book 3 without contradictions.
              </p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <div className="text-xs font-bold text-white mb-1">2. Magic System Logic</div>
              <p className="text-[11px] text-white/50">
                Applying Sanderson-style hard limitations (energy costs, material components, Solfeggio frequencies) and auditing for exploit loopholes.
              </p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <div className="text-xs font-bold text-white mb-1">3. Anti-Slop Grade</div>
              <p className="text-[11px] text-white/50">
                Detecting banned generic verbal tics (&ldquo;tapestry&rdquo;, &ldquo;delve&rdquo;, &ldquo;testament to&rdquo;, &ldquo;nestled&rdquo;) using regex scans.
              </p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <div className="text-xs font-bold text-white mb-1">4. Polyphonic Dialogue</div>
              <p className="text-[11px] text-white/50">
                Evaluating if distinct characters (an ancient god vs a cynical thief) maintain unique vocabulary, rhythm, and sentence structures.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[var(--arc-void)]/10 border border-[var(--arc-void)]/20 rounded-xl text-xs text-white/70 leading-relaxed">
            <strong>Formula:</strong>{" "}
            <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">
              WorldCraft Index = (0.35 × Lore Memory) + (0.30 × Prose Quality) + (0.20 × Magic Logic) + (0.15 × Character Voice)
            </code>
          </div>
        </div>
      )}

      {activeTab === "byok" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                Direct BYOK (Bring Your Own Key) Gateway
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Zero middleman markup. Plug your personal provider keys directly into Arcanea Studio.
              </p>
            </div>
            <Link
              href="/chat"
              className="text-xs text-[var(--arc-brand-atlantean-teal)] hover:underline flex items-center gap-1"
            >
              Configure Keys in Studio ↗
            </Link>
          </div>

          <p className="text-xs text-white/60 mb-6 leading-relaxed">
            Arcanea operates on a true sovereign creator ethos: your unpublished high fantasy manuscripts and lore are never trained on by us, never logged to third parties, and never marked up. You pay standard raw wholesale token rates directly to the provider:
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs">
              <div className="font-semibold text-white mb-1">Anthropic (Claude)</div>
              <div className="text-[11px] text-white/40 mb-2">Direct api.anthropic.com</div>
              <div className="text-[10px] text-[var(--arc-brand-atlantean-teal)] font-mono">
                Sonnet 3.7: $3 / $15 per Mtok
              </div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs">
              <div className="font-semibold text-white mb-1">Google (Gemini)</div>
              <div className="text-[11px] text-white/40 mb-2">Direct generativelanguage.googleapis.com</div>
              <div className="text-[10px] text-[var(--arc-brand-atlantean-teal)] font-mono">
                Gemini 2.0 Pro: $1.25 / $5 per Mtok
              </div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs">
              <div className="font-semibold text-white mb-1">DeepSeek</div>
              <div className="text-[11px] text-white/40 mb-2">Direct api.deepseek.com</div>
              <div className="text-[10px] text-[var(--arc-brand-atlantean-teal)] font-mono">
                DeepSeek R1: $0.55 / $2.19 per Mtok
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
