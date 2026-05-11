/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  SectionShell,
  SectionHeader,
  FeatureCard,
  FeatureIcon,
  StatCard,
  FloatingOrbs,
  GridTexture,
  ProtocolLayerStack,
  ConnectedFlow,
  SovereigntyBadge,
} from "@/components/premium";
import {
  HERO_STATS,
  FEATURES,
  CONTRIBUTOR_STEPS,
  GOVERNANCE_CARDS,
  SOVEREIGNTY_ITEMS,
  STATUS_PILL,
  SpecTable,
} from "./protocol-data";

// ---------------------------------------------------------------------------
// GitHub icon — reused in two places
// ---------------------------------------------------------------------------

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function ExternalIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ProtocolContent() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">

        {/* ── 1. Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20" aria-labelledby="hero-heading">
          <FloatingOrbs preset="cosmic" />
          <GridTexture variant="dots" opacity={0.018} />
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            aria-hidden
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.2) 40%, rgba(127,255,212,0.3) 50%, rgba(0,188,212,0.2) 60%, transparent 100%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex justify-center mb-7"
            >
              <SovereigntyBadge />
            </m.div>
            <m.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/30 mb-5"
            >
              Arcanean Protocol &middot; v0.1.0
            </m.p>
            <m.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-0.03em] leading-[1.04] mb-6"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--arc-brand-atlantean-teal) 0%, var(--arc-brand-atlantean-teal) 40%, var(--arc-void) 75%, var(--arc-brand-arcanean-gold) 100%)",
                }}
              >
                Open standards for agentic creation
              </span>
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-14 font-body"
            >
              Six protocol layers anyone can implement. Agent registry, IP licensing, royalties, BYOK inference.
              MIT licensed. No Arcanea lock-in — ever.
            </m.p>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {HERO_STATS.map(({ value, label, color }, i) => (
                <StatCard key={label} value={value} label={label} color={color} delay={0.28 + i * 0.06} />
              ))}
            </m.div>
          </div>
        </section>

        {/* ── 2. Layer Stack ───────────────────────────────────────────── */}
        <SectionShell ambient="teal" grid size="default" id="stack">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="The Stack"
              title="Six layers of sovereignty"
              subtitle="Each layer is open, interoperable, and independently adoptable. Implement one or all."
              accent="teal"
            />
            <ProtocolLayerStack />
          </div>
        </SectionShell>

        {/* ── 3. What's included ──────────────────────────────────────── */}
        <SectionShell ambient="purple" grid size="default" id="protocols">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="What's included"
              title="Six open protocols"
              subtitle="Every spec is a Markdown document. Every implementation is MIT licensed. Every standard is yours to adopt."
              accent="teal"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} glowColor={f.color} delay={f.delay}>
                  <FeatureIcon color={f.color} size="md">{f.icon}</FeatureIcon>
                  <h3 className="text-base font-display font-semibold mb-2" style={{ color: f.color }}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed font-body">{f.body}</p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── 4. Spec status table ─────────────────────────────────────── */}
        <SectionShell ambient="none" grid={false} size="compact" id="status">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="Spec status"
              title="Where each protocol stands"
              subtitle="Live specs, reference implementations, and deployment timelines."
              accent="teal"
            />
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpecTable />
            </m.div>
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex flex-wrap gap-5 justify-center"
              aria-label="Status legend"
            >
              {(Object.entries(STATUS_PILL) as [keyof typeof STATUS_PILL, (typeof STATUS_PILL)[keyof typeof STATUS_PILL]][]).map(
                ([key, s]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
                    <span className="text-[10px] font-mono tracking-wider text-white/30">{s.label}</span>
                  </div>
                )
              )}
            </m.div>
          </div>
        </SectionShell>

        {/* ── 5. How contributors work ─────────────────────────────────── */}
        <SectionShell ambient="teal" grid size="default" id="contribute">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="How contributors work"
              title="Three steps to conformance"
              subtitle="Read a spec, build an implementation, submit your test results. That's it."
              accent="teal"
            />
            <ConnectedFlow steps={CONTRIBUTOR_STEPS} />
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex justify-center"
            >
              <a
                href="https://github.com/frankxai/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.09] text-sm font-display font-semibold text-white/70 hover:text-white hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-white/[0.07] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/50"
                aria-label="Read the specifications on GitHub"
              >
                <GitHubIcon />
                View specs on GitHub
                <ExternalIcon />
              </a>
            </m.div>
          </div>
        </SectionShell>

        {/* ── 6. Governance ────────────────────────────────────────────── */}
        <SectionShell ambient="gold" grid size="compact" id="governance">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="Governance"
              title="How the protocol evolves"
              subtitle="Open process, public RFCs, community maintainers. No decisions behind closed doors."
              accent="gold"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GOVERNANCE_CARDS.map((item) => (
                <FeatureCard key={item.title} glowColor={item.color} delay={item.delay}>
                  <h3 className="text-base font-display font-semibold mb-3" style={{ color: item.color }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed font-body">{item.body}</p>
                </FeatureCard>
              ))}
            </div>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <Link
                href="/community-hub"
                className="inline-flex items-center gap-2 text-sm font-display text-[var(--arc-brand-arcanean-gold)]/70 hover:text-[var(--arc-brand-arcanean-gold)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-arcanean-gold)]/40 rounded"
              >
                Join the governance discussion
                <ArrowRight />
              </Link>
            </m.div>
          </div>
        </SectionShell>

        {/* ── 7. BYOK guarantee ────────────────────────────────────────── */}
        <section className="relative py-24 overflow-hidden" aria-labelledby="byok-heading">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(127,255,212,0.04) 0%, transparent 70%)",
            }}
          />
          <GridTexture variant="dots" opacity={0.014} />
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-5"
            >
              The Sovereignty Promise
            </m.p>
            <m.h2
              id="byok-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.06 }}
              className="text-center text-3xl md:text-5xl font-display font-bold tracking-[-0.02em] mb-14"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-atlantean-teal))" }}
              >
                Built so you never depend on us
              </span>
            </m.h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SOVEREIGNTY_ITEMS.map((item, i) => (
                <m.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm hover:border-white/[0.11] transition-colors duration-300"
                >
                  <div
                    className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
                    style={{ background: item.color }}
                    aria-hidden
                  />
                  <div className="pl-4">
                    <p className="text-base font-display font-semibold mb-1.5" style={{ color: item.color }}>
                      {item.label}
                    </p>
                    <p className="text-sm text-white/40 leading-relaxed font-body">{item.body}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. Final CTA ─────────────────────────────────────────────── */}
        <section className="relative py-28 overflow-hidden" aria-labelledby="cta-heading">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 60%, rgba(0,188,212,0.06) 0%, transparent 70%)",
            }}
          />
          <GridTexture variant="dots" opacity={0.015} />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-5">
                Start building
              </p>
              <h2
                id="cta-heading"
                className="text-3xl md:text-5xl font-display font-bold tracking-[-0.02em] mb-5"
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--arc-brand-atlantean-teal) 0%, var(--arc-brand-atlantean-teal) 50%, var(--arc-brand-cosmic-blue) 100%)",
                  }}
                >
                  Open protocol. Open source. Open forever.
                </span>
              </h2>
              <p className="text-base text-white/40 mb-12 max-w-lg mx-auto font-body leading-relaxed">
                Read the AIPs, implement a layer, or join the discussion.
                The protocol belongs to every creator who builds on it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <m.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-semibold text-sm rounded-xl shadow-[0_0_24px_rgba(127,255,212,0.2)] hover:shadow-[0_0_32px_rgba(127,255,212,0.3)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/60"
                  aria-label="Read the Arcanean Improvement Proposals on GitHub"
                >
                  <GitHubIcon />
                  Read the AIPs
                </m.a>
                <m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/community-hub"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[var(--arc-brand-atlantean-teal)]/25 text-[var(--arc-brand-atlantean-teal)] font-semibold text-sm rounded-xl hover:bg-[var(--arc-brand-atlantean-teal)]/[0.06] hover:border-[var(--arc-brand-atlantean-teal)]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/60"
                  >
                    Join protocol discussion
                    <ArrowRight />
                  </Link>
                </m.div>
              </div>
            </m.div>
          </div>
        </section>

      </div>
    </LazyMotion>
  );
}
