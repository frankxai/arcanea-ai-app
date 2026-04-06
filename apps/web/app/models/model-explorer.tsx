"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ModelExplorerProps {
  models: Array<{
    id: string;
    name: string;
    provider: string;
    context_length: number;
    pricing_prompt_per_mtok: number;
    pricing_completion_per_mtok: number;
    is_free: boolean;
    max_completion: number;
    modality: string;
    description: string;
  }>;
}

type Category = "all" | "free" | "frontier" | "open-source";
type Modality = "all" | "text" | "text+image" | "text+image+video";
type ContextFilter = "all" | "100k" | "500k" | "1m";
type SortKey = "name" | "context" | "input-price" | "output-price" | "provider";

const DISPLAY_LIMIT = 50;

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

const FRONTIER_PROVIDERS = new Set([
  "anthropic",
  "openai",
  "google",
  "meta-llama",
  "deepseek",
  "mistralai",
  "x-ai",
]);

function isFrontier(provider: string): boolean {
  return FRONTIER_PROVIDERS.has(provider.toLowerCase());
}

function matchesModality(raw: string, filter: Modality): boolean {
  if (filter === "all") return true;
  const l = raw.toLowerCase();
  if (filter === "text+image+video") return l.includes("video");
  if (filter === "text+image") return l.includes("image");
  return l === "text->text" || l === "text";
}

/* ------------------------------------------------------------------ */
/*  Chip                                                               */
/* ------------------------------------------------------------------ */

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-[#7fffd4]/15 text-[#7fffd4] border border-[#7fffd4]/30"
          : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/60 hover:border-white/10"
      }`}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Model Card                                                         */
/* ------------------------------------------------------------------ */

function ModelCard({
  model,
}: {
  model: ModelExplorerProps["models"][number];
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-[#7fffd4]/25 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">
            {model.name}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">{model.provider}</p>
        </div>
        {model.is_free && (
          <span className="ml-2 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#7fffd4]/15 text-[#7fffd4] border border-[#7fffd4]/20">
            Free
          </span>
        )}
      </div>

      <div className="space-y-2 text-xs text-white/50">
        <div className="flex justify-between">
          <span>Context</span>
          <span className="text-white/70 font-mono">
            {formatCtx(model.context_length)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Input /M tok</span>
          <span className={`font-mono ${model.is_free ? "text-[#7fffd4]" : "text-white/70"}`}>
            {formatPrice(model.pricing_prompt_per_mtok)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Output /M tok</span>
          <span className={`font-mono ${model.is_free ? "text-[#7fffd4]" : "text-white/70"}`}>
            {formatPrice(model.pricing_completion_per_mtok)}
          </span>
        </div>
        {model.max_completion > 0 && (
          <div className="flex justify-between">
            <span>Max output</span>
            <span className="text-white/70 font-mono">
              {formatCtx(model.max_completion)}
            </span>
          </div>
        )}
      </div>

      {model.description && (
        <p className="mt-3 text-[11px] text-white/30 line-clamp-2 leading-relaxed">
          {model.description}
        </p>
      )}

      <div className="mt-3">
        <span className="inline-block px-2 py-0.5 rounded text-[10px] text-white/40 bg-white/[0.04]">
          {model.modality}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cost Calculator                                                    */
/* ------------------------------------------------------------------ */

function CostCalculator({
  models,
}: {
  models: ModelExplorerProps["models"];
}) {
  const [tokensPerReq, setTokensPerReq] = useState(1000);
  const [reqsPerDay, setReqsPerDay] = useState(100);

  const cheapest = useMemo(() => {
    const paid = models.filter((m) => !m.is_free);
    const withCost = paid.map((m) => ({
      name: m.name,
      monthlyCost:
        ((tokensPerReq / 1_000_000) *
          (m.pricing_prompt_per_mtok + m.pricing_completion_per_mtok) *
          reqsPerDay *
          30),
    }));
    withCost.sort((a, b) => a.monthlyCost - b.monthlyCost);
    return withCost.slice(0, 5);
  }, [models, tokensPerReq, reqsPerDay]);

  const freeCount = models.filter((m) => m.is_free).length;

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-4 font-[family-name:var(--font-display)]">
        Cost Calculator
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Tokens per request
          </label>
          <input
            type="number"
            min={1}
            value={tokensPerReq}
            onChange={(e) => setTokensPerReq(Math.max(1, Number(e.target.value)))}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7fffd4]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Requests per day
          </label>
          <input
            type="number"
            min={1}
            value={reqsPerDay}
            onChange={(e) => setReqsPerDay(Math.max(1, Number(e.target.value)))}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7fffd4]/30 transition-colors"
          />
        </div>
      </div>

      {freeCount > 0 && (
        <p className="text-xs text-[#7fffd4]/70 mb-3">
          {freeCount} free model{freeCount !== 1 ? "s" : ""} available in current view
        </p>
      )}

      <div className="space-y-2">
        {cheapest.map((m) => (
          <div
            key={m.name}
            className="flex justify-between text-xs text-white/50"
          >
            <span className="truncate mr-3">{m.name}</span>
            <span className="flex-shrink-0 font-mono text-[#ffd700]">
              ${m.monthlyCost < 0.01 ? m.monthlyCost.toFixed(4) : m.monthlyCost.toFixed(2)}
              /mo
            </span>
          </div>
        ))}
        {cheapest.length === 0 && (
          <p className="text-xs text-white/30">No paid models in current view</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ModelExplorer({ models }: ModelExplorerProps) {
  const [searchRaw, setSearchRaw] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [modality, setModality] = useState<Modality>("all");
  const [contextFilter, setContextFilter] = useState<ContextFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [showAll, setShowAll] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchRaw(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSearchDebounced(value), 200);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchDebounced.toLowerCase().trim();

    return models.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q) && !m.provider.toLowerCase().includes(q)) {
        return false;
      }
      if (category === "free" && !m.is_free) return false;
      if (category === "frontier" && !isFrontier(m.provider)) return false;
      if (category === "open-source" && (isFrontier(m.provider) || m.is_free)) return false;
      if (!matchesModality(m.modality, modality)) return false;
      if (contextFilter === "100k" && m.context_length < 100_000) return false;
      if (contextFilter === "500k" && m.context_length < 500_000) return false;
      if (contextFilter === "1m" && m.context_length < 1_000_000) return false;
      return true;
    });
  }, [models, searchDebounced, category, modality, contextFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortKey) {
      case "name":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "context":
        arr.sort((a, b) => b.context_length - a.context_length);
        break;
      case "input-price":
        arr.sort((a, b) => a.pricing_prompt_per_mtok - b.pricing_prompt_per_mtok);
        break;
      case "output-price":
        arr.sort((a, b) => a.pricing_completion_per_mtok - b.pricing_completion_per_mtok);
        break;
      case "provider":
        arr.sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
        break;
    }
    return arr;
  }, [filtered, sortKey]);

  const displayed = showAll ? sorted : sorted.slice(0, DISPLAY_LIMIT);
  const freeCount = filtered.filter((m) => m.is_free).length;

  return (
    <section className="mb-24">
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={searchRaw}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search models by name or provider..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7fffd4]/30 transition-colors backdrop-blur-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider text-white/20 self-center mr-1">
          Category
        </span>
        {(["all", "free", "frontier", "open-source"] as Category[]).map((c) => (
          <Chip
            key={c}
            label={c === "all" ? "All" : c === "free" ? "Free" : c === "frontier" ? "Frontier" : "Open Source"}
            active={category === c}
            onClick={() => { setCategory(c); setShowAll(false); }}
          />
        ))}

        <span className="w-px h-5 bg-white/10 self-center mx-1" />
        <span className="text-[10px] uppercase tracking-wider text-white/20 self-center mr-1">
          Modality
        </span>
        {(["all", "text", "text+image", "text+image+video"] as Modality[]).map((m) => (
          <Chip
            key={m}
            label={m === "all" ? "All" : m === "text" ? "Text" : m === "text+image" ? "Text+Image" : "Text+Image+Video"}
            active={modality === m}
            onClick={() => { setModality(m); setShowAll(false); }}
          />
        ))}

        <span className="w-px h-5 bg-white/10 self-center mx-1" />
        <span className="text-[10px] uppercase tracking-wider text-white/20 self-center mr-1">
          Context
        </span>
        {(["all", "100k", "500k", "1m"] as ContextFilter[]).map((cf) => (
          <Chip
            key={cf}
            label={cf === "all" ? "All" : cf === "100k" ? "100K+" : cf === "500k" ? "500K+" : "1M+"}
            active={contextFilter === cf}
            onClick={() => { setContextFilter(cf); setShowAll(false); }}
          />
        ))}
      </div>

      {/* Sort + Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-xs text-white/40">
          Showing{" "}
          <span className="text-white/70">{displayed.length}</span>
          {!showAll && sorted.length > DISPLAY_LIMIT && (
            <span> of {sorted.length}</span>
          )}{" "}
          of{" "}
          <span className="text-white/70">{models.length}</span> models
          {freeCount > 0 && (
            <>
              {" | "}
              <span className="text-[#7fffd4]">{freeCount} free</span>
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-xs text-white/30">Sort by</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-[#7fffd4]/30 transition-colors"
          >
            <option value="name">Name</option>
            <option value="context">Context (desc)</option>
            <option value="input-price">Input Price (asc)</option>
            <option value="output-price">Output Price (asc)</option>
            <option value="provider">Provider</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {displayed.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {displayed.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-white/30 text-sm">
          No models match your filters.
        </div>
      )}

      {/* Show All */}
      {!showAll && sorted.length > DISPLAY_LIMIT && (
        <div className="text-center mb-10">
          <button
            onClick={() => setShowAll(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:border-white/15 transition-colors"
          >
            Show all {sorted.length} models
          </button>
        </div>
      )}

      {/* Cost Calculator */}
      <CostCalculator models={sorted} />
    </section>
  );
}
