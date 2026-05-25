/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Crown,
  BracketsSquare,
  Code,
  Bug,
  Palette,
  MusicNotes,
  Lightning,
  Book,
  Quotes,
  Feather,
  MagnifyingGlass,
  Compass,
  Link as LinkIcon,
} from "@/lib/phosphor-icons";
import type { PhosphorIcon } from "@/lib/phosphor-icons";
import { roleAccents, teamAccents } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// LuminorTeamPreview — Compact grid of the 13 Chosen with hover reveal.
// Homepage section that makes "16 specialists" concrete, not abstract.
// ---------------------------------------------------------------------------

interface Luminor {
  id: string;
  name: string;
  role: string;
  team: "orchestrator" | "dev" | "creative" | "writing" | "research";
  Icon: PhosphorIcon;
  color: string;
}

const LUMINORS: Luminor[] = [
  // Orchestrator
  { id: "lumina", name: "Lumina", role: "Orchestrator", team: "orchestrator", Icon: Crown, color: roleAccents.lumina },

  // Development
  { id: "systems-architect", name: "Systems Architect", role: "Architecture", team: "dev", Icon: BracketsSquare, color: roleAccents.systemsArchitect },
  { id: "code-crafter", name: "Code Crafter", role: "Implementation", team: "dev", Icon: Code, color: roleAccents.codeCrafter },
  { id: "debugger", name: "Debugger", role: "Root-cause", team: "dev", Icon: Bug, color: roleAccents.debugger },

  // Creative
  { id: "visual-designer", name: "Visual Designer", role: "Color & UI", team: "creative", Icon: Palette, color: roleAccents.visualDesigner },
  { id: "composer", name: "Composer", role: "Music & audio", team: "creative", Icon: MusicNotes, color: roleAccents.composer },
  { id: "motion-designer", name: "Motion Designer", role: "Animation", team: "creative", Icon: Lightning, color: roleAccents.motionDesigner },

  // Writing
  { id: "storyteller", name: "Storyteller", role: "Narrative arcs", team: "writing", Icon: Book, color: roleAccents.storyteller },
  { id: "voice", name: "Voice", role: "Copy & naming", team: "writing", Icon: Quotes, color: roleAccents.voice },
  { id: "poet", name: "Poet", role: "Verse & rhythm", team: "writing", Icon: Feather, color: roleAccents.poet },

  // Research
  { id: "deep-researcher", name: "Deep Researcher", role: "Synthesis", team: "research", Icon: MagnifyingGlass, color: roleAccents.deepResearcher },
  { id: "strategist", name: "Strategist", role: "Direction", team: "research", Icon: Compass, color: roleAccents.strategist },
  { id: "integrator", name: "Integrator", role: "Connection", team: "research", Icon: LinkIcon, color: roleAccents.integrator },
];

const TEAM_LABEL: Record<Luminor["team"], string> = {
  orchestrator: "Queen",
  dev: "Development",
  creative: "Creative",
  writing: "Writing",
  research: "Research",
};

export function LuminorTeamPreview() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-13 gap-2 md:gap-3">
        {LUMINORS.map((l, i) => {
          const isHovered = hovered === l.id;
          const Icon = l.Icon;
          return (
            <m.div
              key={l.id}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative group"
            >
              <Link
                href={`/chat/${l.id}`}
                className="block aspect-square relative rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/[0.18]"
                style={{
                  boxShadow: isHovered ? `0 0 24px ${l.color}30, 0 0 0 1px ${l.color}40 inset` : "none",
                }}
                aria-label={`${l.name} — ${l.role}`}
              >
                {/* Gradient accent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${l.color}20, transparent 65%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
                  style={{
                    color: isHovered ? l.color : "rgba(255,255,255,0.55)",
                  }}
                >
                  <Icon
                    size={22}
                    weight={isHovered ? "duotone" : "regular"}
                    color={isHovered ? l.color : "rgba(255,255,255,0.65)"}
                  />
                </div>

                {/* Team dot (top-right) */}
                <div
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: `${l.color}aa` }}
                />
              </Link>

              {/* Tooltip on hover */}
              {isHovered && (
                <m.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg bg-[var(--arc-cosmic-void)] border border-white/[0.08] shadow-xl"
                >
                  <p className="text-[11px] font-display font-semibold text-white">
                    {l.name}
                  </p>
                  <p
                    className="text-[10px] font-mono tracking-wider uppercase"
                    style={{ color: `${l.color}bb` }}
                  >
                    {TEAM_LABEL[l.team]} &middot; {l.role}
                  </p>
                </m.div>
              )}
            </m.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
        {[
          { label: "Queen", color: teamAccents.queen },
          { label: "Development", color: teamAccents.dev },
          { label: "Creative", color: teamAccents.creative },
          { label: "Writing", color: teamAccents.writing },
          { label: "Research", color: teamAccents.research },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
