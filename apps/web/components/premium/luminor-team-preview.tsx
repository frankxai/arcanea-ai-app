"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// ---------------------------------------------------------------------------
// LuminorTeamPreview — Compact grid of the 13 Chosen with hover reveal.
// Homepage section that makes "16 specialists" concrete, not abstract.
// ---------------------------------------------------------------------------

interface Luminor {
  id: string;
  name: string;
  role: string;
  team: "orchestrator" | "dev" | "creative" | "writing" | "research";
  glyph: string;
  color: string;
}

const LUMINORS: Luminor[] = [
  // Orchestrator
  { id: "lumina", name: "Lumina", role: "Orchestrator", team: "orchestrator", glyph: "✶", color: "#ffd700" },

  // Development
  { id: "systems-architect", name: "Systems Architect", role: "Architecture", team: "dev", glyph: "◩", color: "#00bcd4" },
  { id: "code-crafter", name: "Code Crafter", role: "Implementation", team: "dev", glyph: "⌥", color: "#00bcd4" },
  { id: "debugger", name: "Debugger", role: "Root-cause", team: "dev", glyph: "⚡", color: "#ef4444" },

  // Creative
  { id: "visual-designer", name: "Visual Designer", role: "Color & UI", team: "creative", glyph: "◉", color: "#a855f7" },
  { id: "composer", name: "Composer", role: "Music & audio", team: "creative", glyph: "♪", color: "#f472b6" },
  { id: "motion-designer", name: "Motion Designer", role: "Animation", team: "creative", glyph: "↯", color: "#c084fc" },

  // Writing
  { id: "storyteller", name: "Storyteller", role: "Narrative arcs", team: "writing", glyph: "✎", color: "#7fffd4" },
  { id: "voice", name: "Voice", role: "Copy & naming", team: "writing", glyph: "❝", color: "#00bcd4" },
  { id: "poet", name: "Poet", role: "Verse & rhythm", team: "writing", glyph: "✦", color: "#ffd700" },

  // Research
  { id: "deep-researcher", name: "Deep Researcher", role: "Synthesis", team: "research", glyph: "⌖", color: "#60a5fa" },
  { id: "strategist", name: "Strategist", role: "Direction", team: "research", glyph: "◈", color: "#c084fc" },
  { id: "integrator", name: "Integrator", role: "Connection", team: "research", glyph: "◎", color: "#34d399" },
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

                {/* Glyph */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl transition-colors duration-300"
                  style={{
                    color: isHovered ? l.color : "rgba(255,255,255,0.55)",
                  }}
                >
                  {l.glyph}
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
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0a0a10] border border-white/[0.08] shadow-xl"
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
          { label: "Queen", color: "#ffd700" },
          { label: "Development", color: "#00bcd4" },
          { label: "Creative", color: "#a855f7" },
          { label: "Writing", color: "#7fffd4" },
          { label: "Research", color: "#60a5fa" },
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
