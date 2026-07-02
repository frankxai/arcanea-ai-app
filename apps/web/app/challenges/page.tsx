'use client';

import { Suspense, lazy } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Sparkle, Crown, Lightning, Users,
  Trophy, Globe, Scroll, Book, Sword,
} from '@/lib/phosphor-icons';
import {
  seasonZero,
  getArenaStats,
  getEntryById,
  getPrizeLabel,
  getSeasonStatusLabel,
} from '@/lib/challenges/season-zero';

// Lazy load the 3D scene (heavy)
const ArenaScene = lazy(() =>
  import('@/components/challenges/arena-orbs').then(mod => ({ default: mod.ArenaScene }))
);

/* ----------------------------------------------------------------
 *  PAGE — every number below derives from the Season 0 ledger
 *  (data/challenges/season-0.json). No hand-written stats.
 * ---------------------------------------------------------------- */

export default function ChallengesPage() {
  const stats = getArenaStats();

  const ARENA_STATS = [
    { label: 'Active Challenges', value: String(stats.activeChallenges), icon: Lightning, color: 'var(--arc-fire)' },
    { label: 'Entrants', value: String(stats.entrants), icon: Users, color: 'var(--arc-brand-cosmic-blue)' },
    { label: 'Entries', value: String(stats.entries), icon: Scroll, color: 'var(--arc-wind)' },
    { label: 'Judged', value: String(stats.judgedEntries), icon: Trophy, color: 'var(--arc-brand-arcanean-gold)' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--arc-cosmic-void)]">

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
          <div className="absolute left-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-[var(--arc-fire)]/10 blur-[160px]" />
          <div className="absolute right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-[var(--arc-void)]/10 blur-[140px]" />
          <div className="absolute bottom-[15%] left-[30%] h-[350px] w-[350px] rounded-full bg-[var(--arc-brand-arcanean-gold)]/8 blur-[120px]" />
          <div className="absolute right-[25%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <Sword className="h-4 w-4 text-[var(--arc-fire)]" weight="fill" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--arc-fire)]/90">
              The Arena of Creation
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-[var(--arc-fire)] via-[var(--arc-brand-arcanean-gold)] to-[var(--arc-void)] bg-clip-text text-transparent">
              Arcanea
            </span>
            <br />
            <span className="text-white">Arena</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
            Compete on the workflow, not the artifact.
            <br />
            <span className="text-white/30">
              Build an agentic world-creation workflow. The winning skills ship in the Arcanea plugin.
            </span>
          </p>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById('season-0')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--arc-fire)] to-[var(--arc-brand-arcanean-gold)] px-8 py-4 font-display text-sm font-bold text-[var(--arc-cosmic-void)] shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
            >
              <Lightning className="h-5 w-5" weight="fill" />
              Season 0
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={seasonZero.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-display text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
            >
              <Book className="h-4 w-4" />
              Read the Rules
            </a>
          </div>

          {/* Stats bar — derived from the ledger */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
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

      {/* ============ SEASON 0 ============ */}
      <section id="season-0" className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-8">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-arcanean-gold)]/30 bg-[var(--arc-brand-arcanean-gold)]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--arc-brand-arcanean-gold)]">
              <Crown className="h-3.5 w-3.5" weight="fill" />
              Season {seasonZero.season}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {getSeasonStatusLabel()}
            </span>
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            {seasonZero.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/50">
            {seasonZero.tagline} Your entry is a Claude Code skill that generates a world within
            Arcanea canon. At judging time it runs against a seed you&apos;ve never seen — the
            workflow is what competes.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Prize</div>
              <div className="mt-1.5 font-display text-sm font-semibold text-white">{getPrizeLabel()}</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Entry Window</div>
              <div className="mt-1.5 font-display text-sm font-semibold text-white">
                {seasonZero.opensAt ?? 'To be announced'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Format</div>
              <div className="mt-1.5 font-display text-sm font-semibold text-white">Pull request, judged by panel</div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href={seasonZero.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] transition-colors hover:text-white"
            >
              Rules, seeds, and entry template on GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* ============ LEADERBOARD ============ */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
              <Trophy className="h-4 w-4 text-[var(--arc-brand-arcanean-gold)]" weight="fill" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--arc-brand-arcanean-gold)]/90">
                Season {seasonZero.season} Leaderboard
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              The <span className="bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-fire)] bg-clip-text text-transparent">Worldsmiths</span>
            </h2>
          </div>

          {seasonZero.leaderboard.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
              <Sparkle className="mx-auto mb-4 h-10 w-10 text-white/10" weight="duotone" />
              <p className="font-display text-sm font-semibold text-white/60">No entries judged yet.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/30">
                The leaderboard fills when Season 0 judging completes. Every score is committed to
                the public season ledger — every number here traces to a commit.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-3">
              {seasonZero.leaderboard.map((row) => {
                const entry = getEntryById(row.entryId);
                return (
                  <div
                    key={row.rank}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-bold ${
                      row.rank === 1 ? 'bg-[var(--arc-brand-arcanean-gold)]/15 text-[var(--arc-brand-arcanean-gold)]'
                      : row.rank === 2 ? 'bg-white/10 text-white/60'
                      : row.rank === 3 ? 'bg-[var(--arc-fire)]/15 text-[var(--arc-fire)]'
                      : 'bg-white/[0.04] text-white/30'
                    }`}>
                      {row.rank === 1 ? <Crown className="h-5 w-5" weight="fill" /> : `#${row.rank}`}
                    </div>
                    <div className="flex-1">
                      <span className="font-display text-sm font-semibold text-white">{entry?.entrant ?? row.entryId}</span>
                      <div className="font-mono text-[10px] text-white/30">{entry?.skill}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Sparkle className="h-3 w-3 text-[var(--arc-brand-arcanean-gold)]" weight="fill" />
                        <span className="font-mono text-xs font-bold text-[var(--arc-brand-arcanean-gold)]">{row.finalScore.toFixed(1)}</span>
                      </div>
                      <span className="font-mono text-[9px] text-white/30">final score</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative z-10 border-t border-white/[0.04] bg-[var(--arc-cosmic-void)]/80 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              How the Arena <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">Works</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Read the Challenge',
                description: 'Each season sets a creative brief inside Arcanea canon, with public seeds to build against and a published judging rubric.',
                icon: Lightning,
                color: 'var(--arc-fire)',
              },
              {
                step: '02',
                title: 'Build Your Workflow',
                description: 'Craft a Claude Code skill that generates a world — cosmology, systems, geography, factions, timeline. The workflow is your entry.',
                icon: Sparkle,
                color: 'var(--arc-void)',
              },
              {
                step: '03',
                title: 'Submit by Pull Request',
                description: 'Open a PR on the open-source repo with your skill, manifest, and a sample world. Automated validation checks your entry.',
                icon: Globe,
                color: 'var(--arc-brand-cosmic-blue)',
              },
              {
                step: '04',
                title: 'Judged & Published',
                description: 'Your workflow re-runs against a held-out seed. An anonymized judge panel scores it; results are committed to the public ledger. Winners ship in the Arcanea plugin, credited to you.',
                icon: Trophy,
                color: 'var(--arc-brand-arcanean-gold)',
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
          <Crown className="mx-auto mb-6 h-12 w-12 text-[var(--arc-brand-arcanean-gold)]" weight="fill" />
          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            The Arena Awaits
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Every great creator started with a single challenge.
            Yours begins now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={seasonZero.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[var(--arc-fire)] to-[var(--arc-brand-arcanean-gold)] px-8 py-4 font-display text-sm font-bold text-[var(--arc-cosmic-void)] shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
            >
              <Sparkle className="h-5 w-5" weight="fill" />
              Enter Season 0
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/worlds"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-8 py-4 font-display text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
            >
              <Globe className="h-4 w-4" />
              Explore Worlds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
