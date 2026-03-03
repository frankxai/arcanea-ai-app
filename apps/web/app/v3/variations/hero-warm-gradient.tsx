'use client';

import { motion } from 'framer-motion';
import {
  PhArrowRight,
  PhPaintBrush,
  PhMusicNote,
  PhCode,
} from '@/lib/phosphor-icons';

/* ─────────────────────────────────────────────
   Variation 2 — "Warm Gradient Flow"
   Inspired by TikTok / Canva
   Rounded, playful-premium, warm orbs,
   gradient text, glass cards.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';
const TEAL = '#00897b';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-white/[0.06] p-6 backdrop-blur-md md:p-8"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    >
      <div
        className="mb-4 inline-flex items-center justify-center rounded-2xl p-3"
        style={{
          background: `linear-gradient(135deg, ${CYAN}18, ${TEAL}12)`,
        }}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {description}
      </p>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.15,
    },
  }),
};

export function HeroWarmGradient() {
  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#09090b' }}
    >
      {/* ── Background gradient orbs ── */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(255, 107, 53, 0.03)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `rgba(0, 188, 212, 0.05)` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[60%] h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(0, 137, 123, 0.04)' }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-32 md:px-8 md:pt-36">
        {/* Trending pill */}
        <motion.div
          className="mb-8 flex justify-center md:justify-start"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: CYAN,
            }}
          >
            <span className="text-xs">&#10022;</span>
            AI Creation Platform
          </span>
        </motion.div>

        {/* Headline with gradient text */}
        <motion.h1
          className="font-display text-center text-4xl font-bold leading-[1.08] tracking-[-0.02em] md:text-left md:text-6xl lg:text-7xl"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span className="text-white">Create anything with </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${CYAN}, ${TEAL}, #ff6b35)`,
            }}
          >
            AI that gets you.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-5 max-w-lg text-center text-base leading-relaxed md:mx-0 md:text-left md:text-lg"
          style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          10 specialized AI minds for writing, design, code, music, and research
          &mdash; all in one place.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-10 flex justify-center md:justify-start"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.a
            href="/create"
            className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg md:text-lg"
            style={{
              backgroundImage: `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
              boxShadow: `0 8px 32px ${CYAN}22`,
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 12px 40px ${CYAN}33`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Start creating free
            <PhArrowRight
              size={20}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </motion.a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-5 text-center text-sm md:text-left"
          style={{ color: 'rgba(255, 255, 255, 0.28)' }}
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          No credit card required &middot; Free to start &middot; 34+ original texts
        </motion.p>

        {/* ── Feature cards ── */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<PhPaintBrush size={24} weight="duotone" style={{ color: CYAN }} />}
            title="Design & Visual"
            description="Generate images, refine compositions, and iterate on your visual identity with AI that understands aesthetics."
            delay={0.65}
          />
          <FeatureCard
            icon={<PhMusicNote size={24} weight="duotone" style={{ color: CYAN }} />}
            title="Music & Audio"
            description="Compose melodies, arrange tracks, and explore sonic landscapes with a specialist that speaks music."
            delay={0.8}
          />
          <FeatureCard
            icon={<PhCode size={24} weight="duotone" style={{ color: CYAN }} />}
            title="Code & Build"
            description="Scaffold projects, debug logic, and ship faster with an AI engineer that thinks in systems."
            delay={0.95}
          />
        </div>
      </div>
    </section>
  );
}
