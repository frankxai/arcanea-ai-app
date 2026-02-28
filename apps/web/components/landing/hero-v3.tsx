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
import {
  PhArrowRight,
  PhCaretDown,
} from '@/lib/phosphor-icons';
import heroLogo from "@/assets/brand/arcanea-hero.jpg";

export function HeroV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  // Smooth mouse parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePos.x, { stiffness: 50, damping: 20 });
  const springY = useSpring(mousePos.y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX - innerWidth / 2) / 40,
        y: (e.clientY - innerHeight / 2) / 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-cosmic-deep" />

        {/* Animated aurora gradients */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 80% at 50% 30%, rgba(127,255,212,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 50% 50% at 20% 70%, rgba(255,215,0,0.04) 0%, transparent 50%)
            `,
            x: springX,
            y: springY,
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(127,255,212,0.4) 1px, transparent 1px),
              linear-gradient(rgba(127,255,212,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative max-w-7xl mx-auto px-6 py-24"
        style={{ y, opacity, scale }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Crystal Logo — the centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            style={{ scale: logoScale }}
            className="relative mb-12"
          >
            {/* Logo glow */}
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-full h-full bg-gradient-to-b from-atlantean-teal-aqua/40 via-creation-prism-purple/30 to-gold-bright/20 rounded-full" />
            </div>

            <Image
              src={heroLogo}
              alt="Arcanea — Crystal A mark"
              width={288}
              height={384}
              priority
              className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover object-center rounded-3xl shadow-2xl shadow-black/50"
              style={{
                maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              }}
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.9] mb-6">
              <span className="block text-white">Build Your</span>
              <span className="relative inline-block">
                <motion.span
                  className="relative z-10 bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple via-50% to-gold-bright bg-[length:200%_auto] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  Universe
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Ten Guardians. Seven Wisdoms. A Library of original philosophy.
            <span className="block text-white/80 mt-1">
              The mythology-powered framework for the creative life.
            </span>
          </motion.p>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/academy"
              className="group relative px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua via-atlantean-teal-light to-atlantean-teal-aqua"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                Enter the Academy
                <PhArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/library"
              className="px-10 py-5 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/5 hover:border-white/30 transition-all text-white font-semibold text-lg"
            >
              Explore the Library
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
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
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="text-xs text-text-muted uppercase tracking-widest">
            Explore
          </span>
          <PhCaretDown className="w-5 h-5 text-text-muted" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </section>
  );
}
