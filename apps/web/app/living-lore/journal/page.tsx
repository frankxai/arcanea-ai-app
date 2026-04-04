'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { slideUp, staggerContainer, staggerItem } from '@/lib/design/motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useLivingLoreProgress } from '@/hooks/use-living-lore-progress';
import { getAllCrew } from '@/lib/living-lore/crew-data';
import { BondMeter } from '@/components/living-lore/bond-meter';
import { getMagicRank, BOND_UNLOCKS } from '@/lib/living-lore/progression';
import { ScrollToTop } from '@/components/living-lore/scroll-to-top';

const GATE_NAMES = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
];

const GATE_ELEMENT_COLORS: Record<number, string> = {
  1: '#32CD32', 2: '#4169E1', 3: '#FF6B35', 4: '#4169E1', 5: '#C0C0C0',
  6: '#9370DB', 7: '#9370DB', 8: '#9370DB', 9: '#9370DB', 10: '#FFD700',
};

const RANK_LADDER = [
  { rank: 'Apprentice', gates: '0-2', color: 'text-text-muted' },
  { rank: 'Mage', gates: '3-4', color: 'text-blue-400' },
  { rank: 'Master', gates: '5-6', color: 'text-purple-400' },
  { rank: 'Archmage', gates: '7-8', color: 'text-amber-400' },
  { rank: 'Luminor', gates: '9-10', color: 'text-gold-bright' },
];

// ---------------------------------------------------------------------------
// Animated XP counter
// ---------------------------------------------------------------------------
function useAnimatedCount(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------
function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function JournalSkeleton() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
      <Skeleton variant="text" className="mb-8 h-4 w-32" />
      <div className="mb-10">
        <Skeleton variant="text" className="h-9 w-48 mb-2" />
        <Skeleton variant="text" className="h-4 w-72" />
      </div>
      {/* Rank card skeleton */}
      <Skeleton variant="rect" className="mb-8 h-52 w-full rounded-2xl" />
      {/* Gates skeleton */}
      <Skeleton variant="rect" className="mb-8 h-32 w-full rounded-2xl" />
      {/* Crew skeleton */}
      <Skeleton variant="rect" className="mb-8 h-64 w-full rounded-2xl" />
      {/* Activity skeleton */}
      <Skeleton variant="rect" className="h-40 w-full rounded-2xl" />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function JournalPage() {
  const {
    loading,
    totalXp,
    getBondForMember,
    getCompletedEpisodes,
    getCompletedEncounters,
  } = useLivingLoreProgress();

  const crew = getAllCrew();

  // Derive gates open from completed episodes (simplified: 1 gate per act completed)
  const completedEpisodes = getCompletedEpisodes();
  const completedEncounters = getCompletedEncounters();
  const completedActs = new Set(completedEpisodes.map((e) => e.actNumber));
  const gatesOpen = completedActs.size;

  const { rank, description: rankDescription } = getMagicRank(gatesOpen);
  const animatedXp = useAnimatedCount(totalXp);

  const bondUnlockEntries = Object.entries(BOND_UNLOCKS) as [string, string][];

  // Merge and sort recent activity
  const recentActivity = [
    ...completedEpisodes.map((e) => ({
      type: 'episode' as const,
      slug: e.contentSlug,
      xp: e.xpAwarded,
      date: e.completedAt ?? e.startedAt,
    })),
    ...completedEncounters.map((e) => ({
      type: 'encounter' as const,
      slug: e.contentSlug,
      xp: e.xpAwarded,
      date: e.completedAt ?? e.startedAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) return <JournalSkeleton />;

  return (
    <LazyMotion features={domAnimation}>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-text-muted">
            <li>
              <Link
                href="/living-lore"
                className="hover:text-atlantean-teal-aqua transition-colors"
              >
                Living Lore
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary">Journal</li>
          </ol>
        </nav>

        {/* Title */}
        <m.header
          className="mb-10"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-cinzel text-3xl font-semibold text-text-primary md:text-4xl">
            Your Journey
          </h1>
          <p className="mt-2 text-sm text-text-muted leading-relaxed">
            Every step through the Gates is recorded here. Your progress, your
            bonds, your story.
          </p>
        </m.header>

        {/* ── Magic Rank Card ── */}
        <m.section
          className="mb-8 rounded-2xl liquid-glass-elevated p-6"
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
        >
          <m.div variants={staggerItem} className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-text-dim font-semibold mb-2">
                Magic Rank
              </p>
              <h2 className="font-cinzel text-2xl font-bold text-gradient-cosmic text-glow-soft">
                {rank}
              </h2>
              <p className="mt-1 text-sm text-text-muted leading-relaxed">
                {rankDescription}
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/10 text-2xl font-bold text-atlantean-teal-aqua">
              {gatesOpen}
            </div>
          </m.div>

          {/* XP counter */}
          <m.div variants={staggerItem} className="mt-4 flex items-center justify-between text-xs">
            <span className="text-text-muted">Total XP</span>
            <span className="font-mono font-semibold text-gold-bright">
              {animatedXp} XP
            </span>
          </m.div>

          {/* Rank Ladder */}
          <m.div
            variants={staggerContainer('fast')}
            initial="hidden"
            animate="visible"
            className="mt-6 grid grid-cols-5 gap-1"
          >
            {RANK_LADDER.map((r) => {
              const isActive = r.rank === rank;
              return (
                <m.div
                  key={r.rank}
                  variants={staggerItem}
                  className={`rounded-lg border px-2 py-1.5 text-center text-[10px] transition-all ${
                    isActive
                      ? 'border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/10 glow-soft scale-105'
                      : 'border-white/[0.06] bg-white/[0.02]'
                  }`}
                >
                  <span className={`block font-semibold ${isActive ? 'text-atlantean-teal-aqua' : r.color}`}>
                    {r.rank}
                  </span>
                  <span className="text-text-dim">{r.gates}</span>
                </m.div>
              );
            })}
          </m.div>
        </m.section>

        {/* ── Ten Gates Visualization ── */}
        <m.section
          className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm"
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
        >
          <m.h2 variants={staggerItem} className="font-cinzel text-lg font-semibold text-text-primary mb-4">
            The Ten Gates
          </m.h2>
          <m.div
            variants={staggerContainer('fast')}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-5 gap-3 sm:grid-cols-10 sm:gap-1.5"
          >
            {GATE_NAMES.map((name, i) => {
              const gateNum = i + 1;
              const isOpen = gateNum <= gatesOpen;
              const color = GATE_ELEMENT_COLORS[gateNum];

              return (
                <m.div
                  key={name}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-1.5"
                  title={`Gate ${gateNum}: ${name}`}
                >
                  {isOpen ? (
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all glow-soft"
                      style={{
                        backgroundColor: `${color}20`,
                        borderColor: `${color}40`,
                        borderWidth: 1,
                        color: color,
                        boxShadow: `0 0 10px ${color}25`,
                      }}
                    >
                      <svg className="h-4 w-4" fill={color} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-dim">
                      <svg className="h-3.5 w-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <span className={`text-[8px] leading-tight text-center ${isOpen ? 'text-text-muted' : 'text-text-dim'}`}>
                    {name}
                  </span>
                </m.div>
              );
            })}
          </m.div>
          <m.p variants={staggerItem} className="mt-4 text-xs text-text-muted">
            {gatesOpen} of 10 gates open
          </m.p>
        </m.section>

        {/* ── Crew Bonds ── */}
        <m.section
          className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm"
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
        >
          <m.h2 variants={staggerItem} className="font-cinzel text-lg font-semibold text-text-primary mb-1">
            Crew Bonds
          </m.h2>
          <m.p variants={staggerItem} className="text-xs text-text-muted mb-5">
            Bonds grow through conversations, shared encounters, and lore
            exploration.
          </m.p>

          <m.div
            variants={staggerContainer('fast')}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {crew.map((member) => {
              const bond = getBondForMember(member.id);
              const bondLevel = bond?.bondLevel ?? 0;
              // Find current milestone
              const thresholds = [10, 25, 50, 75, 100];
              const nextThreshold = thresholds.find((t) => t > bondLevel) ?? 100;
              const nextUnlockLabel = BOND_UNLOCKS[nextThreshold as keyof typeof BOND_UNLOCKS] ?? 'max';

              return (
                <m.div key={member.id} variants={staggerItem} className="flex items-center gap-3">
                  <Link
                    href={`/living-lore/crew/${member.id}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${member.color}18` }}
                    title={member.name}
                  >
                    {member.avatar}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        href={`/living-lore/crew/${member.id}`}
                        className="text-sm font-semibold text-text-primary hover:text-atlantean-teal-aqua transition-colors"
                      >
                        {member.name}
                      </Link>
                      <span className="text-[10px] text-text-dim">
                        {bondLevel} / 100
                        {bondLevel < 100 && (
                          <span className="ml-1.5 text-text-dim/60 capitalize">
                            &middot; next: {nextUnlockLabel}
                          </span>
                        )}
                      </span>
                    </div>
                    <BondMeter level={bondLevel} color={member.color} size="sm" />
                  </div>
                </m.div>
              );
            })}
          </m.div>

          {/* Bond Unlock Thresholds */}
          <m.div variants={staggerItem} className="mt-6 border-t border-white/[0.06] pt-4">
            <p className="text-[11px] uppercase tracking-widest text-text-dim font-semibold mb-3">
              Bond Unlocks
            </p>
            <div className="grid grid-cols-5 gap-1">
              {bondUnlockEntries.map(([threshold, reward]) => (
                <div
                  key={threshold}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-center"
                >
                  <span className="block text-[10px] font-semibold text-text-dim">
                    Lv {threshold}
                  </span>
                  <span className="block text-[9px] text-text-dim capitalize mt-0.5">
                    {reward}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        </m.section>

        {/* ── Recent Activity ── */}
        <m.section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm"
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
        >
          <m.h2 variants={staggerItem} className="font-cinzel text-lg font-semibold text-text-primary mb-4">
            Recent Activity
          </m.h2>

          {recentActivity.length > 0 ? (
            <m.div
              variants={staggerContainer('fast')}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {recentActivity.slice(0, 10).map((item) => (
                <m.div
                  key={`${item.type}-${item.slug}`}
                  variants={staggerItem}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  {/* Type icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-text-dim">
                    {item.type === 'episode' ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-[10px] text-text-dim">
                      {item.type === 'episode' ? 'Episode' : 'Encounter'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-semibold text-gold-bright">+{item.xp} XP</span>
                    <span className="block text-[10px] text-text-dim">{relativeTime(item.date)}</span>
                  </div>
                </m.div>
              ))}
            </m.div>
          ) : (
            <m.div variants={staggerItem} className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-xl text-text-dim mb-3 animate-float-slow">
                &#x2726;
              </div>
              <p className="text-sm text-text-muted">
                Your journey begins when you read the first episode.
              </p>
              <Link
                href="/living-lore/chronicle"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/10 px-5 py-2 text-sm font-semibold text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 transition-all duration-300"
              >
                Begin the Chronicle
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </m.div>
          )}
        </m.section>

        <ScrollToTop />
      </main>
    </LazyMotion>
  );
}
