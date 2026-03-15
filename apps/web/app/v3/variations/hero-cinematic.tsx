'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { PhArrowRight, PhCaretDown } from '@/lib/phosphor-icons';
import heroImage from '@/assets/brand/arcanea-hero.jpg';

/* ─────────────────────────────────────────────
   Variation 3 — "Cinematic Dark"
   Inspired by Suno / Leonardo AI
   Full-bleed hero image, dramatic spotlight,
   movie-poster typography, film grain, vignette.
   The atmosphere does the talking.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3 + i * 0.2,
    },
  }),
};

const chevronBounce = {
  y: [0, 6, 0],
  transition: {
    duration: 2,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};

export function HeroCinematic() {
  return (
    <section className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black">
      {/* ── Hero image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          style={{
            opacity: 0.45,
            mixBlendMode: 'soft-light',
          }}
          sizes="100vw"
        />
      </div>

      {/* ── Spotlight gradient (center-top radial) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 15%, rgba(255,255,255,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Vignette (dark edges) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Bottom fade to pure black ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-48"
        style={{
          background: 'linear-gradient(to bottom, transparent, #000000)',
        }}
        aria-hidden="true"
      />

      {/* ── Film grain noise overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
        aria-hidden="true"
      />

      {/* ── Content overlay ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center md:px-8">
        {/* Headline — movie-poster style */}
        <motion.h1
          className="font-display text-5xl font-bold leading-[1.0] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Where imagination
          <br />
          becomes real
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed md:mt-8 md:text-lg"
          style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          16 Luminors. Writing, design, code, music, research.
          <br className="hidden md:block" />
          One platform for everything you create.
        </motion.p>

        {/* CTA — outline with glow */}
        <motion.div
          className="mt-10 md:mt-12"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.a
            href="/create"
            className="group inline-flex items-center gap-2.5 rounded-md border px-7 py-3.5 text-base font-semibold transition-colors md:text-lg"
            style={{
              borderColor: `${CYAN}55`,
              color: CYAN,
              boxShadow: `0 0 24px ${CYAN}11`,
            }}
            whileHover={{
              borderColor: CYAN,
              boxShadow: `0 0 32px ${CYAN}28, inset 0 0 16px ${CYAN}08`,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            Start creating
            <PhArrowRight
              size={20}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </motion.a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-6 text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.22)' }}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Free &middot; No credit card &middot; 34+ original texts
        </motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <span
          className="text-xs font-medium uppercase tracking-[0.15em]"
          style={{ color: 'rgba(255, 255, 255, 0.22)' }}
        >
          Scroll to explore
        </span>
        <motion.div animate={chevronBounce}>
          <PhCaretDown
            size={18}
            weight="bold"
            style={{ color: 'rgba(255, 255, 255, 0.22)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
