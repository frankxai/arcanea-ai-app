/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import type { V3BelowFoldProps } from "./v3-below-fold";
import { HeroShowcase } from "./hero-showcase";
import { WorldSeedExperience } from "./world-seed-experience";
import { SovereigntyBadge } from "@/components/premium/sovereignty-pillars";
import { NumberTicker } from "@/components/motion/number-ticker";
import { FACTS } from "@/lib/facts";
import { Sparkle, Diamond, Code, ShieldStar } from "@/lib/phosphor-icons";
import { PUBLIC_REPO_SUMMARY } from "@/lib/public-repo-registry";

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
  const reducedMotion = useReducedMotion();
  const prefersReduced = !isLoaded || !!reducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden py-14 md:py-20"
      style={{ minHeight: "calc(92svh - var(--nav-h, 64px))" }}
    >
      {/* Background: premium Arcanea production chamber media */}
      <div className="absolute inset-0 z-0 bg-[var(--arc-cosmic-void)]">
        <Image
          src="/brand/arcanea-dashboard-hero-premium.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_42%] opacity-95"
        />
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/brand/arcanea-dashboard-hero-premium.png"
          className="absolute inset-0 hidden h-full w-full object-cover object-[50%_42%] opacity-95 motion-safe:block"
        >
          <source src="/brand/arcanea-dashboard-hero-premium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_82%_52%_at_50%_42%,transparent_0%,color-mix(in_srgb,var(--arc-cosmic-void)_24%,transparent)_58%,var(--arc-cosmic-void)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)]/28 via-[var(--arc-cosmic-void)]/38 to-[var(--arc-cosmic-void)]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-cosmic-void)]/82 via-transparent to-[var(--arc-cosmic-void)]/82" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_46%_44%_at_50%_53%,color-mix(in_srgb,var(--arc-cosmic-void)_78%,transparent)_0%,color-mix(in_srgb,var(--arc-cosmic-void)_52%,transparent)_48%,transparent_74%)] md:block" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_82%_70%_at_50%_52%,color-mix(in_srgb,var(--arc-cosmic-void)_82%,transparent)_0%,color-mix(in_srgb,var(--arc-cosmic-void)_58%,transparent)_52%,transparent_82%)] md:hidden" />
        <div className="absolute left-1/2 top-[12%] h-px w-[min(720px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/38 to-transparent" />
      </div>

      {/* Fine grid — barely visible texture */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--arc-text-primary) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--arc-text-primary) 30%, transparent) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <m.div
        className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-6"
        style={prefersReduced ? { y: 0, opacity: 1 } : { y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Canonical brand mark */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 md:mb-8"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_14px_60px_color-mix(in_srgb,var(--arc-cosmic-void)_70%,transparent)] backdrop-blur-xl md:h-16 md:w-16">
              <Image
                src={navLogo}
                alt="Arcanea"
                width={44}
                height={44}
                sizes="44px"
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </m.div>

          {/* Headline */}
          <m.h1
            className="text-[clamp(2.25rem,5.1vw,4.45rem)] font-display font-bold tracking-[-0.025em] leading-[1.04] mb-4 md:mb-5 text-white"
            initial={{ opacity: 0, y: 18 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">Build living worlds</span>
            <span className="block">with AI agents.</span>
          </m.h1>

          {/* Value prop */}
          <m.p
            className="max-w-2xl mx-auto text-base md:text-lg text-white/55 leading-relaxed mb-5 md:mb-9 font-body"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            Turn one idea into a persistent world graph: lore, characters, rules, media briefs, and agent tasks stay connected across sessions.
          </m.p>

          {/* Chat box */}
          <m.div
            className="w-full mb-5 md:mb-9"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22 }}
          >
            <HeroChatBox />
          </m.div>

          {/* Trust signals */}
          <m.div
            className="flex w-full max-w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible md:gap-3 [&::-webkit-scrollbar]:hidden"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { Icon: ShieldStar, num: 0, suffix: "MIT", label: "open source", color: "var(--arc-void)", fixed: true },
            ].map(({ Icon, num, suffix, label, color, fixed }, i) => (
              <div
                key={label}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm transition-colors hover:border-white/[0.15]"
              >
                <Icon size={11} weight="duotone" color={color} className="opacity-70" />
                <span className="text-[11px] font-display font-semibold text-white/55">
                  {fixed ? (num > 0 ? `${num}${suffix}` : suffix || num) : <NumberTicker value={num} suffix={suffix} delay={0.36 + i * 0.08} />}
                </span>
                <span className="text-[10px] text-white/34 font-body">{label}</span>
              </div>
            ))}
          </m.div>

          <m.div
            className="mt-4 flex flex-col items-center justify-center gap-2 text-[11px] text-white/35 sm:flex-row md:mt-5 md:gap-3"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.42 }}
          >
            <SovereigntyBadge />
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span className="font-body">BYOK / your IP / no lock-in</span>
          </m.div>

          <m.div
            className="mt-6 hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2 backdrop-blur-md md:inline-flex"
            initial={{ opacity: 0, y: 8 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.48 }}
          >
            <Image
              src="/images/mascot/arcanea-welcoming.png"
              alt=""
              width={28}
              height={28}
              sizes="28px"
              className="object-contain"
            />
            <span className="text-[11px] text-white/35">Lumina routes the first brief to the right creation agents.</span>
          </m.div>
        </div>
      </m.div>

      {/* Scroll fade — bottom edge dissolves into below-fold */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--arc-cosmic-void)] to-transparent pointer-events-none" />
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
    <div className="overflow-x-clip">
      <WorldSeedExperience />
      <V3BelowFold
        collectionsCount={collectionsCount}
        textsCount={textsCount}
        totalWords={totalWords}
      />
    </div>
  );
}
