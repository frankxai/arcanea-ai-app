'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PhCompass, PhEye, PhFlame, PhArrowRight } from '@/lib/phosphor-icons';

/* ─────────────────────────────────────────────
   Variation 6 — "Organic Natural"
   Inspired by Notion / Calm / wellness-creative
   Warm dark, gold accents, organic blobs, poetic
   copy, artisanal feel. Serif display, slow entrances.
   ───────────────────────────────────────────── */

const GOLD = '#d4a574';
const WARM_BG = '#0c0b09';

interface PillarProps {
  icon: React.ReactNode;
  label: string;
  index: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.18,
    },
  }),
};

function Pillar({ icon, label, index }: PillarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: 1.2 + index * 0.15,
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border"
        style={{
          borderColor: `${GOLD}20`,
          background: `${GOLD}06`,
        }}
      >
        {icon}
      </div>
      <span
        className="text-xs font-normal tracking-[0.15em] uppercase"
        style={{ color: 'rgba(255, 255, 255, 0.35)' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function HeroOrganic() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: WARM_BG }}
    >
      {/* ── Noise/grain texture overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Organic blob shapes ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute"
          style={{
            width: '500px',
            height: '500px',
            left: '5%',
            top: '10%',
            background: `${GOLD}05`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(60px)',
          }}
          animate={{
            borderRadius: [
              '30% 70% 70% 30% / 30% 30% 70% 70%',
              '50% 50% 30% 70% / 60% 40% 60% 40%',
              '70% 30% 50% 50% / 40% 60% 40% 60%',
              '30% 70% 70% 30% / 30% 30% 70% 70%',
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: '400px',
            height: '400px',
            right: '10%',
            bottom: '15%',
            background: 'rgba(180, 140, 100, 0.03)',
            borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
            filter: 'blur(50px)',
          }}
          animate={{
            borderRadius: [
              '60% 40% 30% 70% / 50% 60% 40% 50%',
              '40% 60% 60% 40% / 70% 30% 70% 30%',
              '50% 50% 40% 60% / 30% 70% 30% 70%',
              '60% 40% 30% 70% / 50% 60% 40% 50%',
            ],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* ── Scattered dots/stars (CSS pseudo via small divs) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { left: '12%', top: '18%', size: 2, opacity: 0.12 },
          { left: '85%', top: '22%', size: 1.5, opacity: 0.10 },
          { left: '72%', top: '72%', size: 2, opacity: 0.08 },
          { left: '25%', top: '78%', size: 1.5, opacity: 0.14 },
          { left: '55%', top: '12%', size: 1, opacity: 0.10 },
          { left: '40%', top: '88%', size: 1.5, opacity: 0.06 },
          { left: '90%', top: '50%', size: 2, opacity: 0.09 },
          { left: '8%', top: '55%', size: 1, opacity: 0.11 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              backgroundColor: GOLD,
              opacity: dot.opacity,
            }}
            animate={{
              opacity: [dot.opacity, dot.opacity * 1.8, dot.opacity],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-32 text-center md:px-8 md:py-40">
        {/* Headline */}
        <motion.h1
          className="font-display leading-[1.15] md:leading-[1.12]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'rgba(255, 255, 255, 0.93)',
          }}
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          Where creativity
          <br />
          takes form
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-lg text-base md:mt-8 md:text-lg"
          style={{
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.8,
          }}
          custom={1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          An AI creation platform with 10 specialized minds
          <br className="hidden sm:block" />
          and a philosophy library for the creative life.
        </motion.p>

        {/* CTA — simple text link, no button */}
        <motion.div
          className="mt-10 md:mt-12"
          custom={2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <a
            href="/create"
            className="group inline-flex items-center gap-2 text-base font-normal transition-colors duration-500 hover:opacity-80"
            style={{ color: GOLD }}
          >
            <span>Begin creating</span>
            <PhArrowRight
              size={16}
              weight="regular"
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-4 text-xs"
          style={{ color: 'rgba(255, 255, 255, 0.20)', lineHeight: 1.8 }}
          custom={3}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          Free to start &middot; No credit card required
        </motion.p>

        {/* ── Three pillars ── */}
        <div className="mt-24 flex items-start justify-center gap-12 md:mt-32 md:gap-20">
          <Pillar
            icon={<PhCompass size={22} weight="light" style={{ color: GOLD }} />}
            label="Direction"
            index={0}
          />
          <Pillar
            icon={<PhEye size={22} weight="light" style={{ color: GOLD }} />}
            label="Vision"
            index={1}
          />
          <Pillar
            icon={<PhFlame size={22} weight="light" style={{ color: GOLD }} />}
            label="Drive"
            index={2}
          />
        </div>
      </div>
    </section>
  );
}
