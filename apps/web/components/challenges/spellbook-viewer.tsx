'use client';

import { useState } from 'react';
import {
  Flame, Drop, Leaf, Wind, Eye, Star, Lightning,
  Lock, Sparkle, Heart, Shield, Globe, Moon, Sun, Diamond,
} from '@/lib/phosphor-icons';
import type { Spellbook, Spell, SpellTier } from '@/lib/types/challenge';

const TIER_LABELS: Record<SpellTier, { label: string; color: string; glow: string }> = {
  cantrip: { label: 'Cantrip', color: '#6b7280', glow: 'rgba(107,114,128,0.3)' },
  invocation: { label: 'Invocation', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
  ritual: { label: 'Ritual', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  arcanum: { label: 'Arcanum', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  genesis: { label: 'Genesis', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
};

const ICON_MAP: Record<string, React.ComponentType<Record<string, unknown>>> = {
  Flame, Drop, Leaf, Wind, Eye, Star, Lightning, Sparkle,
  Heart, Shield, Globe, Moon, Sun, Diamond, Lock,
  Fire: Flame, Waves: Drop, Mountains: Globe, Megaphone: Star,
  Tornado: Wind, Atom: Sparkle, Robot: Shield, Code: Lightning,
  PaintBrush: Sparkle, MusicNote: Star, Scroll: Globe, Book: Shield,
  Brain: Eye, Planet: Globe,
};

function SpellCard({ spell, userGates = 3 }: { spell: Spell; userGates?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const locked = spell.unlockGate > userGates;
  const tier = TIER_LABELS[spell.tier];
  const IconComponent = ICON_MAP[spell.icon] || Sparkle;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        locked
          ? 'border-white/[0.04] bg-white/[0.02] opacity-50 cursor-not-allowed'
          : 'border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] hover:bg-white/[0.06] cursor-pointer'
      }`}
      style={{
        boxShadow: !locked && isHovered ? `0 0 30px ${tier.glow}` : 'none',
      }}
    >
      {/* Tier glow bar */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${spell.color}20` }}
            >
              {locked ? (
                <Lock className="h-5 w-5 text-white/30" weight="fill" />
              ) : (
                <IconComponent className="h-5 w-5" style={{ color: spell.color }} weight="fill" />
              )}
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white">{spell.name}</h4>
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: tier.color }}>
                {tier.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
            <Sparkle className="h-3 w-3 text-[#ffd700]" weight="fill" />
            <span className="font-mono text-[10px] text-[#ffd700]">{spell.manaCost}</span>
          </div>
        </div>

        {/* Incantation */}
        <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
          <p className="text-center font-display text-xs italic text-white/70">
            &ldquo;{locked ? '???' : spell.incantation}&rdquo;
          </p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-white/50">{spell.description}</p>

        {/* Effect */}
        {!locked && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
            <Lightning className="h-3.5 w-3.5 flex-shrink-0" style={{ color: spell.color }} weight="fill" />
            <span className="font-mono text-[10px] text-white/60">{spell.effect}</span>
          </div>
        )}

        {locked && (
          <div className="mt-3 flex items-center gap-2 text-white/30">
            <Lock className="h-3 w-3" />
            <span className="font-mono text-[10px]">Unlock at Gate {spell.unlockGate}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpellbookViewer({
  spellbooks,
  userGates = 3,
}: {
  spellbooks: Spellbook[];
  userGates?: number;
}) {
  const [activeBook, setActiveBook] = useState(0);
  const book = spellbooks[activeBook];

  const ELEMENT_ICONS: Record<string, React.ComponentType<Record<string, unknown>>> = {
    fire: Flame,
    water: Drop,
    earth: Leaf,
    wind: Wind,
    void: Eye,
    spirit: Sun,
  };

  return (
    <div className="space-y-8">
      {/* Book selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {spellbooks.map((sb, i) => {
          const Icon = ELEMENT_ICONS[sb.element] || Sparkle;
          const isActive = i === activeBook;
          return (
            <button
              key={sb.id}
              onClick={() => setActiveBook(i)}
              className={`group relative flex items-center gap-2.5 rounded-2xl border px-5 py-3 font-display text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'border-white/[0.15] bg-white/[0.08] text-white shadow-lg'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.1] hover:text-white/80'
              }`}
            >
              <Icon className="h-4 w-4" weight="fill" />
              {sb.name}
            </button>
          );
        })}
      </div>

      {/* Active book display */}
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm">
        {/* Book header */}
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${book.cover}`}>
            {(() => {
              const Icon = ELEMENT_ICONS[book.element] || Sparkle;
              return <Icon className="h-8 w-8 text-white" weight="fill" />;
            })()}
          </div>
          <h3 className="font-display text-2xl font-bold text-white">{book.name}</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/50">{book.description}</p>
        </div>

        {/* Lore quote */}
        <div className="mx-auto mb-8 max-w-xl rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-center text-xs italic leading-relaxed text-white/40">
            &ldquo;{book.lore}&rdquo;
          </p>
        </div>

        {/* Spell grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {book.spells.map((spell) => (
            <SpellCard key={spell.id} spell={spell} userGates={userGates} />
          ))}
        </div>

        {/* Master spell */}
        <div className="mt-6">
          <div className="mb-3 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffd700]/60">
              <Star className="h-3 w-3" weight="fill" />
              Master Spell
              <Star className="h-3 w-3" weight="fill" />
            </span>
          </div>
          <SpellCard spell={book.masterSpell} userGates={userGates} />
        </div>
      </div>
    </div>
  );
}
