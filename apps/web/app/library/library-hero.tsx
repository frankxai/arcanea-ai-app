/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { FloatingOrbs, StatCard } from "@/components/premium";

// ---------------------------------------------------------------------------
// LibraryHero — Premium hero section for the Library page (Client Component)
// Receives dynamic stats from the server page and renders an animated hero.
// ---------------------------------------------------------------------------

interface LibraryHeroProps {
  collectionsCount: number;
  textsCount: number;
}

export function LibraryHero({ collectionsCount, textsCount }: LibraryHeroProps) {
  const stats = [
    { value: String(collectionsCount), label: "Collections", color: "var(--arc-brand-atlantean-teal)" },
    { value: String(textsCount), label: "Texts", color: "var(--arc-brand-atlantean-teal)" },
    { value: "Free", label: "Always open", color: "var(--arc-void)" },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden pt-28 pb-20">
        <FloatingOrbs preset="aurora" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top horizon line glow */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px -z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.2) 35%, rgba(127,255,212,0.28) 50%, rgba(255,215,0,0.2) 65%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-brand-arcanean-gold)]/40" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--arc-brand-arcanean-gold)]/60">
              Library of Arcanea
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-brand-arcanean-gold)]/40" />
          </m.div>

          {/* Headline with gold-to-teal gradient */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-0.03em] leading-[1.04] mb-6"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--arc-brand-arcanean-gold) 0%, var(--arc-brand-arcanean-gold) 25%, var(--arc-brand-atlantean-teal) 60%, var(--arc-brand-atlantean-teal) 100%)",
              }}
            >
              The Library
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.13 }}
            className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
          >
            Original philosophy, poetry, legend, and practice for the creative
            soul. Laws, meditations, parables. Equipment for living.
          </m.p>

          {/* Stat row */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
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
