"use client";

import { useState, useCallback } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

// ── Types ───────────────────────────────────────────────────────────

type ActionKey =
  | "world_report"
  | "generate_quest"
  | "generate_character"
  | "generate_location"
  | "generate_conflict"
  | "weave_narrative";

interface ActionDef {
  key: ActionKey;
  label: string;
  icon: string;
  description: string;
}

const ACTIONS: ActionDef[] = [
  { key: "world_report", label: "Analyze World", icon: "chart", description: "Health score, gaps & recommendations" },
  { key: "generate_quest", label: "Generate Quest", icon: "scroll", description: "Hooks, complications & rewards" },
  { key: "generate_character", label: "Add Character", icon: "user", description: "Canon-consistent character" },
  { key: "generate_location", label: "Add Location", icon: "map", description: "Rich location with lore" },
  { key: "generate_conflict", label: "Create Conflict", icon: "swords", description: "Morally complex tensions" },
  { key: "weave_narrative", label: "Weave Story", icon: "book", description: "Multi-act story arc" },
];

// ── Bridge helper ───────────────────────────────────────────────────

async function callBridge(tool: string, args: Record<string, unknown> = {}) {
  const res = await fetch("/api/worlds/mcp-bridge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, args }),
  });
  if (!res.ok) throw new Error(`Bridge error ${res.status}`);
  const data = await res.json();
  return data.result;
}

// ── Icons ───────────────────────────────────────────────────────────

const ICON_PATHS: Record<string, string> = {
  chart: "M3 3v18h18M7 16l4-8 4 4 5-9",
  scroll: "M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM10 9h4M10 13h4M10 17h2",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM20 21a8 8 0 10-16 0",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a3 3 0 100-6 3 3 0 000 6z",
  swords: "M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
};

function ActionIcon({ type, className = "w-5 h-5" }: { type: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d={ICON_PATHS[type] ?? "M12 2a10 10 0 100 20 10 10 0 000-20z"} /></svg>;
}

// ── Result renderers ────────────────────────────────────────────────

function ScoreBar({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = pct > 66 ? "#7fffd4" : pct > 33 ? "#ffd700" : "#ef4444";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"><span className="text-white/50">{label}</span><span style={{ color }}>{value}/{max}</span></div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function RenderWorldReport({ data }: { data: Record<string, unknown> }) {
  const health = (data.healthScore as number) ?? (data.health_score as number) ?? 50;
  const gaps = (data.gaps as string[]) ?? [];
  const recommendations = (data.recommendations as string[]) ?? [];
  const elements = (data.elementBalance as Record<string, number>) ?? (data.element_balance as Record<string, number>) ?? {};
  const narrative = (data.narrativePotential as number) ?? (data.narrative_potential as number) ?? 0;

  return (
    <div className="space-y-4">
      <ScoreBar value={health} label="World Health" />
      <ScoreBar value={narrative} label="Narrative Potential" />
      {Object.keys(elements).length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">Element Balance</span>
          {Object.entries(elements).map(([el, val]) => (
            <ScoreBar key={el} value={val as number} label={el} />
          ))}
        </div>
      )}
      <ItemList label="Gaps" items={gaps} color="text-[#ef4444]/80" prefix="-- " />
      <ItemList label="Recommendations" items={recommendations} color="text-[#7fffd4]/80" prefix="+ " />
    </div>
  );
}

function RenderQuest({ data }: { data: Record<string, unknown> }) {
  const title = (data.title as string) ?? "Untitled Quest";
  const type = (data.type as string) ?? (data.questType as string) ?? "Adventure";
  const hook = (data.hook as string) ?? "";
  const complications = (data.complications as string[]) ?? [];
  const rewards = (data.rewards as string[]) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#78a6ff]/15 text-[#78a6ff] border border-[#78a6ff]/20">{type}</span>
        <h4 className="font-display font-semibold text-lg">{title}</h4>
      </div>
      {hook && <p className="text-sm text-white/60 italic">&quot;{hook}&quot;</p>}
      {complications.length > 0 && (
        <div><span className="text-xs text-white/40 uppercase tracking-wider">Complications</span>
          <ol className="mt-1 space-y-1 list-decimal list-inside">{complications.map((c, i) => <li key={i} className="text-sm text-white/70">{c}</li>)}</ol>
        </div>
      )}
      <ItemList label="Rewards" items={rewards} color="text-[#ffd700]/80" prefix="* " />
    </div>
  );
}

function RenderCharacter({ data }: { data: Record<string, unknown> }) {
  const name = (data.name as string) ?? "Unknown";
  const element = (data.primaryElement as string) ?? (data.element as string) ?? "";
  const rank = (data.rank as string) ?? "Apprentice";
  const house = (data.house as string) ?? "";
  const gates = (data.gatesOpen as number) ?? 0;
  const hooks = (data.narrativeHooks as string[]) ?? [];
  const personality = data.personality as Record<string, unknown> | undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-xl">{name}</h4>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-400/20">{rank}</span>
      </div>
      <div className="flex gap-3 text-xs text-white/50">
        {element && <span>Element: <span className="text-white/80">{element}</span></span>}
        {house && <span>House: <span className="text-white/80">{house}</span></span>}
        <span>Gates: <span className="text-white/80">{gates}/10</span></span>
      </div>
      {personality && (
        <div className="text-sm text-white/60 space-y-1">
          {(personality.traits as string[])?.length > 0 && <p>Traits: {(personality.traits as string[]).join(", ")}</p>}
          {personality.desire && <p>Desire: {String(personality.desire)}</p>}
          {personality.flaw && <p>Flaw: {String(personality.flaw)}</p>}
        </div>
      )}
      <ItemList label="Story Hooks" items={hooks} color="text-[#7fffd4]/70" />
    </div>
  );
}

function RenderLocation({ data }: { data: Record<string, unknown> }) {
  const name = (data.name as string) ?? "Unknown Place";
  const desc = (data.description as string) ?? "";
  const region = (data.region as string) ?? "";
  const significance = (data.significance as string) ?? "";
  const features = (data.features as string[]) ?? (data.notableFeatures as string[]) ?? [];

  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-xl">{name}</h4>
      {region && <span className="text-xs text-white/40">Region: {region}</span>}
      {desc && <p className="text-sm text-white/60">{desc}</p>}
      {significance && <p className="text-sm text-[#78a6ff]/70 italic">{significance}</p>}
      <ItemList label="Features" items={features} />
    </div>
  );
}

function RenderConflict({ data }: { data: Record<string, unknown> }) {
  const title = (data.title as string) ?? (data.conflict as string) ?? "Unnamed Conflict";
  const sides = (data.sides as Array<Record<string, unknown>>) ?? [];
  const stakes = (data.stakes as string) ?? "";
  const escalation = (data.escalation as string[]) ?? (data.escalationPath as string[]) ?? [];

  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-xl">{title}</h4>
      {sides.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {sides.slice(0, 2).map((side, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xs text-white/40 uppercase tracking-wider">{i === 0 ? "Side A" : "Side B"}</span>
              <p className="text-sm font-medium mt-1">{(side.name as string) ?? `Faction ${i + 1}`}</p>
              {side.argument && <p className="text-xs text-white/50 mt-1">{String(side.argument)}</p>}
            </div>
          ))}
        </div>
      )}
      {stakes && <p className="text-sm text-[#ffd700]/70"><span className="text-white/40 text-xs uppercase tracking-wider mr-2">Stakes</span>{stakes}</p>}
      <ItemList label="Escalation Path" items={escalation} color="text-[#ef4444]/60" prefix="" />
    </div>
  );
}

function RenderNarrative({ data }: { data: Record<string, unknown> }) {
  const title = (data.title as string) ?? "Untitled Arc";
  const acts = (data.acts as Array<Record<string, unknown>>) ?? (data.storyArc as Array<Record<string, unknown>>) ?? [];
  const theme = (data.theme as string) ?? "";

  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-xl">{title}</h4>
      {theme && <p className="text-sm text-white/50 italic">Theme: {theme}</p>}
      {acts.length > 0 && (
        <div className="space-y-2">
          {acts.map((act, i) => (
            <div key={i} className="pl-3 border-l-2 border-white/10">
              <span className="text-xs text-[#78a6ff]/60 uppercase tracking-wider">Act {i + 1}</span>
              <p className="text-sm text-white/70 mt-0.5">{(act.title as string) ?? (act.description as string) ?? JSON.stringify(act)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemList({ label, items, color = "text-white/60", prefix = "- " }: { label: string; items: string[]; color?: string; prefix?: string }) {
  if (!items.length) return null;
  return (
    <div><span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
      <ul className="mt-1 space-y-1">{items.map((t, i) => <li key={i} className={`text-sm ${color}`}>{prefix}{t}</li>)}</ul>
    </div>
  );
}

function RenderResult({ action, data }: { action: ActionKey; data: unknown }) {
  const d = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  switch (action) {
    case "world_report": return <RenderWorldReport data={d} />;
    case "generate_quest": return <RenderQuest data={d} />;
    case "generate_character": return <RenderCharacter data={d} />;
    case "generate_location": return <RenderLocation data={d} />;
    case "generate_conflict": return <RenderConflict data={d} />;
    case "weave_narrative": return <RenderNarrative data={d} />;
  }
}

// ── Main Component ──────────────────────────────────────────────────
export function WorldActions({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<ActionKey | null>(null);
  const [result, setResult] = useState<{ action: ActionKey; data: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = useCallback(async (action: ActionKey) => {
    setLoading(action);
    setError(null);
    setResult(null);
    try {
      const args: Record<string, unknown> = { worldSlug: slug };
      if (action === "generate_character") args.primaryElement = "Fire";
      const data = await callBridge(action, args);
      setResult({ action, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }, [slug]);

  return (
    <LazyMotion features={domAnimation}>
      {/* Floating trigger button */}
      <m.button
        onClick={() => { setOpen((o) => !o); if (result) { setResult(null); setError(null); } }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/40 border border-white/10 backdrop-blur-md"
        style={{ background: "linear-gradient(135deg, rgba(0,188,212,0.25), rgba(124,58,237,0.25))" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="World Intelligence actions"
      >
        <m.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-white text-xl leading-none">+</m.span>
      </m.button>

      <AnimatePresence>
        {/* Action grid panel */}
        {open && !result && !error && (
          <m.div
            key="grid"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 z-50 w-[340px] rounded-2xl border border-white/[0.08] backdrop-blur-xl p-4"
            style={{ background: "rgba(9,9,11,0.92)" }}
          >
            <h3 className="text-xs text-white/40 uppercase tracking-widest mb-3 px-1">World Intelligence</h3>
            <div className="grid grid-cols-2 gap-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => runAction(a.key)}
                  disabled={loading !== null}
                  className="group flex flex-col items-start gap-1.5 p-3 rounded-xl border border-white/[0.06] hover:border-[#00bcd4]/30 hover:bg-[#00bcd4]/[0.04] transition-all text-left disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#7fffd4]/70 group-hover:text-[#7fffd4] transition-colors">
                      {loading === a.key ? <Spinner /> : <ActionIcon type={a.icon} className="w-4 h-4" />}
                    </span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{a.label}</span>
                  </div>
                  <span className="text-[10px] text-white/30 leading-tight">{a.description}</span>
                </button>
              ))}
            </div>
          </m.div>
        )}

        {/* Result drawer */}
        {(result || error) && open && (
          <m.div
            key="result"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 z-50 w-[380px] max-h-[70vh] overflow-y-auto rounded-2xl border border-white/[0.08] backdrop-blur-xl p-5"
            style={{ background: "rgba(9,9,11,0.95)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/60">
                {error ? "Error" : ACTIONS.find((a) => a.key === result!.action)?.label ?? "Result"}
              </h3>
              <button onClick={() => { setResult(null); setError(null); }} className="text-xs text-white/30 hover:text-white/60 transition-colors">Back</button>
            </div>
            {error ? (
              <p className="text-sm text-[#ef4444]/80">{error}</p>
            ) : (
              <RenderResult action={result!.action} data={result!.data} />
            )}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin text-[#7fffd4]" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
    </svg>
  );
}
