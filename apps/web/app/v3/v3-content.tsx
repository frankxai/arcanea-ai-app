"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import type { V3BelowFoldProps } from "./v3-below-fold";
import { HeroChangingWords } from "./hero-changing-words";
import { HeroShowcase } from "./hero-showcase";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { FloatingOrbs } from "@/components/premium/animated-background";
import { SovereigntyBadge } from "@/components/premium/sovereignty-pillars";
import { NumberTicker } from "@/components/motion/number-ticker";

// ---------------------------------------------------------------------------
// Lazy-load the chat box — it pulls in useRouter + phosphor icons which are
// not needed until the user interacts. Deferring them trims ~15-20 kB from
// the initial JS that blocks LCP.
// ---------------------------------------------------------------------------

const HeroChatBox = dynamic(
  () => import("./hero-chat-box").then((mod) => mod.HeroChatBox),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto">
        <div className="h-14 rounded-2xl bg-white/[0.025] animate-pulse" />
        <div className="flex justify-center gap-2 mt-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      </div>
    ),
  },
);

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
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-[100svh] flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-xl mx-auto mb-12 bg-white/[0.04] animate-pulse" />
          <div className="h-12 md:h-16 w-3/4 mx-auto rounded-lg bg-white/[0.03] animate-pulse mb-5" />
          <div className="h-5 w-2/3 mx-auto rounded bg-white/[0.02] animate-pulse mb-14" />
          <div className="h-14 w-full max-w-2xl mx-auto rounded-2xl bg-white/[0.025] animate-pulse" />
          <div className="flex justify-center gap-2 mt-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-28 rounded-full bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      {/* Below-fold skeleton */}
      <div className="w-full space-y-4 px-6 py-28">
        <div className="h-96 animate-pulse bg-white/[0.02] rounded-2xl" />
        <div className="h-80 animate-pulse bg-white/[0.02] rounded-2xl" />
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
      {/* Background: pure dark with FloatingOrbs aurora */}
      <div className="absolute inset-0 -z-20 bg-[#09090b]">
        <FloatingOrbs preset="aurora" />
        {/* Subtle bottom warmth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_100%,rgba(0,188,212,0.03),transparent_60%)]" />

        {/* Guardian portrait accents — visible only on xl screens, low opacity */}
        <div
          className="hidden xl:block absolute left-0 top-0 bottom-0 w-[340px] pointer-events-none"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.55) 70%, transparent 100%)" }}
        >
          <Image
            src="/guardians/v3/lyria-hero-v3.webp"
            alt="Lyria — Sight Gate Guardian"
            fill
            sizes="340px"
            className="object-cover object-top opacity-[0.18] mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b]" />
        </div>
        <div
          className="hidden xl:block absolute right-0 top-0 bottom-0 w-[340px] pointer-events-none"
          style={{ maskImage: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.55) 70%, transparent 100%)" }}
        >
          <Image
            src="/guardians/v3/shinkami-hero-v3.webp"
            alt="Shinkami — Source Gate Guardian"
            fill
            sizes="340px"
            className="object-cover object-top opacity-[0.18] mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#09090b] via-transparent to-[#09090b]" />
        </div>
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
            className="mb-7 md:mb-9"
          >
            <div className="relative">
              <div className="absolute inset-[-12px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.12)_0%,rgba(255,215,0,0.04)_50%,transparent_70%)] blur-md animate-[breathe_3s_ease-in-out_infinite]" />
              <Image
                src="/images/mascot/arcanea-primary.png"
                alt="Arcanea"
                width={88}
                height={88}
                className="relative drop-shadow-[0_4px_24px_rgba(127,255,212,0.2)] animate-[mascot-float_3s_ease-in-out_infinite]"
                priority
              />
            </div>
          </m.div>

          {/* Sovereignty badge — positioning pill */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-6"
          >
            <SovereigntyBadge />
          </m.div>

          {/* Headline — clean, large, confident */}
          <h1 className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-display font-bold tracking-[-0.035em] leading-[1.08] mb-4 md:mb-5">
            <SplitText
              as="span"
              text="What will you "
              className="text-white"
              delay={0.1}
              stagger={0.025}
            />
            <HeroChangingWords />
          </h1>

          {/* Subtitle — concrete value, leads with what you get */}
          <m.p
            className="max-w-xl mx-auto text-base md:text-lg text-white/50 leading-relaxed mb-3 font-body"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Type one sentence. Get a world — characters, locations, lore, music — all connected, all yours.
          </m.p>

          {/* Secondary clarifier — who it&apos;s for */}
          <m.p
            className="max-w-md mx-auto text-sm text-white/30 leading-relaxed mb-10 md:mb-12 font-body"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            16 specialist AI partners &middot; the Living Worlds engine &middot; open source
          </m.p>

          {/* Trust signals — glass pill badges with animated numbers */}
          <m.div
            className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12 md:mb-14"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { icon: "✦", num: 16, suffix: "", label: "specialist AI partners", color: "#00bcd4" },
              { icon: "◈", num: 190, suffix: "K+", label: "words of craft", color: "#7fffd4" },
              { icon: "⌥", num: 27, suffix: "", label: "open-source repos", color: "#ffd700" },
              { icon: "◎", num: 0, suffix: "MIT", label: "forkable", color: "#c084fc", fixed: true },
            ].map(({ icon, num, suffix, label, color, fixed }, i) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm hover:border-white/[0.15] transition-colors"
              >
                <span className="text-[10px]" style={{ color: `${color}99` }}>{icon}</span>
                <span className="text-[11px] font-display font-semibold text-white/55">
                  {fixed ? suffix : <NumberTicker value={num} suffix={suffix} delay={0.4 + i * 0.1} />}
                </span>
                <span className="text-[10px] text-white/30 font-mono">{label}</span>
              </div>
            ))}
          </m.div>

          {/* Chat box — THE hero element */}
          <m.div
            className="w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <HeroChatBox />
          </m.div>

          {/* Trust line — sovereignty promise */}
          <m.div
            className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {[
              { label: "Keep your keys", color: "#7fffd4" },
              { label: "Keep your IP", color: "#00bcd4" },
              { label: "Open source (MIT)", color: "#ffd700" },
              { label: "No vendor lock-in", color: "#c084fc" },
            ].map(({ label, color }, i) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider"
              >
                {i > 0 && <span className="text-white/10">/</span>}
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: `${color}80` }}
                />
                <span className="text-white/35">{label}</span>
              </span>
            ))}
          </m.div>
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

      {/* Gradient line separator — teal center glow */}
      <div className="relative h-px mx-6 md:mx-auto md:max-w-4xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,188,212,0.12), transparent 70%)" }}
        />
      </div>

      <HeroShowcase />
      <V3BelowFold
        collectionsCount={collectionsCount}
        textsCount={textsCount}
        totalWords={totalWords}
      />
    </>
  );
}
