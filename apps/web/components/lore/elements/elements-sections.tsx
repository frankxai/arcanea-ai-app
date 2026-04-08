'use client';

import { m, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  PhFlame,
  PhDrop,
  PhMountains,
  PhWind,
  PhSparkle,
  PhArrowRight,
  PhSpiral,
  PhLightning,
  PhEye,
} from '@/lib/phosphor-icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ELEMENT_RELATIONS, ARC_PHASES } from './elements-data';

export function FifthElementDuality() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-void-el/10 via-brand-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void-el/10 border border-void-el/30 mb-6">
            <PhSparkle className="w-4 h-4 text-void-el" />
            <span className="text-sm font-medium text-void-el">The Sacred Mystery</span>
          </div>
          <h2 className="text-fluid-4xl font-display font-bold mb-4">
            <span className="text-gradient-cosmic">The Fifth Element</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
            Alone among the five, the Fifth Element carries a dual nature inseparable from
            the cosmic origin story. To understand it is to understand creation itself.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden liquid-glass-elevated mb-12"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-void-el/10 to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-brand-gold/10 to-transparent" />
          </div>

          <div className="relative grid md:grid-cols-2">
            <div className="p-10 md:pr-16 relative">
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-void-el/20 flex items-center justify-center shadow-glow-void">
                    <PhSparkle className="w-6 h-6 text-void-el" />
                  </div>
                  <div>
                    <div className="text-xs font-mono tracking-widest text-void-el uppercase">Nero's Aspect</div>
                    <h3 className="text-2xl font-display font-bold text-void-el">Void</h3>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Nature', value: 'Pure potential, the unformed' },
                    { label: 'Quality', value: 'Mystery, fertile darkness' },
                    { label: 'Colors', value: 'Black, deep purple, midnight gold' },
                    { label: 'State', value: 'Before form — infinite possibility' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="text-xs text-text-muted font-mono uppercase tracking-wider">{label}</span>
                      <p className="text-text-secondary font-sans text-sm mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="text-base font-body italic text-text-secondary border-l-2 border-void-el/50 pl-4 leading-relaxed">
                  "In the beginning, there was Nero. The Void contained everything that could
                  ever be, held in superposition — every possible world, every future creation."
                </blockquote>
              </m.div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-10">
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
              <div className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center my-4 border border-white/[0.12]">
                <span className="text-white font-display text-sm font-bold">/</span>
              </div>
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
            </div>

            <div className="p-10 md:pl-16 relative border-t border-white/[0.06] md:border-t-0 md:border-l md:border-l-white/[0.06]">
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center shadow-glow-gold">
                    <PhSparkle className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <div className="text-xs font-mono tracking-widest text-brand-gold uppercase">Lumina's Aspect</div>
                    <h3 className="text-2xl font-display font-bold text-brand-gold">Spirit</h3>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Nature', value: 'Transcendence, consciousness' },
                    { label: 'Quality', value: 'The soul witnessing itself' },
                    { label: 'Colors', value: 'White-gold, pure violet, luminous' },
                    { label: 'State', value: 'After form — the witness that remains' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="text-xs text-text-muted font-mono uppercase tracking-wider">{label}</span>
                      <p className="text-text-secondary font-sans text-sm mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="text-base font-body italic text-text-secondary border-l-2 border-brand-gold/50 pl-4 leading-relaxed">
                  "Lumina blazed forth not as fire but as form. Where Nero was infinite potential,
                  Lumina was pattern — the First Light that organized the darkness."
                </blockquote>
              </m.div>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
            className="relative border-t border-white/[0.06] bg-white/[0.03] px-10 py-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-sans">
              <div className="flex items-start gap-2">
                <PhEye className="w-4 h-4 text-crystal flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  <span className="text-crystal font-semibold">Light</span> is Fire's creation aspect — not the Fifth Element
                </span>
              </div>
              <div className="flex items-start gap-2">
                <PhEye className="w-4 h-4 text-fire flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  <span className="text-fire font-semibold">Shadow</span> is corrupted Void — Void severed from Spirit, as Malachar became
                </span>
              </div>
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

export function ElementRelationshipsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative">
      <hr className="section-divider mx-8 mb-24" />

      <div className="max-w-5xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <PhLightning className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-brand-gold">When Elements Meet</span>
          </div>
          <h2 className="text-fluid-3xl font-display font-bold mb-4 text-white">
            Elemental Relationships
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-body">
            No element exists in isolation. The interactions between elements are where
            creation's richest expressions emerge.
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-4">
          {ELEMENT_RELATIONS.map((rel, i) => (
            <m.div
              key={`${rel.a}-${rel.b}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl liquid-glass hover:border-white/[0.12] transition-all duration-300 hover-lift"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-display font-semibold text-white">{rel.a}</span>
                <span className="text-text-muted text-lg font-light">+</span>
                <span className="text-sm font-display font-semibold text-white">{rel.b}</span>
                <PhArrowRight className="w-4 h-4 text-text-muted ml-auto" />
              </div>

              <div
                className={cn('text-xl font-display font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2', rel.color)}
              >
                {rel.result}
              </div>
              <p className="text-sm text-text-muted font-body italic">{rel.description}</p>

              <div className={cn('absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none', rel.color, 'opacity-[0.04]')} />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuardianElementsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const GUARDIAN_ELEMENTS = [
    { guardian: 'Lyssandria', gate: 1, freq: '174 Hz', element: 'Earth', color: '#4a7c59', icon: PhMountains },
    { guardian: 'Leyla', gate: 2, freq: '285 Hz', element: 'Water / Fire', color: '#00bcd4', icon: PhDrop },
    { guardian: 'Draconia', gate: 3, freq: '396 Hz', element: 'Fire', color: '#ff6b35', icon: PhFlame },
    { guardian: 'Maylinn', gate: 4, freq: '417 Hz', element: 'Earth', color: '#4a7c59', icon: PhMountains },
    { guardian: 'Alera', gate: 5, freq: '528 Hz', element: 'Water / Sound', color: '#00bcd4', icon: PhDrop },
    { guardian: 'Lyria', gate: 6, freq: '639 Hz', element: 'Wind / Dream', color: '#c8d6e5', icon: PhWind },
    { guardian: 'Aiyami', gate: 7, freq: '741 Hz', element: 'Spirit / Light', color: '#ffd700', icon: PhSparkle },
    { guardian: 'Elara', gate: 8, freq: '852 Hz', element: 'Wind / Fractal', color: '#c8d6e5', icon: PhWind },
    { guardian: 'Ino', gate: 9, freq: '963 Hz', element: 'Void / Balance', color: '#9966ff', icon: PhSparkle },
    { guardian: 'Shinkami', gate: 10, freq: '1111 Hz', element: 'All / Spirit', color: '#ffd700', icon: PhSparkle },
  ];

  return (
    <section ref={ref} className="py-24 relative">
      <hr className="section-divider mx-8 mb-24" />

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <PhEye className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary">The Ten Guardians</span>
          </div>
          <h2 className="text-fluid-3xl font-display font-bold mb-4 text-white">
            Guardians and Their Elements
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-body">
            Each Guardian channels one or more elements through their Gate. No two Gates
            are alike — even when sharing an element, the expression differs entirely.
          </p>
        </m.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GUARDIAN_ELEMENTS.map((g, i) => {
            const Icon = g.icon;
            return (
              <m.div
                key={g.guardian}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.06 }}
                className="group relative p-4 rounded-2xl liquid-glass text-center hover:border-white/[0.12] transition-all duration-300 hover-lift"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${g.color}20`, boxShadow: `0 0 12px ${g.color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color: g.color }} />
                </div>
                <div className="text-xs font-mono text-text-muted mb-1">Gate {g.gate}</div>
                <div className="text-sm font-display font-bold text-white mb-1">{g.guardian}</div>
                <div className="text-xs" style={{ color: g.color }}>{g.element}</div>
                <div className="text-xs text-text-muted font-mono mt-1">{g.freq}</div>
              </m.div>
            );
          })}
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link
            href="/lore/guardians"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold hover:bg-brand-primary/20 transition-all"
          >
            Full Guardian Profiles
            <PhArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
  );
}

export function TheArcSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-gold/3 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <PhSpiral className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-brand-gold">The Eternal Rhythm</span>
          </div>
          <h2 className="text-fluid-3xl font-display font-bold mb-4 text-white">
            The Arc — Elements in Motion
          </h2>
          <p className="text-base text-text-secondary max-w-2xl mx-auto font-body">
            The Arc is not merely a philosophical concept. It is the operating system
            of reality, written in the language of the Five Elements. Every creation
            passes through all five phases — and thus channels all five forces.
          </p>
        </m.div>

        <div className="relative">
          <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-void-el via-fire via-water via-earth to-brand-gold hidden md:block" />

          <div className="space-y-6">
            {ARC_PHASES.map((phase, i) => (
              <m.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12 }}
                className="flex items-center gap-6"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 relative"
                  style={{
                    background: `${phase.color}20`,
                    border: `2px solid ${phase.color}50`,
                    boxShadow: `0 0 20px ${phase.color}30`,
                  }}
                >
                  <span className="text-xs font-display font-bold" style={{ color: phase.color }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div
                  className="flex-1 p-5 rounded-2xl liquid-glass border transition-all duration-300 hover:border-white/[0.10] group"
                  style={{ borderColor: `${phase.color}20` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h3
                      className="text-lg font-display font-bold"
                      style={{ color: phase.color }}
                    >
                      {phase.phase}
                    </h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono w-fit"
                      style={{
                        background: `${phase.color}15`,
                        color: phase.color,
                        border: `1px solid ${phase.color}30`,
                      }}
                    >
                      {phase.element}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-body">{phase.description}</p>
                </div>

                {i < ARC_PHASES.length - 1 && (
                  <div className="hidden md:block absolute left-[26px] mt-12 text-text-muted" />
                )}
              </m.div>
            ))}
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 p-8 rounded-3xl liquid-glass text-center"
        >
          <blockquote className="text-xl font-body italic text-white leading-relaxed mb-4">
            "The Arc turns: Potential → Manifestation → Experience → Dissolution → Evolved Potential.
            Death is not ending but transformation. Destruction enables creation."
          </blockquote>
          <p className="text-sm text-text-muted font-mono tracking-wider">
            — Laws of Arcanea, First Principle
          </p>
        </m.div>
      </div>
    </section>
  );
}

export function ElementsCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 border-t border-white/[0.04] relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-30" />

      <div className="max-w-3xl mx-auto px-6 text-center">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 mx-auto rounded-full liquid-glass flex items-center justify-center mb-8 shadow-glow-md">
            <PhSparkle className="w-10 h-10 text-crystal" />
          </div>

          <h2 className="text-fluid-3xl font-display font-bold mb-4">
            <span className="text-gradient-cosmic">Which Element Calls You?</span>
          </h2>

          <p className="text-lg text-text-secondary font-body mb-4 leading-relaxed">
            You carry all five within you. The question is not which element you are —
            it is which element is seeking expression right now, in this moment of your life.
          </p>

          <p className="text-base text-text-muted font-body italic mb-10">
            "Begin with Fire if you feel the urge to act. Begin with Water if you need to feel.
            Begin with Earth if you are lost. Begin with Wind if you feel caged.
            Begin with Void when nothing else applies — and you are ready for everything."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lore/guardians"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 shadow-glow-brand transition-all"
            >
              <PhSparkle className="w-4 h-4" />
              Meet the Guardians
            </Link>
            <Link
              href="/academy/gate-quiz"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-brand-gold/30 text-brand-gold font-semibold hover:bg-brand-gold/10 transition-all"
            >
              Discover Your Gate
              <PhArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.06] text-text-secondary font-semibold hover:bg-white/[0.04] transition-all"
            >
              Full Lore
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
