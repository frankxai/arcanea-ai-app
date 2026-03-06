"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import heroImage from "@/assets/brand/arcanea-hero.jpg";
import type { V3BelowFoldProps } from "./v3-below-fold";
import { HeroChangingWords } from "./hero-changing-words";
import { HeroMusicPlayer } from "./hero-music-player";
import { HeroChatBox } from "./hero-chat-box";

// ---------------------------------------------------------------------------
// Lazy-load all below-fold sections as a single dynamic chunk.
// The hero stays in the eager bundle for optimal LCP.
// ---------------------------------------------------------------------------

const V3BelowFold = dynamic(
  () => import("./v3-below-fold").then((mod) => mod.V3BelowFold),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-4 px-6 py-28">
        <div className="h-96 animate-pulse bg-white/[0.02] rounded-2xl" />
        <div className="h-80 animate-pulse bg-white/[0.02] rounded-2xl" />
      </div>
    ),
  },
);

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export function V3Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          src={navLogo}
          alt="Arcanea"
          width={48}
          height={48}
          className="rounded-xl mx-auto mb-6 opacity-40"
          priority
        />
        <div className="w-5 h-5 mx-auto rounded-full border-2 border-[#00bcd4]/35 border-t-[#00bcd4] animate-spin" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HERO — Full-Impact Brand Introduction
// ---------------------------------------------------------------------------

function HeroPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background: hero image + cosmic layering */}
      <div className="absolute inset-0 -z-20 bg-cosmic-deep">
        {/* Full-bleed hero image with parallax feel */}
        <Image
          src={heroImage}
          alt=""
          fill
          className="object-cover opacity-[0.35] mix-blend-soft-light brightness-75"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/60 via-cosmic-deep/40 to-cosmic-deep/80" />
        {/* Peacock aurora — top center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,188,212,0.15),transparent_55%)]" />
        {/* Ultramarine nebula — bottom right */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_75%,rgba(13,71,161,0.10),transparent_50%)]" />
        {/* Deep teal warmth — bottom left */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,rgba(0,137,123,0.08),transparent_50%)]" />
        {/* Deep vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(9,9,11,0.7)_75%)]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glass noise texture overlay */}
      <div className="absolute inset-0 -z-5 glass-noise opacity-[0.3] pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto px-6 py-24 md:py-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Floating Music Player */}
        <motion.div 
          className="absolute top-0 right-6 hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <HeroMusicPlayer />
        </motion.div>

        <div className="flex flex-col items-center text-center">
          {/* Brand Mark with iridescent glass frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-14 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,188,212,0.08) 0%, rgba(13,71,161,0.06) 40%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner iridescent shimmer */}
            <motion.div
              className="absolute -inset-3 rounded-2xl pointer-events-none"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(0,188,212,0.12) 0%, rgba(13,71,161,0.10) 50%, rgba(0,137,123,0.06) 100%)",
                  "linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(0,188,212,0.12) 50%, rgba(13,71,161,0.10) 100%)",
                  "linear-gradient(135deg, rgba(0,188,212,0.12) 0%, rgba(13,71,161,0.10) 50%, rgba(0,137,123,0.06) 100%)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <Image
              src={navLogo}
              alt="Arcanea"
              width={96}
              height={96}
              className="relative z-10 rounded-2xl ring-1 ring-white/[0.15] shadow-[0_8px_40px_rgba(0,188,212,0.15),0_2px_16px_rgba(0,0,0,0.4)] w-20 h-20 md:w-24 md:h-24"
              priority
            />
          </motion.div>

          {/* Wordmark */}
          <motion.p
            className="text-[11px] md:text-xs font-mono tracking-[0.5em] uppercase text-white/25 mb-10 md:mb-14"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Arcanea
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-[clamp(2.75rem,7vw,6.5rem)] font-display font-bold tracking-[-0.04em] leading-[0.9] mb-6 md:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="text-white">Create your</span>
            <br />
            <HeroChangingWords />

          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-white/50 leading-relaxed mb-10 md:mb-12 font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Describe your vision. Arcanea&apos;s AI specialists will help you
            build worlds, write stories, design characters, and shape your
            creative universe.
          </motion.p>

          {/* Chat-first Hero Input */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <HeroChatBox />
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="mt-14 md:mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/20 uppercase tracking-wider font-mono"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span>Free to start</span>
            <span className="hidden sm:inline text-white/8">|</span>
            <span>No credit card</span>
            <span className="hidden sm:inline text-white/8">|</span>
            <span>34+ texts of practical wisdom</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 md:mt-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-[10px] text-white/15 uppercase tracking-[0.3em] font-mono">
                Scroll
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main V3 Content
// ---------------------------------------------------------------------------

export function V3Content({
  collectionsCount,
  textsCount,
  totalWords,
}: V3BelowFoldProps) {
  return (
    <>
      <HeroPortal />
      <V3BelowFold
        collectionsCount={collectionsCount}
        textsCount={textsCount}
        totalWords={totalWords}
      />
    </>
  );
}
