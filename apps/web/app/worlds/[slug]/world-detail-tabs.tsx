"use client";

import { useState } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ElementBadge } from "@/components/worlds/ElementBadge";

export interface WorldPalette {
  gradient: string;
  primary: string;
  secondary: string;
}

// ── Types (match live Supabase schema) ─────────────────────────────

import type { Json } from "@/lib/database/types/supabase";
import type {
  WorldCharacterRow,
  WorldLocationRow,
  WorldEventRow,
  WorldFactionRow,
} from "@/lib/database/types/world-graph-types";

type CharacterRow = WorldCharacterRow;
type LocationRow = WorldLocationRow;
type EventRow = WorldEventRow;
type FactionRow = WorldFactionRow;

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
  laws: Json | null;
  systems: Json | null;
  characters: CharacterRow[];
  locations: LocationRow[];
  events: EventRow[];
  factions: FactionRow[];
  [key: string]: unknown; // allow extra DB columns to pass through
}

interface WorldDetailTabsProps {
  world: WorldData;
  palette: WorldPalette;
}

// ── Tabs ─────────────────────────────────────────────────────────────

type Tab = "overview" | "characters" | "locations" | "timeline" | "creations";

const TABS: { key: Tab; label: string; count?: (w: WorldData) => number }[] = [
  { key: "overview", label: "Overview" },
  {
    key: "characters",
    label: "Characters",
    count: (w) => w.characters.length,
  },
  { key: "locations", label: "Locations", count: (w) => w.locations.length },
  { key: "timeline", label: "Timeline", count: (w) => w.events.length },
  { key: "creations", label: "Creations" },
];

export function WorldDetailTabs({ world, palette }: WorldDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main content */}
        <div>
          {/* Tab bar */}
          <div
            className="flex gap-1 border-b border-white/[0.06] mb-8 overflow-x-auto scrollbar-hide"
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
                  onClick={() => setActiveTab(tab.key)}
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
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <OverviewTab world={world} palette={palette} />
              )}
              {activeTab === "characters" && (
                <CharactersTab world={world} />
              )}
              {activeTab === "locations" && (
                <LocationsTab world={world} palette={palette} />
              )}
              {activeTab === "timeline" && (
                <TimelineTab world={world} palette={palette} />
              )}
              {activeTab === "creations" && (
                <CreationsTab world={world} />
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <SidebarCard title="World Stats">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Characters" value={world.characters.length} />
              <MiniStat label="Locations" value={world.locations.length} />
              <MiniStat label="Events" value={world.events.length} />
              <MiniStat label="Factions" value={world.factions.length} />
            </div>
          </SidebarCard>

          {/* Palette preview */}
          {world.elements && world.elements.length > 0 && (
            <SidebarCard title="Palette">
              <div className="flex gap-2">
                {world.elements.map((el) => {
                  const hex = ELEMENT_HEX[el] || "#00bcd4";
                  return (
                    <div key={el} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-10 h-10 rounded-xl ring-1 ring-white/10"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] text-white/30">{el}</span>
                    </div>
                  );
                })}
              </div>
            </SidebarCard>
          )}

          {/* Mood */}
          {world.mood && (
            <SidebarCard title="Mood">
              <p className="text-sm text-white/50 capitalize leading-relaxed">
                {world.mood}
              </p>
            </SidebarCard>
          )}

          {/* Fork source */}
          {world.forked_from_id && (
            <SidebarCard title="Forked From">
              <Link
                href={`/worlds/${world.forked_from_id}`}
                className="text-sm text-[#00bcd4] hover:underline"
              >
                {world.forked_from_id}
              </Link>
            </SidebarCard>
          )}

          {/* Fork CTA */}
          <Link
            href={`/chat?mode=world&fork=${world.slug}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white shadow-lg shadow-[#00bcd4]/15 hover:shadow-[#00bcd4]/25 transition-all"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
              <path d="M12 12v3" />
            </svg>
            Fork This World
          </Link>
        </aside>
      </div>
    </LazyMotion>
  );
}

// ── Tab: Overview ────────────────────────────────────────────────────

function OverviewTab({
  world,
  palette,
}: {
  world: WorldData;
  palette: WorldPalette;
}) {
  const laws = Array.isArray(world.laws) ? (world.laws as unknown as string[]) : [];
  const magicSystems = Array.isArray(world.systems) ? (world.systems as unknown as string[]) : [];
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
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-white/80">
                    {faction.name}
                  </h4>
                </div>
                {faction.philosophy && (
                  <p className="text-xs text-white/40 leading-relaxed">
                    {faction.philosophy}
                  </p>
                )}
                {faction.history && (
                  <p className="text-xs text-white/30 leading-relaxed mt-2">
                    {faction.history}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Laws */}
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
                  <p className="text-sm text-white/55 leading-relaxed">{law}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Magic systems */}
      {magicSystems.length > 0 && (
        <div>
          <SectionLabel>Magic &amp; Systems</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {magicSystems.map((sys) => (
              <span
                key={sys}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed]/70"
              >
                {sys}
              </span>
            ))}
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
                <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
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
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {world.characters.map((char) => {
        const personality = char.personality as Record<string, unknown> | null;
        const traits = Array.isArray(personality?.traits) ? (personality.traits as string[]) : [];

        return (
          <div key={char.id} className="flex flex-col">
            <GlassCard className="flex-1">
              {/* Portrait placeholder */}
              <div
                className="w-full aspect-[4/3] rounded-xl mb-4 flex items-center justify-center overflow-hidden"
                style={{
                  background: char.element
                    ? `linear-gradient(135deg, ${ELEMENT_HEX[char.element] || "#00bcd4"}20, rgba(9,9,11,0.8))`
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {char.portrait_url ? (
                  <img src={char.portrait_url} alt={char.name} className="w-full h-full object-cover" />
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

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {char.element && (
                  <ElementBadge element={char.element} size="sm" />
                )}
                {char.title && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40">
                    {char.title}
                  </span>
                )}
                {char.origin_class && (
                  <span className="text-[11px] text-white/30">{char.origin_class}</span>
                )}
              </div>

              {/* Gate level */}
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

              {/* Traits from personality JSON */}
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {traits.slice(0, 4).map((trait: string) => (
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
              <Link
                href={`/chat?character=${char.id}&world=${world.slug}`}
                className="mt-auto flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Talk to {char.name}
              </Link>
            </GlassCard>
          </div>
        );
      })}

      {/* Add character card */}
      <Link
        href={`/chat?mode=character&world=${world.slug}`}
        className="group flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-[#00bcd4]/30 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-white/[0.04] group-hover:bg-[#00bcd4]/10 flex items-center justify-center transition-all mb-3">
          <svg
            className="w-6 h-6 text-white/20 group-hover:text-[#00bcd4] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <span className="text-sm text-white/30 group-hover:text-[#00bcd4]/70 transition-colors">
          Add Character
        </span>
      </Link>
    </div>
  );
}

// ── Tab: Locations ───────────────────────────────────────────────────

function LocationsTab({
  world,
  palette,
}: {
  world: WorldData;
  palette: WorldPalette;
}) {
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
          {/* Gradient header */}
          <div
            className="w-full h-24 rounded-xl mb-4 flex items-end p-3 overflow-hidden"
            style={{
              background: loc.image_url
                ? undefined
                : `linear-gradient(135deg, ${palette.primary}20, rgba(9,9,11,0.9))`,
            }}
          >
            {loc.image_url && (
              <img src={loc.image_url} alt={loc.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            )}
            <div className="relative flex items-center gap-2">
              <svg
                className="w-4 h-4 text-white/30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {loc.region && (
                <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                  {loc.region}
                </span>
              )}
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
            <p className="text-xs text-white/30 mt-2">
              <span className="text-white/20">Significance:</span>{" "}
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
            .map((id) => characterMap.get(id))
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
                    <span className="text-[10px] text-white/20">
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
  // Creations are not loaded from the API yet; show placeholder
  return (
    <EmptyState
      message="Creations will appear here as you build inside this world — images, music, text, and more."
      cta="Start Creating"
      href={`/chat?mode=create&world=${world.slug}`}
    />
  );
}

// ── Shared small components ──────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
      {children}
    </h3>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-2xl p-5", className)}
      style={{
        background:
          "linear-gradient(145deg, rgba(12,12,20,0.92) 0%, rgba(9,9,11,0.96) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background:
          "linear-gradient(145deg, rgba(12,12,20,0.92) 0%, rgba(9,9,11,0.96) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
        {title}
      </h3>
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div
      className="rounded-xl px-3 py-3 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="text-xl font-display font-bold text-white/70 tabular-nums">
        {value ?? 0}
      </div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function AlignmentPill({ alignment }: { alignment: string }) {
  const classes: Record<string, string> = {
    light: "bg-amber-400/10 border-amber-400/20 text-amber-300/60",
    dark: "bg-violet-500/10 border-violet-500/20 text-violet-300/60",
    balanced: "bg-[#00bcd4]/10 border-[#00bcd4]/20 text-[#00bcd4]/60",
    neutral: "bg-white/[0.04] border-white/[0.08] text-white/35",
  };

  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border",
        classes[alignment] || classes.neutral
      )}
    >
      {alignment}
    </span>
  );
}

function EmptyState({
  message,
  cta,
  href,
}: {
  message: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <svg
          className="w-7 h-7 text-white/15"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <p className="text-white/35 text-sm max-w-md mb-4 leading-relaxed">
        {message}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all"
      >
        {cta}
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>
  );
}

// ── Element hex map (duplicated for client component boundary) ───────

const ELEMENT_HEX: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#3b82f6",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#a855f7",
  Spirit: "#fbbf24",
};
