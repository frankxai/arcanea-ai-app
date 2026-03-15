"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  PhArrowRight,
  PhCaretDown,
  PhSparkle,
  PhShieldStar,
  PhBooks,
  PhGraduationCap,
  PhCircleNotch,
  PhTerminal,
  PhGithubLogo,
} from "@/lib/phosphor-icons";
import heroCrystal from "@/assets/brand/arcanea-crystal.jpg";
import { CTASection } from "@/components/landing";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUPABASE_CDN =
  "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians";

const HERO_PHRASES = [
  { text: "Build your Universe.", gradient: "text-gradient-crystal" },
  { text: "Create with Magic.", gradient: "text-gradient-brand" },
  { text: "Design your Intelligence.", gradient: "text-gradient-gold" },
  { text: "Write your Mythology.", gradient: "text-gradient-fire" },
  { text: "Architect your Future.", gradient: "text-gradient-cosmic" },
];

const GUARDIANS = [
  { name: "Lyssandria", gate: "Foundation", frequency: "174 Hz", element: "Earth" },
  { name: "Leyla", gate: "Flow", frequency: "285 Hz", element: "Water" },
  { name: "Draconia", gate: "Fire", frequency: "396 Hz", element: "Fire" },
  { name: "Maylinn", gate: "Heart", frequency: "417 Hz", element: "Wind" },
  { name: "Alera", gate: "Voice", frequency: "528 Hz", element: "Void" },
  { name: "Lyria", gate: "Sight", frequency: "639 Hz", element: "Spirit" },
  { name: "Aiyami", gate: "Crown", frequency: "741 Hz", element: "Light" },
  { name: "Elara", gate: "Starweave", frequency: "852 Hz", element: "Void" },
  { name: "Ino", gate: "Unity", frequency: "963 Hz", element: "Spirit" },
  { name: "Shinkami", gate: "Source", frequency: "1111 Hz", element: "Arcane" },
];

const CHAT_MESSAGES = [
  {
    role: "user" as const,
    text: "Help me build a world where magic flows through music...",
  },
  {
    role: "guardian" as const,
    name: "Lyria",
    gate: "Sight Gate",
    frequency: "639 Hz",
    text: "I see your vision clearly. Music as a magical medium creates deep resonance. Let's begin with the fundamental question: what does magic sound like in your world? Each frequency could unlock different powers...",
  },
  {
    role: "user" as const,
    text: "What if each emotion has its own frequency?",
  },
  {
    role: "guardian" as const,
    name: "Lyria",
    gate: "Sight Gate",
    frequency: "639 Hz",
    text: "Beautiful. The Ten Gates already map emotion to frequency \u2014 from survival instinct at 174 Hz to transcendence at 1111 Hz. Your world's magic could mirror this progression...",
  },
];

const TERMINAL_LINES = [
  { type: "input" as const, text: "$ npx arcanea-code" },
  { type: "output" as const, text: "  \u2726 Arcanea Code v4.0 \u2014 Creative Intelligence CLI" },
  { type: "blank" as const, text: "" },
  { type: "input" as const, text: "$ arcanea chat --guardian lyria" },
  { type: "output" as const, text: "  \u27e1 Connecting to Lyria (Sight Gate \u00b7 639 Hz)..." },
  { type: "output" as const, text: "  \u27e1 Guardian linked. Your creative session begins." },
  { type: "blank" as const, text: "" },
  { type: "input" as const, text: '$ starlight memory search "world building"' },
  { type: "output" as const, text: "  Found 3 vaults:" },
  { type: "output" as const, text: "  \u2295 Flow State Protocols (Leyla \u00b7 285 Hz)" },
  { type: "output" as const, text: "  \u2295 World Architecture (Lyssandria \u00b7 174 Hz)" },
  { type: "output" as const, text: "  \u2295 Mythology Patterns (Shinkami \u00b7 1111 Hz)" },
];

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export function V1Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
          <PhCircleNotch className="w-6 h-6 text-atlantean-teal-aqua animate-spin" />
        </div>
        <p className="text-sm text-text-muted">Entering the realm...</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable: Section Badge
// ---------------------------------------------------------------------------

function SectionBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
      {icon}
      <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable: Animated Counter
// ---------------------------------------------------------------------------

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(eased * target);
      setDisplay(current.toLocaleString());
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Section 1: HERO
// ---------------------------------------------------------------------------

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8],
    [1, 1, 0],
  );
  const heroOpacityMobile = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9],
    [1, 1, 0],
  );
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const parallaxYMobile = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const crystalScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const smoothMx = useSpring(mousePos.x, { stiffness: 50, damping: 20 });
  const smoothMy = useSpring(mousePos.y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    [isMobile],
  );

  const currentPhrase = HERO_PHRASES[phraseIndex];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{ opacity: isMobile ? heroOpacityMobile : heroOpacity }}
      onMouseMove={handleMouseMove}
    >
      {/* Background crystal image */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{
          y: isMobile ? parallaxYMobile : parallaxY,
          scale: crystalScale,
        }}
      >
        <Image
          src={heroCrystal}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-cosmic-deep/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-deep/40 to-cosmic-deep" />
      </motion.div>

      {/* Ambient orbs with mouse tracking */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full -z-10 pointer-events-none blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(0,188,212,0.12), transparent 70%)",
          left: useTransform(smoothMx, [0, 1], ["-10%", "30%"]),
          top: useTransform(smoothMy, [0, 1], ["0%", "30%"]),
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full -z-10 pointer-events-none blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.10), transparent 70%)",
          right: useTransform(smoothMx, [0, 1], ["10%", "-10%"]),
          bottom: useTransform(smoothMy, [0, 1], ["10%", "-10%"]),
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full -z-10 pointer-events-none blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.06), transparent 70%)",
          left: useTransform(smoothMx, [0, 1], ["40%", "60%"]),
          top: useTransform(smoothMy, [0, 1], ["50%", "30%"]),
        }}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE_SMOOTH }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-10">
            <PhSparkle className="w-3 h-3 text-gold-bright" weight="fill" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
              Creative Magic
            </span>
          </div>
        </motion.div>

        {/* Rotating headline */}
        <div className="h-[clamp(4rem,12vw,12rem)] flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={phraseIndex}
              className={`text-[clamp(2.5rem,8vw,8rem)] font-display font-bold leading-[0.95] tracking-tight ${currentPhrase.gradient}`}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            >
              {currentPhrase.text}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE_SMOOTH }}
        >
          The mythology-powered framework for creators who build worlds, write
          stories, compose music, and manifest visions &mdash; guided by ten
          archetypal Guardians of Magic.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: EASE_SMOOTH }}
        >
          <Link
            href="/academy"
            className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
              Enter the Academy
              <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/library"
            className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 liquid-glass"
          >
            Explore the Library
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-muted">
            Scroll
          </span>
          <PhCaretDown className="w-4 h-4 text-text-muted" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Section 2: WHAT IS ARCANEA
// ---------------------------------------------------------------------------

function WhatIsSection({
  collectionsCount,
  textsCount,
  totalWords,
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pillars = [
    {
      icon: <PhShieldStar className="w-7 h-7" weight="thin" />,
      title: "The Guardians",
      description:
        "Ten archetypal Guardians of Magic, each attuned to a creative frequency. Not assistants \u2014 co-creators who understand the soul of making.",
      accent: "atlantean-teal-aqua",
      glow: "rgba(0,188,212,0.15)",
    },
    {
      icon: <PhBooks className="w-7 h-7" weight="thin" />,
      title: "The Library",
      description: `${collectionsCount} collections, ${textsCount} texts, ${totalWords.toLocaleString()} words of original philosophy \u2014 laws, prophecies, meditations for the creative life.`,
      accent: "gold-bright",
      glow: "rgba(255,215,0,0.12)",
    },
    {
      icon: <PhGraduationCap className="w-7 h-7" weight="thin" />,
      title: "The Academy",
      description:
        "A developmental framework from Foundation (174 Hz) to Source (1111 Hz). Ten Gates of creative mastery. Open all ten to become a Luminor.",
      accent: "creation-prism-purple",
      glow: "rgba(139,92,246,0.12)",
    },
  ];

  return (
    <section ref={ref} className="py-28 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <SectionBadge
            icon={<PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />}
            label="The System"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            A mythology. A library. An academy.
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            Three pillars of a coherent creative philosophy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.1,
                duration: 0.6,
                ease: EASE_SMOOTH,
              }}
              className="group"
            >
              <div className="card-3d relative h-full rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.glow}, transparent 60%)`,
                  }}
                />
                <div className="relative h-full liquid-glass rounded-3xl p-8 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-${pillar.accent} bg-${pillar.accent}/10 group-hover:bg-${pillar.accent}/20 transition-all duration-500`}
                  >
                    {pillar.icon}
                  </div>
                  <h3
                    className={`font-display text-xl font-bold mb-3 group-hover:text-${pillar.accent} transition-colors duration-300`}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 3: FEATURED GUARDIAN STORY
// ---------------------------------------------------------------------------

function FeaturedGuardianSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        >
          <div className="relative rounded-3xl overflow-hidden liquid-glass-elevated border border-white/[0.08] group hover:border-draconic-crimson/20 transition-all duration-700">
            {/* Subtle fire glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-draconic-crimson/8 rounded-full blur-[120px]" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gold-bright/5 rounded-full blur-[100px]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Guardian image */}
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={`${SUPABASE_CDN}/draconia-hero.webp`}
                  alt="Draconia, Guardian of the Fire Gate"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cosmic-deep/60 hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/80 to-transparent lg:hidden" />
              </div>

              {/* Right: Story text */}
              <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.7, ease: EASE_SMOOTH }}
                >
                  <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-draconic-crimson/80 mb-4">
                    Featured Guardian
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-6">
                    Meet Draconia &mdash; Guardian of the Fire Gate
                  </h2>
                  <blockquote className="text-lg md:text-xl italic text-text-secondary mb-6 pl-4 border-l-2 border-draconic-crimson/40">
                    &ldquo;I do not ask if you are ready. I ask if you are
                    willing.&rdquo;
                  </blockquote>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    Power without purpose is destruction. Purpose without power
                    is fantasy. Draconia guards the Fire Gate at 396 Hz &mdash;
                    the threshold where creative will becomes creative force.
                  </p>
                  <Link
                    href="/lore/guardians"
                    className="inline-flex items-center gap-2 text-draconic-crimson hover:text-draconic-crimson/80 font-medium transition-colors group/link"
                  >
                    Meet all ten Guardians
                    <PhArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 4: INTERACTIVE CHAT PREVIEW
// ---------------------------------------------------------------------------

function ChatPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    CHAT_MESSAGES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleMessages(i + 1), 600 + i * 800),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <SectionBadge
            icon={<PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />}
            label="Live Preview"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            See the Magic in Action
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-lg">
            Every Guardian brings unique creative insight to your conversation.
          </p>
        </motion.div>

        {/* Browser chrome mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE_SMOOTH }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] liquid-glass-elevated">
            {/* Title bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] font-mono text-text-muted">
                  arcanea.ai/chat
                </span>
              </div>
              <div className="w-[54px]" />
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-5 min-h-[340px]">
              {CHAT_MESSAGES.map((msg, i) => {
                if (i >= visibleMessages) return null;

                if (msg.role === "user") {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[80%] px-5 py-3 rounded-2xl rounded-br-md bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/15 text-sm text-text-primary">
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
                      <img
                        src={`${SUPABASE_CDN}/lyria-hero.webp`}
                        alt="Lyria"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-text-primary">
                          {msg.name}
                        </span>
                        <span className="text-[10px] font-mono text-creation-prism-purple/70">
                          {msg.gate} &middot; {msg.frequency}
                        </span>
                      </div>
                      <div className="px-5 py-3 rounded-2xl rounded-tl-md liquid-glass border border-white/[0.06] text-sm text-text-secondary leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA below */}
          <div className="text-center mt-8">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:text-atlantean-teal-light font-medium transition-colors group"
            >
              Start a conversation with any Guardian
              <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 5: GUARDIAN GALLERY STRIP
// ---------------------------------------------------------------------------

function GuardianGallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua/3 via-transparent to-creation-prism-purple/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-atlantean-teal-aqua/80 mb-3">
              The Arcane Council
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2">
              Ten Guardians of Magic
            </h2>
            <p className="text-text-secondary text-sm max-w-md">
              Each guarding a Gate on the path to creative mastery.
            </p>
          </div>
          <Link
            href="/lore/guardians"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors"
          >
            View all
            <PhArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {GUARDIANS.map((guardian, i) => (
            <motion.div
              key={guardian.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: 0.1 + i * 0.06,
                duration: 0.5,
                ease: EASE_SMOOTH,
              }}
            >
              <Link
                href={`/lore/guardians/${guardian.name.toLowerCase()}`}
                className="group flex-shrink-0 snap-center block"
              >
                <div className="relative w-[180px] rounded-2xl overflow-hidden card-3d">
                  <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-atlantean-teal-aqua/25 transition-all duration-500 z-20 pointer-events-none" />

                  <div className="aspect-[3/4] bg-cosmic-surface">
                    <img
                      src={`${SUPABASE_CDN}/${guardian.name.toLowerCase()}-hero.webp`}
                      alt={guardian.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-display font-bold text-white text-lg leading-tight">
                      {guardian.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-white/[0.30]">
                        {guardian.gate} Gate
                      </span>
                      <span className="text-[11px] text-atlantean-teal-aqua/70 font-mono">
                        {guardian.frequency}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 sm:hidden">
        <Link
          href="/lore/guardians"
          className="inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua"
        >
          View all Guardians
          <PhArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 6: GALLERY GRID
// ---------------------------------------------------------------------------

function GalleryGridSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const galleryImages = GUARDIANS.map((g) => ({
    name: g.name,
    element: g.element,
    src: `${SUPABASE_CDN}/${g.name.toLowerCase()}-hero.webp`,
  }));

  // Grid spanning pattern: make some images span 2 rows for visual interest
  const spanMap: Record<number, string> = {
    0: "md:row-span-2",
    3: "md:row-span-2",
    7: "md:row-span-2",
  };

  return (
    <section ref={ref} className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          <SectionBadge
            icon={<PhSparkle className="w-3 h-3 text-gold-bright" />}
            label="Gallery"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            The Art of Magic
          </h2>
          <p className="text-text-secondary max-w-lg text-lg">
            Guardian imagery from across the Arcanea universe.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.name}
              className={`relative rounded-xl overflow-hidden group ${spanMap[i] || ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: 0.05 + i * 0.05,
                duration: 0.5,
                ease: EASE_SMOOTH,
              }}
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end">
                <div className="p-4">
                  <p className="font-display font-bold text-white text-sm">
                    {img.name}
                  </p>
                  <p className="text-[10px] font-mono text-white/50 mt-0.5">
                    {img.element}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:text-atlantean-teal-light font-medium transition-colors group"
          >
            Explore the full gallery
            <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 7: CLI SHOWCASE
// ---------------------------------------------------------------------------

function CLIShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setVisibleLines(i + 1),
          400 + i * 220,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
          >
            <SectionBadge
              icon={<PhTerminal className="w-3 h-3 text-atlantean-teal-aqua" />}
              label="For Builders"
            />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Built for Builders
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              Arcanea Code &mdash; the creative intelligence CLI. Open source.
              MIT licensed. Works with Claude, Gemini, and any AI model.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {["Open Source", "MIT License", "npm"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-text-muted border border-white/[0.08] bg-white/[0.02]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <Link
              href="/arcanea-code"
              className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:text-atlantean-teal-light font-medium transition-colors group"
            >
              Get started
              <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Terminal mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE_SMOOTH }}
          >
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0f]">
              {/* macOS title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[11px] font-mono text-text-muted">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-5 font-mono text-[13px] leading-relaxed min-h-[320px] overflow-x-auto">
                {TERMINAL_LINES.map((line, i) => {
                  if (i >= visibleLines) return null;

                  if (line.type === "blank") {
                    return <div key={i} className="h-4" />;
                  }

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={
                        line.type === "input"
                          ? "text-atlantean-teal-aqua"
                          : "text-text-muted"
                      }
                    >
                      {line.text}
                    </motion.div>
                  );
                })}
                {/* Blinking cursor */}
                {visibleLines >= TERMINAL_LINES.length && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-atlantean-teal-aqua mt-1"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 8: METRICS STRIP
// ---------------------------------------------------------------------------

function MetricsStripSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 10, suffix: "", label: "Guardians of Magic" },
    { value: 17, suffix: "", label: "Wisdom Collections" },
    { value: 50, suffix: "K+", label: "Words of Philosophy" },
    { value: 364, suffix: "+", label: "Curated Artworks" },
    { value: 1111, suffix: "", label: "Hz Source Frequency" },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-void via-cosmic-deep to-cosmic-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua/3 via-creation-prism-purple/3 to-gold-bright/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: EASE_SMOOTH,
              }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-br from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright bg-clip-text text-transparent mb-2">
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                  duration={1.8}
                />
              </div>
              <p className="text-xs md:text-sm text-text-muted font-mono tracking-wider">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 10: CLOSING QUOTE
// ---------------------------------------------------------------------------

function ClosingQuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        >
          <div className="liquid-glass rounded-3xl p-12 md:p-16 border border-white/[0.06]">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display italic text-text-secondary leading-relaxed">
              &ldquo;Enter seeking, leave transformed, return whenever
              needed.&rdquo;
            </blockquote>
            <cite className="block mt-8 text-xs text-text-muted font-mono tracking-[0.2em] not-italic uppercase">
              The Library of Arcanea
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main V1 Content
// ---------------------------------------------------------------------------

export function V1Content({
  collectionsCount,
  textsCount,
  totalWords,
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. What is Arcanea */}
      <WhatIsSection
        collectionsCount={collectionsCount}
        textsCount={textsCount}
        totalWords={totalWords}
      />

      {/* 3. Featured Guardian Story */}
      <FeaturedGuardianSection />

      {/* 4. Chat Preview */}
      <ChatPreviewSection />

      {/* 5. Guardian Gallery Strip */}
      <GuardianGallerySection />

      {/* 6. Gallery Grid */}
      <GalleryGridSection />

      {/* 7. CLI Showcase */}
      <CLIShowcaseSection />

      {/* 8. Metrics Strip */}
      <MetricsStripSection />

      {/* 9. CTA Section (reused) */}
      <CTASection />

      {/* 10. Closing Quote */}
      <ClosingQuoteSection />
    </>
  );
}
