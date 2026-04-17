'use client';

import Link from 'next/link';
import {
  ArrowRight, Sparkle, Crown, GraduationCap, Star,
  Lightning, Book, Scroll, Flame, Drop, Leaf, Wind, Globe,
  Eye, Heart, Sun, Diamond, Compass,
} from '@/lib/phosphor-icons';
import type { PhosphorIcon } from '@/lib/phosphor-icons';
import { GateGrid } from './gate-grid';
import { SplitText } from '@/components/motion/split-text';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal, StaggerReveal } from '@/components/motion/reveal';
import { GlowCard } from '@/components/motion/glow-card';
import { NumberTicker } from '@/components/motion/number-ticker';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface Gate {
  n: number;
  name: string;
  god: string;
  beast: string;
  domain: string;
  color: string;
  icon: PhosphorIcon;
  locked?: boolean;
}

interface House {
  name: string;
  element: string;
  color: string;
  icon: PhosphorIcon;
  desc: string;
}

interface Rank {
  rank: string;
  gates: string;
  color: string;
  glow: string;
}

const GATES: Gate[] = [
  { n: 1, name: 'Foundation', god: 'Lyssandria', beast: 'Kaelith', domain: 'Earth & Survival', color: '#00bcd4', icon: Leaf },
  { n: 2, name: 'Flow', god: 'Leyla', beast: 'Veloura', domain: 'Creativity & Emotion', color: '#00bcd4', icon: Drop },
  { n: 3, name: 'Fire', god: 'Draconia', beast: 'Draconis', domain: 'Power & Will', color: '#ff6b35', icon: Flame },
  { n: 4, name: 'Heart', god: 'Maylinn', beast: 'Laeylinn', domain: 'Love & Healing', color: '#f472b6', icon: Heart },
  { n: 5, name: 'Voice', god: 'Alera', beast: 'Otome', domain: 'Truth & Expression', color: '#06b6d4', icon: Compass },
  { n: 6, name: 'Sight', god: 'Lyria', beast: 'Yumiko', domain: 'Intuition & Vision', color: '#a78bfa', icon: Eye },
  { n: 7, name: 'Crown', god: 'Aiyami', beast: 'Sol', domain: 'Enlightenment', color: '#ffd700', icon: Crown, locked: true },
  { n: 8, name: 'Starweave', god: 'Elara', beast: 'Vaelith', domain: 'Perspective', color: '#c084fc', icon: Diamond, locked: true },
  { n: 9, name: 'Unity', god: 'Ino', beast: 'Kyuro', domain: 'Partnership', color: '#60a5fa', icon: Globe, locked: true },
  { n: 10, name: 'Source', god: 'Shinkami', beast: 'Source', domain: 'Meta-consciousness', color: '#ffffff', icon: Sun, locked: true },
];

const HOUSES: House[] = [
  { name: 'Lumina', element: 'Light', color: '#ffd700', icon: Sun, desc: 'Radiance, clarity, and creation through illumination.' },
  { name: 'Nero', element: 'Void', color: '#a78bfa', icon: Eye, desc: 'Mystery, potential, and the fertile unknown.' },
  { name: 'Pyros', element: 'Fire', color: '#ff6b35', icon: Flame, desc: 'Passion, transformation, and focused will.' },
  { name: 'Aqualis', element: 'Water', color: '#60a5fa', icon: Drop, desc: 'Flow, healing, and the wisdom of memory.' },
  { name: 'Terra', element: 'Earth', color: '#34d399', icon: Leaf, desc: 'Stability, growth, and enduring strength.' },
  { name: 'Ventus', element: 'Wind', color: '#c4b5fd', icon: Wind, desc: 'Freedom, speed, and the breath of change.' },
  { name: 'Synthesis', element: 'All', color: '#00bcd4', icon: Sparkle, desc: 'Unity of all elements into mastery.' },
];

const RANKS: Rank[] = [
  { rank: 'Apprentice', gates: '0–2', color: '#6b7280', glow: 'rgba(107,114,128,0.35)' },
  { rank: 'Mage', gates: '3–4', color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
  { rank: 'Master', gates: '5–6', color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
  { rank: 'Archmage', gates: '7–8', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
  { rank: 'Luminor', gates: '9–10', color: '#ffd700', glow: 'rgba(255,215,0,0.45)' },
];

const STATS = [
  { label: 'Gates', value: 10, suffix: '' },
  { label: 'Houses', value: 7, suffix: '' },
  { label: 'Ranks', value: 5, suffix: '' },
  { label: 'Guardians', value: 10, suffix: '' },
];

/* ------------------------------------------------------------------ */
/*  ACADEMY CONTENT (Client Component)                                 */
/* ------------------------------------------------------------------ */

export function AcademyContent() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090b]">

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6">
        {/* Layered ambient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="absolute left-[15%] top-[10%] h-[560px] w-[560px] rounded-full bg-[#0d47a1]/25 blur-[160px]" />
          <div className="absolute right-[5%] top-[30%] h-[420px] w-[420px] rounded-full bg-[#00bcd4]/[0.14] blur-[140px]" />
          <div className="absolute bottom-[5%] left-[5%] h-[380px] w-[380px] rounded-full bg-[#ffd700]/[0.09] blur-[120px]" />
          <div className="absolute right-1/3 top-[8%] h-[240px] w-[240px] rounded-full bg-[#ff6b35]/[0.07] blur-[90px]" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7fffd4]/[0.04] blur-[200px]" />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Label pill */}
          <Reveal delay={0}>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 backdrop-blur-md">
              <GraduationCap className="h-4 w-4 text-[#ffd700]" weight="fill" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffd700]/80">
                Academy of Creation &amp; Light
              </span>
            </div>
          </Reveal>

          {/* Headline */}
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <SplitText
              as="span"
              text="The Academy"
              className="bg-gradient-to-br from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent"
              delay={0.15}
              stagger={0.04}
            />
          </h1>

          {/* Subtitle */}
          <Reveal delay={0.4}>
            <p className="mx-auto mt-7 max-w-2xl font-body text-lg leading-relaxed text-white/55 md:text-xl">
              A ten-stage progression system built on creative philosophy.
              Open each Gate. Earn your rank. The deeper you go, the more the system reveals.
            </p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={0.55}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <Link
                  href="/quiz"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] px-8 py-4 font-semibold text-[#09090b] shadow-[0_0_50px_rgba(127,255,212,0.2)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,188,212,0.35)]"
                >
                  <div className="absolute inset-0 translate-x-[-100%] bg-white/10 transition-transform duration-500 group-hover:translate-x-[100%]" />
                  <Sparkle className="h-5 w-5 relative z-10" weight="fill" />
                  <span className="relative z-10">Discover Your Origin</span>
                  <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/academy/courses"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.03] px-8 py-4 font-semibold text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                >
                  <Book className="h-4 w-4" />
                  Browse Courses
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.65}>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
              Take the quiz to find your House, Gate, and Guardian
            </p>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.75}>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-4 gap-0 divide-x divide-white/[0.06] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-5 px-4">
                  <div className="font-display text-2xl font-bold text-white md:text-3xl">
                    <NumberTicker value={s.value} suffix={s.suffix} delay={0.9} />
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TEN GATES ============ */}
      <section className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-[40%] top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#00bcd4]/[0.07] blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <Reveal>
            <div className="mb-14 text-center">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-[#00bcd4]/60 mb-4">
                The Path
              </span>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                <span className="bg-gradient-to-r from-[#ffd700] via-[#f59e0b] to-[#ff6b35] bg-clip-text text-transparent">
                  Ten Gates of Mastery
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/45">
                Each Gate is guarded by a God or Goddess and their Godbeast companion.
                Open them in sequence to ascend the path of creative mastery.
              </p>
            </div>
          </Reveal>

          <GateGrid gates={GATES} />
        </div>
      </section>

      {/* ============ SEVEN HOUSES ============ */}
      <section className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0d47a1]/[0.07] blur-[180px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <Reveal>
            <div className="mb-14 text-center">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-[#7fffd4]/60 mb-4">
                Your Affinity
              </span>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                  The Seven Houses
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/45">
                Every creator is sorted into a House based on their elemental affinity.
                Your House shapes your creative path and your bond with fellow creators.
              </p>
            </div>
          </Reveal>

          {/* House cards — 2 / 3 / 4 columns, last row centred */}
          <StaggerReveal className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" stagger={0.07}>
            {HOUSES.map((house) => {
              const Icon = house.icon;
              return (
                <GlowCard
                  key={house.name}
                  color={house.color}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03]"
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div
                      className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${house.color}12`,
                        border: `1px solid ${house.color}28`,
                        boxShadow: `0 0 20px ${house.color}18`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: house.color }} weight="fill" />
                    </div>

                    {/* Name */}
                    <h3
                      className="font-display text-lg font-semibold"
                      style={{ color: house.color }}
                    >
                      {house.name}
                    </h3>

                    {/* Element badge */}
                    <div className="mt-2 inline-flex items-center rounded-full px-2.5 py-1"
                      style={{
                        backgroundColor: `${house.color}10`,
                        border: `1px solid ${house.color}20`,
                      }}>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em]"
                        style={{ color: `${house.color}cc` }}>
                        {house.element}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                      {house.desc}
                    </p>
                  </div>
                </GlowCard>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* ============ RANKS PROGRESSION ============ */}
      <section className="relative px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-[#ffd700]/[0.06] blur-[160px]" />
          <div className="absolute right-1/4 top-0 h-[350px] w-[350px] rounded-full bg-[#a78bfa]/[0.06] blur-[140px]" />
        </div>

        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-16 text-center">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffd700]/60 mb-4">
                Progression
              </span>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                <span className="bg-gradient-to-r from-[#6b7280] via-[#a78bfa] to-[#ffd700] bg-clip-text text-transparent">
                  The Path of Mastery
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/45">
                Open Gates to rise through the ranks. Each rank unlocks deeper understanding
                and greater creative power across the Academy.
              </p>
            </div>
          </Reveal>

          {/* Progression timeline */}
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Connector line — desktop */}
              <div className="pointer-events-none absolute left-[10%] right-[10%] top-[38px] z-0 hidden h-px md:block">
                <div className="h-full w-full bg-gradient-to-r from-[#6b7280]/30 via-[#a78bfa]/50 to-[#ffd700]/70" />
              </div>
              {/* Connector line — mobile */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 w-px -translate-x-1/2 md:hidden">
                <div className="h-full w-full bg-gradient-to-b from-[#6b7280]/30 via-[#a78bfa]/50 to-[#ffd700]/70" />
              </div>

              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:gap-0 md:justify-between">
                {RANKS.map((r, i) => {
                  const isLuminor = r.rank === 'Luminor';
                  return (
                    <div key={r.rank} className="flex flex-1 flex-col items-center group">
                      {/* Rank badge */}
                      <div
                        className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 transition-all duration-500 group-hover:scale-110"
                        style={{
                          borderColor: r.color,
                          backgroundColor: `${r.color}0f`,
                          boxShadow: `0 0 ${isLuminor ? 60 : 30}px ${r.glow}, 0 0 ${isLuminor ? 120 : 60}px ${r.glow.replace('0.35', '0.12').replace('0.45', '0.15')}`,
                        }}
                      >
                        {isLuminor ? (
                          <Star
                            className="h-8 w-8"
                            style={{ color: r.color }}
                            weight="fill"
                          />
                        ) : (
                          <span
                            className="font-display text-xl font-bold"
                            style={{ color: r.color }}
                          >
                            {i + 1}
                          </span>
                        )}
                        {/* Outer ring pulse for Luminor */}
                        {isLuminor && (
                          <div
                            className="absolute inset-[-6px] rounded-full border opacity-40"
                            style={{ borderColor: r.color }}
                          />
                        )}
                      </div>

                      {/* Rank info */}
                      <div className="mt-5 text-center">
                        <h3
                          className="font-display text-sm font-semibold md:text-base"
                          style={{ color: r.color }}
                        >
                          {r.rank}
                        </h3>
                        <div
                          className="mt-2 inline-flex items-center rounded-full px-2.5 py-1"
                          style={{
                            backgroundColor: `${r.color}0f`,
                            border: `1px solid ${r.color}25`,
                          }}
                        >
                          <span
                            className="font-mono text-[9px] tracking-[0.15em]"
                            style={{ color: `${r.color}99` }}
                          >
                            Gates {r.gates}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BEGIN YOUR JOURNEY — CTA ============ */}
      <section className="relative px-6 py-32">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/3 top-[15%] h-[500px] w-[500px] rounded-full bg-[#ffd700]/[0.07] blur-[180px]" />
          <div className="absolute right-1/4 bottom-[10%] h-[450px] w-[450px] rounded-full bg-[#0d47a1]/[0.10] blur-[160px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7fffd4]/[0.04] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Main CTA block */}
          <Reveal>
            <div className="mb-16 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/[0.08]">
                  <Scroll className="h-7 w-7 text-[#ffd700]/60" weight="fill" />
                </div>
              </div>
              <h2 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-br from-[#7fffd4] via-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent">
                  Begin Your Journey
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-md font-body text-lg leading-relaxed text-white/45">
                Three paths forward. Each one changes how you create.
              </p>
            </div>
          </Reveal>

          {/* Action cards */}
          <StaggerReveal className="grid gap-4 sm:grid-cols-3" stagger={0.1} delay={0.1}>
            {/* Quiz */}
            <Link
              href="/quiz"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#ffd700]/25 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(255,215,0,0.07)]"
            >
              <div
                className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #ffd700, transparent)' }}
              />
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/10">
                <Sparkle className="h-5 w-5 text-[#ffd700]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Take the Quiz</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                Discover your House, your Gate, and the Guardian who walks with you.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffd700]/60 transition-colors group-hover:text-[#ffd700]">
                Find your origin
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Worlds */}
            <Link
              href="/worlds"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#00bcd4]/25 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(0,188,212,0.07)]"
            >
              <div
                className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #00bcd4, transparent)' }}
              />
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#00bcd4]/20 bg-[#00bcd4]/10">
                <Globe className="h-5 w-5 text-[#00bcd4]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Explore Worlds</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                Walk through complete creative universes built by others. See what the framework produces.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00bcd4]/60 transition-colors group-hover:text-[#00bcd4]">
                Browse worlds
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Studio */}
            <Link
              href="/chat"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#a78bfa]/25 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(167,139,250,0.07)]"
            >
              <div
                className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }}
              />
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/10">
                <Lightning className="h-5 w-5 text-[#a78bfa]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Start Creating</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                Open a conversation with your Guardian. The studio is ready when you are.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a78bfa]/60 transition-colors group-hover:text-[#a78bfa]">
                Enter the studio
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </StaggerReveal>

          {/* Final CTA */}
          <Reveal delay={0.35}>
            <div className="mt-16 text-center">
              <Magnetic>
                <Link
                  href="/academy/gate-quiz"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-[#7fffd4]/20 bg-[#7fffd4]/[0.05] px-10 py-5 font-semibold text-[#7fffd4] backdrop-blur-sm transition-all duration-300 hover:border-[#7fffd4]/35 hover:bg-[#7fffd4]/[0.10] hover:shadow-[0_0_60px_rgba(127,255,212,0.15)]"
                >
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                  <GraduationCap className="h-5 w-5 relative z-10" weight="fill" />
                  <span className="relative z-10">Begin Your Journey</span>
                  <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/20">
                Free to start — your path, your pace
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
