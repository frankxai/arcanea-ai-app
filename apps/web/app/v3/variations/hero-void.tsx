'use client';

import { motion } from 'framer-motion';
import { PhArrowRight } from '@/lib/phosphor-icons';

/* ─────────────────────────────────────────────
   Variation 1 — "Void Monochrome"
   Inspired by Grok / x.ai
   Pure black. Massive type. Absolute minimalism.
   The emptiness IS the design.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.2,
    },
  }),
};

export function HeroVoid() {
  return (
    <section
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:px-8">
        {/* Headline */}
        <motion.h1
          className="font-display font-bold leading-[0.95] tracking-[-0.03em] text-white"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 8rem)',
          }}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Creative intelligence,
          <br />
          <span style={{ color: CYAN }}>specialized.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-xl text-lg leading-relaxed md:mt-8 md:text-xl"
          style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          10 Luminors for writing, design, code, music, and research.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-10 md:mt-12"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <a
            href="/create"
            className="group inline-flex items-center gap-2.5 rounded-md px-7 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90 md:text-lg"
            style={{ backgroundColor: CYAN }}
          >
            Start creating
            <PhArrowRight
              size={20}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.p
          className="mt-8 text-sm tracking-wide md:mt-10"
          style={{ color: 'rgba(255, 255, 255, 0.22)' }}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Free &middot; No credit card &middot; 34+ original texts
        </motion.p>
      </div>
    </section>
  );
}
