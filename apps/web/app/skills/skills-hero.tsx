/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { FloatingOrbs, StatCard } from "@/components/premium";

// ---------------------------------------------------------------------------
// SkillsHero — Premium hero for the open Skill library (Client Component).
// Rendered above the server-fetched SkillSearch in app/skills/page.tsx.
// Mirrors the WorldsHero composition (eyebrow rule + gradient headline +
// StatCard row) so the open library reads at the same quality bar as Worlds.
// ---------------------------------------------------------------------------

interface SkillsHeroProps {
  skillCount: number;
  categoryCount: number;
}

export function SkillsHero({ skillCount, categoryCount }: SkillsHeroProps) {
  const stats = [
    { value: `${skillCount}`, label: "Open skills", color: "var(--arc-brand-atlantean-teal)" },
    { value: `${categoryCount || "—"}`, label: "Domains", color: "var(--arc-brand-atlantean-teal)" },
    { value: "MIT", label: "Always free", color: "var(--arc-void)" },
    { value: "1 command", label: "To install", color: "var(--arc-brand-arcanean-gold)" },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden pt-28 pb-20 safe-px">
        <FloatingOrbs preset="aurora" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.022]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Horizontal rule glow */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px -z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.25) 40%, rgba(127,255,212,0.35) 50%, rgba(0,188,212,0.25) 60%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 container-page max-w-5xl text-center">
          {/* Eyebrow label */}
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--arc-brand-atlantean-teal)]/70">
              Arcanea Open Library
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
          </m.div>

          {/* Headline */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.05] mb-6"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--arc-brand-atlantean-teal) 0%, var(--arc-brand-atlantean-teal) 35%, var(--arc-void) 70%, var(--arc-void) 100%)",
              }}
            >
              Skills for every Gate
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
          >
            Open, composable skills that teach your agents new craft. Drop one into
            Claude Code, OpenCode, or Cursor and install in a single command — then
            fork it forever.
          </m.p>

          {/* Stats row */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map(({ value, label, color }, i) => (
              <StatCard key={label} value={value} label={label} color={color} delay={0.24 + i * 0.06} />
            ))}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
