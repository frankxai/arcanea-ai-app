'use client';

import { useCallback, type ComponentType } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { PhArrowRight, PhEye } from '@/lib/phosphor-icons';

import { HeroVoid } from './hero-void';
import { HeroWarmGradient } from './hero-warm-gradient';
import { HeroCinematic } from './hero-cinematic';
import { HeroSwissGrid } from './hero-swiss-grid';
import { HeroNeonGlass } from './hero-neon-glass';
import { HeroOrganic } from './hero-organic';
import { HeroEditorial } from './hero-editorial';
import { HeroBento } from './hero-bento';
import { HeroMotionTheater } from './hero-motion-theater';
import { HeroImmersiveCanvas } from './hero-immersive-canvas';

// Wave 2: Full-page designs (agent swarm arena)
import { V1Cinematic } from './v1-cinematic';
import { V2Bento } from './v2-bento';
import { V3ScrollStory } from './v3-scroll-story';
import { V4Dashboard } from './v4-dashboard';
import { V5GradientMesh } from './v5-gradient-mesh';
import { V6Terminal } from './v6-terminal';
import { V7Gallery } from './v7-gallery';
import { V8Social } from './v8-social';
import { V9Particles } from './v9-particles';
import { V10Minimal } from './v10-minimal';

/* ─────────────────────────────────────────────
   Design Arena — 20 Homepage Variations (2 waves)
   Full-size showcase with index navigation
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';

interface Variation {
  id: string;
  name: string;
  desc: string;
  component: ComponentType;
}

const VARIATIONS: Variation[] = [
  { id: 'void', name: 'Void Monochrome', desc: 'Pure black. Giant type. Zero decoration. Inspired by Grok.', component: HeroVoid },
  { id: 'warm', name: 'Warm Gradient', desc: 'Soft gradients, rounded cards, playful energy. Inspired by TikTok/Canva.', component: HeroWarmGradient },
  { id: 'cinematic', name: 'Cinematic Dark', desc: 'Full-bleed imagery, dramatic lighting, movie poster. Inspired by Suno.', component: HeroCinematic },
  { id: 'swiss', name: 'Swiss Grid', desc: 'Ultra-precise grid, monochrome, typography-first. Inspired by Vercel.', component: HeroSwissGrid },
  { id: 'neon', name: 'Neon Glass', desc: 'Glowing borders, glass cards, cyberpunk energy. Inspired by gaming tools.', component: HeroNeonGlass },
  { id: 'organic', name: 'Organic Natural', desc: 'Warm tones, organic shapes, artisanal feel. Inspired by Notion/Calm.', component: HeroOrganic },
  { id: 'editorial', name: 'Editorial Magazine', desc: 'Split layout, oversized type, drop caps. Inspired by Bloomberg.', component: HeroEditorial },
  { id: 'bento', name: 'Bento Grid', desc: 'Multi-card layout, mixed heights, modern SaaS. Inspired by Apple.', component: HeroBento },
  { id: 'motion', name: 'Motion Theater', desc: 'Scroll-driven reveals, parallax, every pixel earned. Inspired by Framer.', component: HeroMotionTheater },
  { id: 'canvas', name: 'Immersive Canvas', desc: 'Image-first, orbiting tags, gallery exhibition. Inspired by Midjourney.', component: HeroImmersiveCanvas },
];

const FULL_PAGE: Variation[] = [
  { id: 'fp-cinematic', name: 'Cinematic Film', desc: 'Letterbox bars, film grain, 2.39:1 aspect. Inspired by Runway/Veo/Sora.', component: V1Cinematic },
  { id: 'fp-bento', name: 'Bento Grid', desc: '4-column grid, glass cards, gateway stats. Inspired by Apple/Linear/Vercel.', component: V2Bento },
  { id: 'fp-scroll', name: 'Scroll Storytelling', desc: 'Chapter-based 300vh sections, word-by-word reveal. Inspired by Apple product pages.', component: V3ScrollStory },
  { id: 'fp-dashboard', name: 'Dashboard Preview', desc: 'Product mockup with perspective tilt, fake UI. Inspired by Notion/Figma/Canva.', component: V4Dashboard },
  { id: 'fp-gradient', name: 'Gradient Mesh', desc: 'Animated gradient blobs, vibrant colors, mix-blend-mode. Inspired by Stripe/Clerk.', component: V5GradientMesh },
  { id: 'fp-terminal', name: 'Terminal / Hacker', desc: 'Full terminal aesthetic, boot sequence, process list. Inspired by Warp/Cursor.', component: V6Terminal },
  { id: 'fp-gallery', name: 'Gallery / Museum', desc: 'Art exhibition, gold frames, book spines. Inspired by MOMA/Midjourney.', component: V7Gallery },
  { id: 'fp-social', name: 'Social Feed', desc: 'TikTok-style feed, engagement bars, trending sidebar. Inspired by TikTok/Threads.', component: V8Social },
  { id: 'fp-particles', name: 'Particle Universe', desc: '80 CSS-only particles, orbital showcase, constellation lines. Inspired by Three.js/Cosmos.', component: V9Particles },
  { id: 'fp-minimal', name: 'Minimal Zen', desc: 'Maximum restraint, 186 lines, no icons. Inspired by Muji/Arc Browser.', component: V10Minimal },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.05,
    },
  }),
};

function padNumber(n: number): string {
  return String(n).padStart(2, '0');
}

export function VariationsShowcase() {
  const scrollToVariation = useCallback((id: string) => {
    const el = document.getElementById(`variation-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen" style={{ backgroundColor: '#09090b' }}>
      {/* ── Header & Index ── */}
      <header className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 md:px-8 md:pt-28">
        {/* Title */}
        <m.div
          className="mb-4 flex items-center gap-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="h-px flex-1 max-w-[60px]"
            style={{ background: `linear-gradient(90deg, ${CYAN}, transparent)` }}
          />
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: CYAN }}
          >
            Design Arena
          </span>
        </m.div>

        <m.h1
          className="font-display text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          Homepage Variations
        </m.h1>

        <m.p
          className="mt-4 max-w-lg text-base leading-relaxed md:text-lg"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        >
          20 competing designs across 2 waves. Each a different philosophy. Scroll to explore, or jump directly.
        </m.p>

        {/* ── Variation index cards ── */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {VARIATIONS.map((v, i) => (
            <m.button
              key={v.id}
              onClick={() => scrollToVariation(v.id)}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] p-4 text-left transition-all duration-300 hover:border-white/[0.12]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              }}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              whileHover={{
                y: -2,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
            >
              {/* Number */}
              <span
                className="font-mono text-xs font-medium"
                style={{ color: CYAN }}
              >
                {padNumber(i + 1)}
              </span>

              {/* Name */}
              <h3 className="mt-1.5 text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                {v.name}
              </h3>

              {/* Description */}
              <p
                className="mt-1 line-clamp-2 text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {v.desc}
              </p>

              {/* View link */}
              <span
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ color: CYAN }}
              >
                <PhEye size={12} weight="bold" />
                View Full
                <PhArrowRight size={10} weight="bold" />
              </span>
            </m.button>
          ))}
        </div>

        {/* ── Wave 2 header ── */}
        <div className="mt-16 mb-4 flex items-center gap-3">
          <div
            className="h-px flex-1 max-w-[60px]"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, transparent)' }}
          />
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: '#8b5cf6' }}
          >
            Wave 2 — Full-Page Designs
          </span>
        </div>
        <p
          className="mb-8 max-w-lg text-sm leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          10 complete homepage builds from a competitive agent swarm. Each agent had a distinct design philosophy.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FULL_PAGE.map((v, i) => (
            <m.button
              key={v.id}
              onClick={() => scrollToVariation(v.id)}
              className="group relative overflow-hidden rounded-xl border border-violet-500/[0.12] p-4 text-left transition-all duration-300 hover:border-violet-500/[0.25]"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.01) 100%)',
              }}
              custom={i + 10}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              whileHover={{
                y: -2,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
            >
              <span
                className="font-mono text-xs font-medium"
                style={{ color: '#8b5cf6' }}
              >
                {padNumber(i + 11)}
              </span>
              <h3 className="mt-1.5 text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                {v.name}
              </h3>
              <p
                className="mt-1 line-clamp-2 text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {v.desc}
              </p>
              <span
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ color: '#8b5cf6' }}
              >
                <PhEye size={12} weight="bold" />
                View Full
                <PhArrowRight size={10} weight="bold" />
              </span>
            </m.button>
          ))}
        </div>
      </header>

      {/* ── Full-size variations ── */}
      <div className="w-full">
        {VARIATIONS.map((v, i) => {
          const Component = v.component;
          return (
            <section key={v.id} id={`variation-${v.id}`} className="relative w-full">
              {/* Divider */}
              {i > 0 && (
                <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
                  <div
                    className="h-px w-full"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
                  />
                </div>
              )}

              {/* Label bar */}
              <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-6 md:px-8">
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: CYAN }}
                >
                  {padNumber(i + 1)}
                </span>
                <span
                  className="h-px flex-1 max-w-[40px]"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {v.name}
                </span>
                <span
                  className="hidden text-xs sm:inline"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  &mdash; {v.desc}
                </span>
              </div>

              {/* Full variation render */}
              <div className="relative w-full" style={{ minHeight: '100dvh' }}>
                <Component />
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Wave 2: Full-page variations ── */}
      <div className="w-full">
        {/* Wave 2 divider */}
        <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-8">
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }}
          />
          <p
            className="mt-6 text-center font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: '#8b5cf6' }}
          >
            Wave 2 — Full-Page Designs
          </p>
        </div>

        {FULL_PAGE.map((v, i) => {
          const Component = v.component;
          return (
            <section key={v.id} id={`variation-${v.id}`} className="relative w-full">
              {i > 0 && (
                <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
                  <div
                    className="h-px w-full"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)' }}
                  />
                </div>
              )}

              <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-6 md:px-8">
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: '#8b5cf6' }}
                >
                  {padNumber(i + 11)}
                </span>
                <span
                  className="h-px flex-1 max-w-[40px]"
                  style={{ background: 'rgba(139,92,246,0.2)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {v.name}
                </span>
                <span
                  className="hidden text-xs sm:inline"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  &mdash; {v.desc}
                </span>
              </div>

              <div className="relative w-full" style={{ minHeight: '100dvh' }}>
                <Component />
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-8">
        <div
          className="mx-auto mb-8 h-px w-full max-w-md"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        />
        <p
          className="font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Arcanea Design Arena &middot; 20 Variations &middot; 2 Waves
        </p>
      </footer>
    </div>
    </LazyMotion>
  );
}
