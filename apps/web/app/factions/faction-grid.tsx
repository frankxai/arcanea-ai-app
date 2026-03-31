'use client';

import React, { useState } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Star, Lightning, Skull, Quotes } from '@/lib/phosphor-icons';
import { ORIGIN_CLASSES, type OriginClass } from './faction-data';

// ─── Power Type Badge ─────────────────────────────────────────────────────────

function PowerBadge({ type, color }: { type: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-widest"
      style={{
        color,
        background: `rgba(${hexToRgb(color)}, 0.12)`,
        border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
      }}
    >
      {type}
    </span>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── Expanded Panel ───────────────────────────────────────────────────────────

function ExpandedPanel({
  faction,
  onClose,
}: {
  faction: OriginClass;
  onClose: () => void;
}) {
  return (
    <m.div
      key="expanded"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="col-span-full rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(10,10,26,0.98), rgba(10,10,26,0.95))`,
        border: `1px solid rgba(${faction.colorRgb}, 0.4)`,
        boxShadow: `0 0 60px rgba(${faction.colorRgb}, 0.12), inset 0 1px 0 rgba(${faction.colorRgb}, 0.15)`,
      }}
    >
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="mb-2">
              <PowerBadge type={faction.powerType} color={faction.color} />
            </div>
            <h2
              className="font-display text-3xl md:text-4xl font-bold mb-2"
              style={{
                color: faction.color,
                fontFamily: '"Cinzel", serif',
                textShadow: `0 0 30px rgba(${faction.colorRgb}, 0.5)`,
              }}
            >
              {faction.name}
            </h2>
            <p
              className="italic text-sm md:text-base"
              style={{ color: `rgba(${faction.colorRgb}, 0.8)` }}
            >
              &ldquo;{faction.tagline}&rdquo;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white/50 hover:text-white"
            aria-label="Close detail"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Full description */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Origin
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {faction.fullDescription}
              </p>
            </div>

            {/* Power source */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Power Source
              </h3>
              <p className="text-white/70 text-sm flex items-center gap-2">
                <Lightning
                  weight="fill"
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: faction.color }}
                />
                {faction.powerSource}
              </p>
            </div>

            {/* Signature */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Signature
              </h3>
              <p className="text-white/70 text-sm leading-relaxed flex gap-2">
                <Star
                  weight="fill"
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: faction.color }}
                />
                {faction.signature}
              </p>
            </div>

            {/* Weakness */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Weakness
              </h3>
              <p className="text-white/70 text-sm leading-relaxed flex gap-2">
                <Skull
                  weight="fill"
                  className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60"
                />
                {faction.weakness}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Archetypes */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Archetypes
              </h3>
              <div className="flex flex-wrap gap-2">
                {faction.archetypes.map((archetype) => (
                  <span
                    key={archetype}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/70"
                    style={{
                      background: `rgba(${faction.colorRgb}, 0.08)`,
                      border: `1px solid rgba(${faction.colorRgb}, 0.2)`,
                    }}
                  >
                    {archetype}
                  </span>
                ))}
              </div>
            </div>

            {/* Canon anchor */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: `rgba(${faction.colorRgb}, 0.6)` }}
              >
                Canon Anchor
              </h3>
              <div
                className="rounded-xl p-4"
                style={{
                  background: `rgba(${faction.colorRgb}, 0.05)`,
                  border: `1px solid rgba(${faction.colorRgb}, 0.15)`,
                }}
              >
                <Quotes
                  weight="fill"
                  className="w-4 h-4 mb-2 opacity-40"
                  style={{ color: faction.color }}
                />
                <p className="text-white/60 text-xs leading-relaxed italic">
                  {faction.canonAnchor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

// ─── Faction Card ─────────────────────────────────────────────────────────────

function FactionCard({
  faction,
  isActive,
  onClick,
}: {
  faction: OriginClass;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <m.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative text-left w-full rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${faction.gradientFrom}, ${faction.gradientTo})`
          : 'rgba(255,255,255,0.03)',
        border: isActive
          ? `1px solid rgba(${faction.colorRgb}, 0.5)`
          : `1px solid rgba(255,255,255,0.08)`,
        boxShadow: isActive
          ? `0 0 40px rgba(${faction.colorRgb}, 0.15), inset 0 1px 0 rgba(${faction.colorRgb}, 0.2)`
          : 'none',
      }}
      aria-pressed={isActive}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${faction.colorRgb}, ${isActive ? 0.8 : 0.3}), transparent)`,
        }}
      />

      <div className="p-6">
        {/* Power type badge */}
        <div className="mb-4">
          <PowerBadge type={faction.powerType} color={faction.color} />
        </div>

        {/* Name */}
        <h3
          className="font-bold text-xl mb-1 leading-tight"
          style={{
            fontFamily: '"Cinzel", serif',
            color: isActive ? faction.color : 'rgba(255,255,255,0.9)',
            textShadow: isActive ? `0 0 20px rgba(${faction.colorRgb}, 0.4)` : 'none',
          }}
        >
          {faction.name}
        </h3>

        {/* Power source */}
        <p
          className="text-xs mb-4 uppercase tracking-wider"
          style={{ color: `rgba(${faction.colorRgb}, 0.7)` }}
        >
          {faction.powerSource}
        </p>

        {/* Tagline */}
        <p className="text-white/50 text-xs italic mb-5 leading-relaxed line-clamp-2">
          &ldquo;{faction.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
          {faction.shortDescription}
        </p>

        {/* Expand hint */}
        <div
          className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-opacity"
          style={{ color: faction.color, opacity: isActive ? 1 : 0.5 }}
        >
          <span>{isActive ? 'Close details' : 'View full codex'}</span>
          <ArrowRight
            weight="bold"
            className="w-3 h-3"
            style={{
              transform: isActive ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </div>
      </div>
    </m.button>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────

export function FactionGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleCardClick(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  const activeFaction = ORIGIN_CLASSES.find((f) => f.id === activeId) ?? null;

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ORIGIN_CLASSES.map((faction, index) => (
          <React.Fragment key={faction.id}>
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <FactionCard
                faction={faction}
                isActive={activeId === faction.id}
                onClick={() => handleCardClick(faction.id)}
              />
            </m.div>

            {/* Insert expanded panel after every 4th card (end of each row on desktop) */}
            {activeFaction &&
              activeId === faction.id && (
                <AnimatePresence mode="wait">
                  <ExpandedPanel
                    key={activeId}
                    faction={activeFaction}
                    onClose={() => setActiveId(null)}
                  />
                </AnimatePresence>
              )}
          </React.Fragment>
        ))}
      </div>
    </LazyMotion>
  );
}
