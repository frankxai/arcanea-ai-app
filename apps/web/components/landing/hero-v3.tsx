"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { PhArrowRight, PhCaretDown, PhSparkle } from '@/lib/phosphor-icons';
import heroCrystal from "@/assets/brand/arcanea-crystal.jpg";

// ---------------------------------------------------------------------------
// Rotating Phrases
// ---------------------------------------------------------------------------

interface Phrase {
  verb: string;
  gradientClass: string;
  object: string;
}

const PHRASES: Phrase[] = [
  { verb: "Build",     gradientClass: "text-gradient-crystal", object: "your Universe."     },
  { verb: "Create",    gradientClass: "text-gradient-brand",   object: "your Luminor."      },
  { verb: "Design",    gradientClass: "text-gradient-gold",    object: "your Intelligence." },
  { verb: "Manifest",  gradientClass: "text-gradient-fire",    object: "your Mythology."    },
  { verb: "Architect", gradientClass: "text-gradient-cosmic",  object: "your Future."       },
];

const PHRASE_INTERVAL = 3000;

function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % PHRASES.length),
      PHRASE_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  const phrase = PHRASES[index];

  return (
    <span className="relative inline-flex flex-col sm:inline overflow-hidden" style={{ minHeight: "1.15em" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={phrase.gradientClass}>{phrase.verb}</span>
          <span className="text-white"> {phrase.object}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Floating Ambient Orb
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
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Hero Component
// ---------------------------------------------------------------------------

export function HeroV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Mobile: much slower fade so header stays visible longer
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
      {/* ── Full-bleed crystal background ── */}
      <motion.div className="absolute inset-0 -z-20" style={{ scale: bgScale }}>
        <Image
          src={heroCrystal}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/60 via-cosmic-deep/40 to-cosmic-deep" />
        <div className="absolute inset-0 bg-gradient-to-br from-atlantean-teal-aqua/8 via-transparent to-creation-prism-purple/8" />
      </motion.div>

      {/* ── Mouse-tracking aurora ── */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <AmbientOrb size={500} color="rgba(127,255,212,0.12)" position="top-[15%] left-[10%]" delay={0} />
        <AmbientOrb size={400} color="rgba(139,92,246,0.10)" position="bottom-[20%] right-[15%]" delay={3} />
        <AmbientOrb size={300} color="rgba(255,215,0,0.06)" position="top-[60%] right-[30%]" delay={6} />
      </motion.div>

      {/* ── Content ── */}
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
                Living Intelligence
              </span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-atlantean-teal-aqua"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Headline with rotating phrases */}
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

          {/* Sub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="max-w-2xl mx-auto mb-10 md:mb-14"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/[0.55] leading-relaxed font-light">
              Ten Guardians. A Library of original philosophy.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/[0.75] mt-1.5 font-normal">
              The mythology-powered framework for the creative life.
            </p>
          </motion.div>

          {/* CTA Buttons */}
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

      {/* ── Scroll indicator ── */}
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
