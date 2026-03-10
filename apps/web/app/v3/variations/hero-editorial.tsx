'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { PhArrowRight } from '@/lib/phosphor-icons';
import heroImage from '@/assets/brand/arcanea-hero.jpg';

/* ─────────────────────────────────────────────
   Variation 7 — "Editorial Magazine"
   Inspired by Apple Newsroom / Bloomberg
   Split layout. Oversized type. Drop cap.
   Monochrome except one accent link.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';
const BG = '#09090b';

const headlineWords = ['Arcanea'];

const wordVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3 + i * 0.12,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.7 + i * 0.15,
    },
  }),
};

const DESCRIPTION =
  'A creative intelligence platform housing 10 specialized AI minds and an original library of 34 philosophical texts.';

export function HeroEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-end overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-0 px-6 py-16 md:flex-row md:items-stretch md:gap-0 md:px-10 lg:px-16 lg:py-24">
        {/* ── Left Column: 60% ── */}
        <div className="flex flex-col justify-end md:w-[60%] md:pr-12 lg:pr-16">
          {/* Label */}
          <motion.p
            className="mb-6 text-xs font-medium uppercase md:mb-8"
            style={{
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.5em',
            }}
            custom={0}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            EST. 2024 &middot; Creative Intelligence
          </motion.p>

          {/* Headline */}
          <div className="overflow-hidden">
            {headlineWords.map((word, i) => (
              <motion.h1
                key={word}
                className="font-display font-bold leading-none text-white"
                style={{
                  fontSize: 'clamp(5rem, 12vw, 14rem)',
                  lineHeight: 0.9,
                }}
                custom={i}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={wordVariants}
              >
                {word}
              </motion.h1>
            ))}
          </div>

          {/* Editorial Description with Drop Cap */}
          <motion.div
            className="mt-8 max-w-lg md:mt-10 lg:mt-12"
            custom={0}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            <p
              className="text-xl leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.64)' }}
            >
              <span
                className="float-left mr-2 font-display text-5xl font-bold leading-[0.85] md:text-6xl"
                style={{ color: 'rgba(255, 255, 255, 0.93)' }}
              >
                {DESCRIPTION.charAt(0)}
              </span>
              {DESCRIPTION.slice(1)}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-10 md:mt-14"
            custom={1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            <a
              href="/create"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase transition-colors hover:opacity-80"
              style={{
                color: CYAN,
                letterSpacing: '0.3em',
              }}
            >
              Enter Arcanea
              <PhArrowRight
                size={14}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            className="mt-4 text-[11px] uppercase"
            style={{
              color: 'rgba(255, 255, 255, 0.22)',
              letterSpacing: '0.2em',
            }}
            custom={2}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            Free to start &middot; 16 Luminors &middot; 34+ texts
          </motion.p>
        </div>

        {/* ── Vertical Divider ── */}
        <motion.div
          className="my-8 h-px w-full md:my-0 md:h-auto md:w-px"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={
            isInView
              ? { scaleY: 1, opacity: 1 }
              : { scaleY: 0, opacity: 0 }
          }
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
        />

        {/* ── Right Column: 40% ── */}
        <motion.div
          className="relative flex items-end justify-center overflow-hidden md:w-[40%] md:pl-12 lg:pl-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
        >
          <div
            className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-sm md:aspect-auto md:h-full md:max-w-none"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)',
              WebkitMaskComposite: 'intersect',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)',
              maskComposite: 'intersect',
            }}
          >
            <Image
              src={heroImage}
              alt="Arcanea — Creative Intelligence"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
