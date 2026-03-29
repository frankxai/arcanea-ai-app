'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Star, Users, Clock, Lightning, Sparkle,
  Flame, Drop, Leaf, Wind, Eye, Sun, Trophy, Shield, Crown,
  Check, Book, Globe, Code, Sword, MusicNote,
} from '@/lib/phosphor-icons';
import { FEATURED_CHALLENGES, DIFFICULTY_CONFIG, ELEMENT_CONFIG, CATEGORY_CONFIG } from '@/lib/challenges';
import { SubmissionPortal } from '@/components/challenges';
import type { Challenge } from '@/lib/types/challenge';

const ELEMENT_ICONS: Record<string, React.ComponentType<{ className?: string; weight?: string }>> = {
  fire: Flame, water: Drop, earth: Leaf, wind: Wind, void: Eye, spirit: Sun,
};

/* ----------------------------------------------------------------
 *  Time Display
 * ---------------------------------------------------------------- */
function TimeDisplay({ label, date }: { label: string; date: string }) {
  const d = new Date(date);
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-white/30">{label}</div>
      <div className="mt-0.5 font-display text-sm text-white/70">
        {d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  Reward Tier Display
 * ---------------------------------------------------------------- */
function RewardTier({
  place,
  reward,
  color,
}: {
  place: string;
  reward: { mana: number; xp: number; title?: string; tokenReward?: number; badge?: string };
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12]">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5" style={{ color }} weight="fill" />
        <span className="font-display text-sm font-bold" style={{ color }}>{place}</span>
      </div>
      {reward.title && (
        <div className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-center">
          <span className="font-display text-xs font-semibold text-white/80">
            Title: &ldquo;{reward.title}&rdquo;
          </span>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40">Mana</span>
          <span className="flex items-center gap-1 font-mono text-xs font-bold text-[#ffd700]">
            <Sparkle className="h-3 w-3" weight="fill" />
            {reward.mana.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40">XP</span>
          <span className="font-mono text-xs text-[#34d399]">{reward.xp.toLocaleString()}</span>
        </div>
        {reward.tokenReward && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/40">Token Reward</span>
            <span className="font-mono text-xs text-[#06b6d4]">${reward.tokenReward}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  PAGE
 * ---------------------------------------------------------------- */

export default function ChallengeDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'submit' | 'entries'>('overview');

  const challenge = FEATURED_CHALLENGES.find(c => c.id === params.id);

  if (!challenge) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Eye className="mx-auto mb-4 h-16 w-16 text-white/10" weight="duotone" />
          <h2 className="font-display text-2xl font-bold text-white">Challenge Not Found</h2>
          <p className="mt-2 text-sm text-white/40">This challenge may have dissolved into the Void.</p>
          <Link href="/challenges" className="mt-6 inline-flex items-center gap-2 font-display text-sm text-[#ffd700]">
            <ArrowLeft className="h-4 w-4" /> Back to Arena
          </Link>
        </div>
      </div>
    );
  }

  const elementConfig = ELEMENT_CONFIG[challenge.element];
  const categoryConfig = CATEGORY_CONFIG[challenge.category];
  const diffConfig = DIFFICULTY_CONFIG[challenge.difficulty];
  const ElIcon = ELEMENT_ICONS[challenge.element] || Sparkle;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">

      {/* ============ AMBIENT ============ */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[20%] top-[5%] h-[500px] w-[500px] rounded-full blur-[180px]" style={{ backgroundColor: `${challenge.ambientColor}10` }} />
        <div className="absolute right-[15%] top-[25%] h-[400px] w-[400px] rounded-full blur-[150px]" style={{ backgroundColor: `${challenge.accentColor}08` }} />
        <div className="absolute bottom-[10%] left-[40%] h-[350px] w-[350px] rounded-full bg-[#ffd700]/5 blur-[130px]" />
      </div>

      {/* ============ HEADER ============ */}
      <section className="relative z-10 pt-8">
        <div className="mx-auto max-w-5xl px-6">
          {/* Back link */}
          <Link href="/challenges" className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-white/40 transition-colors hover:text-white/70">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Arena
          </Link>

          {/* Banner */}
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${challenge.bannerGradient} p-8 md:p-12`}>
            {/* Particle dots */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{
                    backgroundColor: challenge.accentColor,
                    left: `${8 + i * 8}%`,
                    top: `${15 + (i % 4) * 20}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Badges row */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {/* Status */}
                <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                  {challenge.status === 'active' && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34d399]" />
                    </span>
                  )}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34d399]">
                    {challenge.status}
                  </span>
                </div>
                {/* Element */}
                <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                  <ElIcon className="h-3.5 w-3.5" style={{ color: elementConfig?.color }} weight="fill" />
                  <span className="font-mono text-[10px]" style={{ color: elementConfig?.color }}>
                    {elementConfig?.label} Element
                  </span>
                </div>
                {/* Category */}
                <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-mono text-[10px] text-white/60">{categoryConfig?.label}</span>
                </div>
                {/* Difficulty */}
                <div className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                  {Array.from({ length: diffConfig?.stars || 0 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3" style={{ color: diffConfig?.color }} weight="fill" />
                  ))}
                  <span className="ml-1 font-mono text-[10px]" style={{ color: diffConfig?.color }}>
                    {diffConfig?.label}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl font-bold text-white md:text-5xl">{challenge.title}</h1>
              <p className="mt-2 text-lg text-white/60">{challenge.subtitle}</p>

              {/* Patron */}
              <div className="mt-6 flex items-center gap-3">
                <Shield className="h-5 w-5 text-white/50" weight="fill" />
                <span className="text-sm text-white/50">
                  Patron: <span className="font-semibold text-white/70">{challenge.patron}</span>
                  {' & '}
                  <span className="font-semibold text-white/70">{challenge.patronGodbeast}</span>
                </span>
              </div>

              {/* Quick stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-[#ffd700]" weight="fill" />
                  <span className="font-mono text-sm font-bold text-[#ffd700]">${challenge.prizePool.toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-white/30">prize pool</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-white/40" />
                  <span className="font-mono text-sm text-white/60">{challenge.totalParticipants}</span>
                  <span className="font-mono text-[10px] text-white/30">creators</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lightning className="h-4 w-4 text-white/40" />
                  <span className="font-mono text-sm text-white/60">{challenge.totalSubmissions}</span>
                  <span className="font-mono text-[10px] text-white/30">submissions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mt-6 flex gap-2">
            {[
              { key: 'overview' as const, label: 'Overview', icon: Book },
              { key: 'submit' as const, label: 'Submit', icon: Lightning },
              { key: 'entries' as const, label: 'Entries', icon: Globe },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 font-display text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'border-white/[0.15] bg-white/[0.08] text-white'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" weight={activeTab === key ? 'fill' : 'regular'} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-10">

        {/* ---- OVERVIEW TAB ---- */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Lore */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <p className="text-center text-sm italic leading-relaxed text-white/50">
                &ldquo;{challenge.lore}&rdquo;
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-4 font-display text-xl font-bold text-white">About This Challenge</h3>
              <p className="text-sm leading-relaxed text-white/60">{challenge.description}</p>
            </div>

            {/* Timeline */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <TimeDisplay label="Challenge Starts" date={challenge.startDate} />
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <TimeDisplay label="Submissions Close" date={challenge.endDate} />
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <TimeDisplay label="Judging Ends" date={challenge.judgingEndDate} />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
                <Check className="h-5 w-5 text-[#34d399]" weight="bold" />
                Requirements
              </h3>
              <div className="space-y-2">
                {challenge.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.1]">
                      <span className="font-mono text-[8px] text-white/40">{i + 1}</span>
                    </div>
                    <span className="text-sm text-white/60">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed tools */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
                <Code className="h-5 w-5 text-[#06b6d4]" weight="bold" />
                Allowed Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {challenge.allowedTools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-white/60">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
                <Trophy className="h-5 w-5 text-[#ffd700]" weight="fill" />
                Rewards
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <RewardTier place="1st Place" reward={challenge.rewards.first} color="#ffd700" />
                <RewardTier place="2nd Place" reward={challenge.rewards.second} color="#c0c0c0" />
                <RewardTier place="3rd Place" reward={challenge.rewards.third} color="#cd7f32" />
              </div>
              <div className="mt-4 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 text-center">
                <span className="font-mono text-[10px] text-white/30">Participation Reward: </span>
                <span className="font-mono text-xs text-[#ffd700]">{challenge.rewards.participation.mana} Mana</span>
                <span className="font-mono text-[10px] text-white/30"> + </span>
                <span className="font-mono text-xs text-[#34d399]">{challenge.rewards.participation.xp} XP</span>
              </div>
            </div>

            {/* Enter CTA */}
            <div className="text-center">
              <button
                onClick={() => setActiveTab('submit')}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ffd700] px-10 py-4 font-display text-sm font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
              >
                <Lightning className="h-5 w-5" weight="fill" />
                Enter This Challenge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* ---- SUBMIT TAB ---- */}
        {activeTab === 'submit' && (
          <SubmissionPortal challenge={challenge} />
        )}

        {/* ---- ENTRIES TAB ---- */}
        {activeTab === 'entries' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold text-white">
                {challenge.totalSubmissions} Submissions
              </h3>
              <p className="mt-2 text-sm text-white/40">
                Browse what other creators have built for this challenge.
              </p>
            </div>

            {/* Placeholder entries */}
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: Math.min(challenge.totalSubmissions, 6) }).map((_, i) => (
                <div key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12]">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-white/5" />
                    <div>
                      <div className="font-display text-sm font-semibold text-white">Entry #{i + 1}</div>
                      <div className="font-mono text-[9px] text-white/30">Creator #{1000 + i}</div>
                    </div>
                    {i < 3 && (
                      <div className="ml-auto">
                        <Trophy className="h-4 w-4" style={{ color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : '#cd7f32' }} weight="fill" />
                      </div>
                    )}
                  </div>
                  <div className="h-32 rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01]" />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-[10px] text-white/30">
                        <Sparkle className="h-3 w-3" weight="fill" /> {Math.floor(Math.random() * 500 + 100)} mana
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-white/30">
                        <Lightning className="h-3 w-3" /> {Math.floor(Math.random() * 5 + 1)} spells
                      </span>
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: challenge.accentColor }}>View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
