"use client";

import { cn } from "@/lib/utils";
import { SectionLabel, GlassCard } from "./world-shared-components";
import type { WorldPalette } from "./world-detail-tabs";

// ── Types ───────────────────────────────────────────────────────────

interface WorldLaw {
  name: string;
  description: string;
}

interface WorldSystem {
  name: string;
  type: string;
  rules: string;
}

interface FactionRow {
  id: string;
  name: string;
  history: string | null;
  philosophy: string | null;
  territory: unknown;
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

interface OverviewWorld {
  description: string | null;
  factions: FactionRow[];
  laws: unknown;
  systems: unknown;
  events: EventRow[];
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

// ── OverviewTab ─────────────────────────────────────────────────────

export function OverviewTab({
  world,
  palette,
}: {
  world: OverviewWorld;
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

      {/* Systems */}
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
