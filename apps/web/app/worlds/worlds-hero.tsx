/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { FloatingOrbs, StatCard, FeatureCard, FeatureIcon } from "@/components/premium";
import { MagicWand, PencilSimple, TreeStructure } from "@/lib/phosphor-icons";
import { useRef } from "react";

// ---------------------------------------------------------------------------
// WorldsHero — Premium hero section for the Worlds page (Client Component)
// Rendered above WorldsClient in the server page.tsx
// ---------------------------------------------------------------------------

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe",
    body: "Type one sentence about your world. A name, an atmosphere, a founding myth — anything. The engine takes it from there.",
    icon: PencilSimple,
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    step: "02",
    title: "Generate",
    body: "AI creates characters, locations, magic systems, and lore — all consistent with each other and rooted in your seed idea.",
    icon: MagicWand,
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    step: "03",
    title: "Connect",
    body: "Everything links together into a living universe. Fork it, share it, build on it with other creators across the multiverse.",
    icon: TreeStructure,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Scroll-linked parallax transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax depths: title moves faster, stats slower, background slowest
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -60]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -40]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -20]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, reducedMotion ? 1 : 0.6]);

  return (
    <LazyMotion features={domAnimation}>
      {/* ── Premium Hero with Scroll-Linked Parallax ───────────────────── */}
      <section ref={containerRef} className="relative overflow-hidden pt-28 pb-20">
        {/* Parallax background layer */}
        <m.div style={{ y: orbY, opacity }} className="absolute inset-0">
          <FloatingOrbs preset="cosmic" />
        </m.div>

        {/* Enhanced liquid glass overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 50% 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 3%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

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
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 30%, transparent) 35%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 45%, transparent) 50%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 30%, transparent) 65%, transparent 100%)",
            boxShadow: reducedMotion ? "none" : "0 0 16px color-mix(in srgb, var(--arc-brand-atlantean-teal) 20%, transparent)",
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow label */}
          <m.div
            initial={{ opacity: 0, y: -8, filter: reducedMotion ? "none" : "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.05,
            }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--arc-brand-atlantean-teal)]/70">
              World Engine
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-brand-atlantean-teal)]/50" />
          </m.div>

          {/* Headline — parallax + spring */}
          <m.h1
            id="worlds-heading"
            tabIndex={-1}
            style={{ y: titleY }}
            initial={{ opacity: 0, filter: reducedMotion ? "none" : "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
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

          {/* Subtitle — parallax */}
          <m.p
            style={{ y: subtitleY }}
            initial={{ opacity: 0, y: 16, filter: reducedMotion ? "none" : "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.2,
            }}
            className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
          >
            A world-building engine where every character, location, and legend
            connects into a coherent, living universe — ready to fork, explore, and evolve.
          </m.p>

          {/* Stats row — parallax + stagger with spring */}
          <m.div
            style={{ y: statsY }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.3,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {HERO_STATS.map(({ value, label, color }, i) => (
              <m.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: reducedMotion ? "none" : "blur(8px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    },
                  },
                }}
              >
                <StatCard value={value} label={label} color={color} delay={0} />
              </m.div>
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
            {HOW_IT_WORKS.map(({ step, title, body, icon: Icon, color }, i) => (
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
                    <Icon className="h-4 w-4" aria-hidden="true" />
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
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 12%, transparent) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
          }}
        />
      </div>
    </LazyMotion>
  );
}
