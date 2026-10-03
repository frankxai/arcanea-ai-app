/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useMemo } from "react";
import { AI_MODELS, type AIModel } from "@/lib/models-data";
import { SectionHeading, formatContext, formatPrice } from "./models-arena-components";
import { useModelFavorites } from "@/hooks/use-model-favorites";

interface ModelComparatorProps {
  initialModels?: string[];
}

export function ModelComparator({
  initialModels = ["claude-sonnet-4", "gemini-2.0-pro", "deepseek-r1"],
}: ModelComparatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialModels);
  const { isFavorite, toggleFavorite } = useModelFavorites();

  const selectedModels = useMemo(() => {
    return selectedIds
      .map((id) => AI_MODELS.find((m) => m.id === id))
      .filter((m): m is AIModel => m !== undefined);
  }, [selectedIds]);

  const handleSelect = (index: number, newId: string) => {
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  const setPreset = (ids: string[]) => {
    setSelectedIds(ids);
  };

  // Novel cost formula: 100,000 words ≈ 133,000 output tokens.
  // Assuming 10 draft chapters with 40,000 prompt tokens of lore bible context per chapter = 400,000 prompt tokens.
  const calculateNovelCost = (model: AIModel) => {
    if (model.pricing.input === "free" || model.pricing.output === "free") {
      return "$0.00 (Free)";
    }
    const inputCost = (400_000 / 1_000_000) * model.pricing.input;
    const outputCost = (133_000 / 1_000_000) * model.pricing.output;
    const total = inputCost + outputCost;
    return `$${total.toFixed(2)}`;
  };

  return (
    <section className="mb-24" id="comparator">
      <SectionHeading
        tag="Deep Comparative Analysis"
        title="Fantasy Model Comparator"
        subtitle="Analyze models head-to-head on high fantasy writing metrics: lore memory, prose lyricism, hard magic logic, anti-slop resistance, and full novel generation costs."
      />

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
        <span className="text-white/40 uppercase tracking-wider text-[10px] mr-1">
          Quick Presets:
        </span>
        <button
          onClick={() =>
            setPreset(["claude-sonnet-4", "claude-opus-4", "mistral-large-2"])
          }
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-[var(--arc-brand-atlantean-teal)]/30 transition-all"
        >
          ✍️ The Supreme Prose Novelists
        </button>
        <button
          onClick={() =>
            setPreset(["gemini-2.0-pro", "qwen-3.6-plus-free", "llama-4-maverick"])
          }
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-[var(--arc-brand-cosmic-blue)]/30 transition-all"
        >
          📜 1M Context Lore Titans
        </button>
        <button
          onClick={() =>
            setPreset(["deepseek-r1", "minimax-m2.5-free", "deepseek-v3"])
          }
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-[var(--arc-brand-arcanean-gold)]/30 transition-all"
        >
          🔮 Hard Magic & Tactical Battles
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] min-w-[720px]">
          {selectedModels.map((model, idx) => {
            const favorited = isFavorite(model.id);

            return (
              <div key={model.id} className="p-6 flex flex-col justify-between">
                {/* Header & Selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      Slot {idx + 1}
                    </span>
                    <button
                      onClick={() => toggleFavorite(model.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                        favorited
                          ? "bg-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)] border border-[var(--arc-brand-arcanean-gold)]/40"
                          : "bg-white/[0.04] text-white/40 hover:text-white hover:border-white/20 border border-white/[0.06]"
                      }`}
                      title={favorited ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <span>{favorited ? "★" : "☆"}</span>
                      <span>{favorited ? "Favorited" : "Favorite"}</span>
                    </button>
                  </div>

                  <div className="mb-4">
                    <select
                      value={model.id}
                      onChange={(e) => handleSelect(idx, e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 transition-colors"
                    >
                      {AI_MODELS.map((m) => (
                        <option key={m.id} value={m.id} className="bg-gray-900 text-white">
                          {m.name} ({m.provider})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title & Role */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{model.providerLogo}</span>
                      <h3 className="text-base font-bold text-white font-[family-name:var(--font-display)]">
                        {model.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--arc-brand-atlantean-teal)] font-medium">
                      {model.curatedRole}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/60">
                        Gate: {model.gateResonance} ({model.gateFrequency})
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/60">
                        Guardian: {model.guardian}
                      </span>
                    </div>
                  </div>

                  {/* Composite Scores */}
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-6 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60 font-medium">WorldCraft Index</span>
                        <span className="text-[var(--arc-brand-atlantean-teal)] font-bold font-mono">
                          {model.worldCraftScore}/100
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)]"
                          style={{ width: `${model.worldCraftScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">Prose Lyricism & Cadence</span>
                        <span className="text-white/90 font-mono text-[11px]">
                          {model.proseQuality}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--arc-wind)]"
                          style={{ width: `${model.proseQuality}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">1M Lore Memory (Needle Recall)</span>
                        <span className="text-white/90 font-mono text-[11px]">
                          {model.loreMemory}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--arc-brand-cosmic-blue)]"
                          style={{ width: `${model.loreMemory}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">Hard Magic & World Logic</span>
                        <span className="text-white/90 font-mono text-[11px]">
                          {model.magicLogic}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--arc-brand-arcanean-gold)]"
                          style={{ width: `${model.magicLogic}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">Character Voice Distinction</span>
                        <span className="text-white/90 font-mono text-[11px]">
                          {model.characterVoice}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--arc-void)]"
                          style={{ width: `${model.characterVoice}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Anti-slop and specs */}
                  <div className="space-y-2 text-xs text-white/50 mb-6">
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Anti-Slop Grade</span>
                      <span className="font-bold text-[var(--arc-brand-atlantean-teal)] font-mono">
                        Grade {model.slopResistance}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Context Window</span>
                      <span className="text-white/80 font-mono">
                        {formatContext(model.contextWindow)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Generation Speed</span>
                      <span className="text-white/80 font-mono">{model.speed} tok/s</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Input Price /Mtok</span>
                      <span className="text-white/80 font-mono">
                        {formatPrice(model.pricing.input)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Output Price /Mtok</span>
                      <span className="text-white/80 font-mono">
                        {formatPrice(model.pricing.output)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03] text-[var(--arc-brand-arcanean-gold)] font-medium">
                      <span>Est. 100K-Word Novel Cost</span>
                      <span className="font-mono font-bold">
                        {calculateNovelCost(model)}
                      </span>
                    </div>
                  </div>

                  {/* Worldbuilder's Sweet Spot */}
                  <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-4">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--arc-brand-arcanean-gold)] font-semibold mb-1">
                      Worldbuilder&apos;s Sweet Spot
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {model.worldbuildingSweetSpot}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
