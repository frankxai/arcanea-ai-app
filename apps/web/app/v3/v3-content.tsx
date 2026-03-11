"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import type { V3BelowFoldProps } from "./v3-below-fold";
import { HeroChangingWords } from "./hero-changing-words";
import { HeroChatBox } from "./hero-chat-box";

// ---------------------------------------------------------------------------
// Lazy-load all below-fold sections as a single dynamic chunk.
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
// HERO — Minimal, Chat-First, Premium
// ---------------------------------------------------------------------------

function HeroPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background: pure dark with subtle aurora — no hero image */}
      <div className="absolute inset-0 -z-20 bg-[#09090b]">
        {/* Single soft aurora bloom — top center */}
        <m.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,188,212,0.07) 0%, transparent 60%)",
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,137,123,0.06) 0%, transparent 60%)",
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(13,71,161,0.05) 0%, transparent 60%)",
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,188,212,0.07) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle bottom warmth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_100%,rgba(0,188,212,0.03),transparent_60%)]" />
      </div>

      {/* Fine grid — barely visible texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <m.div
        className="relative w-full max-w-3xl mx-auto px-6"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Brand mark — small, elegant, no glow rings */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 md:mb-14"
          >
            <Image
              src={navLogo}
              alt="Arcanea"
              width={56}
              height={56}
              className="rounded-xl ring-1 ring-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              priority
            />
          </m.div>

          {/* Headline — clean, large, confident */}
          <m.h1
            className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold tracking-[-0.035em] leading-[1.05] mb-4 md:mb-5"
            initial={{ opacity: 0, y: 24 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-white">What will you </span>
            <HeroChangingWords />
          </m.h1>

          {/* Subtitle — one line, restrained */}
          <m.p
            className="max-w-lg mx-auto text-base md:text-lg text-white/40 leading-relaxed mb-12 md:mb-14 font-body"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Write stories. Compose music. Design worlds. Build apps.
            AI partners that create with you.
          </m.p>

          {/* Chat box — THE hero element */}
          <m.div
            className="w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <HeroChatBox />
          </m.div>

          {/* Minimal trust line */}
          <m.p
            className="mt-10 md:mt-14 text-[11px] text-white/15 font-mono tracking-wider"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Free to use &middot; No signup required &middot; Open source &middot; Built with Next.js &amp; Vercel AI SDK
          </m.p>
        </div>
      </m.div>

      {/* Scroll fade — bottom edge dissolves into below-fold */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
    </section>
    </LazyMotion>
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
