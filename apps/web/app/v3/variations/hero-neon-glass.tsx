'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { PhArrowRight } from '@/lib/phosphor-icons';
import navLogo from '@/assets/brand/arcanea-mark.jpg';

/* ─────────────────────────────────────────────
   Variation 5 — "Neon Glass"
   Inspired by Figma / Discord / Midjourney dark
   Glowing neon borders, glass morphism cards,
   animated gradient mesh, floating capability pills.
   ───────────────────────────────────────────── */

const NEON = '#00e5ff';
const BG = '#0a0a12';

interface PillProps {
  label: string;
  tint: string;
  delay: number;
  x: string;
  y: string;
}

const PILLS: PillProps[] = [
  { label: 'Writing', tint: '#c084fc', delay: 0.8, x: '-45%', y: '-30%' },
  { label: 'Design', tint: '#f472b6', delay: 0.95, x: '115%', y: '-20%' },
  { label: 'Code', tint: '#34d399', delay: 1.1, x: '120%', y: '55%' },
  { label: 'Music', tint: '#fbbf24', delay: 1.25, x: '-40%', y: '70%' },
  { label: 'Research', tint: '#60a5fa', delay: 1.4, x: '-50%', y: '25%' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
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

function FloatingPill({ label, tint, delay, x, y }: PillProps) {
  return (
    <m.div
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
    >
      <m.div
        className="cursor-default rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300"
        style={{
          background: `${tint}08`,
          borderColor: `${tint}30`,
          color: `${tint}cc`,
        }}
        whileHover={{
          backdropFilter: 'blur(24px)',
          borderColor: `${tint}60`,
          background: `${tint}14`,
        }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay * 0.5,
          },
        }}
      >
        {label}
      </m.div>
    </m.div>
  );
}

export function HeroNeonGlass() {
  return (
    <LazyMotion features={domAnimation}>
    <section
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* ── Animated gradient mesh ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <m.div
          className="absolute h-[700px] w-[700px] rounded-full blur-[120px]"
          style={{
            background: 'rgba(0, 229, 255, 0.06)',
            left: '15%',
            top: '10%',
          }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <m.div
          className="absolute h-[500px] w-[500px] rounded-full blur-[100px]"
          style={{
            background: 'rgba(99, 102, 241, 0.05)',
            right: '10%',
            bottom: '15%',
          }}
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <m.div
          className="absolute h-[400px] w-[400px] rounded-full blur-[90px]"
          style={{
            background: 'rgba(192, 132, 252, 0.04)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* ── Corner neon accents ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top-left */}
        <div
          className="absolute left-8 top-8 h-12 w-[1px]"
          style={{
            background: `linear-gradient(to bottom, ${NEON}40, transparent)`,
          }}
        />
        <div
          className="absolute left-8 top-8 h-[1px] w-12"
          style={{
            background: `linear-gradient(to right, ${NEON}40, transparent)`,
          }}
        />
        {/* Top-right */}
        <div
          className="absolute right-8 top-8 h-12 w-[1px]"
          style={{
            background: `linear-gradient(to bottom, ${NEON}40, transparent)`,
          }}
        />
        <div
          className="absolute right-8 top-8 h-[1px] w-12"
          style={{
            background: `linear-gradient(to left, ${NEON}40, transparent)`,
          }}
        />
        {/* Bottom-left */}
        <div
          className="absolute bottom-8 left-8 h-12 w-[1px]"
          style={{
            background: `linear-gradient(to top, ${NEON}40, transparent)`,
          }}
        />
        <div
          className="absolute bottom-8 left-8 h-[1px] w-12"
          style={{
            background: `linear-gradient(to right, ${NEON}40, transparent)`,
          }}
        />
        {/* Bottom-right */}
        <div
          className="absolute bottom-8 right-8 h-12 w-[1px]"
          style={{
            background: `linear-gradient(to top, ${NEON}40, transparent)`,
          }}
        />
        <div
          className="absolute bottom-8 right-8 h-[1px] w-12"
          style={{
            background: `linear-gradient(to left, ${NEON}40, transparent)`,
          }}
        />
      </div>

      {/* ── Neon line decorations ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Horizontal neon line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 opacity-[0.04]"
          style={{
            background: `linear-gradient(to right, transparent 10%, ${NEON}, transparent 90%)`,
          }}
        />
        {/* Vertical neon line */}
        <div
          className="absolute bottom-0 left-1/2 top-0 w-[1px] -translate-x-1/2 opacity-[0.04]"
          style={{
            background: `linear-gradient(to bottom, transparent 10%, ${NEON}, transparent 90%)`,
          }}
        />
      </div>

      {/* ── Central glass card ── */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 md:px-8">
        <m.div
          className="relative rounded-2xl border p-8 backdrop-blur-xl md:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderColor: `${NEON}30`,
            boxShadow: `
              0 0 40px ${NEON}08,
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{
            boxShadow: `
              0 0 60px ${NEON}12,
              inset 0 1px 0 rgba(255,255,255,0.08)
            `,
            borderColor: `${NEON}50`,
          }}
        >
          {/* Brand mark */}
          <m.div
            className="mb-8"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Image
              src={navLogo}
              alt="Arcanea"
              width={36}
              height={36}
              className="rounded-lg"
            />
          </m.div>

          {/* Headline */}
          <m.h1
            className="font-sans text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-white md:text-5xl lg:text-6xl"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Creative
            <br />
            Intelligence
          </m.h1>

          {/* Subtitle */}
          <m.p
            className="mt-4 text-base font-normal leading-relaxed md:text-lg"
            style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            10 specialized AI models for everything you create.
          </m.p>

          {/* CTA */}
          <m.div
            className="mt-8"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <m.a
              href="/create"
              className="group inline-flex items-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold text-black"
              style={{
                backgroundColor: NEON,
                boxShadow: `0 0 24px ${NEON}40`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${NEON}30`,
                  `0 0 32px ${NEON}50`,
                  `0 0 20px ${NEON}30`,
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{ scale: 0.98 }}
            >
              Start creating
              <PhArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </m.a>
          </m.div>

          {/* Trust line */}
          <m.p
            className="mt-5 text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.25)' }}
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Free &middot; No credit card &middot; 34+ original texts
          </m.p>

          {/* ── Floating pills (positioned relative to card) ── */}
          {PILLS.map((pill) => (
            <FloatingPill key={pill.label} {...pill} />
          ))}
        </m.div>

        {/* ── Mobile pills (stacked row below card) ── */}
        <m.div
          className="mt-6 flex flex-wrap justify-center gap-2 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {PILLS.map((pill) => (
            <span
              key={pill.label}
              className="rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              style={{
                background: `${pill.tint}08`,
                borderColor: `${pill.tint}25`,
                color: `${pill.tint}bb`,
              }}
            >
              {pill.label}
            </span>
          ))}
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
