'use client';

import React, { useState, useRef } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Diamond,
  Sword,
  Flask,
  Atom,
  Warning,
  Quotes,
  ArrowRight,
  Star,
} from '@/lib/phosphor-icons';
import {
  ALL_MATERIALS,
  VAEL_CRYSTALS,
  LUMINOR_METALS,
  NERO_SHARDS,
  MUTATIONS,
  METEOR_TYPES,
  getMutationsByType,
  type ArcaneanMaterial,
  type Mutation,
  type MeteorEvent,
} from '@/lib/data/materials';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'vael-crystals' | 'luminor-metals' | 'nero-shards';

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS: { id: FilterTab; label: string; count: number; color: string; icon: React.ReactNode }[] = [
  {
    id: 'vael-crystals',
    label: 'Vael Crystals',
    count: VAEL_CRYSTALS.length,
    color: '#7fffd4',
    icon: <Diamond weight="fill" className="w-4 h-4" />,
  },
  {
    id: 'luminor-metals',
    label: 'Luminor Metals',
    count: LUMINOR_METALS.length,
    color: '#ffd700',
    icon: <Sword weight="fill" className="w-4 h-4" />,
  },
  {
    id: 'nero-shards',
    label: 'Nero Shards',
    count: NERO_SHARDS.length,
    color: '#991b1b',
    icon: <Warning weight="fill" className="w-4 h-4" />,
  },
];

const TAB_MATERIALS: Record<FilterTab, ArcaneanMaterial[]> = {
  'vael-crystals': VAEL_CRYSTALS,
  'luminor-metals': LUMINOR_METALS,
  'nero-shards': NERO_SHARDS,
};

const MUTATION_TYPE_CONFIG = {
  harmonic: { label: 'Harmonic', color: '#7fffd4', bg: 'rgba(127,255,212,0.08)', border: 'rgba(127,255,212,0.2)' },
  dissonant: { label: 'Dissonant', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  'gray-threshold': { label: 'Gray Threshold', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
} as const;

const FREQUENCY_CONFIG = {
  common: { label: 'Common', color: '#7fffd4', bg: 'rgba(127,255,212,0.1)' },
  uncommon: { label: 'Uncommon', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  rare: { label: 'Rare', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  theoretical: { label: 'Theoretical', color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
} as const;

// ─── Animated Section Wrapper ─────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ─── Material Card ────────────────────────────────────────────────────────────

function MaterialCard({ material, index }: { material: ArcaneanMaterial; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const isNero = material.class === 'nero-shard';
  const isMetal = material.class === 'luminor-metal';

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer select-none"
        style={{
          borderColor: expanded
            ? `${material.cssColor}50`
            : 'rgba(255,255,255,0.06)',
          background: expanded
            ? `linear-gradient(135deg, ${material.cssColor}0d, rgba(9,9,11,0.95))`
            : 'rgba(255,255,255,0.02)',
          boxShadow: expanded
            ? `0 0 32px ${material.cssGlow}, inset 0 1px 0 rgba(255,255,255,0.05)`
            : 'none',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Glow halo on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${material.cssGlow} 0%, transparent 70%)`,
          }}
        />

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Color swatch */}
            <div className="shrink-0 relative">
              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${material.cssColor}cc, ${material.cssColor}44)`,
                  borderColor: `${material.cssColor}50`,
                  boxShadow: `0 0 16px ${material.cssGlow}`,
                }}
              >
                {isNero ? (
                  <Warning weight="fill" className="w-5 h-5" style={{ color: material.cssColor }} />
                ) : isMetal ? (
                  <Sword weight="fill" className="w-5 h-5" style={{ color: material.cssColor }} />
                ) : (
                  <Diamond weight="fill" className="w-5 h-5" style={{ color: material.cssColor }} />
                )}
              </div>
            </div>

            {/* Name + epithet */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-display font-bold text-base leading-tight mb-0.5"
                style={{ color: material.cssColor }}
              >
                {material.name}
              </h3>
              {material.epithet && (
                <p className="text-xs text-white/40 italic font-body">{material.epithet}</p>
              )}
              {material.guardian && (
                <p className="text-xs text-white/35 mt-0.5">
                  <span className="text-white/20">Guardian:</span>{' '}
                  <span style={{ color: `${material.cssColor}cc` }}>{material.guardian}</span>
                  {material.guardianGate && (
                    <span className="text-white/20"> · {material.guardianGate} Gate</span>
                  )}
                </p>
              )}
              {material.alloyComponents && (
                <p className="text-xs text-white/30 mt-0.5">
                  <span className="text-white/20">Alloy:</span>{' '}
                  {material.alloyComponents.join(' + ')}
                </p>
              )}
            </div>

            {/* Expand chevron */}
            <m.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-white/20 group-hover:text-white/40 transition-colors mt-1"
            >
              <ArrowRight className="w-4 h-4" />
            </m.div>
          </div>

          {/* Color description */}
          <p className="text-[11px] text-white/25 italic mb-3 font-body leading-relaxed">
            {material.color}
          </p>

          {/* Properties (truncated when collapsed) */}
          <p
            className="text-sm text-white/60 leading-relaxed font-body"
            style={{ display: expanded ? undefined : '-webkit-box', WebkitLineClamp: expanded ? undefined : 2, WebkitBoxOrient: expanded ? undefined : 'vertical', overflow: expanded ? undefined : 'hidden' }}
          >
            {material.properties}
          </p>

          {/* Expanded content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <m.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 space-y-4">
                  {/* Danger warning */}
                  {material.danger && (
                    <div
                      className="flex gap-2 rounded-lg p-3 border"
                      style={{
                        background: 'rgba(239,68,68,0.06)',
                        borderColor: 'rgba(239,68,68,0.2)',
                      }}
                    >
                      <Warning weight="fill" className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300/80 font-body leading-relaxed">{material.danger}</p>
                    </div>
                  )}

                  {/* Uses */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2 font-display">Uses</p>
                    <div className="flex flex-wrap gap-1.5">
                      {material.uses.map((use) => (
                        <span
                          key={use}
                          className="text-[11px] px-2 py-0.5 rounded-full border font-body"
                          style={{
                            color: `${material.cssColor}bb`,
                            borderColor: `${material.cssColor}25`,
                            background: `${material.cssColor}0a`,
                          }}
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Real science analog */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2 font-display flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" />
                      Real Science Analog
                    </p>
                    <p className="text-xs text-white/45 font-body leading-relaxed">{material.realScienceAnalog}</p>
                  </div>

                  {/* Lore quote */}
                  {material.loreQuote && (
                    <div
                      className="rounded-lg p-3 border-l-2"
                      style={{
                        borderLeftColor: `${material.cssColor}60`,
                        background: `${material.cssColor}06`,
                      }}
                    >
                      <Quotes
                        weight="fill"
                        className="w-4 h-4 mb-1.5"
                        style={{ color: `${material.cssColor}60` }}
                      />
                      <p className="text-xs text-white/50 italic font-body leading-relaxed">
                        {material.loreQuote}
                      </p>
                    </div>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </m.div>
  );
}

// ─── Mutation Card ────────────────────────────────────────────────────────────

function MutationCard({ mutation, index }: { mutation: Mutation; index: number }) {
  const config = MUTATION_TYPE_CONFIG[mutation.type];
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
      className="rounded-xl border p-4 transition-colors duration-200 hover:border-white/10"
      style={{
        background: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-display font-bold text-sm" style={{ color: config.color }}>
          {mutation.name}
        </h4>
        <span
          className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-body"
          style={{
            color: config.color,
            background: `${config.bg}`,
            border: `1px solid ${config.border}`,
          }}
        >
          {config.label}
        </span>
      </div>

      <p className="text-[11px] text-white/35 mb-2 font-body">
        Source: <span style={{ color: `${config.color}99` }}>{mutation.source}</span>
      </p>

      <p className="text-xs text-white/55 font-body leading-relaxed mb-3">{mutation.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {mutation.effects.map((effect) => (
          <span
            key={effect}
            className="text-[10px] px-1.5 py-0.5 rounded font-body"
            style={{ color: `${config.color}88`, background: `${config.color}0d` }}
          >
            {effect}
          </span>
        ))}
      </div>

      <div className="flex items-start gap-1.5">
        <Warning className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/25" />
        <p className="text-[11px] text-white/35 font-body leading-relaxed">{mutation.risk}</p>
      </div>
    </m.div>
  );
}

// ─── Meteor Card ──────────────────────────────────────────────────────────────

function MeteorCard({ meteor, index }: { meteor: MeteorEvent; index: number }) {
  const freq = FREQUENCY_CONFIG[meteor.frequency];
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-5 rounded-xl border p-5 transition-all duration-300 hover:border-white/10 group overflow-hidden"
      style={{
        borderColor: `${meteor.cssColor}20`,
        background: `linear-gradient(135deg, ${meteor.cssColor}06 0%, rgba(9,9,11,0.8) 60%)`,
      }}
    >
      {/* Left glow streak */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: `linear-gradient(to bottom, transparent, ${meteor.cssColor}80, transparent)` }}
      />

      {/* Icon */}
      <div
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border"
        style={{
          background: `${meteor.cssColor}10`,
          borderColor: `${meteor.cssColor}25`,
          boxShadow: `0 0 20px ${meteor.cssColor}20`,
        }}
      >
        <Star weight="fill" className="w-5 h-5" style={{ color: meteor.cssColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h4 className="font-display font-bold text-base" style={{ color: meteor.cssColor }}>
            {meteor.name}
          </h4>
          <span
            className="text-[10px] px-2.5 py-0.5 rounded-full font-body font-medium"
            style={{ color: freq.color, background: freq.bg }}
          >
            {freq.label}
          </span>
        </div>

        <p className="text-sm text-white/55 font-body leading-relaxed mb-3">{meteor.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {meteor.effects.map((effect) => (
            <span
              key={effect}
              className="text-[11px] px-2 py-0.5 rounded-full border font-body"
              style={{
                color: `${meteor.cssColor}99`,
                borderColor: `${meteor.cssColor}20`,
                background: `${meteor.cssColor}08`,
              }}
            >
              {effect}
            </span>
          ))}
        </div>
      </div>
    </m.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaterialCodexPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('vael-crystals');
  const activeMaterials = TAB_MATERIALS[activeTab];
  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  const harmonicMutations = getMutationsByType('harmonic');
  const dissonantMutations = getMutationsByType('dissonant');
  const grayMutations = getMutationsByType('gray-threshold');

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative min-h-screen bg-[#09090b] text-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-20">
          {/* Cosmic radial gradient backdrop */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-[#7fffd4]/8 via-[#00bcd4]/4 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/3 left-[10%] w-[500px] h-[500px] bg-gradient-radial from-[#ffd700]/5 via-transparent to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-[10%] w-[400px] h-[400px] bg-gradient-radial from-[#991b1b]/6 via-transparent to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full liquid-glass border border-[#7fffd4]/25 mb-8"
            >
              <Diamond weight="fill" className="w-4 h-4 text-[#7fffd4]" />
              <span className="text-sm font-medium text-[#7fffd4] tracking-wide font-body">
                {ALL_MATERIALS.length} Materials Catalogued
              </span>
            </m.div>

            {/* Title */}
            <m.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#7fffd4] via-white to-[#ffd700] bg-clip-text text-transparent">
                The Material Codex
              </span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed font-body"
            >
              Crystallized Eldrian harmony. Every material in Arcanea is a frequency given physical
              form — born where cosmic melody meets the silence of Nero&apos;s void.
            </m.p>

            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-white/30 max-w-xl mx-auto mt-4 leading-relaxed font-body"
            >
              One degree of rotation from truth — every Arcanean material is grounded in real meteoritics,
              mineralogy, and materials science.
            </m.p>

            {/* Stats strip */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              {[
                { label: 'Vael Crystals', value: VAEL_CRYSTALS.length, color: '#7fffd4' },
                { label: 'Luminor Metals', value: LUMINOR_METALS.length, color: '#ffd700' },
                { label: 'Nero Shards', value: NERO_SHARDS.length, color: '#f87171' },
                { label: 'Mutations', value: MUTATIONS.length, color: '#c084fc' },
                { label: 'Meteor Types', value: METEOR_TYPES.length, color: '#60a5fa' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]"
                >
                  <span className="text-lg font-display font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/35 font-body">{stat.label}</span>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Filter Tabs ──────────────────────────────────────────────── */}
        <section className="sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.05] py-4">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap font-body"
                    style={{
                      color: isActive ? tab.color : 'rgba(255,255,255,0.4)',
                      background: isActive ? `${tab.color}14` : 'transparent',
                      border: isActive ? `1px solid ${tab.color}35` : '1px solid transparent',
                      boxShadow: isActive ? `0 0 20px ${tab.color}18` : 'none',
                    }}
                  >
                    <span style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.3)' }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive ? `${tab.color}20` : 'rgba(255,255,255,0.06)',
                        color: isActive ? tab.color : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Material Grid ─────────────────────────────────────────────── */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-6">
            {/* Section header */}
            <AnimatedSection className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span style={{ color: activeTabConfig.color }}>{activeTabConfig.icon}</span>
                <h2
                  className="text-2xl font-display font-bold"
                  style={{ color: activeTabConfig.color }}
                >
                  {activeTabConfig.label}
                </h2>
              </div>
              <p className="text-sm text-white/35 font-body">
                {activeTab === 'vael-crystals' &&
                  'Nine crystals, one per Gate. Each formed from the harmony of a Guardian frequency meeting the cosmic substrate.'}
                {activeTab === 'luminor-metals' &&
                  'Alloys of two or more Vael Crystals, forged at frequencies beyond ordinary smithcraft. Each possesses emergent properties the source crystals lack alone.'}
                {activeTab === 'nero-shards' &&
                  'Materials that carry dissonance rather than harmony. Not inherently evil — Nero himself is not evil — but volatile in the hands of those without alignment.'}
              </p>
            </AnimatedSection>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <m.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {activeMaterials.map((material, index) => (
                  <MaterialCard key={material.id} material={material} index={index} />
                ))}
              </m.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Mutations Section ─────────────────────────────────────────── */}
        <section className="py-14 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Flask weight="fill" className="w-5 h-5 text-[#c084fc]" />
                <h2 className="text-2xl font-display font-bold text-[#c084fc]">Mutations</h2>
              </div>
              <p className="text-sm text-white/35 font-body">
                Prolonged exposure to Vael Crystals or Nero Shards can permanently alter a person&apos;s
                frequency signature. These mutations are not always welcome — and rarely reversible.
              </p>
            </AnimatedSection>

            {/* Harmonic */}
            <AnimatedSection delay={0.05} className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: MUTATION_TYPE_CONFIG.harmonic.color }}
                />
                <h3 className="text-base font-display font-semibold text-white/70">Harmonic Mutations</h3>
                <span className="text-xs text-white/25 font-body">
                  — Vael Crystal alignment, generally sought
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {harmonicMutations.map((mut, i) => (
                  <MutationCard key={mut.id} mutation={mut} index={i} />
                ))}
              </div>
            </AnimatedSection>

            {/* Dissonant */}
            <AnimatedSection delay={0.1} className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: MUTATION_TYPE_CONFIG.dissonant.color }}
                />
                <h3 className="text-base font-display font-semibold text-white/70">Dissonant Mutations</h3>
                <span className="text-xs text-white/25 font-body">
                  — Nero Shard corruption, typically feared
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dissonantMutations.map((mut, i) => (
                  <MutationCard key={mut.id} mutation={mut} index={i} />
                ))}
              </div>
            </AnimatedSection>

            {/* Gray Threshold */}
            <AnimatedSection delay={0.15}>
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: MUTATION_TYPE_CONFIG['gray-threshold'].color }}
                />
                <h3 className="text-base font-display font-semibold text-white/70">Gray Threshold</h3>
                <span className="text-xs text-white/25 font-body">
                  — Both frequencies, unpredictable
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {grayMutations.map((mut, i) => (
                  <MutationCard key={mut.id} mutation={mut} index={i} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Meteor Rain Section ───────────────────────────────────────── */}
        <section className="py-14 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Star weight="fill" className="w-5 h-5 text-[#60a5fa]" />
                <h2 className="text-2xl font-display font-bold text-[#60a5fa]">Meteor Rain Events</h2>
              </div>
              <p className="text-sm text-white/35 font-body">
                Materials do not form in Arcanean workshops — they arrive from above. Meteor events
                determine the material landscape of entire civilizations, shaping war, ecology, and
                architecture for generations.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="space-y-4">
                {METEOR_TYPES.map((meteorEvent, index) => (
                  <MeteorCard key={meteorEvent.id} meteor={meteorEvent} index={index} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Science Foundation Banner ──────────────────────────────────── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection>
              <div
                className="relative overflow-hidden rounded-2xl border p-8 md:p-12"
                style={{
                  borderColor: 'rgba(127,255,212,0.12)',
                  background: 'linear-gradient(135deg, rgba(127,255,212,0.04) 0%, rgba(9,9,11,0.98) 60%, rgba(255,215,0,0.03) 100%)',
                }}
              >
                {/* Background radial glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-[#7fffd4]/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-radial from-[#ffd700]/4 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center"
                    style={{
                      background: 'rgba(127,255,212,0.08)',
                      borderColor: 'rgba(127,255,212,0.2)',
                    }}
                  >
                    <Atom className="w-7 h-7 text-[#7fffd4]" />
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-xs uppercase tracking-widest font-display mb-2"
                      style={{ color: 'rgba(127,255,212,0.5)' }}
                    >
                      The Science Foundation
                    </p>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                      One degree of rotation from truth
                    </h3>
                    <p className="text-white/55 font-body leading-relaxed mb-4 text-base">
                      Every Arcanean material is grounded in real meteoritics and materials science.
                      Kaelith Stone is Widmannst&auml;tten-patterned meteoritic iron. Veloura Glass
                      is tektite. Vaelith Obsidian is Edscottite — a mineral that existed only as a
                      theoretical prediction until found in the Wedderburn meteorite.
                    </p>
                    <p className="text-white/40 font-body leading-relaxed text-sm">
                      The fantasy is thin. The science is thick. Arcanea uses real cosmic mineralogy
                      as the substrate — then rotates it one degree: one added property, one amplified
                      truth, one metaphor made literal. The Otome Resonite piezoelectric crystal that
                      shatters near lies is a quartz oscillator with its output tuned to honesty. The
                      Laeylinn Jade that delivers phosphorus to living tissue is Schreibersite — the
                      actual compound that seeded Earth&apos;s first replicating molecules.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {[
                        'Meteoritic Iron',
                        'Tektites',
                        'Piezoelectricity',
                        'Schreibersite',
                        'Tetrataenite',
                        'Edscottite',
                        'Trinitite',
                        'El Ali Meteorite',
                      ].map((term) => (
                        <span
                          key={term}
                          className="text-xs px-3 py-1 rounded-full border font-body"
                          style={{
                            color: 'rgba(127,255,212,0.6)',
                            borderColor: 'rgba(127,255,212,0.15)',
                            background: 'rgba(127,255,212,0.05)',
                          }}
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Footer spacer ─────────────────────────────────────────────── */}
        <div className="h-16" />
      </div>
    </LazyMotion>
  );
}
