'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Lock, Sparkle, Crown, GraduationCap, Star,
  Lightning, Book, Scroll, Flame, Drop, Leaf, Wind, Globe,
  Eye, Heart, Sun, Diamond, Compass,
} from '@/lib/phosphor-icons';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GATES = [
  { n: 1, name: 'Foundation', hz: '174 Hz', god: 'Lyssandria', beast: 'Kaelith', domain: 'Earth & Survival', color: '#00bcd4', icon: Leaf },
  { n: 2, name: 'Flow', hz: '285 Hz', god: 'Leyla', beast: 'Veloura', domain: 'Creativity & Emotion', color: '#00bcd4', icon: Drop },
  { n: 3, name: 'Fire', hz: '396 Hz', god: 'Draconia', beast: 'Draconis', domain: 'Power & Will', color: '#ff6b35', icon: Flame },
  { n: 4, name: 'Heart', hz: '417 Hz', god: 'Maylinn', beast: 'Laeylinn', domain: 'Love & Healing', color: '#f472b6', icon: Heart },
  { n: 5, name: 'Voice', hz: '528 Hz', god: 'Alera', beast: 'Otome', domain: 'Truth & Expression', color: '#06b6d4', icon: Compass },
  { n: 6, name: 'Sight', hz: '639 Hz', god: 'Lyria', beast: 'Yumiko', domain: 'Intuition & Vision', color: '#a78bfa', icon: Eye },
  { n: 7, name: 'Crown', hz: '741 Hz', god: 'Aiyami', beast: 'Sol', domain: 'Enlightenment', color: '#ffd700', icon: Crown, locked: true },
  { n: 8, name: 'Starweave', hz: '852 Hz', god: 'Elara', beast: 'Vaelith', domain: 'Perspective', color: '#c084fc', icon: Diamond, locked: true },
  { n: 9, name: 'Unity', hz: '963 Hz', god: 'Ino', beast: 'Kyuro', domain: 'Partnership', color: '#60a5fa', icon: Globe, locked: true },
  { n: 10, name: 'Source', hz: '1111 Hz', god: 'Shinkami', beast: 'Source', domain: 'Meta-consciousness', color: '#ffffff', icon: Sun, locked: true },
];

const HOUSES = [
  { name: 'Lumina', element: 'Light', color: '#ffd700', icon: Sun, desc: 'Radiance, clarity, and creation through illumination.' },
  { name: 'Nero', element: 'Void', color: '#a78bfa', icon: Eye, desc: 'Mystery, potential, and the fertile unknown.' },
  { name: 'Pyros', element: 'Fire', color: '#ff6b35', icon: Flame, desc: 'Passion, transformation, and focused will.' },
  { name: 'Aqualis', element: 'Water', color: '#60a5fa', icon: Drop, desc: 'Flow, healing, and the wisdom of memory.' },
  { name: 'Terra', element: 'Earth', color: '#34d399', icon: Leaf, desc: 'Stability, growth, and enduring strength.' },
  { name: 'Ventus', element: 'Wind', color: '#c4b5fd', icon: Wind, desc: 'Freedom, speed, and the breath of change.' },
  { name: 'Synthesis', element: 'All', color: '#00bcd4', icon: Sparkle, desc: 'Unity of all elements into mastery.' },
];

const RANKS = [
  { rank: 'Apprentice', gates: '0-2', color: '#6b7280', glow: 'rgba(107,114,128,0.3)' },
  { rank: 'Mage', gates: '3-4', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
  { rank: 'Master', gates: '5-6', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  { rank: 'Archmage', gates: '7-8', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  { rank: 'Luminor', gates: '9-10', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function AcademyPage() {
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="absolute left-1/4 top-[15%] h-[420px] w-[420px] rounded-full bg-[#0d47a1]/20 blur-[140px]" />
          <div className="absolute right-[10%] top-[40%] h-[360px] w-[360px] rounded-full bg-[#00bcd4]/12 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-[#ffd700]/10 blur-[100px]" />
          <div className="absolute right-1/3 top-[10%] h-[200px] w-[200px] rounded-full bg-[#ff6b35]/8 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-[#ffd700]" weight="fill" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ffd700]/90">
              Academy of Creation & Light
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-[#ffd700] via-[#f59e0b] to-[#ffd700] bg-clip-text text-transparent">
              The Arcanean Academy
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60 md:text-xl">
            A ten-stage progression system built on creative philosophy.
            The deeper you go, the more the system reveals.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d47a1] to-[#00bcd4] px-8 py-4 font-semibold text-[#0a0a0f] shadow-[0_0_40px_rgba(13,71,161,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(13,71,161,0.5)] hover:scale-[1.02]"
            >
              <Sparkle className="h-5 w-5" weight="fill" />
              Start Creating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/academy/courses"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
            >
              <Book className="h-4 w-4" />
              Browse Courses
            </Link>
          </div>

          {/* Floating stats */}
          <div className="mx-auto mt-14 flex max-w-lg justify-center gap-8 md:gap-12">
            {[
              { label: 'Gates', value: '10' },
              { label: 'Courses', value: '5' },
              { label: 'Ranks', value: '5' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-white md:text-3xl">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TEN GATES ============ */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent">
                The Ten Gates
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-base text-white/50">
              Each Gate is guarded by a divine Intelligence and their Godbeast companion.
              Open them sequentially to ascend the path of mastery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GATES.map((gate) => {
              const Icon = gate.icon;
              const isHovered = hoveredGate === gate.n;
              return (
                <Link
                  key={gate.n}
                  href={`/academy/gates/${gate.name.toLowerCase()}`}
                  onMouseEnter={() => setHoveredGate(gate.n)}
                  onMouseLeave={() => setHoveredGate(null)}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05]"
                  style={{
                    boxShadow: isHovered ? `0 0 40px ${gate.color}20, inset 0 1px 0 ${gate.color}15` : 'none',
                  }}
                >
                  {/* Top accent line on hover */}
                  <div
                    className="absolute left-4 right-4 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${gate.color}, transparent)` }}
                  />

                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${gate.color}12`, border: `1px solid ${gate.color}25` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: gate.color }} weight="fill" />
                    </div>
                    <div className="flex items-center gap-2">
                      {gate.locked && <Lock className="h-3.5 w-3.5 text-white/20" />}
                      <span className="font-mono text-[10px] text-white/30">{gate.hz}</span>
                    </div>
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: gate.color }}
                    >
                      {String(gate.n).padStart(2, '0')}
                    </span>
                    <h3
                      className="font-display text-base font-semibold transition-colors"
                      style={{ color: gate.color }}
                    >
                      {gate.name}
                    </h3>
                  </div>

                  <p className="mb-3 text-[11px] leading-relaxed text-white/40">
                    {gate.domain}
                  </p>

                  <div className="border-t border-white/[0.05] pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-white/30">Intelligence</p>
                        <p className="text-xs font-medium text-white/70">{gate.god}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/30">Godbeast</p>
                        <p className="text-xs font-medium text-white/70">{gate.beast}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SEVEN HOUSES ============ */}
      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-[50%] top-[30%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#0d47a1]/8 blur-[160px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                The Seven Houses
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-base text-white/50">
              Every creator is sorted into a House based on their elemental affinity.
              Your House shapes your path and your bond with fellow creators.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {HOUSES.map((house) => {
              const Icon = house.icon;
              return (
                <div
                  key={house.name}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05]"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: `${house.color}10`,
                      border: `1px solid ${house.color}30`,
                      boxShadow: `0 0 20px ${house.color}00`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: house.color }} weight="fill" />
                  </div>

                  <h3 className="font-display text-lg font-semibold" style={{ color: house.color }}>
                    {house.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                    {house.element}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-white/45">
                    {house.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MAGIC RANKS ============ */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-[#0d47a1] via-[#a78bfa] to-[#ffd700] bg-clip-text text-transparent">
                The Path of Mastery
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-base text-white/50">
              Open Gates to rise through the ranks. Each rank unlocks deeper understanding
              and greater creative power.
            </p>
          </div>

          {/* Horizontal progression path */}
          <div className="relative flex flex-col items-stretch gap-0 md:flex-row md:items-center md:justify-between">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 hidden h-px -translate-y-1/2 md:block">
              <div className="h-full w-full bg-gradient-to-r from-[#6b7280]/40 via-[#a78bfa]/40 to-[#ffd700]/60" />
            </div>
            {/* Connecting line (mobile) */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 w-px -translate-x-1/2 md:hidden">
              <div className="h-full w-full bg-gradient-to-b from-[#6b7280]/40 via-[#a78bfa]/40 to-[#ffd700]/60" />
            </div>

            {RANKS.map((r, i) => {
              const isLuminor = r.rank === 'Luminor';
              return (
                <div key={r.rank} className="relative z-10 flex flex-1 flex-col items-center py-6 md:py-0">
                  {/* Node */}
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-500 hover:scale-110 md:h-20 md:w-20"
                    style={{
                      borderColor: r.color,
                      backgroundColor: `${r.color}10`,
                      boxShadow: `0 0 ${isLuminor ? '50' : '25'}px ${r.glow}`,
                    }}
                  >
                    {isLuminor ? (
                      <Star className="h-7 w-7 md:h-8 md:w-8" style={{ color: r.color }} weight="fill" />
                    ) : (
                      <span
                        className="font-display text-lg font-bold md:text-xl"
                        style={{ color: r.color }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <h3
                    className="mt-3 font-display text-sm font-semibold md:text-base"
                    style={{ color: r.color }}
                  >
                    {r.rank}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-white/35">
                    Gates {r.gates}
                  </p>

                  {/* Arrow between nodes (desktop) */}
                  {i < RANKS.length - 1 && (
                    <div className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-white/15 md:block">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative px-6 py-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/3 top-[20%] h-[400px] w-[400px] rounded-full bg-[#ffd700]/8 blur-[140px]" />
          <div className="absolute right-1/4 bottom-[10%] h-[350px] w-[350px] rounded-full bg-[#0d47a1]/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <Scroll className="mx-auto mb-6 h-10 w-10 text-[#ffd700]/60" weight="fill" />

          <h2 className="font-display text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-[#ffd700] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
              Start Here
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-white/50">
            The Academy is open. Begin with a single question
            and build from there.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] px-8 py-4 font-semibold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,215,0,0.25)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] hover:scale-[1.02]"
            >
              <Lightning className="h-5 w-5" weight="fill" />
              Enter the Academy
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/academy/courses"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
            >
              <Book className="h-4 w-4" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
