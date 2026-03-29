'use client';

import { useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Sparkle, Crown, Star, Lightning, Users,
  Trophy, Flame, Drop, Leaf, Wind, Eye, Sun,
  Globe, Shield, Scroll, Book, Sword, MusicNote,
} from '@/lib/phosphor-icons';
import { FEATURED_CHALLENGES, DIFFICULTY_CONFIG, ELEMENT_CONFIG, SPELLBOOKS } from '@/lib/challenges';
import { ChallengeCard, SpellbookViewer, TeamComposer } from '@/components/challenges';
import type { ChallengeCategory, ChallengeStatus, Element } from '@/lib/types/challenge';

// Lazy load the 3D scene (heavy)
const ArenaScene = lazy(() =>
  import('@/components/challenges/arena-orbs').then(mod => ({ default: mod.ArenaScene }))
);

/* ----------------------------------------------------------------
 *  ARENA STATS
 * ---------------------------------------------------------------- */

const ARENA_STATS = [
  { label: 'Active Challenges', value: '6', icon: Lightning, color: '#ff6b35' },
  { label: 'Creators Competing', value: '1,434', icon: Users, color: '#60a5fa' },
  { label: 'Total Prize Pool', value: '$12,200', icon: Trophy, color: '#ffd700' },
  { label: 'Spells Cast', value: '8,291', icon: Sparkle, color: '#a78bfa' },
  { label: 'Submissions', value: '526', icon: Scroll, color: '#34d399' },
  { label: 'Legendary Entries', value: '12', icon: Crown, color: '#f59e0b' },
];

const FILTER_CATEGORIES: { label: string; value: ChallengeCategory | 'all'; icon: React.ComponentType<{ className?: string; weight?: string }> }[] = [
  { label: 'All', value: 'all', icon: Globe },
  { label: 'Web Design', value: 'web-design', icon: Globe },
  { label: 'Visual Art', value: 'visual-art', icon: Sparkle },
  { label: 'Music', value: 'music-composition', icon: MusicNote },
  { label: 'Agent Forge', value: 'agent-forge', icon: Shield },
  { label: 'Lore', value: 'lore-weaving', icon: Book },
  { label: 'Prompt Craft', value: 'prompt-craft', icon: Scroll },
];

const LEADERBOARD = [
  { rank: 1, name: 'Vaelith Storm', house: 'Pyros', mana: 42800, wins: 7, element: 'fire' as Element },
  { rank: 2, name: 'Luna Deepwell', house: 'Aqualis', mana: 38200, wins: 6, element: 'water' as Element },
  { rank: 3, name: 'Kaiden Roothold', house: 'Terra', mana: 35100, wins: 5, element: 'earth' as Element },
  { rank: 4, name: 'Zephyr Windcaller', house: 'Ventus', mana: 31500, wins: 5, element: 'wind' as Element },
  { rank: 5, name: 'Nyxara Voidtouched', house: 'Nero', mana: 28900, wins: 4, element: 'void' as Element },
];

/* ----------------------------------------------------------------
 *  PAGE
 * ---------------------------------------------------------------- */

export default function ChallengesPage() {
  const [activeSection, setActiveSection] = useState<'challenges' | 'spellbooks' | 'teams'>('challenges');
  const [filterCategory, setFilterCategory] = useState<ChallengeCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ChallengeStatus | 'all'>('all');

  const filteredChallenges = FEATURED_CHALLENGES.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const ELEMENT_ICONS: Record<string, React.ComponentType<{ className?: string; weight?: string }>> = {
    fire: Flame, water: Drop, earth: Leaf, wind: Wind, void: Eye, spirit: Sun,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">

      {/* ============ 3D ARENA BACKDROP ============ */}
      <Suspense fallback={null}>
        <div className="pointer-events-none fixed inset-0 opacity-40">
          <ArenaScene />
        </div>
      </Suspense>

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="absolute left-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#ff6b35]/10 blur-[160px]" />
          <div className="absolute right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-[#7c3aed]/10 blur-[140px]" />
          <div className="absolute bottom-[15%] left-[30%] h-[350px] w-[350px] rounded-full bg-[#ffd700]/8 blur-[120px]" />
          <div className="absolute right-[25%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-[#06b6d4]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <Sword className="h-4 w-4 text-[#ff6b35]" weight="fill" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff6b35]/90">
              The Arena of Creation
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ffd700] to-[#a78bfa] bg-clip-text text-transparent">
              Arcanea
            </span>
            <br />
            <span className="text-white">Challenge Arena</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
            Compete. Cast Spells. Create Legends.
            <br />
            <span className="text-white/30">
              Where GenAI meets world-building, and creators forge their destiny.
            </span>
          </p>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ffd700] px-8 py-4 font-display text-sm font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
            >
              <Lightning className="h-5 w-5" weight="fill" />
              Enter the Arena
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setActiveSection('spellbooks')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-display text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
            >
              <Book className="h-4 w-4" />
              Open Spellbooks
            </button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-6 sm:grid-cols-6">
            {ARENA_STATS.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <StatIcon className="mx-auto mb-1.5 h-5 w-5" style={{ color: stat.color }} weight="fill" />
                  <div className="font-display text-xl font-bold text-white md:text-2xl">{stat.value}</div>
                  <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION SWITCHER ============ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-center gap-2">
          {[
            { key: 'challenges' as const, label: 'Challenges', icon: Sword },
            { key: 'spellbooks' as const, label: 'Spellbooks', icon: Book },
            { key: 'teams' as const, label: 'Team Forge', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2.5 rounded-2xl border px-6 py-3 font-display text-sm font-semibold transition-all duration-300 ${
                activeSection === key
                  ? 'border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.12] hover:text-white/80'
              }`}
            >
              <Icon className="h-4 w-4" weight={activeSection === key ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ============ CHALLENGES SECTION ============ */}
      {activeSection === 'challenges' && (
        <section id="challenges" className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
          {/* Filters */}
          <div className="mb-10 space-y-4">
            {/* Category filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Category</span>
              {FILTER_CATEGORIES.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilterCategory(value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[10px] transition-all ${
                    filterCategory === value
                      ? 'border-white/[0.15] bg-white/[0.08] text-white'
                      : 'border-white/[0.06] text-white/40 hover:border-white/[0.1] hover:text-white/60'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Status</span>
              {(['all', 'active', 'upcoming', 'judging', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] capitalize transition-all ${
                    filterStatus === status
                      ? 'border-white/[0.15] bg-white/[0.08] text-white'
                      : 'border-white/[0.06] text-white/40 hover:border-white/[0.1] hover:text-white/60'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="py-20 text-center">
              <Eye className="mx-auto mb-4 h-12 w-12 text-white/10" weight="duotone" />
              <p className="text-sm text-white/30">No challenges match your filters. Try adjusting them.</p>
            </div>
          )}

          {/* ============ LEADERBOARD ============ */}
          <div className="mt-20">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
                <Trophy className="h-4 w-4 text-[#ffd700]" weight="fill" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ffd700]/90">
                  Arena Leaderboard
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Top <span className="bg-gradient-to-r from-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent">Creators</span>
              </h2>
            </div>

            <div className="mx-auto max-w-2xl space-y-3">
              {LEADERBOARD.map((entry) => {
                const ElIcon = ELEMENT_ICONS[entry.element] || Sparkle;
                const elConfig = ELEMENT_CONFIG[entry.element];
                return (
                  <div
                    key={entry.rank}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-bold ${
                      entry.rank === 1 ? 'bg-[#ffd700]/15 text-[#ffd700]'
                      : entry.rank === 2 ? 'bg-white/10 text-white/60'
                      : entry.rank === 3 ? 'bg-[#cd7f32]/15 text-[#cd7f32]'
                      : 'bg-white/[0.04] text-white/30'
                    }`}>
                      {entry.rank === 1 ? <Crown className="h-5 w-5" weight="fill" /> : `#${entry.rank}`}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold text-white">{entry.name}</span>
                        <ElIcon className="h-3.5 w-3.5" style={{ color: elConfig?.color }} weight="fill" />
                      </div>
                      <span className="font-mono text-[10px] text-white/30">House {entry.house}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Sparkle className="h-3 w-3 text-[#ffd700]" weight="fill" />
                        <span className="font-mono text-xs font-bold text-[#ffd700]">{entry.mana.toLocaleString()}</span>
                      </div>
                      <span className="font-mono text-[9px] text-white/30">{entry.wins} wins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ SPELLBOOKS SECTION ============ */}
      {activeSection === 'spellbooks' && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              The Five <span className="bg-gradient-to-r from-[#ff6b35] via-[#ffd700] to-[#a78bfa] bg-clip-text text-transparent">Spellbooks</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
              Master the elemental grimoires. Each spell enhances your submissions with magical power.
              Speak the incantation, pay the Mana cost, and watch your creation transform.
            </p>
          </div>
          <SpellbookViewer spellbooks={SPELLBOOKS} userGates={3} />
        </section>
      )}

      {/* ============ TEAMS SECTION ============ */}
      {activeSection === 'teams' && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
          <TeamComposer />
        </section>
      )}

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative z-10 border-t border-white/[0.04] bg-[#0a0a0f]/80 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              How the Arena <span className="bg-gradient-to-r from-[#06b6d4] to-[#60a5fa] bg-clip-text text-transparent">Works</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Choose Your Challenge',
                description: 'Browse active challenges across categories — web design, AI agents, music, visual art, lore, and more.',
                icon: Lightning,
                color: '#ff6b35',
              },
              {
                step: '02',
                title: 'Forge Your Team',
                description: 'Assemble a team with your chosen Formation. Each role and combination grants unique synergy bonuses.',
                icon: Users,
                color: '#60a5fa',
              },
              {
                step: '03',
                title: 'Cast & Create',
                description: 'Use Spellbooks to enhance your work. Cast incantations, burn Mana, and channel elemental power into your creation.',
                icon: Sparkle,
                color: '#a78bfa',
              },
              {
                step: '04',
                title: 'Submit & Earn',
                description: 'Submit your creation on-chain. Smart contracts verify authorship, team composition, and timestamps. Winners earn Mana, titles, and real rewards.',
                icon: Trophy,
                color: '#ffd700',
              },
            ].map((item) => {
              const StepIcon = item.icon;
              return (
                <div key={item.step} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <StepIcon className="h-5 w-5" style={{ color: item.color }} weight="fill" />
                    </div>
                    <span className="font-mono text-3xl font-bold text-white/10">{item.step}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Crown className="mx-auto mb-6 h-12 w-12 text-[#ffd700]" weight="fill" />
          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            The Arena Awaits
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Every great creator started with a single challenge.
            Yours begins now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ffd700] px-8 py-4 font-display text-sm font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
            >
              <Sparkle className="h-5 w-5" weight="fill" />
              Join the Arena
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
