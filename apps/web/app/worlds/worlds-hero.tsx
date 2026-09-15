/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { FloatingOrbs, StatCard, FeatureCard, FeatureIcon } from "@/components/premium";

// ---------------------------------------------------------------------------
// WorldsHero — Premium hero section for the Worlds page (Client Component)
// Rendered above WorldsClient in the server page.tsx
// ---------------------------------------------------------------------------

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe",
    body: "Type one sentence about your world. A name, an atmosphere, a founding myth — anything. The engine takes it from there.",
    icon: "✍",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    step: "02",
    title: "Generate",
    body: "AI creates characters, locations, magic systems, and lore — all consistent with each other and rooted in your seed idea.",
    icon: "✦",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    step: "03",
    title: "Connect",
    body: "Everything links together into a living universe. Fork it, share it, build on it with other creators across the multiverse.",
    icon: "⬡",
    color: "var(--arc-brand-arcanean-gold)",
  },
];

const HERO_STATS = [
  { value: "12", label: "Supabase tables", color: "var(--arc-brand-atlantean-teal)" },
  { value: "5", label: "Elements", color: "var(--arc-brand-atlantean-teal)" },
  { value: "∞", label: "Connected lore", color: "var(--arc-void)" },
  { value: "Fork anything", label: "Always open", color: "var(--arc-brand-arcanean-gold)" },
];

export function WorldsHero() {
  return (
    <LazyMotion features={domAnimation}>
      {/* ── Premium Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <FloatingOrbs preset="cosmic" />

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

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow label */}
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--arc-brand-atlantean-teal)]/70">
              World Engine
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
          </m.div>

          {/* Headline */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-0.03em] leading-[1.04] mb-6"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--arc-brand-atlantean-teal) 0%, var(--arc-brand-atlantean-teal) 35%, var(--arc-void) 70%, var(--arc-void) 100%)",
              }}
            >
              Living Worlds
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
          >
            A world-building engine where every character, location, and legend
            connects into a coherent, living universe — ready to fork, explore, and evolve.
          </m.p>

          {/* Stats row */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {HERO_STATS.map(({ value, label, color }, i) => (
              <StatCard key={label} value={value} label={label} color={color} delay={0.24 + i * 0.06} />
            ))}
          </m.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="relative pb-16">
        {/* Subtle ambient glow behind section */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px -z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 15%, rgba(255,215,0,0.08) 50%, transparent 85%)",
          }}
          aria-hidden
        />

        <div className="max-w-5xl mx-auto px-6">
          {/* Section label */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-3">
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white/80">
              From one idea to a living universe
            </h2>
          </m.div>

          {/* 3-step cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ step, title, body, icon, color }, i) => (
              <FeatureCard key={step} glowColor={color} delay={0.08 + i * 0.1}>
                {/* Step badge */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: `${color}14`,
                      border: `1px solid ${color}28`,
                      color,
                    }}
                  >
                    {step}
                  </span>
                  <FeatureIcon color={color} size="sm">
                    <span className="text-base leading-none" aria-hidden>
                      {icon}
                    </span>
                  </FeatureIcon>
                </div>

                <h3
                  className="text-xl font-display font-semibold mb-2"
                  style={{ color }}
                >
                  {title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed font-body">
                  {body}
                </p>
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider into WorldsClient ─────────────────────────────────── */}
      <div
        className="mx-auto max-w-5xl px-6 mb-4"
        aria-hidden
      >
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(0,188,212,0.12) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
          }}
        />
      </div>
    </LazyMotion>
  );
}
