/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { AI_MODELS } from "@/lib/models-data";
import {
  byRatingDesc,
  mergeExplorerModels,
  type ExplorerModel,
  type LiveModelSummary,
} from "@/lib/models/live-models";
import { useModelFavorites } from "@/hooks/use-model-favorites";

export type { LiveModelSummary };

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ModelExplorerProps {
  models?: LiveModelSummary[];
}

type QuickFilter =
  | "all"
  | "favorites"
  | "curated"
  | "1m-lore"
  | "prose"
  | "magic"
  | "free"
  | "open-source";

type SortKey =
  | "worldcraft"
  | "prose"
  | "lore"
  | "magic"
  | "context"
  | "input-price"
  | "speed"
  | "name";

const DISPLAY_LIMIT = 48;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCtx(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatPrice(perMtok: number): string {
  if (perMtok === 0) return "Free";
  if (perMtok < 0.01) return `$${perMtok.toFixed(4)}`;
  if (perMtok < 1) return `$${perMtok.toFixed(2)}`;
  return `$${perMtok.toFixed(2)}`;
}

function awardBadge(award?: string) {
  if (!award) return null;
  switch (award) {
    case "editors-choice":
      return {
        label: "🏆 Editor’s Choice",
        color:
          "bg-[var(--arc-brand-arcanean-gold)]/15 text-[var(--arc-brand-arcanean-gold)] border-[var(--arc-brand-arcanean-gold)]/30",
      };
    case "best-lore":
      return {
        label: "📜 Best Lore Vault",
        color:
          "bg-[var(--arc-brand-cosmic-blue)]/15 text-[var(--arc-brand-cosmic-blue)] border-[var(--arc-brand-cosmic-blue)]/30",
      };
    case "best-prose":
      return {
        label: "👑 Supreme Prose",
        color:
          "bg-[var(--arc-void)]/15 text-[var(--arc-void)] border-[var(--arc-void)]/30",
      };
    case "best-free":
      return {
        label: "⚡ Best Free Model",
        color:
          "bg-[var(--arc-wind)]/15 text-[var(--arc-wind)] border-[var(--arc-wind)]/30",
      };
    case "best-magic":
      return {
        label: "🔮 Grand Enchanter",
        color:
          "bg-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)] border-[var(--arc-brand-atlantean-teal)]/30",
      };
    case "best-dialogue":
      return {
        label: "🎭 Bard of Truth",
        color:
          "bg-[var(--arc-fire)]/15 text-[var(--arc-fire)] border-[var(--arc-fire)]/30",
      };
    case "best-tactics":
      return {
        label: "⚔️ War Master",
        color:
          "bg-[var(--arc-fire)]/15 text-[var(--arc-fire)] border-[var(--arc-fire)]/30",
      };
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Model Card Component                                               */
/* ------------------------------------------------------------------ */

function WorldCraftModelCard({
  model,
  isFavorite,
  onToggleFavorite,
}: {
  model: ExplorerModel;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const badge = awardBadge(model.curatedAward);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-[var(--arc-brand-atlantean-teal)]/25 transition-all flex flex-col justify-between group relative backdrop-blur-sm">
      {/* Top Bar: Identity & Favorite */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{model.providerLogo}</span>
              <h3 className="text-sm font-semibold text-white truncate font-[family-name:var(--font-display)]">
                {model.name}
              </h3>
            </div>
            <p className="text-[11px] text-white/40 mt-0.5">{model.provider}</p>
          </div>

          <button
            onClick={() => onToggleFavorite(model.id)}
            className={`p-1.5 rounded-lg border transition-all ${
              isFavorite
                ? "bg-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)] border-[var(--arc-brand-arcanean-gold)]/40 shadow-[0_0_10px_rgba(255,215,0,0.15)]"
                : "bg-white/[0.03] text-white/30 hover:text-white hover:border-white/20 border-white/[0.06]"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={`Favorite ${model.name}`}
          >
            <span className="text-sm leading-none">
              {isFavorite ? "★" : "☆"}
            </span>
          </button>
        </div>

        {/* Curated Award or Free Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border tracking-wide uppercase ${badge.color}`}
            >
              {badge.label}
            </span>
          )}
          {model.isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
              Free Zen
            </span>
          )}
          {model.gateResonance && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-white/40 bg-white/[0.04] border border-white/[0.04]">
              {model.gateResonance} Gate • {model.gateFrequency}
            </span>
          )}
          {model.slopResistance && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)] bg-white/[0.02]">
              Slop: {model.slopResistance}
            </span>
          )}
        </div>

        {model.worldCraftScore === null ? (
          <div className="mb-4 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-white/60 font-medium">WorldCraft rating</span>
            <span className="text-white/40 font-mono">Not rated</span>
          </div>
        ) : (
          <div className="mb-4 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-white/60 font-medium">
                WorldCraft Index
              </span>
              <span className="text-[var(--arc-brand-atlantean-teal)] font-mono font-bold">
                {model.worldCraftScore}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)]"
                style={{ width: `${model.worldCraftScore}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
              <div className="bg-white/[0.02] rounded p-1">
                <span className="text-white/40 block">Prose</span>
                <span className="text-white font-mono font-medium">
                  {model.proseQuality}%
                </span>
              </div>
              <div className="bg-white/[0.02] rounded p-1">
                <span className="text-white/40 block">Lore</span>
                <span className="text-white font-mono font-medium">
                  {model.loreMemory}%
                </span>
              </div>
              <div className="bg-white/[0.02] rounded p-1">
                <span className="text-white/40 block">Magic</span>
                <span className="text-white font-mono font-medium">
                  {model.magicLogic}%
                </span>
              </div>
              <div className="bg-white/[0.02] rounded p-1">
                <span className="text-white/40 block">Voice</span>
                <span className="text-white font-mono font-medium">
                  {model.characterVoice}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Role & Sweet Spot */}
        <p className="text-xs text-[var(--arc-brand-arcanean-gold)] font-medium mb-1">
          {model.curatedRole}
        </p>
        <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed mb-3">
          {model.worldbuildingSweetSpot}
        </p>
      </div>

      {/* Bottom Specs & Action */}
      <div className="pt-3 border-t border-white/[0.04] text-[11px] text-white/50 space-y-1.5">
        <div className="flex justify-between">
          <span>Context Window</span>
          <span className="text-white/80 font-mono">
            {formatCtx(model.contextWindow)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Pricing (In / Out)</span>
          <span
            className={`font-mono ${model.isFree ? "text-[var(--arc-brand-atlantean-teal)] font-medium" : "text-white/70"}`}
          >
            {model.isFree
              ? "Free / Free"
              : `${formatPrice(model.inputPrice)} / ${formatPrice(model.outputPrice)}`}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 mt-2">
          <span className="text-[10px] text-white/30">
            {model.speed === null ? "" : `${model.speed} tok/s`}
          </span>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-[11px] text-[var(--arc-brand-atlantean-teal)] hover:underline font-medium"
          >
            Draft in Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ModelExplorer({ models = [] }: ModelExplorerProps) {
  const [searchRaw, setSearchRaw] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [gateFilter, setGateFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("worldcraft");
  const [showAll, setShowAll] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { favorites, isFavorite, toggleFavorite, favoriteCount } =
    useModelFavorites();

  const handleSearch = useCallback((value: string) => {
    setSearchRaw(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSearchDebounced(value), 180);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const unifiedModels = useMemo(
    () => mergeExplorerModels(AI_MODELS, models),
    [models],
  );

  // Filtering
  const filtered = useMemo(() => {
    const q = searchDebounced.toLowerCase().trim();

    return unifiedModels.filter((m) => {
      // Text search
      if (q) {
        const matchesQuery =
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.curatedRole.toLowerCase().includes(q) ||
          m.gateResonance.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Quick filter
      if (quickFilter === "favorites" && !isFavorite(m.id)) return false;
      if (quickFilter === "curated" && !m.curatedAward) return false;
      if (quickFilter === "1m-lore" && m.contextWindow < 1_000_000)
        return false;
      if (quickFilter === "prose" && (m.proseQuality ?? 0) < 90) return false;
      if (quickFilter === "magic" && (m.magicLogic ?? 0) < 90) return false;
      if (quickFilter === "free" && !m.isFree) return false;
      if (quickFilter === "open-source" && m.category !== "open-source")
        return false;

      // Gate filter
      if (gateFilter !== "all" && m.gateResonance !== gateFilter) return false;

      return true;
    });
  }, [unifiedModels, searchDebounced, quickFilter, gateFilter, isFavorite]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortKey) {
      case "worldcraft":
        arr.sort((a, b) => byRatingDesc(a.worldCraftScore, b.worldCraftScore));
        break;
      case "prose":
        arr.sort((a, b) => byRatingDesc(a.proseQuality, b.proseQuality));
        break;
      case "lore":
        arr.sort((a, b) => byRatingDesc(a.loreMemory, b.loreMemory));
        break;
      case "magic":
        arr.sort((a, b) => byRatingDesc(a.magicLogic, b.magicLogic));
        break;
      case "context":
        arr.sort((a, b) => b.contextWindow - a.contextWindow);
        break;
      case "input-price":
        arr.sort((a, b) => a.inputPrice - b.inputPrice);
        break;
      case "speed":
        arr.sort((a, b) => byRatingDesc(a.speed, b.speed));
        break;
      case "name":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return arr;
  }, [filtered, sortKey]);

  const displayed = showAll ? sorted : sorted.slice(0, DISPLAY_LIMIT);

  return (
    <section className="mb-24" id="explorer">
      {/* Search Input */}
      <div className="relative mb-5">
        <input
          type="text"
          value={searchRaw}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search models by name, role, Gate (Voice, Starweave), or provider..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 transition-colors backdrop-blur-md"
        />
        {searchRaw && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[
          { id: "all", label: "All Models" },
          {
            id: "favorites",
            label: `★ My Favorites (${favoriteCount})`,
            highlight: favoriteCount > 0,
          },
          { id: "curated", label: "🏆 Curated Best" },
          { id: "1m-lore", label: "📜 1M+ Lore Vaults" },
          { id: "prose", label: "✍️ Lyrical Prose (90+)" },
          { id: "magic", label: "🔮 Hard Magic Logic" },
          { id: "free", label: "🆓 Free Tier (Zen)" },
          { id: "open-source", label: "Open Source" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setQuickFilter(f.id as QuickFilter);
              setShowAll(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              quickFilter === f.id
                ? "bg-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/30"
                : f.id === "favorites" && f.highlight
                  ? "bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)] border border-[var(--arc-brand-arcanean-gold)]/20 hover:border-[var(--arc-brand-arcanean-gold)]/40"
                  : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/12"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gate Filter Chips + Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Arcanean Gate:
          </span>
          <select
            value={gateFilter}
            onChange={(e) => setGateFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors"
          >
            <option value="all" className="bg-gray-900 text-white">
              All Gates
            </option>
            <option value="Voice" className="bg-gray-900 text-white">
              Voice (528 Hz • Prose & Dialogue)
            </option>
            <option value="Starweave" className="bg-gray-900 text-white">
              Starweave (852 Hz • 1M Lore Vaults)
            </option>
            <option value="Foundation" className="bg-gray-900 text-white">
              Foundation (174 Hz • Magic Logic & Geo)
            </option>
            <option value="Crown" className="bg-gray-900 text-white">
              Crown (741 Hz • Cosmology & Sagas)
            </option>
            <option value="Fire" className="bg-gray-900 text-white">
              Fire (396 Hz • Battle Choreography)
            </option>
            <option value="Heart" className="bg-gray-900 text-white">
              Heart (417 Hz • Emotional Arcs)
            </option>
            <option value="Sight" className="bg-gray-900 text-white">
              Sight (639 Hz • Sensory Scenes & Maps)
            </option>
            <option value="Flow" className="bg-gray-900 text-white">
              Flow (285 Hz • Folklore & Ballads)
            </option>
            <option value="Unity" className="bg-gray-900 text-white">
              Unity (963 Hz • Council Summits)
            </option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-mono">
            Showing <strong className="text-white">{displayed.length}</strong>{" "}
            of <strong className="text-white">{sorted.length}</strong> models
          </span>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/40">Sort:</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors"
            >
              <option value="worldcraft" className="bg-gray-900 text-white">
                WorldCraft Index (Highest)
              </option>
              <option value="prose" className="bg-gray-900 text-white">
                Prose Lyricism (Highest)
              </option>
              <option value="lore" className="bg-gray-900 text-white">
                Lore Memory (1M Context)
              </option>
              <option value="magic" className="bg-gray-900 text-white">
                Hard Magic Logic
              </option>
              <option value="context" className="bg-gray-900 text-white">
                Context Window (Largest)
              </option>
              <option value="input-price" className="bg-gray-900 text-white">
                Price (Lowest first)
              </option>
              <option value="speed" className="bg-gray-900 text-white">
                Speed (Fastest first)
              </option>
              <option value="name" className="bg-gray-900 text-white">
                Name (A-Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {displayed.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {displayed.map((m) => (
            <WorldCraftModelCard
              key={m.id}
              model={m}
              isFavorite={isFavorite(m.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <span className="text-3xl mb-3 block">📜</span>
          <p className="text-base text-white/70 font-semibold mb-1">
            No models match your current filters
          </p>
          <p className="text-xs text-white/40 mb-4 max-w-sm mx-auto">
            Try loosening your search terms or toggling from &ldquo;
            {quickFilter}&rdquo; back to &ldquo;All Models&rdquo;.
          </p>
          <button
            onClick={() => {
              setQuickFilter("all");
              setGateFilter("all");
              setSearchRaw("");
              setSearchDebounced("");
            }}
            className="px-4 py-2 rounded-xl text-xs bg-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-[var(--arc-brand-atlantean-teal)]/25 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Show All Toggle */}
      {!showAll && sorted.length > DISPLAY_LIMIT && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            Show All {sorted.length} Models
          </button>
        </div>
      )}
    </section>
  );
}
