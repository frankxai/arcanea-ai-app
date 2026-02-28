"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { PhArrowRight, PhCaretDown } from '@/lib/phosphor-icons';
import heroCrystal from "@/assets/brand/arcanea-crystal.jpg";

export function HeroV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePos.x, { stiffness: 40, damping: 25 });
  const springY = useSpring(mousePos.y, { stiffness: 40, damping: 25 });

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX - innerWidth / 2) / 50,
        y: (e.clientY - innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed crystal background */}
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
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/70 via-cosmic-deep/50 to-cosmic-deep" />
        {/* Color tinting */}
        <div className="absolute inset-0 bg-gradient-to-br from-atlantean-teal-aqua/10 via-transparent to-creation-prism-purple/10" />
      </motion.div>

      {/* Mouse-tracking aurora */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-atlantean-teal-aqua/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-creation-prism-purple/6 rounded-full blur-[100px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative max-w-5xl mx-auto px-6 py-32 md:py-40"
        style={{ y, opacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/10 mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-atlantean-teal-aqua animate-pulse" />
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-atlantean-teal-aqua/90">
                Living Intelligence
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold tracking-tight leading-[0.9] mb-8">
              <span className="block text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                Build Your
              </span>
              <motion.span
                className="relative inline-block bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple via-50% to-gold-bright bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(127,255,212,0.3)]"
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                Universe
              </motion.span>
            </h1>
          </motion.div>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Ten Guardians. A Library of original philosophy.
            <span className="block text-white/90 mt-2 font-normal">
              The mythology-powered framework for the creative life.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/academy"
              className="group relative px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden btn-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                Enter the Academy
                <PhArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/library"
              className="px-10 py-4 rounded-2xl liquid-glass border border-white/15 hover:border-atlantean-teal-aqua/30 hover:bg-white/[0.06] transition-all duration-300 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(127,255,212,0.1)]"
            >
              Explore the Library
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Explore</span>
          <PhCaretDown className="w-4 h-4 text-white/40" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </section>
  );
}
