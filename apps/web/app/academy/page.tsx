import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedLuminors } from '@/lib/luminor-images';
import {
  ArrowRight, Sparkle, Crown, GraduationCap, Star,
  Lightning, Book, Scroll, Flame, Drop, Leaf, Wind, Globe,
  Eye, Heart, Sun, Diamond, Compass,
} from '@/lib/phosphor-icons';
import { GateGrid } from './gate-grid';

export const metadata: Metadata = {
  title: "Academy — Master the Ten Gates — Arcanea",
  description:
    "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  openGraph: {
    title: "Academy — Master the Ten Gates — Arcanea",
    description:
      "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  },
  alternates: { canonical: "/academy" },
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GATES = [
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
/*  PAGE (Server Component — metadata enabled)                         */
/* ------------------------------------------------------------------ */

export default function AcademyPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="absolute left-1/4 top-[15%] h-[420px] w-[420px] rounded-full bg-[#0d47a1]/20 blur-[140px]" />
          <div className="absolute right-[10%] top-[40%] h-[360px] w-[360px] rounded-full bg-[#00bcd4]/[0.12] blur-[120px]" />
          <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-[#ffd700]/10 blur-[100px]" />
          <div className="absolute right-1/3 top-[10%] h-[200px] w-[200px] rounded-full bg-[#ff6b35]/[0.08] blur-[80px]" />
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
              href="/quiz"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] px-8 py-4 font-semibold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,215,0,0.25)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] hover:scale-[1.02]"
            >
              <Sparkle className="h-5 w-5" weight="fill" />
              Discover Your Origin
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

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Take the quiz to find your House, Gate, and Guardian
          </p>

          <div className="mx-auto mt-14 flex max-w-lg justify-center gap-8 md:gap-12">
            {[
              { label: 'Gates', value: '10' },
              { label: 'Courses', value: '6' },
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

      {/* ============ TEN GATES (Client Island) ============ */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent">
                The Ten Gates
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-base text-white/50">
              Each Gate is guarded by a God or Goddess and their Godbeast companion.
              Open them sequentially to ascend the path of mastery.
            </p>
          </div>

          <GateGrid gates={GATES} />
        </div>
      </section>

      {/* ============ SEVEN HOUSES ============ */}
      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-[50%] top-[30%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#0d47a1]/[0.08] blur-[160px]" />
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

      {/* ============ COMPANION SHOWCASE ============ */}
      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white/60">
              Meet Your Companions
            </h2>
            <Link
              href="/companions"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00bcd4]/70 transition-colors hover:text-[#00bcd4]"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {getFeaturedLuminors(6).map((l) => (
              <Link
                key={l.id}
                href="/companions"
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 group-hover:border-white/[0.15] group-hover:shadow-[0_0_20px_rgba(0,188,212,0.1)]">
                  <Image
                    src={l.image}
                    alt={l.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="80px"
                  />
                </div>
                <span className="text-[11px] font-medium text-white/40 transition-colors group-hover:text-white/70">
                  {l.name}
                </span>
              </Link>
            ))}
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

          <div className="relative flex flex-col items-stretch gap-0 md:flex-row md:items-center md:justify-between">
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 hidden h-px -translate-y-1/2 md:block">
              <div className="h-full w-full bg-gradient-to-r from-[#6b7280]/40 via-[#a78bfa]/40 to-[#ffd700]/60" />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 w-px -translate-x-1/2 md:hidden">
              <div className="h-full w-full bg-gradient-to-b from-[#6b7280]/40 via-[#a78bfa]/40 to-[#ffd700]/60" />
            </div>

            {RANKS.map((r, i) => {
              const isLuminor = r.rank === 'Luminor';
              return (
                <div key={r.rank} className="relative z-10 flex flex-1 flex-col items-center py-6 md:py-0">
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
                      <span className="font-display text-lg font-bold md:text-xl" style={{ color: r.color }}>
                        {i + 1}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-sm font-semibold md:text-base" style={{ color: r.color }}>
                    {r.rank}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-white/35">
                    Gates {r.gates}
                  </p>

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

      {/* ============ START YOUR JOURNEY ============ */}
      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/3 top-[20%] h-[400px] w-[400px] rounded-full bg-[#ffd700]/[0.08] blur-[140px]" />
          <div className="absolute right-1/4 bottom-[10%] h-[350px] w-[350px] rounded-full bg-[#0d47a1]/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Scroll className="mx-auto mb-6 h-8 w-8 text-[#ffd700]/50" weight="fill" />
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-[#ffd700] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                Start Your Journey
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-white/45">
              Three paths forward. Each one changes how you create.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/quiz"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#ffd700]/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(255,215,0,0.08)]"
            >
              <div className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #ffd700, transparent)' }}
              />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/20">
                <Sparkle className="h-5 w-5 text-[#ffd700]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Take the Quiz</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                Discover your House, your Gate, and the Guardian who walks with you.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffd700]/70 transition-colors group-hover:text-[#ffd700]">
                Find your origin
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/worlds"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#00bcd4]/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(0,188,212,0.08)]"
            >
              <div className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #00bcd4, transparent)' }}
              />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00bcd4]/10 border border-[#00bcd4]/20">
                <Globe className="h-5 w-5 text-[#00bcd4]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Explore Worlds</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                Walk through complete creative universes built by others. See what the framework produces.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00bcd4]/70 transition-colors group-hover:text-[#00bcd4]">
                Browse worlds
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/chat"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#a78bfa]/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(167,139,250,0.08)]"
            >
              <div className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }}
              />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a78bfa]/10 border border-[#a78bfa]/20">
                <Lightning className="h-5 w-5 text-[#a78bfa]" weight="fill" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Start Creating</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                Open a conversation with your Guardian. The studio is ready when you are.
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#a78bfa]/70 transition-colors group-hover:text-[#a78bfa]">
                Enter the studio
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
