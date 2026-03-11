'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { PhArrowRight } from '@/lib/phosphor-icons';
import navLogo from '@/assets/brand/arcanea-mark.jpg';

/* ─────────────────────────────────────────────
   Variation 9 — "Motion Theater"
   Inspired by Framer / Rive / Award sites
   Scroll-driven experience: 200vh sticky reveal.
   Every pixel of scroll reveals something.
   ───────────────────────────────────────────── */

const CYAN = '#00bcd4';
const BG = '#09090b';
const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = 'Creative intelligence, specialized.';

const STATS: { value: string; label: string }[] = [
  { value: '10', label: 'Luminors' },
  { value: '34+', label: 'Texts' },
  { value: 'Free', label: 'To Start' },
];

/* Floating geometric shape data */
const SHAPES: {
  type: 'circle' | 'line';
  x: string;
  y: string;
  size: number;
  rotation: number;
}[] = [
  { type: 'circle', x: '15%', y: '20%', size: 60, rotation: 0 },
  { type: 'line', x: '75%', y: '15%', size: 120, rotation: 45 },
  { type: 'circle', x: '80%', y: '65%', size: 40, rotation: 0 },
  { type: 'line', x: '10%', y: '70%', size: 80, rotation: -30 },
  { type: 'circle', x: '50%', y: '85%', size: 50, rotation: 0 },
  { type: 'line', x: '35%', y: '30%', size: 100, rotation: 70 },
];

/* Dot positions around the brand mark (10 dots, evenly spaced) */
function getDotPosition(index: number, radius: number): { x: number; y: number } {
  const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function HeroMotionTheater() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  /* ── Scroll-linked transforms ── */

  // Brand mark: starts centered & large, shrinks and moves up
  const markScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.35], {
    ease: EASE as unknown as (t: number) => number,
  });
  const markY = useTransform(scrollYProgress, [0, 0.2], [0, -180]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0.6]);

  // Dot ring rotation & fade
  const ringRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [0.6, 0.4, 0]);
  const ringScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  // Headline: appears as mark moves up
  const headlineOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.15, 0.3], [40, 0]);

  // Stats: stagger in
  const stat0Opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const stat0X = useTransform(scrollYProgress, [0.35, 0.45], [-40, 0]);
  const stat1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const stat1Y = useTransform(scrollYProgress, [0.4, 0.5], [30, 0]);
  const stat2Opacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const stat2X = useTransform(scrollYProgress, [0.45, 0.55], [40, 0]);

  // CTA: scales up with bounce at end
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);

  // Background gradient mesh: slow drift
  const bgX = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  // Middle layer shapes: parallax
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Cursor blink for the typewriter effect
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCursorVisible(v > 0.15 && v < 0.55);
  });

  // Headline character reveal based on scroll
  const headlineProgress = useTransform(scrollYProgress, [0.18, 0.38], [0, 1]);
  const [visibleChars, setVisibleChars] = useState(0);
  useMotionValueEvent(headlineProgress, 'change', (v) => {
    setVisibleChars(Math.floor(v * HEADLINE.length));
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '200vh', backgroundColor: BG }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        {/* ── Layer 1: Background gradient mesh ── */}
        <motion.div
          className="absolute inset-0"
          style={{ x: bgX, y: bgY }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0,188,212,0.04) 0%, transparent 70%),
                radial-gradient(ellipse 60% 80% at 80% 70%, rgba(13,71,161,0.04) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,137,123,0.03) 0%, transparent 60%)
              `,
            }}
          />
        </motion.div>

        {/* ── Layer 2: Floating geometric shapes ── */}
        <motion.div
          className="absolute inset-0"
          style={{ y: shapeY }}
        >
          {SHAPES.map((shape, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: shape.x,
                top: shape.y,
                transform: `rotate(${shape.rotation}deg)`,
              }}
            >
              {shape.type === 'circle' ? (
                <div
                  className="rounded-full"
                  style={{
                    width: shape.size,
                    height: shape.size,
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: shape.size,
                    height: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Layer 3: Content ── */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6">
          {/* Brand mark with rotating dot ring */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              scale: markScale,
              y: markY,
              opacity: markOpacity,
            }}
          >
            {/* Rotating ring of dots */}
            <motion.div
              className="absolute"
              style={{
                width: 200,
                height: 200,
                rotate: ringRotation,
                opacity: ringOpacity,
                scale: ringScale,
              }}
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const pos = getDotPosition(i, 90);
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    }}
                  />
                );
              })}
            </motion.div>

            {/* Brand mark */}
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full">
              <Image
                src={navLogo}
                alt="Arcanea"
                fill
                className="object-cover"
                sizes="120px"
                priority
              />
            </div>
          </motion.div>

          {/* Headline: typewriter reveal */}
          <motion.div
            className="mt-12 text-center"
            style={{
              opacity: headlineOpacity,
              y: headlineY,
            }}
          >
            <h1
              className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              <span>{HEADLINE.slice(0, visibleChars)}</span>
              {cursorVisible && (
                <motion.span
                  className="ml-0.5 inline-block h-[1.1em] w-[3px] align-middle"
                  style={{ backgroundColor: CYAN }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'steps(2)',
                  }}
                />
              )}
            </h1>
          </motion.div>

          {/* Stats row */}
          <div className="mt-12 flex w-full max-w-md items-start justify-center gap-10 sm:gap-16">
            {STATS.map((stat, i) => {
              const opacities = [stat0Opacity, stat1Opacity, stat2Opacity];
              const transforms =
                i === 0
                  ? { x: stat0X }
                  : i === 1
                    ? { y: stat1Y }
                    : { x: stat2X };

              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  style={{
                    opacity: opacities[i],
                    ...transforms,
                  }}
                >
                  <p
                    className="font-display text-3xl font-bold sm:text-4xl"
                    style={{ color: CYAN }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-1 text-xs font-medium uppercase"
                    style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-14"
            style={{
              scale: ctaScale,
              opacity: ctaOpacity,
            }}
          >
            <a
              href="/create"
              className="group inline-flex items-center gap-2.5 rounded-lg px-8 py-4 text-base font-semibold text-black transition-opacity hover:opacity-90"
              style={{ backgroundColor: CYAN }}
            >
              Start creating
              <PhArrowRight
                size={18}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
