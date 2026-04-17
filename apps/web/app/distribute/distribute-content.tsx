"use client";

import type { JSX } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  SectionShell,
  SectionHeader,
  FeatureCard,
  FloatingOrbs,
  GridTexture,
  ConnectedFlow,
  IntegrationGrid,
  SovereigntyBadge,
  StatusBadge,
  StatusNotice,
} from "@/components/premium";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";

// ─── Types ─────────────────────────────────────────────────────────────────

interface AdaptationRow {
  channel: string;
  glyph: string;
  color: string;
  format: string;
  detail: string;
}

interface ToolingPartner {
  name: string;
  glyph: string;
  color: string;
  what: string;
  when: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "12+", label: "Channels" },
  { value: "1-click", label: "Publish" },
  { value: "Scheduled", label: "Drops" },
  { value: "Unified", label: "Analytics" },
];

const FLOW_STEPS = [
  {
    number: "01",
    title: "Create in Arcanea",
    body: "Write a chapter, generate a track, build a scene — anything created inside Arcanea can become a distribution package.",
    accent: "#00bcd4",
  },
  {
    number: "02",
    title: "Pick your channels",
    body: "Select from Discord, Reddit, X, YouTube, Instagram, TikTok, Whop, or any connected platform. Mix and match per project.",
    accent: "#7fffd4",
  },
  {
    number: "03",
    title: "Format auto-adapts",
    body: "Each channel gets a native format — long-form post, thread, carousel, narrated video, short reel — generated to spec.",
    accent: "#ffd700",
  },
  {
    number: "04",
    title: "Track the ripple",
    body: "Engagement signals flow back into Arcanea's dashboard. See what lands, what sparks conversations, what builds your world.",
    accent: "#0d47a1",
  },
];

const ADAPTATION_ROWS: AdaptationRow[] = [
  {
    channel: "Discord",
    glyph: "◎",
    color: "#5865F2",
    format: "Long-form post",
    detail: "Full chapter with cover image and lore context, posted to your creator server.",
  },
  {
    channel: "X",
    glyph: "𝕏",
    color: "#ffffff",
    format: "3-post thread",
    detail: "Opening hook, key scene extract, and closing teaser — each under 280 characters.",
  },
  {
    channel: "Instagram",
    glyph: "◱",
    color: "#e1306c",
    format: "Carousel",
    detail: "5-slide carousel with pull quotes, cover art, and a swipe-to-read structure.",
  },
  {
    channel: "YouTube",
    glyph: "▶",
    color: "#ff0000",
    format: "Narrated video",
    detail: "Auto-narrated with ElevenLabs voice, Suno background score, and chapter art.",
  },
  {
    channel: "TikTok",
    glyph: "◈",
    color: "#69c9d0",
    format: "60s highlight reel",
    detail: "Key moments trimmed to vertical video with dynamic captions and hook opening.",
  },
  {
    channel: "Reddit",
    glyph: "◐",
    color: "#ff4500",
    format: "Detailed post",
    detail: "Long-form submission with lore links, spoiler tags, and community flair.",
  },
];

const TOOLING_PARTNERS: ToolingPartner[] = [
  {
    name: "Blotato",
    glyph: "◬",
    color: "#ef4444",
    what: "Multi-channel posting from a single API call. Handles media upload, scheduling, and account auth across all major platforms.",
    when: "You want one button that posts to every channel at once.",
  },
  {
    name: "Postiz",
    glyph: "◱",
    color: "#3b82f6",
    what: "Visual scheduling calendar with optimal-time recommendations. Queue drops days in advance and monitor from a unified inbox.",
    when: "You batch-create content and want it drip-published over a week.",
  },
  {
    name: "n8n",
    glyph: "⏚",
    color: "#ea580c",
    what: "Self-hostable workflow automation. Connects Arcanea webhooks to any downstream service with full code control.",
    when: "You need custom logic — conditional posting, audience splits, or CRM sync.",
  },
  {
    name: "Zapier",
    glyph: "⚡",
    color: "#ff4a00",
    what: "No-code trigger automation. Connect Arcanea events to 6,000+ apps without writing a single line.",
    when: "You want a quick integration that just works with zero configuration.",
  },
];

const CHANNELS = [
  { name: "Discord", glyph: "◎", color: "#5865F2", note: "Long-form + lore" },
  { name: "X", glyph: "𝕏", color: "#ffffff", note: "Threads + hooks" },
  { name: "Instagram", glyph: "◱", color: "#e1306c", note: "Carousels + Reels" },
  { name: "YouTube", glyph: "▶", color: "#ff0000", note: "Narrated chapters" },
  { name: "TikTok", glyph: "◈", color: "#69c9d0", note: "60s highlights" },
  { name: "Reddit", glyph: "◐", color: "#ff4500", note: "Deep-dive posts" },
  { name: "Whop", glyph: "⎊", color: "#f59e0b", note: "Member drops" },
  { name: "Telegram", glyph: "✈", color: "#0088cc", note: "Bot broadcasts" },
];

// ─── Adaptation Table Row (Client) ─────────────────────────────────────────

function AdaptationRow({ row, index }: { row: AdaptationRow; index: number }): JSX.Element {
  return (
    <m.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[auto_1fr_1fr] md:grid-cols-[120px_140px_1fr] items-start gap-4 md:gap-6 px-5 py-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300 group"
    >
      {/* Channel */}
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold flex-shrink-0"
          style={{
            background: `${row.color}14`,
            border: `1px solid ${row.color}28`,
            color: row.color,
          }}
        >
          {row.glyph}
        </span>
        <span className="text-sm font-display font-semibold text-white/85 hidden md:inline">
          {row.channel}
        </span>
      </div>

      {/* Format badge */}
      <div>
        <span
          className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wide"
          style={{
            background: `${row.color}10`,
            border: `1px solid ${row.color}20`,
            color: `${row.color}cc`,
          }}
        >
          {row.format}
        </span>
      </div>

      {/* Detail */}
      <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-300 col-span-2 md:col-span-1">
        {row.detail}
      </p>
    </m.div>
  );
}

// ─── Tooling Card ──────────────────────────────────────────────────────────

function ToolingCard({ partner, index }: { partner: ToolingPartner; index: number }): JSX.Element {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-400"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{
            background: `${partner.color}12`,
            border: `1px solid ${partner.color}25`,
            color: partner.color,
          }}
        >
          {partner.glyph}
        </div>
        <h3 className="text-base font-display font-semibold text-white/90">{partner.name}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/25 mb-1">
            What it does
          </p>
          <p className="text-sm text-white/50 leading-relaxed">{partner.what}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/25 mb-1">
            When you need it
          </p>
          <p className="text-sm text-white/60 leading-relaxed">{partner.when}</p>
        </div>
      </div>
    </m.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function DistributeContent(): JSX.Element {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#09090b] text-white">
        <GridTexture opacity={0.02} />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center py-20">
          <FloatingOrbs preset="cosmic" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <m.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-4"
              >
                Distribution
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="flex justify-center mb-6"
              >
                <StatusBadge level="planned" note="Pipelines Q3 2026" />
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <StatusNotice
                  level="planned"
                  title="Distribution pipelines are planned, not live"
                  body="Blotato / Postiz / n8n integrations are scheduled on the backlog. Today Arcanea helps you draft — you publish via your own accounts. This page is the spec, not the product."
                  linkHref="/community-hub"
                  linkLabel="Join Discord for updates"
                />
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.04] mb-6"
              >
                <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                  Publish everywhere,
                </span>
                <br />
                <span className="text-white/90">write once.</span>
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-lg text-white/40 leading-relaxed max-w-2xl mx-auto mb-12 font-body"
              >
                Your world generates a chapter. It posts to Discord, trims to X, becomes a Reel,
                gets archived to YouTube &mdash; automatically. Choose the channels, keep the flow.
              </m.p>

              {/* Stats row */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center gap-6 md:gap-10 mb-12 flex-wrap"
              >
                {STATS.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-6">
                    {i > 0 && <span className="w-px h-4 bg-white/[0.06]" />}
                    <div className="text-center">
                      <span className="text-lg font-display font-bold bg-gradient-to-b from-[#7fffd4] to-[#00bcd4] bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-white/25 ml-1.5 font-mono uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </m.div>

              {/* CTA buttons */}
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Magnetic strength={12}>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] px-7 py-3.5 text-sm font-semibold text-[#09090b] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Set up distribution
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Magnetic>
                <Link
                  href="/integrations"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:text-white hover:border-white/[0.20] hover:bg-white/[0.07]"
                >
                  View all integrations
                </Link>
              </m.div>
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <SectionShell ambient="teal" id="how-it-works">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Pipeline"
              title="How it works"
              subtitle="Four steps from creation to everywhere. No content repurposing fatigue, no manual reformatting."
              accent="teal"
            />
            <ConnectedFlow
              steps={FLOW_STEPS.map((s) => ({
                ...s,
                icon: undefined,
                iconNode: undefined,
              }))}
            />
          </div>
        </SectionShell>

        {/* ── Channel Grid ──────────────────────────────────────────────── */}
        <SectionShell ambient="none" grid={false} id="channels">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Channels"
              title="Every channel, native format"
              subtitle="Connect the platforms your audience already lives on. Each gets content designed for its own grammar."
              accent="teal"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {CHANNELS.map((ch, i) => (
                <m.div
                  key={ch.name}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300 flex flex-col gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${ch.color}12`,
                      border: `1px solid ${ch.color}25`,
                      color: ch.color,
                    }}
                  >
                    {ch.glyph}
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-white/85">{ch.name}</p>
                    <p className="text-[11px] text-white/35 mt-0.5 font-body">{ch.note}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── Adaptation Matrix ─────────────────────────────────────────── */}
        <SectionShell ambient="teal" id="adaptation">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Adaptation Matrix"
              title="One story. Six formats."
              subtitle={`Source: "A new chapter of your saga" — watch how Arcanea transforms it for every destination.`}
              accent="teal"
            />

            {/* Source row */}
            <Reveal delay={0.1} className="mb-6">
              <div className="p-5 rounded-2xl bg-[#00bcd4]/[0.06] border border-[#00bcd4]/[0.14] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00bcd4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#00bcd4]/60 mb-0.5">Source</p>
                  <p className="text-sm font-semibold text-white/85">A new chapter of your saga</p>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7fffd4] shadow-[0_0_6px_rgba(127,255,212,0.8)]" />
                  <span className="text-[10px] font-mono text-[#7fffd4]/70 tracking-wider">READY</span>
                </div>
              </div>
            </Reveal>

            {/* Adaptation rows */}
            <div className="space-y-3">
              {ADAPTATION_ROWS.map((row, i) => (
                <AdaptationRow key={row.channel} row={row} index={i} />
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── Tooling Partners ──────────────────────────────────────────── */}
        <SectionShell ambient="none" grid id="tooling">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Tooling"
              title="Powered by the best distribution stack"
              subtitle="Arcanea prepares your content. These tools carry it to your audience."
              accent="gold"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TOOLING_PARTNERS.map((partner, i) => (
                <ToolingCard key={partner.name} partner={partner} index={i} />
              ))}
            </div>

            {/* Distribution integrations grid */}
            <Reveal delay={0.15} className="mt-12">
              <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/20 text-center mb-6">
                All distribution integrations
              </p>
              <IntegrationGrid filter="social" />
            </Reveal>
          </div>
        </SectionShell>

        {/* ── Sovereignty Note ──────────────────────────────────────────── */}
        <SectionShell ambient="gold" size="compact" id="sovereignty">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FeatureCard glowColor="#ffd700">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <SovereigntyBadge />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-white/90 mb-2">
                    Your channels. Your keys. Your analytics.
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed max-w-2xl font-body">
                    Arcanea doesn&apos;t post for you &mdash; it prepares content that you publish via your own
                    accounts. Tokens and cookies stay in your browser. No middleman custody, no
                    platform lock-in. Connect your own Blotato, Postiz, or n8n instance and retain
                    full control of your distribution infrastructure.
                  </p>
                </div>
              </div>
            </FeatureCard>
          </div>
        </SectionShell>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <SectionShell ambient="teal" size="compact" id="cta">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4]/10 via-[#0d47a1]/08 to-[#7fffd4]/08" />
                <div className="absolute inset-0 bg-white/[0.02]" />
                <div className="relative p-12 md:p-16">
                  <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-4">
                    Ready to distribute?
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
                    One creation.{" "}
                    <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                      Every channel.
                    </span>
                  </h2>
                  <p className="text-base text-white/40 mb-10 max-w-lg mx-auto font-body leading-relaxed">
                    Connect your platforms, pick your format rules, and let Arcanea handle the
                    adaptation. Your story reaches further without writing it twice.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Magnetic strength={10}>
                      <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] px-8 py-3.5 text-sm font-semibold text-[#09090b] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Set up distribution
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </Magnetic>
                    <Link
                      href="/integrations"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/65 transition hover:text-white hover:border-white/[0.20] hover:bg-white/[0.07]"
                    >
                      Explore integrations
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionShell>
      </div>
    </LazyMotion>
  );
}
