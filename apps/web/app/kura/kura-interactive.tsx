"use client";

import { useRef } from "react";
import {
  motion,
  LazyMotion,
  domAnimation,
  useReducedMotion,
} from "framer-motion";
import {
  AnimatedBeam,
  BorderBeam,
  NumberTicker,
  Spotlight,
  Marquee,
} from "@arcanea/design-system/primitives";
import { brand } from "@arcanea/design-system/tokens";

const STAGES = [
  {
    n: "01",
    label: "Export",
    body: "One click in your browser. The current conversation, its prompts, and any generated media land in ArcaneaKura/ on your disk.",
  },
  {
    n: "02",
    label: "Process",
    body: "Run /kura-process in Claude Code. The skill extracts characters, locations, artifacts and lore — populating Obsidian wikilinks in the frontmatter.",
  },
  {
    n: "03",
    label: "See",
    body: "Open the folder in Obsidian. The graph view builds itself from the wikilinks. Your AI work becomes a knowledge network you actually own.",
  },
];

const PLATFORMS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Grok",
  "DeepSeek",
  "Perplexity",
  "AI Studio",
];

const SCALE_NUMBERS = [
  { value: 7, label: "platforms" },
  { value: 0, label: "cloud servers" },
  { value: 100, label: "% local-first" },
];

export function KuraHero() {
  const reduced = useReducedMotion();
  return (
    <section className="relative isolate mx-auto max-w-6xl overflow-hidden px-6 pb-20 pt-28 md:pt-36">
      {!reduced && <Spotlight color={brand.atlanteanTeal} size={520} />}

      {/* Backdrop glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[680px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.10] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-[var(--arc-brand-arcanean-gold)]/[0.04] blur-3xl" />
      </div>

      <LazyMotion features={domAnimation} strict>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]" />
            v0.2.0 · Chrome MV3 · Local-first
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="text-balance font-serif text-5xl font-normal leading-[1.02] tracking-tight text-zinc-50 md:text-7xl lg:text-[5.5rem]"
          >
            Kura.
            <br />
            <span className="bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-crystal)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
              Export your most precious writing.
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            A 蔵 (<em className="italic text-zinc-300">kura</em>) is the
            fireproof storehouse a family kept for their most valuable scrolls
            and records. This is the digital one — for every ChatGPT, Claude,
            Grok, Gemini, DeepSeek and Perplexity conversation you&apos;ve ever
            wanted to keep.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <a
              href="https://github.com/frankxai/arcanea-vault"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-12px_rgba(0,188,212,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(0,188,212,0.7)]"
            >
              <BorderBeam
                size={180}
                duration={6}
                colorFrom={brand.atlanteanTeal}
                colorTo={brand.arcaneanGold}
              />
              <span className="relative">Install (developer mode)</span>
              <span aria-hidden="true" className="relative">
                →
              </span>
            </a>
            <a
              href="https://github.com/frankxai/arcanea-vault/blob/main/FORMAT_SPEC.md"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Read the format spec
            </a>
            <span className="ml-auto font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              Web Store · in review
            </span>
          </motion.div>

          {/* Scale tickers */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
            className="mt-16 grid grid-cols-3 gap-6 border-t border-white/[0.06] pt-10 md:max-w-md"
          >
            {SCALE_NUMBERS.map((n) => (
              <div key={n.label}>
                <div className="font-serif text-4xl font-normal text-[var(--arc-brand-atlantean-teal)]">
                  <NumberTicker value={n.value} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  {n.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </LazyMotion>
    </section>
  );
}

export function KuraWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-20">
      <h2 className="mb-12 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        The capture loop
      </h2>

      <div ref={containerRef} className="relative grid gap-6 md:grid-cols-3">
        {STAGES.map((s, i) => {
          const stageRef = i === 0 ? r1 : i === 1 ? r2 : r3;
          return (
            <div
              key={s.n}
              ref={stageRef}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 backdrop-blur-sm transition hover:border-[var(--arc-brand-atlantean-teal)]/30"
            >
              <div className="mb-4 font-mono text-xs text-zinc-500">{s.n}</div>
              <div className="mb-3 font-serif text-2xl font-normal text-[var(--arc-brand-atlantean-teal)]">
                {s.label}
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{s.body}</p>
            </div>
          );
        })}

        {!reduced && (
          <>
            <AnimatedBeam
              containerRef={containerRef as React.RefObject<HTMLElement>}
              fromRef={r1 as React.RefObject<HTMLElement>}
              toRef={r2 as React.RefObject<HTMLElement>}
              gradientStartColor={brand.atlanteanTeal}
              gradientStopColor={brand.aquamarine}
              duration={3.5}
              pathOpacity={0.18}
              className="hidden md:block"
            />
            <AnimatedBeam
              containerRef={containerRef as React.RefObject<HTMLElement>}
              fromRef={r2 as React.RefObject<HTMLElement>}
              toRef={r3 as React.RefObject<HTMLElement>}
              gradientStartColor={brand.aquamarine}
              gradientStopColor={brand.arcaneanGold}
              duration={3.5}
              delay={0.4}
              pathOpacity={0.18}
              className="hidden md:block"
            />
          </>
        )}
      </div>
    </section>
  );
}

export function KuraPlatformMarquee() {
  return (
    <section className="relative mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-16">
      <h2 className="mb-8 text-center font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Works with the platforms you already use
      </h2>
      <Marquee className="[--duration:32s]" pauseOnHover>
        {PLATFORMS.map((p) => (
          <span
            key={p}
            className="mx-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-sm"
          >
            {p}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
