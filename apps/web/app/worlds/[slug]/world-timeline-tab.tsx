/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { GlassCard, EmptyState } from "./world-shared-components";
import type { WorldPalette } from "./world-detail-tabs";

// ── Types ───────────────────────────────────────────────────────────

interface CharacterRow {
  id: string;
  name: string;
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

interface TimelineWorld {
  slug: string;
  events: EventRow[];
  characters: CharacterRow[];
}

// ── TimelineTab ─────────────────────────────────────────────────────

export function TimelineTab({
  world,
  palette,
}: {
  world: TimelineWorld;
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
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/15 text-[var(--arc-brand-atlantean-teal)]/60"
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
