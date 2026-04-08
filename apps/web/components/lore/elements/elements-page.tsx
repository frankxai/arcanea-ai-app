'use client';

import { LazyMotion, domAnimation, m, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  PhSparkle,
  PhCaretDown,
  PhSpiral,
} from '@/lib/phosphor-icons';
import { cn } from '@/lib/utils';
import { ELEMENTS } from './elements-data';
import {
  FifthElementDuality,
  ElementRelationshipsSection,
  GuardianElementsSection,
  TheArcSection,
  ElementsCTA,
} from './elements-sections';

function ElementsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

  const ORB_POSITIONS = [
    { x: '50%', y: '15%', color: '#9966ff', shadowColor: 'rgba(153,102,255,0.6)', delay: 0, size: 'w-16 h-16' },
    { x: '80%', y: '40%', color: '#ff6b35', shadowColor: 'rgba(255,107,53,0.6)', delay: 0.4, size: 'w-12 h-12' },
    { x: '68%', y: '78%', color: '#4a7c59', shadowColor: 'rgba(74,124,89,0.6)', delay: 0.8, size: 'w-14 h-14' },
    { x: '32%', y: '78%', color: '#00bcd4', shadowColor: 'rgba(0,188,212,0.6)', delay: 1.2, size: 'w-14 h-14' },
    { x: '20%', y: '40%', color: '#c8d6e5', shadowColor: 'rgba(200,214,229,0.4)', delay: 1.6, size: 'w-12 h-12' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-cosmic-deep">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 bg-aurora opacity-40" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {ORB_POSITIONS.map((orb, i) => (
          <m.div
            key={i}
            className={cn('absolute rounded-full', orb.size)}
            style={{
              left: orb.x,
              top: orb.y,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${orb.color}40 0%, ${orb.color}10 60%, transparent 100%)`,
              boxShadow: `0 0 40px ${orb.shadowColor}, 0 0 80px ${orb.shadowColor}50`,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: orb.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points="50,15 80,40 68,78 32,78 20,40"
            fill="none"
            stroke="rgba(0,188,212,0.5)"
            strokeWidth="0.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {[...Array(60)].map((_, i) => (
          <m.div
            key={`star-${i}`}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${(i * 17.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              opacity: (i % 3) * 0.3 + 0.1,
            }}
            animate={{ opacity: [(i % 3) * 0.2 + 0.1, 0.8, (i % 3) * 0.2 + 0.1] }}
            transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 5) * 0.4 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cosmic-deep pointer-events-none" />

      <m.div
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-brand-primary/30 mb-8"
        >
          <PhSpiral className="w-4 h-4 text-brand-primary" />
          <span className="text-sm font-medium text-brand-primary font-sans">
            The Foundations of All Creation
          </span>
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-fluid-hero font-display font-bold mb-6 leading-none"
        >
          <span className="text-gradient-cosmic">The Five</span>
          <br />
          <span className="text-white">Elements</span>
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-6 font-body italic leading-relaxed"
        >
          "From the meeting of Lumina and Nero, five forces crystallized — not as opposites
          but as collaborators. Each element is a different way existence speaks."
        </m.p>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-sm text-text-muted font-mono tracking-wider mb-14"
        >
          — Meditations on Elements, Vol. I
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {ELEMENTS.map((el, i) => {
            const Icon = el.icon;
            return (
              <m.div
                key={el.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border"
                style={{ borderColor: el.colors.border }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: el.colors.primary }} />
                <span className="text-sm font-display font-medium" style={{ color: el.colors.primary }}>
                  {el.name}
                </span>
              </m.div>
            );
          })}
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-text-muted font-sans">Descend into the elements</span>
          <m.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <PhCaretDown className="w-6 h-6 text-text-muted" />
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}

function ElementCardsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-brand-primary/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-fire/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crystal/10 border border-crystal/20 mb-6">
            <PhSparkle className="w-4 h-4 text-crystal" />
            <span className="text-sm font-medium text-crystal">The Five Forces</span>
          </div>
          <h2 className="text-fluid-4xl font-display font-bold mb-4 text-white">
            Each Element, A Way of Being
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
            Every creator channels all five — but one will resonate as your primary attunement.
            Which element are you in this moment?
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ELEMENTS.map((element, i) => {
            const Icon = element.icon;
            const isExpanded = expandedId === element.id;
            const isLast = i === ELEMENTS.length - 1;

            return (
              <m.div
                key={element.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(isLast && 'md:col-span-2 xl:col-span-1')}
              >
                <div
                  className={cn(
                    'relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 group hover-lift glow-card',
                    'iridescent-glass',
                    isExpanded && 'ring-1',
                  )}
                  style={{
                    boxShadow: isExpanded ? `0 0 60px ${element.colors.glow}` : undefined,
                    borderColor: isExpanded ? element.colors.border : undefined,
                    // @ts-ignore -- ring color
                    '--tw-ring-color': element.colors.primary,
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : element.id)}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${element.colors.glow} 0%, transparent 60%)`,
                    }}
                  />

                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ background: element.colors.bg }}
                  />

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `${element.colors.primary}20`, boxShadow: `0 0 20px ${element.colors.glow}` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: element.colors.primary }} />
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs font-mono tracking-[0.2em] font-bold mb-1"
                          style={{ color: element.colors.primary }}
                        >
                          {element.keyword}
                        </div>
                        <div className="text-xs text-text-muted font-mono">{element.solfeggio}</div>
                      </div>
                    </div>

                    <h3
                      className={cn('text-3xl font-display font-bold mb-1', element.colors.textGradient)}
                    >
                      {element.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-3 font-body italic">
                      {element.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {element.domain.split(', ').map((d) => (
                        <span
                          key={d}
                          className="px-2.5 py-0.5 rounded-full text-xs font-sans"
                          style={{
                            background: `${element.colors.primary}12`,
                            color: element.colors.primary,
                            border: `1px solid ${element.colors.border}`,
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <p className="text-text-secondary leading-relaxed text-sm font-body mb-5">
                      {element.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted font-sans">
                        {isExpanded ? 'Close' : 'Explore deeper'}
                      </span>
                      <m.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PhCaretDown
                          className="w-4 h-4"
                          style={{ color: element.colors.primary }}
                        />
                      </m.div>
                    </div>
                  </div>

                  {isExpanded && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative border-t"
                      style={{ borderColor: element.colors.border }}
                    >
                      <div className="p-8 space-y-6">
                        <div>
                          <h4
                            className="text-xs font-mono tracking-widest uppercase mb-3"
                            style={{ color: element.colors.primary }}
                          >
                            The Teaching
                          </h4>
                          <blockquote
                            className="font-body italic text-white leading-relaxed text-base border-l-2 pl-4"
                            style={{ borderColor: element.colors.primary }}
                          >
                            "{element.philosophy}"
                          </blockquote>
                        </div>

                        <div>
                          <h4
                            className="text-xs font-mono tracking-widest uppercase mb-3"
                            style={{ color: element.colors.primary }}
                          >
                            Guardians of This Element
                          </h4>
                          <ul className="space-y-1">
                            {element.guardians.map((g) => (
                              <li key={g} className="text-sm text-text-secondary font-sans">
                                <span style={{ color: element.colors.primary }}>•</span> {g}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: element.colors.bg, border: `1px solid ${element.colors.border}` }}>
                          <PhSpiral className="w-4 h-4 flex-shrink-0" style={{ color: element.colors.primary }} />
                          <div>
                            <div className="text-xs text-text-muted font-mono mb-0.5">Arc Phase</div>
                            <div className="text-sm font-display font-semibold" style={{ color: element.colors.primary }}>
                              {element.arcPhase}
                            </div>
                          </div>
                        </div>
                      </div>
                    </m.div>
                  )}

                  <m.div
                    className="absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${element.colors.primary} 0%, transparent 70%)`,
                    }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ElementsPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-cosmic-deep">
        <ElementsHero />
        <ElementCardsSection />
        <FifthElementDuality />
        <ElementRelationshipsSection />
        <GuardianElementsSection />
        <TheArcSection />
        <ElementsCTA />
      </div>
    </LazyMotion>
  );
}
