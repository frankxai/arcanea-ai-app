/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  SectionShell,
  SectionHeader,
  FloatingOrbs,
  AuroraGradient,
  RevenueStreamCard,
  SovereigntyBadge,
  ConnectedFlow,
  StatusBadge,
  StatusNotice,
} from "@/components/premium";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight } from "@/lib/phosphor-icons";
import {
  REVENUE_STREAMS,
  HOW_IT_WORKS,
  CASE_STUDIES,
  SOVEREIGNTY_PILLARS,
} from "./creator-economy-data";

export function CreatorEconomyContent() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center py-24">
          <AuroraGradient />
          <FloatingOrbs preset="aurora" />

          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center w-full">
            <Reveal delay={0}>
              <div className="flex flex-wrap justify-center items-center gap-2">
                <SovereigntyBadge />
                <StatusBadge level="roadmap" note="Rolling out 2026" />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
                Creator Economy
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-6 max-w-2xl mx-auto">
                <StatusNotice
                  level="roadmap"
                  title="Revenue streams are a public roadmap"
                  body="None of the 8 streams below are fully live. This page serves as a technical & engineering guide blueprint for the Arcanea agentic economy: combining the Agentic Payments Protocol (AP2) and Agentic Commerce Protocol (ACP) for autonomous AI commerce."
                  linkHref="/roadmap"
                  linkLabel="See the roadmap"
                />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.06] tracking-[-0.03em]">
                Build a universe.{" "}
                <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
                  Make a living.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-7 max-w-2xl text-lg md:text-xl text-white/40 leading-relaxed font-body">
                Eight revenue streams. You keep 90%+, always. Enforced via cryptographic mandates, Byzantine consensus, and autonomous AI affiliate referrals.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-14">
                {[
                  { value: 90, suffix: "%+", label: "Creator take" },
                  { value: 0, suffix: "", label: "Fixed fees" },
                  { value: 8, suffix: "", label: "Revenue streams" },
                  { value: 100, suffix: "%", label: "Data portable" },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-8 md:gap-14">
                    {i > 0 && (
                      <span className="w-px h-5 bg-white/[0.08]" aria-hidden />
                    )}
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                        <NumberTicker value={stat.value} suffix={stat.suffix} delay={0.4 + i * 0.08} />
                      </p>
                      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-7 py-3.5 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open Creator Dashboard
                  <ArrowRight className="w-4 h-4" weight="bold" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/[0.2] hover:bg-white/[0.07]"
                >
                  See pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Creator math ─────────────────────────────────────────────── */}
        <SectionShell ambient="teal" size="compact">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-center text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-10">
                The creator math
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              <m.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              >
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/30 mb-4">
                  Traditional platform
                </p>
                <ul className="space-y-3">
                  {[
                    "30–50% taken on every sale",
                    "Platform owns your audience relationship",
                    "You can be deplatformed without warning",
                    "Changing terms, no recourse",
                    "Your data, their database",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/40">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </m.div>

              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/[0.18] bg-[var(--arc-brand-atlantean-teal)]/[0.03] p-6"
              >
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--arc-brand-atlantean-teal)]/50 mb-4">
                  Arcanea
                </p>
                <ul className="space-y-3">
                  {[
                    "90%+ take on every sale",
                    "You own your audience list — export any time",
                    "MIT licensed — fork and self-host if needed",
                    "On-chain royalties, terms encoded in contracts",
                    "Your data, portable JSON, yours to keep",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--arc-brand-atlantean-teal)]/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
          </div>
        </SectionShell>

        {/* ── Revenue streams ───────────────────────────────────────────── */}
        <SectionShell ambient="teal" id="revenue-streams">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Eight ways to earn"
              title="Revenue streams built for creators"
              subtitle="Each pathway is independent — run one or all eight. Payouts through Stripe, on-chain, and cryptographic mandates. Click any pathway to read its technical engineering guide."
              accent="teal"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVENUE_STREAMS.map((stream, i) => (
                <RevenueStreamCard key={stream.title} stream={stream} index={i} />
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <SectionShell ambient="gold" size="compact">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Three steps"
              title="Create. Package. Monetize."
              subtitle="No finance or legal knowledge required. Set a price, choose a stream, publish."
              accent="gold"
            />
            <ConnectedFlow steps={HOW_IT_WORKS} />
          </div>
        </SectionShell>

        {/* ── Case studies ──────────────────────────────────────────────── */}
        <SectionShell ambient="purple">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Hypothetical examples — not real users"
              title="What creators can build"
              subtitle="These are illustrative projections based on realistic platform usage patterns, not actual creator data."
              accent="purple"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CASE_STUDIES.map((study, i) => (
                <m.div
                  key={study.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 hover:border-white/[0.12] transition-colors duration-500"
                >
                  <m.div
                    className="absolute top-0 left-6 right-6 h-px"
                    style={{ background: `linear-gradient(to right, transparent, ${study.accent}70, transparent)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                  />

                  <div className="relative">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-mono tracking-wider mb-4"
                      style={{
                        background: `${study.accent}10`,
                        border: `1px solid ${study.accent}25`,
                        color: `${study.accent}CC`,
                      }}
                    >
                      {study.type}
                    </span>

                    <h3 className="text-lg font-display font-semibold text-white mb-1">
                      {study.name}
                    </h3>
                    <p className="text-sm font-mono mb-4" style={{ color: study.accent }}>
                      {study.headline}
                    </p>
                    <p className="text-sm text-white/45 leading-relaxed mb-6">
                      {study.story}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {study.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl p-3"
                          style={{ background: `${study.accent}06`, border: `1px solid ${study.accent}15` }}
                        >
                          <p className="text-[10px] font-mono tracking-wider uppercase text-white/30 mb-0.5">
                            {stat.label}
                          </p>
                          <p className="text-sm font-display font-semibold" style={{ color: `${study.accent}CC` }}>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </m.div>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="text-center text-[11px] font-mono text-white/20 mt-8 tracking-wider">
                Note: These are hypothetical examples for illustration purposes only. Individual results vary.
              </p>
            </Reveal>
          </div>
        </SectionShell>

        {/* ── Sovereignty guarantees ────────────────────────────────────── */}
        <SectionShell ambient="gold" size="compact">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--arc-brand-arcanean-gold)]/50 mb-4">
                  Sovereignty guarantees
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-[-0.02em]">
                  Your work, your audience,{" "}
                  <span className="bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] via-[var(--arc-brand-arcanean-gold)] to-[var(--arc-fire)] bg-clip-text text-transparent">
                    your rules.
                  </span>
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SOVEREIGNTY_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <m.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className="group relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm hover:border-[var(--arc-brand-arcanean-gold)]/[0.18] transition-colors duration-500"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(400px circle at 50% 0%, ${pillar.accent}08, transparent 50%)` }}
                    />
                    <div className="relative">
                      <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                        style={{ background: `${pillar.accent}10`, border: `1px solid ${pillar.accent}20` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          weight="duotone"
                          style={{ color: pillar.accent } as React.CSSProperties}
                        />
                      </div>
                      <h3 className="text-sm font-display font-semibold mb-2" style={{ color: pillar.accent }}>
                        {pillar.title}
                      </h3>
                      <p className="text-[13px] text-white/45 leading-relaxed">
                        {pillar.body}
                      </p>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </SectionShell>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/[0.07] via-[var(--arc-brand-atlantean-teal)]/[0.05] to-[var(--arc-brand-arcanean-gold)]/[0.06]" />
                <div className="absolute inset-0 bg-white/[0.02]" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.025]"
                  aria-hidden
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/40 to-transparent" />

                <div className="relative p-12 md:p-20 text-center">
                  <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--arc-brand-atlantean-teal)]/50 mb-5">
                    Start today
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] tracking-[-0.03em] mb-5">
                    <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
                      Start monetizing
                    </span>
                    {" "}your creativity.
                  </h2>
                  <p className="mx-auto max-w-lg text-base md:text-lg text-white/40 leading-relaxed mb-10 font-body">
                    No upfront fees. No exclusivity clause. Your first template, membership, or commission can be live today.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-8 py-4 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_50px_rgba(127,255,212,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Open Creator Dashboard
                      <ArrowRight className="w-4 h-4" weight="bold" />
                    </Link>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-sm font-medium text-white/60 transition hover:border-white/[0.2] hover:bg-white/[0.07]"
                    >
                      See pricing
                    </Link>
                  </div>

                  <p className="mt-8 text-[11px] font-mono text-white/20 tracking-wider">
                    Free to start. MIT licensed. No lock-in.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </LazyMotion>
  );
}
