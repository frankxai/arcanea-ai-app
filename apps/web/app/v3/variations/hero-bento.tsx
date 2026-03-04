'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import {
  PhArrowRight,
  PhBooks,
  PhCompass,
  PhPen,
  PhPaintBrush,
  PhCode,
  PhMusicNote,
} from '@/lib/phosphor-icons';
import heroImage from '@/assets/brand/arcanea-hero.jpg';

/* ─────────────────────────────────────────────
   Variation 8 — "Bento Grid"
   Inspired by Apple (iPhone features page)
   Flat cards, micro-borders, tight gap.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';
const BG = '#09090b';

const CARD_BASE =
  'rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.12]';

const capabilities: {
  label: string;
  icon: React.ComponentType<{
    size: number;
    weight?: 'bold' | 'duotone' | 'fill' | 'light' | 'thin' | 'regular';
    className?: string;
    style?: CSSProperties;
  }>;
  gradient: string;
}[] = [
  {
    label: 'Writing',
    icon: PhPen,
    gradient: 'linear-gradient(135deg, rgba(0,188,212,0.08) 0%, transparent 60%)',
  },
  {
    label: 'Design',
    icon: PhPaintBrush,
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 60%)',
  },
  {
    label: 'Code',
    icon: PhCode,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 60%)',
  },
  {
    label: 'Music',
    icon: PhMusicNote,
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%)',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 24,
      delay: i * 0.08,
    },
  }),
};

export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 md:py-24">
        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Top Spanning Card: Headline + CTA (4 cols) ── */}
          <motion.div
            className={`${CARD_BASE} col-span-1 flex flex-col justify-between p-8 sm:col-span-2 lg:col-span-4 lg:p-10`}
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(0,188,212,0.04) 0%, transparent 40%)',
            }}
            custom={0}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <div>
              <h1
                className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Creative intelligence,{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${CYAN}, #0d47a1)`,
                  }}
                >
                  specialized.
                </span>
              </h1>
              <p
                className="mt-4 max-w-xl text-lg leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.55)' }}
              >
                10 AI specialists for writing, design, code, music, and research
                — backed by an original library of philosophical wisdom.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/create"
                className="group inline-flex items-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                style={{ backgroundColor: CYAN }}
              >
                Start creating
                <PhArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </motion.div>

          {/* ── Left Tall Card: Hero Image + "10 Specialists" (2 cols, 2 rows) ── */}
          <motion.div
            className={`${CARD_BASE} relative col-span-1 row-span-1 min-h-[280px] overflow-hidden sm:col-span-1 lg:col-span-2 lg:row-span-2`}
            custom={1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <Image
              src={heroImage}
              alt="Arcanea specialists"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <p
                className="text-xs font-medium uppercase"
                style={{
                  color: CYAN,
                  letterSpacing: '0.25em',
                }}
              >
                AI Specialists
              </p>
              <p className="mt-1 font-display text-4xl font-bold text-white lg:text-5xl">
                10
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Specialized minds for every creative discipline
              </p>
            </div>
          </motion.div>

          {/* ── Right Top Card: Philosophy Library (2 cols, 1 row) ── */}
          <motion.div
            className={`${CARD_BASE} col-span-1 flex flex-col justify-between p-6 sm:col-span-1 lg:col-span-2 lg:p-8`}
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, transparent 50%)',
            }}
            custom={2}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <PhBooks
              size={32}
              weight="duotone"
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
            />
            <div className="mt-6">
              <p
                className="text-xs font-medium uppercase"
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.2em',
                }}
              >
                Philosophy Library
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-white">
                34+ texts
              </p>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.45)' }}
              >
                Original wisdom across 17 collections for the creative journey.
              </p>
            </div>
          </motion.div>

          {/* ── Right Bottom Card: Open Platform (2 cols, 1 row) ── */}
          <motion.div
            className={`${CARD_BASE} col-span-1 flex flex-col justify-between p-6 sm:col-span-1 lg:col-span-2 lg:p-8`}
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(0,137,123,0.06) 0%, transparent 50%)',
            }}
            custom={3}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <PhCompass
              size={32}
              weight="duotone"
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
            />
            <div className="mt-6">
              <p
                className="text-xs font-medium uppercase"
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.2em',
                }}
              >
                Open Platform
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-white">
                Free to start
              </p>
              <a
                href="/create"
                className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: CYAN }}
              >
                Explore
                <PhArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </motion.div>

          {/* ── 4 Capability Cards ── */}
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.label}
                className={`${CARD_BASE} col-span-1 flex flex-col items-start p-6`}
                style={{ backgroundImage: cap.gradient }}
                custom={4 + i}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                <Icon
                  size={28}
                  weight="duotone"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                />
                <p className="mt-4 text-sm font-semibold text-white">
                  {cap.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
