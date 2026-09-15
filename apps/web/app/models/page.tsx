/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import {
  AI_MODELS,
  MODEL_WEEKLY_UPDATES,
  getFreeModels,
} from "@/lib/models-data";
import { SplitText } from "@/components/motion/split-text";
import { fetchLiveModels } from "@/lib/openrouter-live";
import {
  CuratedBestShowcase,
  WorldcraftRankingsTable,
  WorkflowMap,
  NovelCostCalculator,
  ModelDeepDives,
  UpdateLog,
  ImageArenaTeaser,
  ArenaCTA,
} from "./models-arena-components";
import ModelExplorer from "./model-explorer";
import { ModelComparator } from "./model-comparator";
import { DataProvenance } from "./data-provenance";

export const revalidate = 3600;

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "AI Model Arena | Arcanea — Worldbuilding & High Fantasy Writing Intelligence",
  description:
    "Evaluate, benchmark, and compare AI models dedicated for worldbuilding, high fantasy fiction, 1M canon memory, hard magic logic, and anti-slop prose. Live OpenRouter pricing, favorites, and Arcanea WorldCraft lab scores.",
  keywords: [
    "AI models for world building",
    "best AI for fantasy writing",
    "high fantasy LLM comparison",
    "1M context canon memory",
    "hard magic system AI",
    "free AI writing models",
    "Claude vs Gemini for fiction",
    "AI model arena",
    "WorldCraft index",
    "Arcanea Gate resonance",
  ],
  openGraph: {
    title: "AI Model Arena | Arcanea — Worldbuilding & High Fantasy Intelligence",
    description:
      "Empirical benchmarks, 1M lore vault tracking, anti-slop prose evaluations, and side-by-side fantasy model comparison. Updated hourly.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                            */
/* ------------------------------------------------------------------ */

function ArenaJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea Worldcraft AI Model Arena",
    description:
      "Empirical benchmarks, rankings, and analysis of AI models dedicated to worldbuilding, high fantasy writing, and universe continuity.",
    publisher: {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
    },
    dateModified: MODEL_WEEKLY_UPDATES[0]?.weekOf ?? "2026-04-14",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function ModelsArenaPage() {
  const live = await fetchLiveModels();
  const modelCount = live?.meta.total ?? AI_MODELS.length;
  const freeCount = live?.meta.free ?? getFreeModels().length;
  const providerCount =
    live?.meta.providers ?? new Set(AI_MODELS.map((m) => m.provider)).size;
  const isLive = live !== null;

  // Count 1M+ context models
  const oneMillionCount = AI_MODELS.filter(
    (m) => m.contextWindow >= 1_000_000,
  ).length;

  return (
    <div className="relative min-h-screen bg-cosmic-deep text-white selection:bg-[var(--arc-brand-atlantean-teal)]/20 selection:text-[var(--arc-brand-atlantean-teal)]">
      <ArenaJsonLd />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--arc-brand-atlantean-teal)] mb-3 bg-[var(--arc-brand-atlantean-teal)]/10 px-3 py-1 rounded-full border border-[var(--arc-brand-atlantean-teal)]/20">
            Creative Intelligence Layer
          </span>

          <SplitText
            as="h1"
            text="AI Model Arena"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[family-name:var(--font-display)] mb-4"
            delay={0.1}
            stagger={0.04}
          />

          <h2 className="text-lg sm:text-xl text-[var(--arc-brand-arcanean-gold)] font-medium max-w-3xl mx-auto mb-4 font-[family-name:var(--font-display)]">
            Dedicated Intelligence for Worldbuilders, Fantasy Novelists & Saga Architects
          </h2>

          <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Evaluate models by what truly matters for fiction: 1M-token canon retention, poetic cadence, hard magic causality, polyphonic character voices, and anti-slop resistance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/40 mb-8 font-mono">
            <span className="flex items-center gap-1.5">
              <strong className="text-white">{modelCount}</strong> models tracked
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <strong className="text-[var(--arc-brand-atlantean-teal)]">{freeCount}</strong> 100% free
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <strong className="text-[var(--arc-brand-cosmic-blue)]">{oneMillionCount}</strong> 1M+ context titans
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-[var(--arc-brand-atlantean-teal)]">
                <span className="w-2 h-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
                Live OpenRouter Sync
              </span>
            ) : (
              <span>Last updated {MODEL_WEEKLY_UPDATES[0]?.weekOf ?? "recently"}</span>
            )}
          </div>

          {/* Quick Anchor Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-xs">
            <a
              href="#curated-best"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-[var(--arc-brand-arcanean-gold)]/40 transition-all"
            >
              🏆 Curated Best
            </a>
            <a
              href="#explorer"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-[var(--arc-brand-atlantean-teal)]/40 transition-all"
            >
              🔍 Model Explorer & Favorites
            </a>
            <a
              href="#comparator"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-[var(--arc-void)]/40 transition-all"
            >
              ⚔️ Head-to-Head Comparator
            </a>
            <a
              href="#rankings"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              📊 WorldCraft Leaderboard
            </a>
            <a
              href="#workflows"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              ⛩️ 10 Gates Workflow Map
            </a>
            <a
              href="#data-provenance"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              🌐 Data Sources & Pipelines
            </a>
            <a
              href="#novel-calculator"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              💰 Novel Cost Calculator
            </a>
          </div>
        </header>

        {/* 1. Curated Best Showcase (The 5 Crown Models) */}
        <CuratedBestShowcase />

        {/* 2. Interactive Worldcraft Model Explorer (with Favorites & Gate Filtering) */}
        <ModelExplorer models={live?.models} />

        {/* 3. Side-by-Side Model Comparator */}
        <ModelComparator />

        {/* 4. Full Worldcraft Rankings Table */}
        <WorldcraftRankingsTable />

        {/* 5. Novel Production Cost Calculator */}
        <NovelCostCalculator models={live?.models} />

        {/* 6. Arcanean Worldbuilding Workflow Map (The 10 Gates & Guardians) */}
        <WorkflowMap />

        {/* 7. Transparent Data Provenance & Methodology Hub */}
        <DataProvenance
          lastFetched={live?.meta.lastFetched}
          liveModelCount={live?.meta.total}
          providerCount={live?.meta.providers}
        />

        {/* 8. Author Deep Dives */}
        <ModelDeepDives />

        {/* 9. Weekly Changelog & Update Log */}
        <UpdateLog />

        {/* 10. Image Arena Teaser & Final CTA */}
        <ImageArenaTeaser />
        <ArenaCTA />
      </main>
    </div>
  );
}
