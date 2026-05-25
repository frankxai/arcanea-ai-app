/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Users,
  Chat,
  Trophy,
  Calendar,
  Crown,
  ArrowRight,
  ArrowUpRight,
  ArrowSquareOut,
  TrendUp,
  TrendDown,
  Flame,
  Globe,
  YoutubeLogo,
} from "@/lib/phosphor-icons";
import { FloatingOrbs } from "@/components/premium/animated-background";
import { FeatureCard, FeatureIcon } from "@/components/premium/feature-card";
import { SectionShell, SectionHeader } from "@/components/premium/section-shell";
import { StatusBadge, StatusNotice } from "@/components/premium/status-badge";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, StaggerReveal } from "@/components/motion/reveal";
import { NumberTicker } from "@/components/motion/number-ticker";
import {
  HERO_STATS,
  PRIMARY_CHANNELS,
  WEEKLY_RHYTHM,
  FEATURED_CREATORS,
  LEADERBOARDS,
  CONTESTS,
  CODE_OF_CREATION,
  type LeaderboardEntry,
} from "./community-hub-data";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HeroStatsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center divide-x divide-white/[0.06] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md max-w-2xl mx-auto">
      {HERO_STATS.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center py-5 px-6 flex-1 min-w-[100px]">
          <div className="font-display text-2xl font-bold text-white">
            <NumberTicker value={s.value} suffix={s.suffix} delay={0.8 + i * 0.1} />
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

interface LeaderboardChangeProps {
  change: LeaderboardEntry["change"];
  delta: number;
}

function LeaderboardChange({ change, delta }: LeaderboardChangeProps) {
  if (change === "new") {
    return (
      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] uppercase tracking-widest">
        New
      </span>
    );
  }
  if (change === "same") {
    return <span className="font-mono text-[10px] text-white/25">—</span>;
  }
  if (change === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-[var(--arc-brand-atlantean-teal)]">
        <TrendUp className="w-3 h-3" weight="bold" />
        {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-[var(--arc-fire)]">
      <TrendDown className="w-3 h-3" weight="bold" />
      {delta}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export function CommunityHubContent() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-x-hidden bg-[var(--arc-cosmic-void)]">

        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 -z-20 bg-[var(--arc-cosmic-void)]">
            <FloatingOrbs preset="aurora" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_100%,rgba(0,188,212,0.04),transparent_60%)]" />
          </div>
          <div
            className="absolute inset-0 -z-10 opacity-[0.012]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Reveal delay={0}>
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 backdrop-blur-md">
                <Users className="h-4 w-4 text-[var(--arc-brand-atlantean-teal)]" weight="fill" />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]/80">
                  Community
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="flex justify-center mb-6">
                <StatusBadge level="beta" note="Discord live · stats mocked" />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="max-w-2xl mx-auto mb-8">
                <StatusNotice
                  level="beta"
                  title="Discord and Reddit are live. Everything else is a preview."
                  body="Channel links work — the hub, leaderboards, contests, and spotlight cards below are representative design, not live data. Real dashboards arrive after ARC-community workstream ships."
                  linkHref="https://discord.gg/arcanea"
                  linkLabel="Join Discord"
                />
              </div>
            </Reveal>

            <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.07] tracking-[-0.035em] mb-6">
              <SplitText
                as="span"
                text="Where creators find "
                className="text-white"
                delay={0.1}
                stagger={0.025}
              />
              <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                each other
              </span>
            </h1>

            <Reveal delay={0.4}>
              <p className="mx-auto max-w-2xl font-body text-base md:text-lg leading-relaxed text-white/50 mb-12">
                Arcanea is a product and a movement. Join thousands of creators shaping their own universes — across Discord, Reddit, Whop, and more.
              </p>
            </Reveal>

            <Reveal delay={0.55}>
              <HeroStatsRow />
            </Reveal>

            <Reveal delay={0.7}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Magnetic>
                  <a
                    href="https://discord.gg/arcanea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] px-8 py-4 font-semibold text-[var(--arc-cosmic-void)] shadow-[0_0_50px_rgba(127,255,212,0.2)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,188,212,0.35)]"
                  >
                    <div className="absolute inset-0 translate-x-[-100%] bg-white/10 transition-transform duration-500 group-hover:translate-x-[100%]" />
                    <Chat className="h-5 w-5 relative z-10" weight="fill" />
                    <span className="relative z-10">Join Discord</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://reddit.com/r/arcanea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.03] px-8 py-4 font-semibold text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    Browse Reddit
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--arc-cosmic-void)] to-transparent pointer-events-none" />
        </section>

        {/* ================================================================
            SECTION 1 — PRIMARY CHANNELS
        ================================================================ */}
        <SectionShell ambient="teal" id="channels">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              label="Where we gather"
              title="Primary channels"
              subtitle="Four flagship destinations. Each one serves a distinct purpose in the Arcanea creative ecosystem."
              accent="teal"
            />
            <StaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
              {PRIMARY_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <FeatureCard key={ch.id} glowColor={ch.color}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-5">
                        <FeatureIcon color={ch.color} size="lg">
                          <Icon className="h-6 w-6" weight="fill" />
                        </FeatureIcon>
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
                          style={{ color: ch.color, borderColor: `${ch.color}30`, backgroundColor: `${ch.color}0f` }}
                        >
                          {ch.badge}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-white mb-1">{ch.name}</h3>
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: `${ch.color}99` }}>
                        {ch.tagline}
                      </p>
                      <ul className="space-y-2 mb-6 flex-1">
                        {ch.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-[13px] text-white/40 font-body">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: `${ch.color}80` }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200 group/cta"
                        style={{ color: ch.color }}
                      >
                        {ch.cta}
                        <ArrowSquareOut className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                      </a>
                    </div>
                  </FeatureCard>
                );
              })}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 2 — WEEKLY RHYTHM
        ================================================================ */}
        <SectionShell ambient="gold" size="compact" id="rhythm">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              label="Weekly rhythm"
              title="Every week, the cycle turns"
              subtitle="The community runs on a steady creative pulse. Show up any day and find something worth joining."
              accent="gold"
            />
            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {WEEKLY_RHYTHM.map((day) => (
                <m.div
                  key={day.day}
                  className={`relative rounded-2xl border backdrop-blur-sm p-6 transition-colors duration-300 ${
                    day.featured
                      ? "bg-white/[0.04] border-white/[0.10] hover:border-white/[0.16]"
                      : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.09]"
                  }`}
                >
                  {day.featured && (
                    <div
                      className="absolute top-0 left-6 right-6 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${day.color}60, transparent)` }}
                    />
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-display text-2xl font-bold" style={{ color: day.color }}>
                        {day.shortDay}
                      </span>
                      <span className="ml-1.5 font-mono text-[10px] text-white/25 uppercase tracking-[0.15em]">
                        {day.day}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border"
                      style={{ color: day.color, borderColor: `${day.color}25`, backgroundColor: `${day.color}0d` }}
                    >
                      {day.channel}
                    </span>
                  </div>
                  <p className="font-body text-sm text-white/70 mb-3 leading-relaxed">{day.event}</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-white/25" />
                    <span className="font-mono text-[10px] text-white/25">{day.time}</span>
                  </div>
                </m.div>
              ))}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 3 — CREATOR SPOTLIGHT
        ================================================================ */}
        <SectionShell ambient="teal" id="creators">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              label="Creator spotlight"
              title="The people building here"
              subtitle="From world-builders to composers to lore architects — the community spans every creative discipline."
              accent="teal"
            />
            <StaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {FEATURED_CREATORS.map((creator) => (
                <FeatureCard key={creator.name} glowColor={creator.color} compact>
                  <div className="flex items-start gap-4">
                    <div
                      className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border"
                      style={{ borderColor: `${creator.color}25` }}
                    >
                      <Image
                        src={creator.portrait}
                        alt={creator.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top opacity-80"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, transparent 40%, ${creator.color}30)` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-white leading-tight">{creator.name}</h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{ color: `${creator.color}99` }}>
                        {creator.role}
                      </p>
                      <p className="font-body text-[12px] text-white/40 mt-2 leading-relaxed line-clamp-2">{creator.bio}</p>
                      <div className="flex items-center gap-4 mt-3">
                        {creator.worlds > 0 && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-white/30" />
                            <span className="font-mono text-[10px] text-white/35">{creator.worlds} worlds</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-white/30" />
                          <span className="font-mono text-[10px] text-white/35">{creator.followers} followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.05]">
                    <Link
                      href={creator.href}
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
                      style={{ color: `${creator.color}70` }}
                    >
                      View profile
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </FeatureCard>
              ))}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 4 — LEADERBOARDS
        ================================================================ */}
        <SectionShell ambient="purple" size="compact" id="leaderboards">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              label="Leaderboards"
              title="This week's top creators"
              subtitle="Live rankings across four dimensions of creative output. Updated every 24 hours."
              accent="teal"
            />
            <StaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
              {LEADERBOARDS.map((lb) => (
                <FeatureCard key={lb.title} glowColor={lb.color} compact>
                  <div className="mb-5">
                    <Trophy className="h-5 w-5 mb-3" style={{ color: lb.color }} weight="fill" />
                    <h3 className="font-display text-sm font-semibold leading-tight mb-0.5" style={{ color: lb.color }}>
                      {lb.title}
                    </h3>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">{lb.period}</p>
                  </div>
                  <div className="space-y-3">
                    {lb.entries.map((entry) => (
                      <div key={`${lb.title}-${entry.rank}`} className="flex items-center gap-2.5">
                        <span
                          className="font-display text-sm font-bold w-5 text-center shrink-0"
                          style={{ color: entry.rank === 1 ? lb.color : "rgba(255,255,255,0.25)" }}
                        >
                          {entry.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-[12px] text-white/75 truncate leading-tight">{entry.name}</p>
                          <p className="font-mono text-[9px] text-white/30 mt-0.5">{entry.stat}</p>
                        </div>
                        <div className="shrink-0">
                          <LeaderboardChange change={entry.change} delta={entry.changeDelta} />
                        </div>
                      </div>
                    ))}
                  </div>
                </FeatureCard>
              ))}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 5 — CONTESTS & CHALLENGES
        ================================================================ */}
        <SectionShell ambient="fire" size="compact" id="contests">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              label="Contests & challenges"
              title="Compete. Create. Get recognised."
              subtitle="Active challenges across every creative discipline. Prizes, features, and community glory await."
              accent="gold"
            />
            <StaggerReveal className="grid gap-5 sm:grid-cols-2" stagger={0.08}>
              {CONTESTS.map((contest) => {
                const Icon = contest.icon;
                return (
                  <FeatureCard key={contest.title} glowColor={contest.color}>
                    <div className="flex items-start gap-4">
                      <FeatureIcon color={contest.color} size="md">
                        <Icon className="h-5 w-5" weight="fill" />
                      </FeatureIcon>
                      <div className="flex-1 min-w-0">
                        {contest.urgent && (
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-[var(--arc-fire)]/10 border border-[var(--arc-fire)]/20">
                            <Flame className="h-3 w-3 text-[var(--arc-fire)]" weight="fill" />
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--arc-fire)]">Closes soon</span>
                          </div>
                        )}
                        <h3 className="font-display text-base font-semibold text-white leading-tight mb-1">{contest.title}</h3>
                        <p className="font-body text-sm text-white/50 mb-3">{contest.theme}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
                          <span className="flex items-center gap-1.5 font-mono text-white/35">
                            <Trophy className="h-3 w-3" style={{ color: contest.color }} />
                            {contest.prize}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-white/35">
                            <Calendar className="h-3 w-3 text-white/25" />
                            Ends in {contest.endsIn}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/[0.05]">
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: `${contest.color}70` }}>
                            {contest.channel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </FeatureCard>
                );
              })}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 6 — CODE OF CREATION
        ================================================================ */}
        <SectionShell ambient="teal" size="compact" id="code-of-creation">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="Community values"
              title="The Code of Creation"
              subtitle="Four principles that hold the community together. Simple to say. Powerful to practise."
              accent="teal"
            />
            <StaggerReveal className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
              {CODE_OF_CREATION.map((item) => {
                const Icon = item.icon;
                return (
                  <FeatureCard key={item.title} glowColor={item.color}>
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: item.color }} weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold mb-1.5" style={{ color: item.color }}>
                          {item.title}
                        </h3>
                        <p className="font-body text-sm text-white/45 leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </FeatureCard>
                );
              })}
            </StaggerReveal>
          </div>
        </SectionShell>

        {/* ================================================================
            SECTION 7 — FINAL CTA
        ================================================================ */}
        <section className="relative px-6 py-32">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute left-1/3 top-[10%] h-[500px] w-[500px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.08] blur-[180px]" />
            <div className="absolute right-1/4 bottom-[10%] h-[450px] w-[450px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.10] blur-[160px]" />
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.04] blur-[120px]" />
          </div>

          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/[0.08]">
                  <Users className="h-7 w-7 text-[var(--arc-brand-atlantean-teal)]/60" weight="fill" />
                </div>
              </div>

              <h2 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl mb-5">
                <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                  Join the movement
                </span>
              </h2>

              <p className="mx-auto max-w-xl font-body text-lg text-white/40 leading-relaxed mb-12">
                The community is live, the calendar is full, and new creators arrive every day. Pick the channel that fits and start building.
              </p>

              <StaggerReveal className="flex flex-wrap justify-center gap-3" stagger={0.07}>
                {[
                  { label: "Discord", href: "https://discord.gg/arcanea", color: "var(--arc-void)", icon: Chat },
                  { label: "Reddit", href: "https://reddit.com/r/arcanea", color: "var(--arc-fire)", icon: Globe },
                  { label: "Whop", href: "https://whop.com/arcanea", color: "var(--arc-brand-arcanean-gold)", icon: Crown },
                  { label: "YouTube", href: "https://youtube.com/@arcanea", color: "var(--arc-fire)", icon: YoutubeLogo },
                ].map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <Magnetic key={btn.label}>
                      <a
                        href={btn.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-2xl border backdrop-blur-sm px-7 py-4 font-semibold text-sm transition-all duration-300"
                        style={{ borderColor: `${btn.color}30`, backgroundColor: `${btn.color}0d`, color: btn.color }}
                      >
                        <Icon className="h-4 w-4" weight="fill" />
                        {btn.label}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    </Magnetic>
                  );
                })}
              </StaggerReveal>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {[
                  { label: "Free to join", color: "var(--arc-brand-atlantean-teal)" },
                  { label: "No spam, ever", color: "var(--arc-brand-atlantean-teal)" },
                  { label: "Creator-first culture", color: "var(--arc-brand-arcanean-gold)" },
                  { label: "15+ languages", color: "var(--arc-void)" },
                ].map(({ label, color }, i) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider">
                    {i > 0 && <span className="text-white/10">/</span>}
                    <span className="w-1 h-1 rounded-full" style={{ background: `${color}80` }} />
                    <span className="text-white/35">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </LazyMotion>
  );
}
