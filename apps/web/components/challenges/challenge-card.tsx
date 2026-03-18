'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Star, Users, Clock, Lightning, Sparkle,
  Flame, Drop, Leaf, Wind, Eye, Sun, Trophy, Shield,
} from '@/lib/phosphor-icons';
import { DIFFICULTY_CONFIG, ELEMENT_CONFIG, CATEGORY_CONFIG } from '@/lib/challenges';
import type { Challenge } from '@/lib/types/challenge';

const ELEMENT_ICONS: Record<string, React.ComponentType<{ className?: string; weight?: string }>> = {
  fire: Flame,
  water: Drop,
  earth: Leaf,
  wind: Wind,
  void: Eye,
  spirit: Sun,
};

function DifficultyStars({ difficulty }: { difficulty: string }) {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) return null;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: config.stars }).map((_, i) => (
        <Star key={i} className="h-3 w-3" style={{ color: config.color }} weight="fill" />
      ))}
      {Array.from({ length: 5 - config.stars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-white/10" weight="regular" />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; pulse: boolean }> = {
    active: { label: 'LIVE', color: '#34d399', bg: 'rgba(52,211,153,0.15)', pulse: true },
    upcoming: { label: 'UPCOMING', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', pulse: false },
    judging: { label: 'JUDGING', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', pulse: true },
    completed: { label: 'COMPLETE', color: '#6b7280', bg: 'rgba(107,114,128,0.15)', pulse: false },
    legendary: { label: 'LEGENDARY', color: '#ffd700', bg: 'rgba(255,215,0,0.15)', pulse: true },
  };
  const config = configs[status] || configs.completed;

  return (
    <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: config.bg }}>
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: config.color }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
        </span>
      )}
      <span className="font-mono text-[9px] font-bold tracking-widest" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

function TimeRemaining({ endDate }: { endDate: string }) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return <span className="text-white/30">Ended</span>;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <span className="flex items-center gap-1.5">
      <Clock className="h-3 w-3 text-white/40" />
      <span className="font-mono text-[10px] text-white/50">
        {days}d {hours}h remaining
      </span>
    </span>
  );
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [isHovered, setIsHovered] = useState(false);
  const elementConfig = ELEMENT_CONFIG[challenge.element];
  const categoryConfig = CATEGORY_CONFIG[challenge.category];
  const ElIcon = ELEMENT_ICONS[challenge.element] || Sparkle;

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
        style={{
          boxShadow: isHovered
            ? `0 0 60px ${elementConfig?.bgGlow || 'rgba(255,255,255,0.05)'}, inset 0 1px 0 rgba(255,255,255,0.06)`
            : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Banner gradient */}
        <div className={`relative h-32 bg-gradient-to-r ${challenge.bannerGradient} overflow-hidden`}>
          {/* Animated particles overlay */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 animate-pulse rounded-full"
                style={{
                  backgroundColor: challenge.accentColor,
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Status + Element badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <StatusBadge status={challenge.status} />
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: `${elementConfig?.color || '#fff'}20` }}
            >
              <ElIcon className="h-3 w-3" style={{ color: elementConfig?.color }} weight="fill" />
              <span className="font-mono text-[9px]" style={{ color: elementConfig?.color }}>
                {elementConfig?.label}
              </span>
            </div>
          </div>

          {/* Prize pool */}
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[#ffd700]/20 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <Trophy className="h-3.5 w-3.5 text-[#ffd700]" weight="fill" />
            <span className="font-mono text-xs font-bold text-[#ffd700]">
              ${challenge.prizePool.toLocaleString()}
            </span>
          </div>

          {/* Patron */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-white/50" weight="fill" />
            <span className="font-mono text-[9px] text-white/50">
              Patron: {challenge.patron}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category + Difficulty */}
          <div className="mb-3 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${categoryConfig?.color || '#fff'}15`,
                color: categoryConfig?.color || '#fff',
              }}
            >
              {categoryConfig?.label}
            </span>
            <DifficultyStars difficulty={challenge.difficulty} />
          </div>

          <h3 className="font-display text-xl font-bold leading-tight text-white group-hover:text-[#ffd700] transition-colors">
            {challenge.title}
          </h3>
          <p className="mt-1.5 text-sm text-white/40">{challenge.subtitle}</p>

          {/* Lore preview */}
          <p className="mt-3 line-clamp-2 text-xs italic leading-relaxed text-white/30">
            &ldquo;{challenge.lore}&rdquo;
          </p>

          {/* Stats row */}
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-white/30" />
                <span className="font-mono text-[10px] text-white/40">
                  {challenge.totalParticipants}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lightning className="h-3.5 w-3.5 text-white/30" />
                <span className="font-mono text-[10px] text-white/40">
                  {challenge.totalSubmissions} entries
                </span>
              </div>
            </div>
            <TimeRemaining endDate={challenge.endDate} />
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center gap-2 font-display text-sm font-semibold transition-colors" style={{ color: challenge.accentColor }}>
            Enter Challenge
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
