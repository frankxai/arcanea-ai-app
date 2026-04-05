"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SidebarCard, MiniStat, ELEMENT_HEX } from "./world-shared-components";
import { OverviewTab } from "./world-overview-tab";
import { CharactersTab } from "./world-characters-tab";
import { LocationsTab } from "./world-locations-tab";
import { TimelineTab } from "./world-timeline-tab";
import { CreationsTab } from "./world-creations-tab";

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

        {/* Sidebar */}
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
