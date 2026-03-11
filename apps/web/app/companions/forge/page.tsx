'use client';

import { useState, useRef, useCallback } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Drop,
  Leaf,
  Wind,
  Eye,
  Sparkle,
  Star,
  Lightning,
} from '@/lib/phosphor-icons';
import { COMPANION_ARCHETYPES } from '@/lib/companions/archetypes';
import type { CompanionArchetype, Element } from '@/lib/companions/types';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const ELEMENTS: { key: Element | 'All'; label: string; color: string }[] = [
  { key: 'All', label: 'All', color: '#ffffff' },
  { key: 'Fire', label: 'Fire', color: '#ef4444' },
  { key: 'Water', label: 'Water', color: '#00bcd4' },
  { key: 'Earth', label: 'Earth', color: '#22c55e' },
  { key: 'Wind', label: 'Wind', color: '#94a3b8' },
  { key: 'Void', label: 'Void', color: '#a78bfa' },
];

const ELEMENT_COLORS: Record<Element, string> = {
  Fire: '#ef4444',
  Water: '#00bcd4',
  Earth: '#22c55e',
  Wind: '#94a3b8',
  Void: '#a78bfa',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ELEMENT_ICONS: Record<Element, any> = {
  Fire: Flame,
  Water: Drop,
  Earth: Leaf,
  Wind: Wind,
  Void: Eye,
};

const ELEMENT_GRADIENTS: Record<Element, string> = {
  Fire: 'from-red-500/30 via-orange-500/20 to-yellow-500/10',
  Water: 'from-cyan-500/30 via-blue-500/20 to-teal-500/10',
  Earth: 'from-green-500/30 via-emerald-500/20 to-lime-500/10',
  Wind: 'from-slate-400/30 via-gray-300/20 to-white/10',
  Void: 'from-violet-500/30 via-purple-500/20 to-indigo-500/10',
};

const PERSONALITY_POOL = [
  'fierce', 'loyal', 'brave', 'wise', 'patient', 'ancient',
  'swift', 'perceptive', 'free', 'mysterious', 'cunning', 'intuitive',
  'fluid', 'deep', 'healing', 'reborn', 'passionate', 'creative',
  'steadfast', 'protective', 'enduring', 'elusive', 'clever', 'adaptable',
  'observant', 'strategic', 'silent', 'nurturing', 'powerful', 'calm',
  'ambitious', 'transforming', 'thoughtful', 'grounded', 'joyful', 'quick',
  'expressive', 'alien', 'peaceful', 'transcendent', 'playful', 'resourceful',
  'connected', 'ethereal', 'transformative', 'luminous',
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function TierBadge({ tier }: { tier: CompanionArchetype['tier'] }) {
  if (tier === 'common') return null;

  const styles =
    tier === 'legendary'
      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border-yellow-500/30'
      : 'bg-amber-500/10 text-amber-300 border-amber-500/20';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles}`}
    >
      {tier === 'legendary' && <Star size={10} weight="fill" />}
      {tier}
    </span>
  );
}

function PersonalityPill({
  trait,
  selected,
  onClick,
}: {
  trait: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
        selected
          ? 'border-[#00bcd4]/40 bg-[#00bcd4]/15 text-[#00bcd4]'
          : 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/10 hover:text-white/60'
      }`}
    >
      {trait}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

export default function CompanionForgePage() {
  const [elementFilter, setElementFilter] = useState<Element | 'All'>('All');
  const [selectedArchetype, setSelectedArchetype] = useState<CompanionArchetype | null>(null);
  const [customName, setCustomName] = useState('');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [forgeComplete, setForgeComplete] = useState(false);

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const filteredArchetypes =
    elementFilter === 'All'
      ? COMPANION_ARCHETYPES
      : COMPANION_ARCHETYPES.filter((a) => a.element === elementFilter);

  const handleSelectArchetype = useCallback((archetype: CompanionArchetype) => {
    setSelectedArchetype(archetype);
    setSelectedElement(archetype.element);
    setSelectedPersonality([...archetype.personality]);
    setCustomName('');
    setIsForging(false);
    setForgeComplete(false);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleTogglePersonality = useCallback((trait: string) => {
    setSelectedPersonality((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait);
      }
      if (prev.length >= 5) return prev;
      return [...prev, trait];
    });
  }, []);

  const handleForge = useCallback(() => {
    setIsForging(true);
    setForgeComplete(false);
    setTimeout(() => {
      setIsForging(false);
      setForgeComplete(true);
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }, 2000);
  }, []);

  const activeElement = selectedElement ?? selectedArchetype?.element ?? 'Fire';
  const activeColor = ELEMENT_COLORS[activeElement];

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* ---- Hero ---- */}
        <section className="relative overflow-hidden px-6 pb-12 pt-24 text-center md:pt-32">
          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.06)_0%,transparent_60%)]" />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
              The Forge
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Forge Your Companion
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
              Choose an archetype. Name it. Give it personality. Bring it to
              life.
            </p>
          </m.div>
        </section>

        {/* ---- Step 1: Choose Archetype ---- */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="mb-1 font-display text-lg font-semibold tracking-tight text-white/80">
              Step 1
            </h2>
            <p className="mb-6 text-sm text-white/40">Choose an archetype</p>

            {/* Element filter tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
              {ELEMENTS.map((el) => {
                const active = elementFilter === el.key;
                return (
                  <button
                    key={el.key}
                    type="button"
                    onClick={() => setElementFilter(el.key)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/10 hover:text-white/60'
                    }`}
                    style={active ? { borderColor: `${el.color}40`, color: el.color } : undefined}
                  >
                    {el.label}
                  </button>
                );
              })}
            </div>

            {/* Archetype grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredArchetypes.map((archetype) => {
                  const isSelected = selectedArchetype?.id === archetype.id;
                  const ElementIcon = ELEMENT_ICONS[archetype.element];
                  const color = ELEMENT_COLORS[archetype.element];
                  const isLegendary = archetype.tier === 'legendary';
                  const isRare = archetype.tier === 'rare';

                  return (
                    <m.button
                      key={archetype.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      type="button"
                      onClick={() => handleSelectArchetype(archetype)}
                      className={`group relative rounded-2xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-white/20 bg-white/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'
                      } ${isLegendary ? 'overflow-hidden' : ''}`}
                      style={
                        isSelected
                          ? {
                              borderColor: `${archetype.baseColor}60`,
                              boxShadow: `0 0 24px ${archetype.glowColor}, 0 0 48px ${archetype.glowColor}`,
                            }
                          : isRare
                            ? { boxShadow: `0 0 12px rgba(255,215,0,0.08)` }
                            : undefined
                      }
                    >
                      {/* Legendary animated border shimmer */}
                      {isLegendary && (
                        <div
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
                          style={{
                            background: `linear-gradient(135deg, ${archetype.baseColor}40, transparent 40%, transparent 60%, ${archetype.baseColor}40)`,
                            animation: 'shimmer 3s ease-in-out infinite',
                          }}
                        />
                      )}

                      <div className="relative z-10 p-5">
                        {/* Icon + tier */}
                        <div className="mb-3 flex items-start justify-between">
                          <span className="text-3xl">{archetype.icon}</span>
                          <TierBadge tier={archetype.tier} />
                        </div>

                        {/* Name */}
                        <h3 className="mb-1 font-display text-sm font-semibold tracking-tight text-white/90">
                          {archetype.name}
                        </h3>

                        {/* Element badge */}
                        <div className="mb-3 flex items-center gap-1.5">
                          <ElementIcon size={12} className="opacity-60" style={{ color }} />
                          <span className="text-[11px] font-medium" style={{ color: `${color}aa` }}>
                            {archetype.element}
                          </span>
                        </div>

                        {/* Personality traits */}
                        <div className="flex flex-wrap gap-1">
                          {archetype.personality.map((trait) => (
                            <span
                              key={trait}
                              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/40"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </m.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </m.div>
        </section>

        {/* ---- Step 2: Customize ---- */}
        <AnimatePresence>
          {selectedArchetype && (
            <m.section
              ref={step2Ref}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl px-6 pb-16"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-md md:p-8">
                <h2 className="mb-1 font-display text-lg font-semibold tracking-tight text-white/80">
                  Step 2
                </h2>
                <p className="mb-8 text-sm text-white/40">
                  Customize your companion
                </p>

                {/* Selected archetype preview */}
                <div className="mb-8 flex items-start gap-5">
                  <div
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-3xl"
                    style={{
                      background: `${selectedArchetype.baseColor}15`,
                      boxShadow: `0 0 20px ${selectedArchetype.glowColor}`,
                    }}
                  >
                    {selectedArchetype.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white/90">
                      {selectedArchetype.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/40">
                      {selectedArchetype.description}
                    </p>
                  </div>
                </div>

                {/* Name input */}
                <div className="mb-8">
                  <label
                    htmlFor="companion-name"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
                  >
                    Name your companion
                  </label>
                  <input
                    id="companion-name"
                    type="text"
                    maxLength={24}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={selectedArchetype.name}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-display text-base text-white placeholder:text-white/20 focus:border-[#00bcd4]/30 focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20"
                  />
                  <p className="mt-1.5 text-right text-[11px] text-white/20">
                    {customName.length}/24
                  </p>
                </div>

                {/* Element selector */}
                <div className="mb-8">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
                    Element
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ELEMENTS.filter((e) => e.key !== 'All').map((el) => {
                      const isActive = selectedElement === el.key;
                      const Icon = ELEMENT_ICONS[el.key as Element];
                      return (
                        <button
                          key={el.key}
                          type="button"
                          onClick={() => setSelectedElement(el.key as Element)}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-white/[0.08] text-white'
                              : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/10 hover:text-white/60'
                          }`}
                          style={
                            isActive
                              ? {
                                  borderColor: `${el.color}50`,
                                  boxShadow: `0 0 16px ${el.color}20`,
                                }
                              : undefined
                          }
                        >
                          <Icon size={16} style={isActive ? { color: el.color } : undefined} />
                          {el.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personality */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
                    Personality Traits
                  </p>
                  <p className="mb-3 text-[11px] text-white/25">
                    Select up to 5 traits
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALITY_POOL.map((trait) => (
                      <PersonalityPill
                        key={trait}
                        trait={trait}
                        selected={selectedPersonality.includes(trait)}
                        onClick={() => handleTogglePersonality(trait)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </m.section>
          )}
        </AnimatePresence>

        {/* ---- Step 3: Forge ---- */}
        <AnimatePresence>
          {selectedArchetype && customName.trim().length > 0 && (
            <m.section
              ref={step3Ref}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl px-6 pb-32"
            >
              <div className="text-center">
                <h2 className="mb-1 font-display text-lg font-semibold tracking-tight text-white/80">
                  Step 3
                </h2>
                <p className="mb-8 text-sm text-white/40">
                  Bring your companion to life
                </p>

                {/* Forge button */}
                {!forgeComplete && (
                  <m.button
                    type="button"
                    onClick={handleForge}
                    disabled={isForging}
                    whileHover={isForging ? undefined : { scale: 1.03 }}
                    whileTap={isForging ? undefined : { scale: 0.97 }}
                    className="group relative mx-auto inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 px-10 py-4 font-display text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${activeColor}30, #0d47a120)`,
                      boxShadow: isForging
                        ? `0 0 40px ${activeColor}30, 0 0 80px ${activeColor}15`
                        : `0 0 20px ${activeColor}15`,
                    }}
                  >
                    {isForging ? (
                      <>
                        {/* Shimmer overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${activeColor}15, transparent)`,
                            animation: 'shimmer 1.5s ease-in-out infinite',
                          }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div
                            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                            style={{ borderColor: `${activeColor}60`, borderTopColor: 'transparent' }}
                          />
                          <span className="text-white/70">Forging...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Lightning size={22} weight="fill" className="text-[#ffd700]" />
                        Forge {customName.trim()}
                      </>
                    )}
                  </m.button>
                )}

                {/* Forged companion card */}
                <AnimatePresence>
                  {forgeComplete && selectedArchetype && (
                    <m.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md"
                      style={{
                        boxShadow: `0 0 40px ${activeColor}20, 0 0 80px ${activeColor}10`,
                      }}
                    >
                      {/* Gradient image placeholder */}
                      <div
                        className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${ELEMENT_GRADIENTS[activeElement]}`}
                      >
                        <span className="text-6xl">{selectedArchetype.icon}</span>
                        <div className="absolute bottom-3 right-3">
                          <TierBadge tier={selectedArchetype.tier} />
                        </div>
                      </div>

                      <div className="p-6 text-left">
                        {/* Name + element */}
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-display text-xl font-bold tracking-tight">
                            {customName.trim()}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const Icon = ELEMENT_ICONS[activeElement];
                              return (
                                <Icon size={14} style={{ color: activeColor }} />
                              );
                            })()}
                            <span
                              className="text-xs font-medium"
                              style={{ color: activeColor }}
                            >
                              {activeElement}
                            </span>
                          </div>
                        </div>

                        {/* Archetype origin */}
                        <p className="mb-4 text-xs text-white/30">
                          Born from the{' '}
                          <span className="text-white/50">
                            {selectedArchetype.name}
                          </span>{' '}
                          archetype
                        </p>

                        {/* Personality traits */}
                        <div className="flex flex-wrap gap-1.5">
                          {selectedPersonality.map((trait) => (
                            <span
                              key={trait}
                              className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                              style={{
                                borderColor: `${activeColor}30`,
                                color: `${activeColor}cc`,
                                background: `${activeColor}10`,
                              }}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>

                        {/* Sparkle footer */}
                        <div className="mt-6 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                          <Sparkle size={14} weight="fill" className="text-[#ffd700]" />
                          <span className="text-xs text-white/30">
                            Companion forged. Ready when you are.
                          </span>
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.section>
          )}
        </AnimatePresence>

        {/* Global keyframe for shimmer animation */}
        <style jsx global>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.3; transform: translateX(-100%); }
            50% { opacity: 1; transform: translateX(100%); }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
