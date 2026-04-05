"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ElementBadge } from "@/components/worlds/ElementBadge";
import { GlassCard, EmptyState, ELEMENT_HEX } from "./world-shared-components";

// ── Types ───────────────────────────────────────────────────────────

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

interface CharactersWorld {
  slug: string;
  characters: CharacterRow[];
}

// ── CharactersTab ───────────────────────────────────────────────────

export function CharactersTab({ world }: { world: CharactersWorld }) {
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
