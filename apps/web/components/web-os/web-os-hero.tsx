'use client';

// Scene 1 — the hook. Intelligence-core hero. Heavy 3D is lazy-loaded
// (ssr:false) with the static poster as the loading + reduced-motion +
// mobile fallback. Copy enters with the design-system heroReveal
// (blur-to-focus). One cinematic moment per page lives here.

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { heroReveal, staggerContainer } from '@arcanea/design-system';
import { WebOsPoster } from './web-os-poster';

const WebOsCore = dynamic(() => import('./web-os-core'), {
  ssr: false,
  loading: () => <WebOsPoster />,
});

export function WebOsHero() {
  // Reduced motion / coarse-pointer (mobile) → render the static poster, not WebGL.
  const [allow3D, setAllow3D] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 768px)').matches;
    setAllow3D(!reduce && !small);
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {allow3D ? <WebOsCore /> : <WebOsPoster />}
      </div>

      {/* radial vignette to seat the type */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 28%, #09090b 100%)',
        }}
      />

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        variants={staggerContainer(0.1, 0.08)}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={heroReveal}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-aquamarine/20 bg-aquamarine/[0.06] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-aquamarine animate-pulse" aria-hidden="true" />
          <span className="text-xs font-mono tracking-widest uppercase text-aquamarine">
            Premium Web OS
          </span>
        </motion.div>

        <motion.h1
          variants={heroReveal}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-6 leading-[1.05]"
        >
          The operating system behind{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, hsl(160 100% 75%), hsl(195 80% 55%), hsl(265 60% 65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            premium worlds
          </span>
        </motion.h1>

        <motion.p
          variants={heroReveal}
          className="font-body text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto"
        >
          A control plane that turns taste, motion, and 3D into constraints — so
          agents build cinematic sites by construction, not by luck.
        </motion.p>

        <motion.div variants={heroReveal} className="mt-10">
          <Link
            href="#mechanism"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-[#09090b] bg-aquamarine hover:bg-aquamarine-soft transition-colors"
          >
            Enter the System
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
