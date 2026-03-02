"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, CircleNotch } from "@/lib/phosphor-icons";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import type { V3BelowFoldProps } from "./v3-below-fold";

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
        <CircleNotch className="w-5 h-5 text-atlantean-teal-aqua animate-spin mx-auto" />
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

  useEffect(() => { setIsLoaded(true); }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background: multi-layer gradient mesh */}
      <div className="absolute inset-0 -z-20 bg-cosmic-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(127,255,212,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(255,215,0,0.03),transparent_50%)]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative w-full max-w-4xl mx-auto px-6 py-24 md:py-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Brand Mark — the REAL logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            <motion.div
              className="absolute -inset-10 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(127,255,212,0.12) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Image
              src={navLogo}
              alt="Arcanea"
              width={80}
              height={80}
              className="relative z-10 rounded-2xl ring-1 ring-white/[0.12] shadow-2xl shadow-atlantean-teal-aqua/10 w-16 h-16 md:w-20 md:h-20"
              priority
            />
          </motion.div>

          {/* Wordmark */}
          <motion.p
            className="text-[11px] md:text-xs font-mono tracking-[0.4em] uppercase text-white/40 mb-10 md:mb-14"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Arcanea
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-[clamp(2.2rem,6vw,5.5rem)] font-display font-bold tracking-tight leading-[1.05] mb-6 md:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="text-white">Living Intelligence</span>
            <br />
            <span className="bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright bg-clip-text text-transparent">
              for Creators
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-white/50 leading-relaxed mb-12 md:mb-16 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Ten archetypal intelligences. An original philosophy library.
            A framework for the creative life.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link
              href="/chat"
              className="group relative w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 text-cosmic-deep flex items-center justify-center gap-2">
                Start Creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" weight="bold" />
              </span>
            </Link>
            <Link
              href="/library"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all duration-300 text-white/80 hover:text-white font-medium text-base text-center"
            >
              Explore the Library
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="mt-14 md:mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/20 uppercase tracking-wider font-mono"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span>Free to start</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>No credit card</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>34+ original texts</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          type="button"
          aria-label="Scroll to explore"
          className="flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal-aqua/50 rounded-md px-2 py-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/[0.10] flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-1 rounded-full bg-white/30"
              animate={{ y: [0, 10, 0], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.button>
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
