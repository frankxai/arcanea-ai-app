'use client';

import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhArrowRight,
  PhSparkle,
  PhLightning,
} from '@/lib/phosphor-icons';
import heroCrystal from '@/assets/brand/arcanea-crystal.jpg';

import { TEAMS, WISDOMS } from './luminors-data';
import { LUMINORS } from './luminors-roster';
import { AmbientOrb, RotatingPhrase } from './luminors-hero';
import { LuminorPortrait } from './luminor-portrait';
import { TeamSection } from './luminor-team-section';
import { PipelineSection } from './luminors-pipeline';

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPERIENCE
// ══════════════════════════════════════════════════════════════════════════════

export function LuminorsExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 80 : 200],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.8 : 0.6],
    [1, 0],
  );
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePos.x, { stiffness: 40, damping: 25 });
  const springY = useSpring(mousePos.y, { stiffness: 40, damping: 25 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX - innerWidth / 2) / 50,
      y: (e.clientY - innerHeight / 2) / 50,
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('mousemove', handleMouseMove);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [handleMouseMove]);

  // Section refs
  const wisdomRef = useRef<HTMLElement>(null);
  const wisdomInView = useInView(wisdomRef, { once: true });

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO — Full-bleed parallax with rotating phrases
        ════════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <m.div className="absolute inset-0 -z-20" style={{ scale: bgScale }}>
            <Image
              src={heroCrystal}
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/70 via-cosmic-deep/50 to-cosmic-deep" />
            <div className="absolute inset-0 bg-gradient-to-br from-creation-prism-purple/10 via-transparent to-atlantean-teal-aqua/8" />
          </m.div>

          {/* Mouse-tracking aurora */}
          <m.div
            className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
            style={{ x: springX, y: springY }}
          >
            <AmbientOrb
              size={500}
              color="rgba(139,92,246,0.12)"
              position="top-[15%] left-[10%]"
              delay={0}
            />
            <AmbientOrb
              size={400}
              color="rgba(0,188,212,0.08)"
              position="bottom-[20%] right-[15%]"
              delay={3}
            />
            <AmbientOrb
              size={300}
              color="rgba(245,158,11,0.06)"
              position="top-[60%] right-[30%]"
              delay={6}
            />
          </m.div>

          {/* Content */}
          <m.div
            className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Badge */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full liquid-glass border border-white/[0.06] mb-8 md:mb-10">
                  <PhSparkle className="w-3.5 h-3.5 text-creation-prism-purple" />
                  <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">
                    Luminor Intelligence System
                  </span>
                  <m.span
                    className="w-1.5 h-1.5 rounded-full bg-creation-prism-purple"
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </m.div>

              {/* Rotating headline */}
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1
                  className="text-[clamp(2.5rem,7vw,6.5rem)] font-display font-bold tracking-tight leading-[0.95] mb-6 md:mb-8"
                  aria-live="polite"
                >
                  <RotatingPhrase />
                </h1>
              </m.div>

              {/* Sub */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="max-w-2xl mx-auto mb-10 md:mb-14"
              >
                <p className="text-base sm:text-lg md:text-xl text-white/[0.55] leading-relaxed font-light">
                  Each has opened all Ten Gates. Each channels a Wisdom.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white/[0.75] mt-1.5 font-normal">
                  They don&apos;t wait for instructions &mdash; they see what
                  you&apos;re creating and help you build it better.
                </p>
              </m.div>

              {/* Stats row */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
              >
                {[
                  { value: '16', label: 'Luminors', color: '#8b5cf6' },
                  { value: '7', label: 'Wisdoms', color: '#ffd700' },
                  { value: '4', label: 'Teams', color: '#00bcd4' },
                  { value: '10', label: 'Gates Opened', color: '#ec4899' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p
                      className="text-3xl md:text-4xl font-display font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </m.div>

              {/* CTA */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link
                  href="/chat"
                  className="group relative px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden btn-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple to-atlantean-teal-aqua" />
                  <m.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 text-white flex items-center justify-center gap-2">
                    Start a Conversation
                    <PhArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <a
                  href="#gallery"
                  className="px-10 py-4 rounded-2xl liquid-glass border border-white/[0.06] hover:border-creation-prism-purple/30 hover:bg-white/[0.04] transition-all duration-300 text-white font-semibold text-lg"
                >
                  Meet the Intelligences
                </a>
              </m.div>
            </div>
          </m.div>

          {/* Scroll indicator */}
          <m.div
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <m.button
              type="button"
              aria-label="Scroll down"
              className="flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creation-prism-purple rounded-md"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
              }
            >
              <span className="text-[10px] text-white/[0.30] uppercase tracking-[0.3em]">
                Discover
              </span>
              <div className="w-6 h-9 rounded-full border border-white/[0.12] flex items-start justify-center pt-2">
                <m.div
                  className="w-1 h-1 rounded-full bg-creation-prism-purple/70"
                  animate={{ y: [0, 12, 0], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
            </m.button>
          </m.div>
        </section>

        {/* THE MYTHOLOGY PIPELINE — Gates → Guardians → Wisdoms → Luminors */}
        <PipelineSection />

        {/* ═══════════════════════════════════════════════════════════════════
            HORIZONTAL SCROLL GALLERY — all 16 Luminors
        ════════════════════════════════════════════════════════════════════ */}
        <section id="gallery" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-cosmic-deep" />
            <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple/3 via-transparent to-atlantean-teal-aqua/3" />
          </div>

          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-creation-prism-purple/80 mb-3">
                  All 16 Luminors
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
                  Sixteen creative intelligences
                </h2>
              </div>
              <Link
                href="/chat"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-creation-prism-purple hover:text-atlantean-teal-aqua transition-colors"
              >
                Start a conversation
                <PhArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Scrollable gallery */}
            <div className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-hide">
              {LUMINORS.map((luminor) => (
                <LuminorPortrait key={luminor.id} luminor={luminor} />
              ))}
            </div>

            {/* Edge fades */}
            <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
          </div>

          {/* Mobile link */}
          <div className="max-w-7xl mx-auto px-6 mt-6 sm:hidden">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-sm text-creation-prism-purple"
            >
              Start a conversation
              <PhArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            TEAM SECTIONS — image-first cards with rich detail
        ════════════════════════════════════════════════════════════════════ */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
          {Object.keys(TEAMS).map((teamKey, i) => (
            <TeamSection key={teamKey} teamKey={teamKey} index={i} />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SEVEN WISDOMS — constellation visualization
        ════════════════════════════════════════════════════════════════════ */}
        <section ref={wisdomRef} className="py-28 relative">
          <div className="absolute inset-0 -z-10 bg-cosmic-deep" />

          <div className="max-w-7xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={wisdomInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
                <PhLightning className="w-3 h-3 text-gold-bright" />
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
                  The Seven Wisdoms
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
                Seven lenses for creative mastery
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto text-lg">
                Each Luminor channels one Wisdom as their core strength and
                guiding philosophy.
              </p>
            </m.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {Object.entries(WISDOMS).map(([name, w], i) => {
                const count = LUMINORS.filter((l) => l.wisdom === name).length;
                const channelers = LUMINORS.filter((l) => l.wisdom === name)
                  .map((l) => l.name)
                  .join(', ');

                return (
                  <m.div
                    key={name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={wisdomInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                    className="liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center hover-lift transition-all group"
                  >
                    {/* Glowing orb */}
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle, ${w.color}40, ${w.color}10)`,
                        boxShadow: `0 0 20px ${w.color}25`,
                      }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: w.color }}
                      />
                    </div>

                    <h3
                      className="font-display font-semibold text-sm mb-1"
                      style={{ color: w.color }}
                    >
                      {name}
                    </h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">
                      {w.essence}
                    </p>
                    <p className="text-[10px] text-text-secondary leading-relaxed mb-2">
                      {w.description}
                    </p>
                    <p className="text-[9px] text-text-muted">
                      {count} Luminor{count > 1 ? 's' : ''}
                    </p>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PHILOSOPHY QUOTE
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="liquid-glass rounded-3xl p-12 md:p-16 border border-white/[0.06]">
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display italic text-text-secondary leading-relaxed">
                &ldquo;A Luminor is not an assistant. It is a partner who has
                already walked the path you are beginning — and remembers every
                step.&rdquo;
              </blockquote>
              <cite className="block mt-8 text-xs text-text-muted font-mono tracking-[0.2em] not-italic uppercase">
                The Academy Handbook
              </cite>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CTA — Gradient border, elevated glass
        ════════════════════════════════════════════════════════════════════ */}
        <section className="pb-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="gradient-border">
              <div className="liquid-glass-elevated rounded-[calc(1.5rem-1px)] p-10 md:p-14 text-center relative overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-creation-prism-purple/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-atlantean-teal-aqua/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-bright/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl liquid-glass mx-auto mb-6 flex items-center justify-center">
                    <PhSparkle className="w-7 h-7 text-gold-bright" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                    Ready to work with a Luminor?
                  </h2>
                  <p className="text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
                    Start a conversation with any of the 16 Luminors. They&apos;ll
                    bring the accumulated wisdom of all Ten Gates to your creative
                    work.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/chat"
                      className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple to-atlantean-teal-aqua" />
                      <span className="relative z-10 text-white flex items-center gap-2">
                        Start a Conversation
                        <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <Link
                      href="/academy"
                      className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                    >
                      Enter the Academy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
