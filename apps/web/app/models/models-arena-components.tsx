/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AI_MODELS,
  ARCANEAN_WORKFLOWS,
  MODEL_WEEKLY_UPDATES,
  getCuratedBestModels,
  type ArcaneanWorkflow,
  type AIModel,
} from "@/lib/models-data";
import { useModelFavorites } from "@/hooks/use-model-favorites";

/* ------------------------------------------------------------------ */
/*  Shared Helpers                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <span className="inline-block text-xs font-medium tracking-widest uppercase text-[var(--arc-brand-atlantean-teal)]/70 mb-3">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-display)]">
        {title}
      </h2>
      <p className="mt-3 text-base text-white/50 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export function FreeBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
      FREE
    </span>
  );
}

export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`;
  return `${tokens}`;
}

export function formatPrice(price: number | "free"): string {
  if (price === "free") return "Free";
  if (price < 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Curated Best Showcase (The 5 Crown Models for High Fantasy)       */
/* ------------------------------------------------------------------ */

export function CuratedBestShowcase() {
  const curated = getCuratedBestModels().slice(0, 5);
  const { isFavorite, toggleFavorite } = useModelFavorites();

  const awardMeta: Record<
    string,
    { title: string; badge: string; border: string; glow: string }
  > = {
    "editors-choice": {
      title: "Editor's Choice",
      badge: "🏆 #1 For High Fantasy Novels",
      border: "border-[var(--arc-brand-arcanean-gold)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]",
    },
    "best-lore": {
      title: "Best 1M Lore Vault",
      badge: "📜 1M Token Canon Sentinel",
      border: "border-[var(--arc-brand-cosmic-blue)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(77,159,255,0.15)]",
    },
    "best-magic": {
      title: "Grand Enchanter",
      badge: "🔮 Hard Magic & Consequence Logic",
      border: "border-[var(--arc-brand-atlantean-teal)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(127,255,212,0.15)]",
    },
    "best-free": {
      title: "Best Free Worldbuilder",
      badge: "⚡ 100% Free on Zen Routing",
      border: "border-[var(--arc-wind)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(200,225,255,0.15)]",
    },
    "best-dialogue": {
      title: "Bard of Truth",
      badge: "🎭 Polyphonic Character Dialogue",
      border: "border-[var(--arc-void)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(180,120,255,0.15)]",
    },
    "best-tactics": {
      title: "War Master",
      badge: "⚔️ Combat & Magic Choreography",
      border: "border-[var(--arc-fire)]/40",
      glow: "hover:shadow-[0_0_30px_rgba(255,100,100,0.15)]",
    },
  };

  return (
    <section className="mb-24" id="curated-best">
      <SectionHeading
        tag="Arcanea Hall of Fame"
        title="Curated Best for Worldbuilders"
        subtitle="We tested dozens of frontier and open-weight models against 50,000+ words of high fantasy lore, magic system design, and novel chapters. These five represent the absolute peak."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {curated.map((model) => {
          const meta =
            awardMeta[model.curatedAward || ""] || awardMeta["editors-choice"];
          const favorited = isFavorite(model.id);

          return (
            <div
              key={model.id}
              className={`bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border ${meta.border} ${meta.glow} transition-all flex flex-col justify-between relative group`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.06] text-white/90 border border-white/[0.1]">
                    {meta.badge}
                  </span>
                  <button
                    onClick={() => toggleFavorite(model.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      favorited
                        ? "bg-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)] border-[var(--arc-brand-arcanean-gold)]/40"
                        : "bg-white/[0.03] text-white/30 hover:text-white border-white/[0.06]"
                    }`}
                    title={favorited ? "Saved in Favorites" : "Add to Favorites"}
                  >
                    <span className="text-sm">{favorited ? "★" : "☆"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">{model.providerLogo}</span>
                  <div>
                    <h3 className="text-base font-bold text-white font-[family-name:var(--font-display)]">
                      {model.name}
                    </h3>
                    <p className="text-xs text-white/40">{model.provider}</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--arc-brand-atlantean-teal)] font-medium mb-3">
                  {model.curatedRole}
                </p>

                {/* WorldCraft Score Box */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-white/60">WorldCraft Index</span>
                    <span className="text-[var(--arc-brand-arcanean-gold)] font-mono font-bold text-sm">
                      {model.worldCraftScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/[0.04] text-[10px]">
                    <div>
                      <span className="text-white/40 block">Prose Lyricism</span>
                      <span className="text-white font-mono font-semibold">
                        {model.proseQuality}% (Grade {model.slopResistance})
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Lore Retention</span>
                      <span className="text-white font-mono font-semibold">
                        {model.loreMemory}% ({formatContext(model.contextWindow)})
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed line-clamp-3 mb-4">
                  {model.worldbuildingSweetSpot}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white/40">
                  Gate:{" "}
                  <strong className="text-white/80">
                    {model.gateResonance} ({model.gateFrequency})
                  </strong>
                </span>
                <Link
                  href="/chat"
                  className="text-[var(--arc-brand-atlantean-teal)] hover:underline font-medium text-[11px]"
                >
                  Create in Studio →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WorldCraft Rankings Table                                         */
/* ------------------------------------------------------------------ */

export function WorldcraftRankingsTable() {
  const { isFavorite, toggleFavorite } = useModelFavorites();
  const sorted = [...AI_MODELS].sort(
    (a, b) => b.worldCraftScore - a.worldCraftScore,
  );

  return (
    <section className="mb-24" id="rankings">
      <SectionHeading
        tag="Creative Leaderboard"
        title="High Fantasy & Worldcraft Rankings"
        subtitle="Ranked by composite WorldCraft Index, evaluating prose lyricism, 1M canon memory, hard magic logic, anti-slop grade, and token pricing."
      />

      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="px-3 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-center w-12">
                #
              </th>
              <th className="px-3 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-center w-10">
                Fav
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider">
                Model & Provider
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-center">
                Gate
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                WorldCraft
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Prose
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Lore 1M
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Magic
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-center">
                Anti-Slop
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Context
              </th>
              <th className="px-4 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                In / Out
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sorted.map((model, i) => {
              const favorited = isFavorite(model.id);

              return (
                <tr
                  key={model.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-3 py-3.5 text-white/30 font-mono text-xs text-center">
                    {i + 1}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <button
                      onClick={() => toggleFavorite(model.id)}
                      className={`text-sm transition-colors ${
                        favorited
                          ? "text-[var(--arc-brand-arcanean-gold)]"
                          : "text-white/20 hover:text-white/60"
                      }`}
                      title={favorited ? "Favorited" : "Add to favorites"}
                    >
                      {favorited ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{model.providerLogo}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">
                            {model.name}
                          </span>
                          {model.pricing.input === "free" && <FreeBadge />}
                          {model.curatedAward === "editors-choice" && (
                            <span className="text-[10px] text-[var(--arc-brand-arcanean-gold)] font-bold">
                              🏆
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-white/40 block">
                          {model.curatedRole}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-block text-[11px] text-white/60 bg-white/[0.04] px-2 py-0.5 rounded">
                      {model.gateResonance}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-xs">
                    <span
                      style={{
                        color:
                          model.worldCraftScore >= 95
                            ? "var(--arc-brand-arcanean-gold)"
                            : model.worldCraftScore >= 90
                              ? "var(--arc-brand-atlantean-teal)"
                              : "var(--arc-wind)",
                      }}
                    >
                      {model.worldCraftScore}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-white/80">
                    {model.proseQuality}%
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-white/80">
                    {model.loreMemory}%
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-white/80">
                    {model.magicLogic}%
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-xs">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        model.slopResistance === "S"
                          ? "bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]"
                          : model.slopResistance === "A"
                            ? "bg-[var(--arc-brand-cosmic-blue)]/20 text-[var(--arc-brand-cosmic-blue)]"
                            : "bg-white/[0.05] text-white/50"
                      }`}
                    >
                      {model.slopResistance}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-white/60">
                    {formatContext(model.contextWindow)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-white/60">
                    {model.pricing.input === "free"
                      ? "Free"
                      : `${formatPrice(model.pricing.input)} / ${formatPrice(model.pricing.output)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Worldbuilding Workflow Map (The 10 Gates)                         */
/* ------------------------------------------------------------------ */

export function WorkflowMap() {
  return (
    <section className="mb-24" id="workflows">
      <SectionHeading
        tag="Creative Architecture"
        title="Arcanean Worldcraft Workflow Map"
        subtitle="How Arcanea routes models to dedicated worldbuilding and fantasy novel writing agents. Each agent embodies one of the Ten Gates with Solfeggio tuning, a primary model, and fallback chain."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARCANEAN_WORKFLOWS.map((wf) => {
          const primaryModel = AI_MODELS.find((m) => m.id === wf.model);

          return (
            <div
              key={wf.id}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:border-[var(--arc-brand-atlantean-teal)]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white font-[family-name:var(--font-display)]">
                    {wf.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
                    {wf.frequency || wf.gate}
                  </span>
                </div>

                <div className="text-[11px] text-white/40 mb-3 flex items-center gap-2">
                  <span>Guardian: <strong className="text-white/70">{wf.guardian}</strong></span>
                  <span>•</span>
                  <span>Gate: <strong className="text-white/70">{wf.gate}</strong></span>
                </div>

                {wf.domain && (
                  <p className="text-xs text-[var(--arc-brand-arcanean-gold)] font-medium mb-3">
                    {wf.domain}
                  </p>
                )}

                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  {wf.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Primary Model</span>
                  <span className="text-[var(--arc-brand-atlantean-teal)] font-medium font-mono">
                    {primaryModel?.name ?? wf.model}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/40 flex-shrink-0">Fallbacks</span>
                  <span className="text-white/60 text-right ml-2 font-mono text-[11px]">
                    {wf.fallbackModels
                      .map((id) => AI_MODELS.find((m) => m.id === id)?.name ?? id)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Novel Production Cost Calculator                                  */
/* ------------------------------------------------------------------ */

export function NovelCostCalculator({ models }: { models?: any[] }) {
  type NovelScale = "novella" | "novel" | "trilogy";
  const [novelScale, setNovelScale] = useState<NovelScale>("novel");
  const [worldBibleSize, setWorldBibleSize] = useState<number>(50_000); // tokens

  const scaleSpecs: Record<
    NovelScale,
    { words: number; outputTokens: number; chapters: number }
  > = {
    novella: { words: 40_000, outputTokens: 53_000, chapters: 8 },
    novel: { words: 100_000, outputTokens: 133_000, chapters: 20 },
    trilogy: { words: 300_000, outputTokens: 400_000, chapters: 60 },
  };

  const currentScale = scaleSpecs[novelScale];
  const totalPromptTokens = currentScale.chapters * worldBibleSize;

  const costBreakdown = AI_MODELS.map((model) => {
    if (model.pricing.input === "free" || model.pricing.output === "free") {
      return { model, cost: 0, isFree: true };
    }
    const inputCost =
      (totalPromptTokens / 1_000_000) * (model.pricing.input as number);
    const outputCost =
      (currentScale.outputTokens / 1_000_000) *
      (model.pricing.output as number);
    return { model, cost: inputCost + outputCost, isFree: false };
  }).sort((a, b) => a.cost - b.cost);

  return (
    <section className="mb-24" id="novel-calculator">
      <SectionHeading
        tag="Production Economics"
        title="Novel Production Cost Calculator"
        subtitle="Estimate the exact API cost to draft full fantasy manuscripts with your world bible in context. Transparent wholesale token economics."
      />

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/[0.06]">
          {/* Controls */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
              1. Select Manuscript Scale
            </label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: "novella", label: "Novella", words: "40K words" },
                { id: "novel", label: "Epic Novel", words: "100K words" },
                { id: "trilogy", label: "Trilogy Saga", words: "300K words" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setNovelScale(s.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    novelScale === s.id
                      ? "bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)]/40 text-white"
                      : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80"
                  }`}
                >
                  <div className="text-xs font-bold">{s.label}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {s.words}
                  </div>
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
              2. World Bible Context Per Chapter:{" "}
              <span className="text-[var(--arc-brand-atlantean-teal)] font-mono">
                {formatContext(worldBibleSize)} tokens
              </span>
            </label>
            <input
              type="range"
              min={10_000}
              max={200_000}
              step={10_000}
              value={worldBibleSize}
              onChange={(e) => setWorldBibleSize(Number(e.target.value))}
              className="w-full accent-[var(--arc-brand-atlantean-teal)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>10K (Short Glossary)</span>
              <span>100K (Full World Bible)</span>
              <span>200K (Multi-Realm Compendium)</span>
            </div>
          </div>

          {/* Scale Summary */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--arc-brand-arcanean-gold)] font-mono">
                Simulation Parameters
              </span>
              <h4 className="text-sm font-bold text-white mt-1 mb-3">
                {novelScale.toUpperCase()} ({currentScale.words.toLocaleString()}{" "}
                words in {currentScale.chapters} chapters)
              </h4>
              <ul className="text-xs text-white/50 space-y-2">
                <li className="flex justify-between">
                  <span>Output Generation:</span>
                  <span className="font-mono text-white/80">
                    ~{currentScale.outputTokens.toLocaleString()} tokens
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Prompt Context Ingestion:</span>
                  <span className="font-mono text-white/80">
                    ~{totalPromptTokens.toLocaleString()} tokens
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Draft Iterations per Chapter:</span>
                  <span className="font-mono text-white/80">1 Primary Pass</span>
                </li>
              </ul>
            </div>
            <p className="text-[11px] text-white/40 mt-4 pt-3 border-t border-white/[0.04]">
              Note: Free models run at $0.00 via Zen routing. Paid models use direct wholesale provider API pricing.
            </p>
          </div>
        </div>

        {/* Output Ranking */}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
          Estimated Cost Across Tracked Models
        </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {costBreakdown.slice(0, 8).map(({ model, cost, isFree }) => (
            <div
              key={model.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-white truncate mr-2">
                  {model.name}
                </span>
                <span className="text-base">{model.providerLogo}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-[10px] text-white/40">
                  {model.gateResonance} Gate
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    isFree
                      ? "text-[var(--arc-brand-atlantean-teal)]"
                      : "text-[var(--arc-brand-arcanean-gold)]"
                  }`}
                >
                  {isFree ? "$0.00 (Free)" : `$${cost.toFixed(2)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Model Deep Dives                                                   */
/* ------------------------------------------------------------------ */

export function ModelDeepDives() {
  const top = [...AI_MODELS]
    .sort((a, b) => b.worldCraftScore - a.worldCraftScore)
    .slice(0, 8);

  return (
    <section className="mb-24" id="deep-dives">
      <SectionHeading
        tag="Author Evaluations"
        title="Fantasy Model Deep Dives"
        subtitle="Detailed authoring analysis: sensory strengths, fantasy genre sweet spots, anti-slop resistance, and failure modes."
      />

      <div className="space-y-3">
        {top.map((model) => (
          <details
            key={model.id}
            className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="text-xl">{model.providerLogo}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-[family-name:var(--font-display)]">
                      {model.name}
                    </span>
                    <span className="text-xs text-white/40">
                      {model.provider}
                    </span>
                    {model.curatedAward && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)] border border-[var(--arc-brand-arcanean-gold)]/20">
                        {model.curatedAward.replace("-", " ")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--arc-brand-atlantean-teal)] mt-0.5 block">
                    {model.curatedRole}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-white/40 block">
                    WorldCraft Index
                  </span>
                  <span className="text-sm font-mono font-bold text-[var(--arc-brand-atlantean-teal)]">
                    {model.worldCraftScore}/100
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </summary>

            <div className="px-5 pb-6 border-t border-white/[0.04]">
              {/* Sweet spot banner */}
              <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--arc-brand-arcanean-gold)]">
                  Worldbuilder&apos;s Sweet Spot:
                </span>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  {model.worldbuildingSweetSpot}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-[var(--arc-wind)] uppercase tracking-wider mb-2">
                    Fantasy Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {model.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/60 flex items-start gap-1.5"
                      >
                        <span className="text-[var(--arc-wind)] mt-0.5 flex-shrink-0">
                          +
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[var(--arc-fire)] uppercase tracking-wider mb-2">
                    Weaknesses & Caveats
                  </h4>
                  <ul className="space-y-1.5">
                    {model.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/60 flex items-start gap-1.5"
                      >
                        <span className="text-[var(--arc-fire)] mt-0.5 flex-shrink-0">
                          −
                        </span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[var(--arc-brand-cosmic-blue)] uppercase tracking-wider mb-2">
                    Creative Metrics
                  </h4>
                  <div className="space-y-2 text-xs text-white/50">
                    <div className="flex justify-between">
                      <span>Prose Lyricism:</span>
                      <span className="font-mono text-white/80">
                        {model.proseQuality}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>1M Canon Memory:</span>
                      <span className="font-mono text-white/80">
                        {model.loreMemory}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Magic System Logic:</span>
                      <span className="font-mono text-white/80">
                        {model.magicLogic}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anti-Slop Grade:</span>
                      <span className="font-mono font-bold text-[var(--arc-brand-atlantean-teal)]">
                        Grade {model.slopResistance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creative Writing Elo:</span>
                      <span className="font-mono text-white/80">
                        {model.benchmarks.creativeWritingElo ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Update Log                                                         */
/* ------------------------------------------------------------------ */

export function UpdateLog() {
  const latest = MODEL_WEEKLY_UPDATES[0];
  if (!latest) return null;

  return (
    <section className="mb-24" id="changelog">
      <SectionHeading
        tag="Changelog"
        title="Weekly Intelligence Log"
        subtitle="Track updates to the creative model arena, free tier status, and Solfeggio gate tuning decisions."
      />
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[var(--arc-brand-atlantean-teal)]/80">
            Week of {latest.weekOf}
          </span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed mb-4">
          {latest.notes}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-white/40">Free models this week:</span>
          {latest.models.map((id) => {
            const model = AI_MODELS.find((m) => m.id === id);
            return (
              <span
                key={id}
                className="inline-block px-2 py-0.5 rounded text-[10px] text-[var(--arc-brand-atlantean-teal)]/80 bg-[var(--arc-brand-atlantean-teal)]/5 border border-[var(--arc-brand-atlantean-teal)]/15 font-mono"
              >
                {model?.name ?? id}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Image Arena Teaser                                                 */
/* ------------------------------------------------------------------ */

export function ImageArenaTeaser() {
  return (
    <section className="mb-24">
      <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-[var(--arc-void)]/80 mb-3">
              Visual Worldbuilding
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
              Concept Art & Image Arena
            </h2>
            <p className="text-white/50 max-w-lg leading-relaxed">
              Compare FLUX.2, Midjourney v7, DALL-E 3, and Stable Diffusion 3.5.
              Evaluated for realm cartography, armor heraldry, and godbeast rendering.
            </p>
          </div>
          <Link
            href="/models/image"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-void)]/15 border border-[var(--arc-void)]/30 text-[var(--arc-void)] font-medium text-sm hover:bg-[var(--arc-void)]/25 transition-all flex-shrink-0"
          >
            View Visual Arena
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

export function ArenaCTA() {
  return (
    <section className="text-center py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
        Begin Crafting Your Universe
      </h2>
      <p className="text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">
        Every model in the Arena is directly available in Arcanea Studio. Free models run on Zen routing. Premium models run via your own sovereign API keys.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-semibold text-sm hover:shadow-[0_0_30px_rgba(127,255,212,0.25)] transition-all"
        >
          Open World Studio
        </Link>
        <Link
          href="/studio/author"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/70 font-medium text-sm hover:border-white/[0.2] hover:text-white transition-all"
        >
          Author Workspace
        </Link>
        <Link
          href="/models/image"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/70 font-medium text-sm hover:border-white/[0.2] hover:text-white transition-all"
        >
          Image Arena
        </Link>
      </div>
    </section>
  );
}
