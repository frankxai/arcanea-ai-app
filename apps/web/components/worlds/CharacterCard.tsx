'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ElementBadge, getElementGlowColor, getElementBorderClass } from './ElementBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CharacterCardProps {
  name: string;
  primaryElement: string;
  secondaryElement?: string;
  house: string;
  rank: string;
  gatesOpen: number;
  patronGuardian?: {
    name: string;
    domain: string;
    relationship?: string;
  };
  godbeast?: {
    name: string;
    form: string;
    bond?: string;
  };
  personality?: {
    traits: string[];
    flaw?: string;
    desire?: string;
    fear?: string;
    secret?: string;
  };
  imageUrl?: string;
  narrativeHooks?: string[];
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOTAL_GATES = 10;

const RANK_BADGE_CLASS: Record<string, string> = {
  Apprentice: 'bg-slate-500/20 border-slate-400/30 text-slate-300',
  Mage: 'bg-[#78a6ff]/10 border-[#78a6ff]/30 text-[#78a6ff]',
  Master: 'bg-[#7fffd4]/10 border-[#7fffd4]/30 text-[#7fffd4]',
  Archmage: 'bg-violet-500/10 border-violet-400/30 text-violet-300',
  Luminor: 'bg-amber-400/10 border-amber-300/40 text-amber-300',
};

function getRankBadgeClass(rank: string): string {
  return RANK_BADGE_CLASS[rank] ?? 'bg-white/5 border-white/10 text-white/60';
}

function getElementInitialGradient(element: string): string {
  const map: Record<string, string> = {
    Fire: 'from-red-900/60 via-orange-800/40 to-red-950/80',
    Water: 'from-blue-900/60 via-cyan-800/40 to-blue-950/80',
    Earth: 'from-green-900/60 via-emerald-800/40 to-green-950/80',
    Wind: 'from-slate-700/60 via-slate-600/40 to-slate-900/80',
    Void: 'from-violet-900/60 via-purple-800/40 to-violet-950/80',
    Spirit: 'from-amber-800/60 via-yellow-700/40 to-amber-950/80',
  };
  const normalized = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  return map[normalized] ?? 'from-[#0a0a14]/60 via-[#0d0d1a]/40 to-[#09090b]/80';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GateDots({ gatesOpen }: { gatesOpen: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${gatesOpen} of ${TOTAL_GATES} gates open`}>
      {Array.from({ length: TOTAL_GATES }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            i < gatesOpen
              ? 'bg-[#7fffd4] shadow-[0_0_6px_rgba(127,255,212,0.7)]'
              : 'bg-white/10 border border-white/[0.07]'
          )}
        />
      ))}
    </div>
  );
}

function SecretReveal({ secret }: { secret: string }) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium transition-all duration-200',
          revealed
            ? 'text-amber-300/80'
            : 'text-white/30 hover:text-white/50'
        )}
        aria-expanded={revealed}
      >
        <span className="w-3 h-3 flex items-center justify-center rounded-full border border-current opacity-70">
          {revealed ? '−' : '+'}
        </span>
        {revealed ? 'Secret' : 'Hidden secret'}
      </button>
      {revealed && (
        <p className="mt-1.5 text-xs text-amber-200/60 italic leading-relaxed pl-5">
          {secret}
        </p>
      )}
    </div>
  );
}

// ─── CharacterCard ────────────────────────────────────────────────────────────

export function CharacterCard({
  name,
  primaryElement,
  secondaryElement,
  house,
  rank,
  gatesOpen,
  patronGuardian,
  godbeast,
  personality,
  imageUrl,
  narrativeHooks,
  className,
}: CharacterCardProps) {
  const glowColor = getElementGlowColor(primaryElement);
  const borderClass = getElementBorderClass(primaryElement);
  const gradientClass = getElementInitialGradient(primaryElement);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'group relative rounded-2xl overflow-hidden',
        'transition-all duration-500 ease-out',
        'hover:scale-[1.015] hover:-translate-y-1',
        // Glass morphism base
        'backdrop-blur-xl bg-white/[0.03]',
        'border',
        borderClass,
        className
      )}
      style={{
        background: 'linear-gradient(145deg, rgba(12,12,20,0.92) 0%, rgba(9,9,11,0.96) 100%)',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.05)',
          'inset 0 -1px 0 rgba(0,0,0,0.3)',
          '0 20px 60px rgba(0,0,0,0.4)',
          `0 0 0 1px ${glowColor.replace('0.5', '0.08')}`,
        ].join(', '),
      }}
    >
      {/* Element glow bloom on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor.replace('0.5', '0.08')} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Top iridescent edge */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor.replace('0.5', '0.4')}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Portrait area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Portrait of ${name}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-gradient-to-b',
              gradientClass
            )}
          >
            <span
              className="font-display text-6xl font-bold select-none"
              style={{
                color: glowColor,
                textShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor.replace('0.5', '0.2')}`,
              }}
            >
              {initial}
            </span>
          </div>
        )}

        {/* Gradient fade into card body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(9,9,11,0.95))',
          }}
          aria-hidden="true"
        />

        {/* House badge — top right */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium font-sans backdrop-blur-md bg-black/40 border border-white/10 text-white/60">
            {house}
          </span>
        </div>

        {/* Rank badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'inline-flex items-center h-6 px-2.5 rounded-full text-xs font-semibold font-sans border backdrop-blur-md',
              getRankBadgeClass(rank)
            )}
          >
            {rank}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-4 pb-5 space-y-4">

        {/* Name + elements */}
        <div>
          <h3 className="font-display text-xl font-bold text-white leading-tight tracking-tight">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <ElementBadge element={primaryElement} />
            {secondaryElement && (
              <ElementBadge element={secondaryElement} size="sm" />
            )}
          </div>
        </div>

        {/* Gates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40 font-sans uppercase tracking-widest">Gates</span>
            <span className="text-xs text-white/40 font-mono tabular-nums">{gatesOpen}/{TOTAL_GATES}</span>
          </div>
          <GateDots gatesOpen={gatesOpen} />
        </div>

        {/* Patron Guardian */}
        {patronGuardian && (
          <div
            className="rounded-xl p-3 space-y-1"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/40 uppercase tracking-widest font-sans">Patron</span>
              {patronGuardian.relationship && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-[#7fffd4]/70">
                  {patronGuardian.relationship}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white/80 font-sans">{patronGuardian.name}</p>
            <p className="text-xs text-white/40 font-sans">{patronGuardian.domain}</p>
          </div>
        )}

        {/* Godbeast */}
        {godbeast && (
          <div
            className="rounded-xl p-3 space-y-1"
            style={{
              background: `${glowColor.replace('0.5', '0.04')}`,
              border: `1px solid ${glowColor.replace('0.5', '0.12')}`,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/40 uppercase tracking-widest font-sans">Godbeast</span>
              {godbeast.bond && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300/70">
                  {godbeast.bond}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white/80 font-sans">{godbeast.name}</p>
            <p className="text-xs text-white/40 font-sans italic">{godbeast.form}</p>
          </div>
        )}

        {/* Personality */}
        {personality && (personality.traits.length > 0 || personality.flaw || personality.desire || personality.fear || personality.secret) && (
          <div className="space-y-2.5">
            {personality.traits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {personality.traits.map((trait) => (
                  <span
                    key={trait}
                    className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium font-sans bg-white/[0.04] border border-white/[0.07] text-white/50"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1">
              {personality.desire && (
                <p className="text-xs text-white/35 font-sans">
                  <span className="text-[#7fffd4]/40 mr-1">Desires</span>
                  {personality.desire}
                </p>
              )}
              {personality.fear && (
                <p className="text-xs text-white/35 font-sans">
                  <span className="text-red-400/40 mr-1">Fears</span>
                  {personality.fear}
                </p>
              )}
              {personality.flaw && (
                <p className="text-xs text-white/35 font-sans">
                  <span className="text-amber-400/40 mr-1">Flaw</span>
                  {personality.flaw}
                </p>
              )}
            </div>

            {personality.secret && <SecretReveal secret={personality.secret} />}
          </div>
        )}

        {/* Narrative hooks */}
        {narrativeHooks && narrativeHooks.length > 0 && (
          <div
            className="pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <ul className="space-y-1.5">
              {narrativeHooks.map((hook, i) => (
                <li
                  key={i}
                  className="text-xs text-white/30 italic font-sans leading-relaxed flex gap-2"
                >
                  <span className="mt-0.5 flex-shrink-0 w-1 h-1 rounded-full bg-white/20 translate-y-[5px]" />
                  {hook}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
