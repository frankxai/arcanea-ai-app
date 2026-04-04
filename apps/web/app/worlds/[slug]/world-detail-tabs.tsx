"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ElementBadge } from "@/components/worlds/ElementBadge";

export interface WorldPalette {
  gradient: string;
  primary: string;
  secondary: string;
}

// ── Types (match Supabase Row shapes) ────────────────────────────────

interface CharacterRow {
  id: string;
  name: string;
  element: string | null;
  gate: number | null;
  origin_class: string | null;
  title: string | null;
  backstory: string | null;
  personality: unknown;
  portrait_url: string | null;
  motivation: string | null;
  is_agent: boolean | null;
}

interface LocationRow {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  significance: string | null;
  image_url: string | null;
}

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  era: string | null;
  characters_involved: string[] | null;
  sort_order: number | null;
  consequences: string | null;
  date_in_world: string | null;
}

interface FactionRow {
  id: string;
  name: string;
  history: string | null;
  philosophy: string | null;
  territory: unknown;
}

// ── Typed law/system shapes ─────────────────────────────────────────

interface WorldLaw {
  name: string;
  description: string;
}

interface WorldSystem {
  name: string;
  type: string;
  rules: string;
}

interface WorldData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  elements: string[];
  mood: string | null;
  forked_from_id: string | null;
  star_count: number | null;
  fork_count: number | null;
  laws: unknown;
  systems: unknown;
  characters: CharacterRow[];
  locations: LocationRow[];
  events: EventRow[];
  factions: FactionRow[];
}

interface WorldDetailTabsProps {
  world: WorldData;
  palette: WorldPalette;
  slug: string;
  initialStarred?: boolean;
}

// ── Tabs ─────────────────────────────────────────────────────────────

type Tab = "overview" | "characters" | "locations" | "timeline" | "creations";

const TAB_ORDER: Tab[] = ["overview", "characters", "locations", "timeline", "creations"];

const TABS: { key: Tab; label: string; count?: (w: WorldData) => number }[] = [
  { key: "overview", label: "Overview" },
  { key: "characters", label: "Characters", count: (w) => w.characters.length },
  { key: "locations", label: "Locations", count: (w) => w.locations.length },
  { key: "timeline", label: "Timeline", count: (w) => w.events.length },
  { key: "creations", label: "Creations" },
];

const SIMILAR_WORLDS = [
  { name: "Arcanea", mood: "Mythological", href: "/lore", gradient: "linear-gradient(135deg, #00bcd4, #7c3aed)" },
  { name: "Eldrian Archives", mood: "Fantasy", href: "/worlds/create?prompt=ancient+library+of+lost+magic", gradient: "linear-gradient(135deg, #fbbf24, #ef4444)" },
  { name: "Void Expanse", mood: "Cosmic", href: "/worlds/create?prompt=cosmic+void+between+stars", gradient: "linear-gradient(135deg, #a855f7, #1e1b4b)" },
];

export function WorldDetailTabs({ world, palette, slug, initialStarred = false }: WorldDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [starred, setStarred] = useState(initialStarred);
  const [starCount, setStarCount] = useState(world.star_count ?? 0);
  const [forkCount] = useState(world.fork_count ?? 0);
  const [forking, setForking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const prevTabIndex = useRef(0);
  const router = useRouter();

  const handleTabChange = useCallback((tab: Tab) => {
    prevTabIndex.current = TAB_ORDER.indexOf(activeTab);
    setActiveTab(tab);
  }, [activeTab]);

  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const direction = currentIndex >= prevTabIndex.current ? 1 : -1;

  const handleStar = useCallback(async () => {
    const prevStarred = starred;
    const prevCount = starCount;
    setStarred(!starred);
    setStarCount(starred ? starCount - 1 : starCount + 1);

    try {
      const res = await fetch(`/api/worlds/${slug}/star`, { method: "POST" });
      if (!res.ok) throw new Error("Star failed");
      const data = await res.json();
      setStarred(data.starred);
      setStarCount(data.star_count);
    } catch {
      setStarred(prevStarred);
      setStarCount(prevCount);
    }
  }, [starred, starCount, slug]);

  const handleFork = useCallback(async () => {
    setForking(true);
    try {
      const res = await fetch(`/api/worlds/${slug}/fork`, { method: "POST" });
      if (!res.ok) throw new Error("Fork failed");
      const data = await res.json();
      const forkSlug = data.fork_slug ?? data.data?.fork_slug;
      if (forkSlug) {
        router.push(`/worlds/${forkSlug}`);
      }
    } catch {
      setForking(false);
    }
  }, [slug, router]);

  // Keyboard shortcuts: Arrow keys for tabs, S to star, F to fork
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const idx = TAB_ORDER.indexOf(activeTab);
      if (e.key === "ArrowRight" && idx < TAB_ORDER.length - 1) { e.preventDefault(); handleTabChange(TAB_ORDER[idx + 1]); }
      if (e.key === "ArrowLeft" && idx > 0) { e.preventDefault(); handleTabChange(TAB_ORDER[idx - 1]); }
      if (e.key === "s" || e.key === "S") { e.preventDefault(); handleStar(); }
      if (e.key === "f" || e.key === "F") { e.preventDefault(); handleFork(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTab, handleTabChange, handleStar, handleFork]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main content */}
        <div>
          {/* Tab bar */}
          <div
            className="flex gap-1 border-b border-white/[0.06] mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            role="tablist"
            aria-label="World sections"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = tab.count ? tab.count(world) : undefined;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    "relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/60 rounded-t-lg",
                    isActive
                      ? "text-[#00bcd4]"
                      : "text-white/40 hover:text-white/60"
                  )}
                >
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span
                      className={cn(
                        "ml-1.5 text-[11px] tabular-nums px-1.5 py-0.5 rounded-full",
                        isActive
                          ? "bg-[#00bcd4]/15 text-[#00bcd4]"
                          : "bg-white/[0.05] text-white/30"
                      )}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <m.div
                      layoutId="world-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: 12 * direction, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -12 * direction, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "overview" && (
                <OverviewTab world={world} palette={palette} />
              )}
              {activeTab === "characters" && <CharactersTab world={world} />}
              {activeTab === "locations" && <LocationsTab world={world} />}
              {activeTab === "timeline" && (
                <TimelineTab world={world} palette={palette} />
              )}
              {activeTab === "creations" && <CreationsTab world={world} />}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Sidebar — collapsible on mobile, always visible on lg+ */}
        <aside className="space-y-6">
          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium bg-white/[0.03] border border-white/[0.06] text-white/50 lg:hidden"
            aria-expanded={sidebarOpen}
          >
            <span>World Info</span>
            <svg
              className={cn("w-4 h-4 transition-transform", sidebarOpen && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={cn("space-y-6", sidebarOpen ? "block" : "hidden lg:block")}>
            <SidebarCard title="World Stats">
              <div className="grid grid-cols-3 gap-3">
                <MiniStat label="Stars" value={starCount} icon="star" />
                <MiniStat label="Forks" value={forkCount} icon="fork" />
                <MiniStat label="Characters" value={world.characters.length} />
                <MiniStat label="Locations" value={world.locations.length} />
                <MiniStat label="Events" value={world.events.length} />
                <MiniStat label="Factions" value={world.factions.length} />
              </div>
            </SidebarCard>

            {world.elements.length > 0 && (
              <SidebarCard title="Palette">
                <div className="flex gap-2">
                  {world.elements.map((el) => (
                    <div key={el} className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-xl ring-1 ring-white/10" style={{ backgroundColor: ELEMENT_HEX[el] || "#00bcd4" }} />
                      <span className="text-[10px] text-white/30">{el}</span>
                    </div>
                  ))}
                </div>
              </SidebarCard>
            )}
            {world.mood && (
              <SidebarCard title="Mood">
                <p className="text-sm text-white/50 capitalize leading-relaxed">{world.mood}</p>
              </SidebarCard>
            )}
            {world.forked_from_id && (
              <SidebarCard title="Forked From">
                <span className="text-sm text-[#00bcd4]/60">{world.forked_from_id}</span>
              </SidebarCard>
            )}

            {/* Similar Worlds */}
            <SidebarCard title="Similar Worlds">
              <div className="space-y-3">
                {SIMILAR_WORLDS.slice(0, 3).map((sw) => (
                  <Link key={sw.name} href={sw.href} className="group flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-white/[0.03] transition-colors">
                    <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: sw.gradient }} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/60 group-hover:text-white/80 truncate transition-colors">{sw.name}</p>
                      <p className="text-[10px] text-white/25 truncate">{sw.mood}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* Star CTA */}
            <button
              onClick={handleStar}
              className={cn(
                "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                starred ? "bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700]"
                  : "bg-white/[0.03] border border-[#ffd700]/20 text-[#ffd700]/70 hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {starred ? "Starred" : "Star This World"}
            </button>

            {/* Fork CTA */}
            <button onClick={handleFork} disabled={forking}
              className={cn(
                "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white shadow-lg shadow-[#00bcd4]/15 hover:shadow-[#00bcd4]/25 transition-all",
                forking && "opacity-60 cursor-wait"
              )}
            >
              {forking ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.3} />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" />
                </svg>
              )}
              {forking ? "Forking..." : "Fork This World"}
            </button>
          </div>
        </aside>
      </div>
    </LazyMotion>
  );
}

// ── Law/System parsers ──────────────────────────────────────────────

function parseLaws(raw: unknown): WorldLaw[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item === "string") return [{ name: "", description: item }];
    if (item && typeof item === "object" && "description" in item) {
      return [{
        name: typeof item.name === "string" ? item.name : "",
        description: typeof item.description === "string" ? item.description : String(item.description),
      }];
    }
    return [];
  });
}

function parseSystems(raw: unknown): WorldSystem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item === "string") return [{ name: item, type: "magic", rules: "" }];
    if (item && typeof item === "object" && "name" in item) {
      return [{
        name: typeof item.name === "string" ? item.name : String(item.name),
        type: typeof item.type === "string" ? item.type : "magic",
        rules: typeof item.rules === "string" ? item.rules : "",
      }];
    }
    return [];
  });
}

const SYSTEM_TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  magic: { bg: "bg-[#7c3aed]/10", border: "border-[#7c3aed]/20", text: "text-[#7c3aed]/70" },
  technology: { bg: "bg-[#00bcd4]/10", border: "border-[#00bcd4]/20", text: "text-[#00bcd4]/70" },
  hybrid: { bg: "bg-[#fbbf24]/10", border: "border-[#fbbf24]/20", text: "text-[#fbbf24]/70" },
};

// ── Tab: Overview ────────────────────────────────────────────────────

function OverviewTab({
  world,
  palette,
}: {
  world: WorldData;
  palette: WorldPalette;
}) {
  const laws = parseLaws(world.laws);
  const systems = parseSystems(world.systems);
  const firstEvent = world.events[0];

  return (
    <div className="space-y-8">
      {/* Description */}
      {world.description && (
        <div>
          <SectionLabel>About This World</SectionLabel>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/60 leading-relaxed whitespace-pre-line">
              {world.description}
            </p>
          </div>
        </div>
      )}

      {/* Factions */}
      {world.factions.length > 0 && (
        <div>
          <SectionLabel>Factions</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-4">
            {world.factions.map((faction) => (
              <GlassCard key={faction.id}>
                <h4 className="text-sm font-semibold text-white/80 mb-2">
                  {faction.name}
                </h4>
                {faction.philosophy && (
                  <p className="text-xs text-white/40 leading-relaxed mb-2 italic">
                    {faction.philosophy}
                  </p>
                )}
                {faction.history && (
                  <p className="text-xs text-white/35 leading-relaxed">
                    {faction.history}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Laws — structured cards */}
      {laws.length > 0 && (
        <div>
          <SectionLabel>Laws of the World</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-3">
            {laws.map((law, i) => (
              <GlassCard key={i}>
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      background: `${palette.primary}15`,
                      border: `1px solid ${palette.primary}30`,
                      color: palette.primary,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    {law.name && (
                      <p className="text-sm font-semibold text-white/70 mb-1">{law.name}</p>
                    )}
                    <p className="text-sm text-white/55 leading-relaxed">{law.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Systems — typed cards with badge */}
      {systems.length > 0 && (
        <div>
          <SectionLabel>Magic &amp; Systems</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-3">
            {systems.map((sys, i) => {
              const typeKey = sys.type.toLowerCase();
              const colors = SYSTEM_TYPE_COLORS[typeKey] || SYSTEM_TYPE_COLORS.magic;
              return (
                <GlassCard key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border",
                      colors.bg, colors.border, colors.text
                    )}>
                      {sys.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white/70 mb-1">{sys.name}</h4>
                  {sys.rules && (
                    <p className="text-xs text-white/40 leading-relaxed">{sys.rules}</p>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Founding event */}
      {firstEvent && (
        <div>
          <SectionLabel>Founding Event</SectionLabel>
          <GlassCard>
            <div className="flex items-center gap-2 mb-2">
              {firstEvent.era && (
                <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold px-2 py-0.5 rounded bg-white/[0.04]">
                  {firstEvent.era}
                </span>
              )}
            </div>
            <h4 className="text-base font-semibold text-white/80 mb-2">
              {firstEvent.title}
            </h4>
            {firstEvent.description && (
              <p className="text-sm text-white/45 leading-relaxed">
                {firstEvent.description}
              </p>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}

// ── Tab: Characters ──────────────────────────────────────────────────

function CharactersTab({ world }: { world: WorldData }) {
  if (world.characters.length === 0) {
    return (
      <EmptyState
        message="No characters yet."
        cta="Add Character"
        href={`/chat?mode=character&world=${world.slug}`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {world.characters.map((char) => {
        const personality = char.personality as Record<string, unknown> | null;
        const traits = Array.isArray(personality?.traits)
          ? (personality.traits as string[])
          : [];

        return (
          <div key={char.id} className="flex flex-col">
            <GlassCard className="flex-1 flex flex-col">
              {/* Portrait */}
              <div
                className="w-full aspect-[4/3] rounded-xl mb-4 flex items-center justify-center overflow-hidden relative"
                style={{
                  background: char.element
                    ? `linear-gradient(135deg, ${ELEMENT_HEX[char.element] || "#00bcd4"}20, rgba(9,9,11,0.8))`
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {char.portrait_url ? (
                  <Image
                    src={char.portrait_url}
                    alt={`Portrait of ${char.name}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
                  />
                ) : (
                  <span
                    className="font-display text-5xl font-bold select-none"
                    style={{
                      color: char.element
                        ? (ELEMENT_HEX[char.element] || "#00bcd4") + "80"
                        : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {char.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name + badges */}
              <h4 className="font-display text-lg font-bold text-white leading-tight mb-1">
                {char.name}
              </h4>
              {char.title && (
                <p className="text-xs text-white/35 mb-2">{char.title}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {char.element && (
                  <ElementBadge element={char.element} size="sm" />
                )}
                {char.origin_class && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40">
                    {char.origin_class}
                  </span>
                )}
              </div>

              {/* Gates */}
              {char.gate != null && char.gate > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < (char.gate ?? 0)
                          ? "bg-[#7fffd4] shadow-[0_0_4px_rgba(127,255,212,0.6)]"
                          : "bg-white/10"
                      )}
                    />
                  ))}
                  <span className="text-[10px] text-white/25 ml-1.5 tabular-nums">
                    {char.gate}/10
                  </span>
                </div>
              )}

              {/* Traits */}
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {traits.slice(0, 4).map((trait) => (
                    <span
                      key={trait}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/35"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              {/* Talk CTA */}
              <Link href={`/chat?character=${char.id}&world=${world.slug}`} className="mt-auto flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Talk to {char.name}
              </Link>
            </GlassCard>
          </div>
        );
      })}

      {/* Add character card */}
      <Link href={`/chat?mode=character&world=${world.slug}`} className="group flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-[#00bcd4]/30 transition-all">
        <div className="w-12 h-12 rounded-full bg-white/[0.04] group-hover:bg-[#00bcd4]/10 flex items-center justify-center transition-all mb-3">
          <svg className="w-6 h-6 text-white/20 group-hover:text-[#00bcd4] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-sm text-white/30 group-hover:text-[#00bcd4]/70 transition-colors">Add Character</span>
      </Link>
    </div>
  );
}

// ── Tab: Locations ───────────────────────────────────────────────────

function LocationsTab({ world }: { world: WorldData }) {
  if (world.locations.length === 0) {
    return (
      <EmptyState
        message="No locations defined yet."
        cta="Add Location"
        href={`/chat?mode=location&world=${world.slug}`}
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {world.locations.map((loc) => (
        <GlassCard key={loc.id}>
          {/* Image or gradient header */}
          <div className="w-full h-24 rounded-xl mb-4 flex items-end p-3 overflow-hidden relative">
            {loc.image_url ? (
              <Image
                src={loc.image_url}
                alt={loc.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,188,212,0.15), rgba(9,9,11,0.9))",
                }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {loc.region && <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">{loc.region}</span>}
            </div>
          </div>

          <h4 className="font-display text-base font-bold text-white/80 mb-1">
            {loc.name}
          </h4>

          {loc.description && (
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              {loc.description}
            </p>
          )}

          {loc.significance && (
            <p className="text-xs text-white/30 leading-relaxed italic">
              <span className="text-[#00bcd4]/40 mr-1">Significance:</span>
              {loc.significance}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}

// ── Tab: Timeline ────────────────────────────────────────────────────

function TimelineTab({
  world,
  palette,
}: {
  world: WorldData;
  palette: WorldPalette;
}) {
  if (world.events.length === 0) {
    return (
      <EmptyState
        message="No events recorded yet."
        cta="Create Event"
        href={`/chat?mode=event&world=${world.slug}`}
      />
    );
  }

  const sorted = [...world.events].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const characterMap = new Map(
    world.characters.map((c) => [c.id, c.name])
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[19px] top-4 bottom-4 w-px"
        style={{
          background: `linear-gradient(to bottom, ${palette.primary}40, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="space-y-6">
        {sorted.map((event, i) => {
          const involvedNames = (event.characters_involved || [])
            .map((id) => characterMap.get(id) ?? id)
            .filter(Boolean);

          return (
            <div key={event.id} className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex-shrink-0 relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  style={{
                    background: `${palette.primary}15`,
                    border: `2px solid ${palette.primary}40`,
                    color: palette.primary,
                  }}
                >
                  {i + 1}
                </div>
              </div>

              {/* Event card */}
              <GlassCard className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {event.era && (
                    <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold px-2 py-0.5 rounded bg-white/[0.04]">
                      {event.era}
                    </span>
                  )}
                  {event.date_in_world && (
                    <span className="text-[10px] text-white/20 font-mono">
                      {event.date_in_world}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white/80 mb-2">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {event.description}
                  </p>
                )}
                {event.consequences && (
                  <p className="text-xs text-amber-400/40 leading-relaxed mb-3 italic">
                    <span className="text-amber-400/30 mr-1">
                      Consequences:
                    </span>
                    {event.consequences}
                  </p>
                )}
                {involvedNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-white/20 mr-1">
                      Involved:
                    </span>
                    {involvedNames.map((name) => (
                      <span
                        key={name}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#00bcd4]/10 border border-[#00bcd4]/15 text-[#00bcd4]/60"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Creations ───────────────────────────────────────────────────

function CreationsTab({ world }: { world: WorldData }) {
  return (
    <div className="space-y-8">
      {/* Ghost card placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl animate-pulse"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>

      {/* Action cards */}
      <div>
        <SectionLabel>Start Creating</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CreationActionCard
            href={`/chat?mode=story&world=${world.slug}`}
            label="Write a Story"
            description="Craft a narrative set in this world"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            }
          />
          <CreationActionCard
            href={`/chat?mode=imagine&world=${world.slug}`}
            label="Generate an Image"
            description="Visualize scenes, characters, or places"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            }
          />
          <CreationActionCard
            href={`/chat?mode=music&world=${world.slug}`}
            label="Compose Music"
            description="Create a soundtrack for your world"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            }
          />
        </div>
      </div>

      <p className="text-center text-white/25 text-xs">
        Creations will appear here as you build inside this world.
      </p>
    </div>
  );
}

function CreationActionCard({ href, label, description, icon }: { href: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all hover:scale-[1.02]" style={GLASS_STYLE}>
      <div className="w-12 h-12 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/20 flex items-center justify-center text-[#00bcd4]/60 group-hover:text-[#00bcd4] group-hover:bg-[#00bcd4]/15 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/70 group-hover:text-white/90 transition-colors mb-1">{label}</p>
        <p className="text-xs text-white/30 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

// ── Shared small components ──────────────────────────────────────────

const GLASS_STYLE = {
  background: "linear-gradient(145deg, rgba(12,12,20,0.92) 0%, rgba(9,9,11,0.96) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{children}</h3>;
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl p-5", className)} style={GLASS_STYLE}>{children}</div>;
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={GLASS_STYLE}>
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2";
const FORK_PATHS = "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3";

function MiniStat({ label, value, icon }: { label: string; value: number; icon?: string }) {
  return (
    <div className="rounded-xl px-3 py-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="text-xl font-display font-bold text-white/70 tabular-nums flex items-center justify-center gap-1.5">
        {icon === "star" && (
          <svg className="w-3.5 h-3.5 text-[#ffd700]/50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points={STAR_PATH} />
          </svg>
        )}
        {icon === "fork" && (
          <svg className="w-3.5 h-3.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d={FORK_PATHS} />
          </svg>
        )}
        {value}
      </div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

function EmptyState({ message, cta, href }: { message: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <m.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <svg className="w-7 h-7 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </m.div>
      <p className="text-white/35 text-sm max-w-md mb-4 leading-relaxed">{message}</p>
      <Link href={href} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all">
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

// ── Element hex map ──────────────────────────────────────────────────

const ELEMENT_HEX: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#3b82f6",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#a855f7",
  Spirit: "#fbbf24",
};
