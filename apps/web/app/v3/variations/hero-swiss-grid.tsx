'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PhArrowRight } from '@/lib/phosphor-icons';

/* ─────────────────────────────────────────────
   Variation 4 — "Swiss Grid Precision"
   Inspired by Vercel / Linear
   Ultra-precise layout. Typography IS the design.
   Monochrome until interaction. Generous whitespace.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';

interface FeatureItem {
  number: string;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    number: '01',
    title: 'Specialized Intelligence',
    description:
      '10 AI specialists, each trained for a distinct creative discipline.',
  },
  {
    number: '02',
    title: 'Philosophy Library',
    description:
      '34 original texts on creativity, ritual, and the practice of making.',
  },
  {
    number: '03',
    title: 'Unified Platform',
    description:
      'Writing, design, code, music, and research in a single workspace.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.12,
    },
  }),
};

function FeatureRow({
  item,
  index,
}: {
  item: FeatureItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="group relative border-t border-white/[0.06] py-8 pl-0 transition-colors duration-300 hover:border-l-2 md:py-10"
      style={{
        borderLeftColor: 'transparent',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.55,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.1,
      }}
      whileHover={{
        borderLeftColor: CYAN,
        paddingLeft: 20,
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        {/* Number */}
        <div className="md:col-span-2">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(255, 255, 255, 0.25)' }}
          >
            {item.number}
          </span>
        </div>

        {/* Title */}
        <div className="md:col-span-4">
          <h3 className="text-base font-medium tracking-[-0.01em] text-white/90">
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <div className="md:col-span-6">
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.45)' }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSwissGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden"
      style={{ backgroundColor: '#09090b' }}
    >
      {/* ── Subtle grid pattern ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-48 md:px-8">
        {/* ── Top: Brand mark ── */}
        <motion.div
          className="mb-20 md:mb-28"
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {/* Headline */}
          <h1
            className="font-display font-light leading-[0.92] text-white/90"
            style={{
              fontSize: 'clamp(4rem, 10vw, 12rem)',
              letterSpacing: '-0.06em',
            }}
          >
            Arcanea
          </h1>

          {/* Descriptor */}
          <motion.p
            className="mt-5 font-mono text-xs uppercase tracking-[0.5em] md:mt-6"
            style={{ color: 'rgba(255, 255, 255, 0.30)' }}
            custom={1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            Creative Intelligence Platform
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-10 md:mt-14"
            custom={2}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <a
              href="/create"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-white/70 transition-colors duration-300 hover:text-white"
            >
              <span>Start creating</span>
              <PhArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </motion.div>

        {/* ── Feature rows ── */}
        <div className="mt-0">
          {FEATURES.map((item, i) => (
            <FeatureRow key={item.number} item={item} index={i} />
          ))}
          {/* Closing border */}
          <div className="border-t border-white/[0.06]" />
        </div>

        {/* ── Bottom stats bar ── */}
        <motion.div
          className="mt-16 flex flex-col items-start justify-between gap-4 md:mt-20 md:flex-row md:items-center"
          custom={5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {/* Horizontal rule + stats */}
          <div />
          <p
            className="font-mono text-xs tracking-wider"
            style={{ color: 'rgba(255, 255, 255, 0.20)' }}
          >
            10 specialists &middot; 34 texts &middot; Free to start
          </p>
        </motion.div>
      </div>
    </section>
  );
}
