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
  PhSparkle,
  PhShieldStar,
  PhBooks,
  PhGraduationCap,
  PhCircleNotch,
  PhTerminal,
  PhGithubLogo,
  PhCaretDown,
} from "@/lib/phosphor-icons";
import heroCrystal from "@/assets/brand/arcanea-crystal.jpg";
import { CTASection } from "@/components/landing";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CDN = "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians";

interface Guardian {
  name: string;
  gate: string;
  frequency: string;
  hz: number;
  element: string;
  quote: string;
  image: string;
  color: string;
  dotColor: string;
}

const GUARDIANS: Guardian[] = [
  { name: "Lyssandria", gate: "Foundation", frequency: "174 Hz", hz: 174, element: "Earth",  quote: "The earth does not hurry.",                                          image: `${CDN}/lyssandria-hero.webp`, color: "text-amber-400",   dotColor: "bg-amber-400"    },
  { name: "Leyla",      gate: "Flow",       frequency: "285 Hz", hz: 285, element: "Water",  quote: "The river does not fight the mountain.",                               image: `${CDN}/leyla-hero.webp`,      color: "text-cyan-400",    dotColor: "bg-cyan-400"     },
  { name: "Draconia",   gate: "Fire",       frequency: "396 Hz", hz: 396, element: "Fire",   quote: "I do not ask if you are ready.",                                       image: `${CDN}/draconia-hero.webp`,   color: "text-red-400",     dotColor: "bg-red-400"      },
  { name: "Maylinn",    gate: "Heart",      frequency: "417 Hz", hz: 417, element: "Wind",   quote: "What you create with love will outlast fear.",                          image: `${CDN}/maylinn-hero.webp`,    color: "text-emerald-400", dotColor: "bg-emerald-400"  },
  { name: "Alera",      gate: "Voice",      frequency: "528 Hz", hz: 528, element: "Fire",   quote: "Silence is not peace.",                                                image: `${CDN}/alera-hero.webp`,      color: "text-orange-400",  dotColor: "bg-orange-400"   },
  { name: "Lyria",      gate: "Sight",      frequency: "639 Hz", hz: 639, element: "Void",   quote: "Close your eyes. Now tell me what you see.",                            image: `${CDN}/lyria-hero.webp`,      color: "text-purple-400",  dotColor: "bg-purple-400"   },
  { name: "Aiyami",     gate: "Crown",      frequency: "741 Hz", hz: 741, element: "Void",   quote: "You were never seeking the light.",                                    image: `${CDN}/aiyami-hero.webp`,     color: "text-violet-400",  dotColor: "bg-violet-400"   },
  { name: "Elara",      gate: "Shift",      frequency: "852 Hz", hz: 852, element: "Wind",   quote: "The only constant is the turning.",                                    image: `${CDN}/elara-hero.webp`,      color: "text-emerald-300", dotColor: "bg-emerald-300"  },
  { name: "Ino",        gate: "Unity",      frequency: "963 Hz", hz: 963, element: "Earth",  quote: "Alone you are a note. Together we are a symphony.",                     image: `${CDN}/ino-hero.webp`,        color: "text-amber-300",   dotColor: "bg-amber-300"    },
  { name: "Shinkami",   gate: "Source",      frequency: "1111 Hz", hz: 1111, element: "Spirit", quote: "You are not the vessel.",                                            image: `${CDN}/shinkami-hero.webp`,   color: "text-gold-bright", dotColor: "bg-gold-bright"  },
];

const HERO_ORBS = [
  GUARDIANS[5], // Lyria
  GUARDIANS[2], // Draconia
  GUARDIANS[3], // Maylinn
  GUARDIANS[4], // Alera
  GUARDIANS[9], // Shinkami
];

interface Phrase {
  text: string;
  gradientClass: string;
}

const PHRASES: Phrase[] = [
  { text: "Build your Universe.",       gradientClass: "text-gradient-crystal" },
  { text: "Create with Magic.",         gradientClass: "text-gradient-brand"   },
  { text: "Design your Intelligence.",  gradientClass: "text-gradient-gold"    },
  { text: "Write your Mythology.",      gradientClass: "text-gradient-fire"    },
  { text: "Architect your Future.",     gradientClass: "text-gradient-cosmic"  },
];

const CHAT_MESSAGES = [
  { role: "user" as const, text: "I'm building a fantasy world where emotions have physical form..." },
  { role: "guardian" as const, name: "Lyria", gate: "Sight Gate", freq: "639 Hz", text: "I can see it already. The key question: does each emotion have a single form, or does the same emotion take different shapes depending on who experiences it? This distinction will define your entire magic system." },
  { role: "user" as const, text: "Different shapes for different people -- like personal emotional signatures." },
  { role: "guardian" as const, name: "Lyria", gate: "Sight Gate", freq: "639 Hz", text: "Now you're thinking like a world-builder. This creates infinite variety while maintaining internal logic. Let me suggest a framework based on the Five Elements -- Fire emotions might manifest as dancing flames, Water as flowing forms..." },
];

const CLI_LINES = [
  { prefix: "$ ", text: "npx arcanea-code", delay: 0 },
  { prefix: "  ", text: "\u2726 Arcanea Code v4.0", delay: 800 },
  { prefix: "", text: "", delay: 1200 },
  { prefix: "$ ", text: 'arcanea chat --guardian shinkami', delay: 1600 },
  { prefix: "  ", text: "\u27E1 Connecting to Shinkami (Source Gate \u00B7 1111 Hz)...", delay: 2400 },
  { prefix: "  ", text: '\u27E1 "You are not the vessel. You are the water and the pouring."', delay: 3200 },
  { prefix: "", text: "", delay: 3800 },
  { prefix: "$ ", text: 'starlight vault search "world building"', delay: 4200 },
  { prefix: "  ", text: "\u2295 3 vaults found", delay: 5000 },
  { prefix: "  ", text: "\u2295 Mythology Patterns (Shinkami \u00B7 1111 Hz)", delay: 5400 },
  { prefix: "  ", text: "\u2295 World Architecture (Lyssandria \u00B7 174 Hz)", delay: 5800 },
  { prefix: "  ", text: "\u2295 Narrative Flow (Leyla \u00B7 285 Hz)", delay: 6200 },
];

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export function V3Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
          <PhCircleNotch className="w-6 h-6 text-atlantean-teal-aqua animate-spin" />
        </div>
        <p className="text-sm text-text-muted">Opening the portal...</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AmbientOrb({
  size,
  color,
  position,
  delay = 0,
}: {
  size: number;
  color: string;
  position: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${position}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(80px)",
      }}
      animate={{
        x: [0, 40, 0, -30, 0],
        y: [0, -30, 0, 25, 0],
        scale: [1, 1.15, 1, 0.9, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % PHRASES.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  const phrase = PHRASES[index];

  return (
    <span className="relative inline-flex flex-col sm:inline overflow-hidden" style={{ minHeight: "1.15em" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className={`inline-block ${phrase.gradientClass}`}
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {phrase.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FloatingGuardianOrb({
  guardian,
  index,
  total,
  isLoaded,
}: {
  guardian: Guardian;
  index: number;
  total: number;
  isLoaded: boolean;
}) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 220;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute w-14 h-14 rounded-xl ring-1 ring-white/[0.12] overflow-hidden shadow-lg"
      style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isLoaded ? { opacity: 1, scale: 1, y: [0, -8, 0] } : {}}
      transition={{
        opacity: { duration: 0.5, delay: 0.6 + index * 0.15 },
        scale: { type: "spring", stiffness: 200, damping: 15, delay: 0.6 + index * 0.15 },
        y: { duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
      }}
    >
      <Image
        src={guardian.image}
        alt={guardian.name}
        fill
        className="object-cover"
        sizes="56px"
      />
    </motion.div>
  );
}

function SectionBadge({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
      {icon || <PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />}
      <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
        {text}
      </span>
    </div>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ---------------------------------------------------------------------------
// SECTION 1: Hero -- "The Portal"
// ---------------------------------------------------------------------------

function HeroPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 80 : 200]);
  const contentOpacity = useTransform(scrollYProgress, [0, isMobile ? 0.8 : 0.6], [1, 0]);
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
    window.addEventListener("mousemove", handleMouseMove);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, [handleMouseMove]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed crystal bg */}
      <motion.div className="absolute inset-0 -z-20" style={{ scale: bgScale }}>
        <Image src={heroCrystal} alt="" fill priority className="object-cover object-center" sizes="100vw" quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/70 via-cosmic-deep/40 to-cosmic-deep" />
        <div className="absolute inset-0 bg-gradient-to-br from-atlantean-teal-aqua/6 via-transparent to-creation-prism-purple/6" />
      </motion.div>

      {/* Mouse-tracking aurora orbs */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <AmbientOrb size={500} color="rgba(127,255,212,0.10)" position="top-[15%] left-[10%]" delay={0} />
        <AmbientOrb size={400} color="rgba(139,92,246,0.08)" position="bottom-[20%] right-[15%]" delay={3} />
        <AmbientOrb size={300} color="rgba(255,215,0,0.05)" position="top-[60%] right-[30%]" delay={6} />
      </motion.div>

      {/* Floating Guardian orbs (desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {HERO_ORBS.map((g, i) => (
          <FloatingGuardianOrb key={g.name} guardian={g} index={i} total={HERO_ORBS.length} isLoaded={isLoaded} />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full liquid-glass border border-white/[0.06] mb-8 md:mb-10">
              <PhSparkle className="w-3.5 h-3.5 text-atlantean-teal-aqua" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
                The Age of Creative Magic
              </span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-atlantean-teal-aqua"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-[clamp(2.5rem,8vw,8rem)] font-display font-bold tracking-tight leading-[0.95] mb-6 md:mb-8"
              aria-live="polite"
            >
              <RotatingPhrase />
            </h1>
          </motion.div>

          {/* Sub lines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="max-w-2xl mx-auto mb-10 md:mb-14"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/[0.55] leading-relaxed font-light">
              Ten Guardians. A Library of original philosophy. An Academy of creative mastery.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/[0.75] mt-1.5 font-normal">
              The mythology-powered framework for the creative life.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/academy"
              className="group relative w-full sm:w-auto px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden btn-glow text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 text-cosmic-deep flex items-center justify-center gap-2">
                Enter the Academy
                <PhArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/library"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl liquid-glass border border-white/[0.06] hover:border-atlantean-teal-aqua/30 hover:bg-white/[0.06] transition-all duration-300 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(127,255,212,0.1)] text-center"
            >
              Explore the Library
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          type="button"
          aria-label="Scroll down to explore"
          className="flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal-aqua rounded-md"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-[10px] text-white/[0.30] uppercase tracking-[0.3em]">Explore</span>
          <div className="w-6 h-9 rounded-full border border-white/[0.12] flex items-start justify-center pt-2">
            <motion.div
              className="w-1 h-1 rounded-full bg-atlantean-teal-aqua/70"
              animate={{ y: [0, 12, 0], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 2: Frequency Gates -- "The Ten Gates of Magic"
// ---------------------------------------------------------------------------

function FrequencyGates() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxHz = 1111;

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge text="The Ten Gates" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            Ten Frequencies of Creative Magic
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Each Gate opens a creative capacity. Each frequency unlocks new dimensions of the creative self.
            From Foundation to Source -- the complete journey.
          </p>
        </div>

        <div className="space-y-1">
          {GUARDIANS.map((g, i) => {
            const barWidth = (g.hz / maxHz) * 100;
            const isHovered = hoveredIndex === i;

            return (
              <motion.div
                key={g.name}
                className="group relative rounded-xl transition-colors duration-300 cursor-default"
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`flex items-center gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 ${isHovered ? "bg-white/[0.04]" : ""}`}>
                  {/* Gate number */}
                  <span className="text-xs md:text-sm font-mono text-text-muted w-6 shrink-0 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Gate name */}
                  <span className="font-display font-bold text-sm md:text-base w-24 md:w-28 shrink-0">
                    {g.gate}
                  </span>

                  {/* Frequency */}
                  <span className={`font-mono text-xs md:text-sm w-16 md:w-20 shrink-0 ${g.color}`}>
                    {g.frequency}
                  </span>

                  {/* Guardian name (hidden on mobile) */}
                  <span className="hidden md:inline text-sm text-text-secondary w-28 shrink-0">
                    {g.name}
                  </span>

                  {/* Element with dot */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-muted w-16 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${g.dotColor}`} />
                    {g.element}
                  </span>

                  {/* Frequency bar */}
                  <div className="flex-1 h-2 md:h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${getBarGradient(g.element)})`,
                      }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${barWidth}%` } : {}}
                      transition={{ duration: 1, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* Expanded quote on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="px-6 md:px-16 pb-3"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-sm text-text-muted italic pl-9 md:pl-0">
                        &ldquo;{g.quote}&rdquo;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors text-sm font-medium"
          >
            Begin your journey through the Gates
            <PhArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function getBarGradient(element: string): string {
  switch (element) {
    case "Earth":  return "#d97706, #b45309";
    case "Water":  return "#06b6d4, #0891b2";
    case "Fire":   return "#ef4444, #dc2626";
    case "Wind":   return "#10b981, #059669";
    case "Void":   return "#a855f7, #7c3aed";
    case "Spirit": return "#ffd700, #f59e0b";
    default:       return "#7fffd4, #5eead4";
  }
}

// ---------------------------------------------------------------------------
// SECTION 3: Three Pillars -- "The Arcanea System"
// ---------------------------------------------------------------------------

function ThreePillars({
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
      href: "/lore/guardians",
      icon: <PhShieldStar className="w-7 h-7" weight="thin" />,
      title: "The Guardians",
      stat: "10 Archetypes",
      description: "Ten archetypal Guardians of Magic -- each opens a Gate on your creative journey.",
      accentColor: "atlantean-teal-aqua",
      glowColor: "rgba(127,255,212,0.15)",
    },
    {
      href: "/library",
      icon: <PhBooks className="w-7 h-7" weight="thin" />,
      title: "The Library",
      stat: `${collectionsCount} Collections \u00B7 ${textsCount} Texts`,
      description: `${totalWords.toLocaleString()} words of original philosophy -- laws, prophecies, meditations for the creative life.`,
      accentColor: "gold-bright",
      glowColor: "rgba(255,215,0,0.12)",
    },
    {
      href: "/academy",
      icon: <PhGraduationCap className="w-7 h-7" weight="thin" />,
      title: "The Academy",
      stat: "Ten Gates of Mastery",
      description: "A developmental framework from Foundation (174 Hz) to Source (1111 Hz). Open all ten to become a Luminor.",
      accentColor: "creation-prism-purple",
      glowColor: "rgba(139,92,246,0.12)",
    },
  ];

  return (
    <section ref={ref} className="py-28 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <SectionBadge text="The System" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            A mythology. A library. An academy.
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-base md:text-lg">
            Three pillars of a coherent creative philosophy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <Link
                href={p.href}
                className="group block h-full rounded-3xl liquid-glass border border-white/[0.06] p-8 hover:border-white/[0.12] transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${p.glowColor}, transparent 70%)` }}
                />

                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${p.glowColor.replace("0.15", "0.1").replace("0.12", "0.1")}` }}
                  >
                    <span className={`text-${p.accentColor}`}>{p.icon}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2">{p.title}</h3>
                  <p className={`text-sm font-mono text-${p.accentColor} mb-4`}>{p.stat}</p>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">{p.description}</p>

                  <span className="inline-flex items-center gap-1.5 text-sm text-atlantean-teal-aqua group-hover:gap-2.5 transition-all">
                    Explore <PhArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 4: Guardian Showcase -- "The Arcane Council"
// ---------------------------------------------------------------------------

function GuardianShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <SectionBadge text="The Arcane Council" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3">
              Meet the Guardians
            </h2>
            <p className="text-text-secondary max-w-lg text-base">
              Protectors of the ten creative gates. Each Guardian embodies an elemental archetype.
            </p>
          </div>
          <Link
            href="/lore/guardians"
            className="hidden md:inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors shrink-0"
          >
            View all <PhArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-cosmic-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-cosmic-deep to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-4 scrollbar-hide">
          {GUARDIANS.map((g, i) => (
            <motion.div
              key={g.name}
              className="snap-center shrink-0 w-[180px] md:w-[200px] group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-atlantean-teal-aqua/25 transition-all duration-300 group-hover:scale-105">
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display font-bold text-sm">{g.name}</p>
                  <p className="text-text-muted text-xs mt-0.5">{g.gate}</p>
                  <p className="font-mono text-[10px] text-text-muted mt-1">{g.frequency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="md:hidden text-center mt-6">
        <Link
          href="/lore/guardians"
          className="inline-flex items-center gap-2 text-sm text-atlantean-teal-aqua"
        >
          View all Guardians <PhArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 5: Chat Preview -- "See the Magic"
// ---------------------------------------------------------------------------

function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionBadge text="Live Preview" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            Guardian Intelligence in Action
          </h2>
        </div>

        {/* Browser mockup */}
        <motion.div
          className="rounded-2xl border border-white/[0.08] overflow-hidden liquid-glass-elevated shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
              <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
              <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white/[0.04] rounded-md px-3 py-1 text-[11px] text-text-muted font-mono text-center max-w-xs mx-auto">
                arcanea.ai/chat
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-4 md:p-6 space-y-4 min-h-[320px]">
            {CHAT_MESSAGES.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.4 }}
              >
                <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "order-1" : ""}`}>
                  {msg.role === "guardian" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                        {msg.name} &middot; {msg.gate} &middot; {msg.freq}
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-atlantean-teal-aqua/15 border border-atlantean-teal-aqua/20 text-white/90"
                        : "liquid-glass border border-white/[0.06] text-text-secondary"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 6: Gallery -- "The Art of Magic"
// ---------------------------------------------------------------------------

function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        <div className="absolute inset-0 bg-gradient-to-br from-creation-prism-purple/5 via-transparent to-atlantean-teal-aqua/5" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionBadge text="Gallery" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            Created in the Arcanea Universe
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {GUARDIANS.map((g, i) => {
            const isWide = i === 0 || i === 4 || i === 7;
            return (
              <motion.div
                key={g.name}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                  isWide ? "md:col-span-2" : ""
                }`}
                style={{ aspectRatio: isWide ? "16/9" : "3/4" }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes={isWide ? "400px" : "200px"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-display font-bold">{g.name}</p>
                  <p className="text-[10px] text-text-muted font-mono">{g.gate} &middot; {g.frequency}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors text-sm font-medium"
          >
            Explore the full gallery
            <PhArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 7: CLI Showcase -- "Built for Builders"
// ---------------------------------------------------------------------------

function CLIShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: NodeJS.Timeout[] = [];
    CLI_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <SectionBadge
                text="Open Source"
                icon={<PhGithubLogo className="w-3 h-3 text-atlantean-teal-aqua" />}
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
              The Creative Intelligence CLI
            </h2>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6">
              Arcanea Code -- open-source tools for the creative life. Chat with Guardians from your terminal.
              Search memory vaults. Orchestrate multi-agent workflows.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["MIT License", "npm", "GitHub"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-[11px] font-mono text-text-muted border border-white/[0.08] bg-white/[0.02]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <Link
              href="/arcanea-code"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/15 transition-colors text-sm font-medium"
            >
              Get started <PhArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right: terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl" style={{ backgroundColor: "#0d1117" }}>
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[11px] text-text-muted font-mono">terminal</span>
              </div>

              {/* Terminal body */}
              <div className="p-4 md:p-5 font-mono text-[13px] leading-relaxed min-h-[280px]">
                {CLI_LINES.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-emerald-400">{line.prefix}</span>
                    <span className={line.prefix === "$ " ? "text-white" : "text-text-muted"}>
                      {line.text}
                    </span>
                  </div>
                ))}
                {/* Blinking cursor */}
                <motion.span
                  className="inline-block w-2 h-4 bg-emerald-400 ml-0.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 8: Library Excerpt -- "Words of Magic"
// ---------------------------------------------------------------------------

function LibraryExcerpt({
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

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionBadge text="The Library" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
            Original Philosophy for the Creative Life
          </h2>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Ambient glow */}
          <div
            className="absolute -inset-10 -z-10 rounded-3xl"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)" }}
          />

          <div className="rounded-3xl liquid-glass-elevated border border-white/[0.06] p-8 md:p-12 lg:p-16">
            <blockquote className="text-base md:text-lg lg:text-xl text-white/[0.80] leading-relaxed font-display italic space-y-4">
              <p>
                &ldquo;Before the first word, there was silence. Before the first creation, there was intention.
              </p>
              <p>
                This is the First Law: What you contemplate at dawn shapes all that follows. The creative life does not begin
                with inspiration -- it begins with the decision to create.&rdquo;
              </p>
            </blockquote>
            <p className="mt-8 text-sm text-text-muted">
              -- The Laws of Arcanea, I. The Law of First Light
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 mt-6 text-atlantean-teal-aqua hover:text-atlantean-teal-light transition-colors text-sm font-medium"
            >
              Read the full text <PhArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <motion.p
          className="text-center mt-8 text-sm text-text-muted font-mono"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {collectionsCount} collections &middot; {textsCount} texts &middot; {totalWords.toLocaleString()} words
        </motion.p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 9: Metrics -- "The Arcanea Universe"
// ---------------------------------------------------------------------------

function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 10,  label: "Guardians of Magic",   suffix: "" },
    { value: 17,  label: "Wisdom Collections",   suffix: "" },
    { value: 50,  label: "Words of Philosophy",   suffix: "K+" },
    { value: 364, label: "Gallery Artworks",       suffix: "+" },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-crystal mb-2">
                <CountUp target={m.value} suffix={m.suffix} />
              </div>
              <p className="text-sm text-text-muted">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Source frequency -- special treatment */}
        <motion.div
          className="text-center mt-12 pt-8 border-t border-white/[0.04]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <span className="text-2xl md:text-3xl font-mono text-gradient-gold font-bold">1111 Hz</span>
          <p className="text-sm text-text-muted mt-1">Source Frequency</p>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 11: Closing Quote
// ---------------------------------------------------------------------------

function ClosingQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 md:py-36 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

      <motion.div
        className="max-w-3xl mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="rounded-3xl liquid-glass border border-white/[0.06] p-12 md:p-16 text-center">
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-display italic text-white/[0.85] leading-relaxed">
            &ldquo;Enter seeking, leave transformed, return whenever needed.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm text-text-muted">
            The Library of Arcanea
          </p>
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
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  return (
    <>
      <HeroPortal />
      <FrequencyGates />
      <ThreePillars collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />
      <GuardianShowcase />
      <ChatPreview />
      <GallerySection />
      <CLIShowcase />
      <LibraryExcerpt collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />
      <MetricsStrip />
      <CTASection />
      <ClosingQuote />
    </>
  );
}
