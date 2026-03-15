"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMouseStore } from "@/hooks/use-mouse-store";
import { durations, m3Curves } from "@/lib/design/motion";

export function LoreHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMouseStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Normalized mouse position (0-1)
  const mx = typeof window !== "undefined" ? mouse.x / (window.innerWidth || 1) : 0.5;
  const my = typeof window !== "undefined" ? mouse.y / (window.innerHeight || 1) : 0.5;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cosmic Background — CSS-only star field */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 stars-ambient" />

        {/* Lumina — Golden Light (top right) */}
        <m.div
          className="absolute top-20 right-20 w-[600px] h-[600px]"
          style={{ x: mx * 30 - 15, y: my * 30 - 15 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-gold-bright/30 via-gold-bright/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-20 bg-gradient-radial from-white/[0.12] via-gold-bright/5 to-transparent rounded-full blur-2xl animate-pulse" />
        </m.div>

        {/* Nero — Deep Void (bottom left) */}
        <m.div
          className="absolute bottom-20 left-20 w-[600px] h-[600px]"
          style={{ x: -mx * 30 + 15, y: -my * 30 + 15 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-creation-prism-purple/30 via-cosmic-void/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-20 bg-gradient-radial from-creation-prism-purple/10 to-transparent rounded-full blur-2xl" />
        </m.div>

        {/* World Tree silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <svg viewBox="0 0 200 400" className="h-[80vh] w-auto" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M100 400 L100 200 Q90 150 70 100 M100 200 Q110 150 130 100" />
            <path d="M70 100 Q50 80 30 90 M70 100 Q60 70 50 50" />
            <path d="M130 100 Q150 80 170 90 M130 100 Q140 70 150 50" />
            <path d="M100 150 Q80 130 60 140 M100 150 Q120 130 140 140" />
            <path d="M100 400 Q80 420 50 410 M100 400 Q120 420 150 410" />
            <path d="M100 400 Q90 430 70 440 M100 400 Q110 430 130 440" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-transparent to-cosmic-deep" />
      </div>

      {/* Content */}
      <m.div
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-gold-bright/20 mb-8"
        >
          <svg className="w-4 h-4 text-gold-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          </svg>
          <span className="text-sm font-medium text-gold-bright">
            The Living Mythology
          </span>
        </m.div>

        {/* Title */}
        <m.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: durations.slowest, ease: m3Curves.emphasized }}
          className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-gold-bright via-white to-creation-prism-purple bg-clip-text text-transparent">
            Lore of Arcanea
          </span>
        </m.h1>

        {/* Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 font-body italic"
        >
          &quot;Before Lumina spoke, there was only Nero—the Fertile Unknown,
          pregnant with infinite possibility. And when the First Light pierced
          the darkness, neither was diminished.&quot;
        </m.p>

        {/* Quote attribution */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: durations.normal }}
          className="text-sm text-text-muted font-mono tracking-wider mb-12"
        >
          — Archive of Unity, Founding Texts
        </m.p>

        {/* Quick stats — shimmer border on hover */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            { value: "10", label: "Guardians" },
            { value: "10", label: "Gates" },
            { value: "7", label: "Wisdoms" },
            { value: "17", label: "Library Collections" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-3xl md:text-4xl font-display font-bold text-white group-hover:text-gold-bright transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </m.div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-text-muted">Descend into the lore</span>
          <m.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}
