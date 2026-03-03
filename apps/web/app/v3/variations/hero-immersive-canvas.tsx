'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import heroImage from '@/assets/brand/arcanea-hero.jpg';

/* ─────────────────────────────────────────────
   Variation 10 — "Immersive Canvas"
   Inspired by Midjourney / Leonardo
   Gallery-first: the IMAGE is the hero.
   Floating capability tags orbit the focal piece.
   Cinematic, museum-exhibition feel.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';

/* ── Capability tags with orbital positions ── */
const TAGS = [
  { label: 'Writing',        top: '8%',   left: '2%',   delay: 0,    speed: 22 },
  { label: 'Design',         top: '18%',  left: '85%',  delay: 1.4,  speed: 26 },
  { label: 'Code',           top: '42%',  left: '-4%',  delay: 2.8,  speed: 20 },
  { label: 'Music',          top: '68%',  left: '90%',  delay: 0.6,  speed: 28 },
  { label: 'Research',       top: '85%',  left: '8%',   delay: 3.2,  speed: 24 },
  { label: 'Strategy',       top: '5%',   left: '50%',  delay: 1.0,  speed: 30 },
  { label: 'World Building', top: '50%',  left: '92%',  delay: 2.2,  speed: 18 },
  { label: 'Philosophy',     top: '90%',  left: '60%',  delay: 3.8,  speed: 25 },
  { label: 'Education',      top: '30%',  left: '93%',  delay: 0.4,  speed: 22 },
  { label: 'Analysis',       top: '75%',  left: '-2%',  delay: 2.0,  speed: 27 },
] as const;

/* ── Framer Motion variants ── */
const containerFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
  },
};

const textFade = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const tagFade = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 + delay * 0.12 },
  }),
};

/* ── Inline keyframes injected once ── */
const KEYFRAMES_CSS = `
@keyframes canvas-drift-0 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(6px,-8px); } 66% { transform: translate(-4px,6px); } }
@keyframes canvas-drift-1 { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-8px,4px); } 50% { transform: translate(5px,-6px); } 75% { transform: translate(-3px,8px); } }
@keyframes canvas-drift-2 { 0%,100% { transform: translate(0,0); } 40% { transform: translate(7px,5px); } 80% { transform: translate(-6px,-7px); } }
@keyframes canvas-drift-3 { 0%,100% { transform: translate(0,0); } 20% { transform: translate(-5px,-9px); } 60% { transform: translate(8px,3px); } }
@keyframes canvas-drift-4 { 0%,100% { transform: translate(0,0); } 35% { transform: translate(4px,7px); } 70% { transform: translate(-7px,-4px); } }
`.trim();

function OrbitalKeyframes() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />;
}

const DRIFT_ANIMATIONS = [
  'canvas-drift-0',
  'canvas-drift-1',
  'canvas-drift-2',
  'canvas-drift-3',
  'canvas-drift-4',
];

export function HeroImmersiveCanvas() {
  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <OrbitalKeyframes />

      {/* ── Subtle center radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${CYAN}08 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Main canvas area ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20 md:px-8 md:py-24"
        initial="hidden"
        animate="visible"
        variants={containerFade}
      >
        {/* ── Image container with glass frame ── */}
        <div className="relative mx-auto w-full max-w-3xl">
          {/* Floating tags — desktop: absolute around image */}
          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            {TAGS.map((tag, i) => (
              <motion.span
                key={tag.label}
                className="pointer-events-auto absolute inline-flex cursor-default items-center rounded-full border border-white/[0.08] px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/20 hover:text-white/80"
                style={{
                  top: tag.top,
                  left: tag.left,
                  color: 'rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.03)',
                  animationName: DRIFT_ANIMATIONS[i % DRIFT_ANIMATIONS.length],
                  animationDuration: `${tag.speed}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${tag.delay}s`,
                }}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={tagFade}
              >
                {tag.label}
              </motion.span>
            ))}
          </div>

          {/* Glass-framed image */}
          <motion.div
            className="relative overflow-hidden rounded-3xl"
            style={{
              padding: '1px',
              background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, ${CYAN}18 100%)`,
            }}
            variants={imageFade}
          >
            <div
              className="relative overflow-hidden rounded-[calc(1.5rem-1px)]"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              <Image
                src={heroImage}
                alt="Arcanea — Creative Intelligence"
                className="h-auto w-full object-cover"
                style={{
                  aspectRatio: '16/9',
                  boxShadow: `0 40px 100px -20px rgba(0,0,0,0.8), 0 0 80px -10px ${CYAN}08`,
                }}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                placeholder="blur"
              />
            </div>
          </motion.div>

          {/* Mobile tag strip — horizontal scroll */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-hide">
            {TAGS.map((tag, i) => (
              <motion.span
                key={tag.label}
                className="inline-flex shrink-0 items-center rounded-full border border-white/[0.08] px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.03)',
                }}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={tagFade}
              >
                {tag.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Title block beneath the image ── */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center md:mt-14">
          <motion.h1
            className="font-display text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl"
            custom={1.0}
            initial="hidden"
            animate="visible"
            variants={textFade}
          >
            Arcanea
          </motion.h1>

          <motion.p
            className="font-mono text-xs uppercase tracking-[0.25em]"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            custom={1.2}
            initial="hidden"
            animate="visible"
            variants={textFade}
          >
            Creative Intelligence Platform
          </motion.p>
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="mt-10 flex justify-center md:mt-12"
          custom={1.5}
          initial="hidden"
          animate="visible"
          variants={textFade}
        >
          <a
            href="/create"
            className="group inline-flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            <span className="border-b border-transparent transition-all duration-300 group-hover:border-white/40 group-hover:text-white/90">
              Start Creating
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
