"use client";

import { m } from "framer-motion";
import { useState, useEffect } from "react";
import { useMouseStore } from "@/hooks/use-mouse-store";

export function LoreHero() {
  const mouse = useMouseStore();
  const [windowSize, setWindowSize] = useState({ w: 1, h: 1 });

  useEffect(() => {
    setWindowSize({ w: window.innerWidth || 1, h: window.innerHeight || 1 });
  }, []);

  // Normalized mouse position (0-1), safe for SSR.
  const mx = mouse.x / windowSize.w;
  const my = mouse.y / windowSize.h;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 stars-ambient" />

        <m.div
          className="hidden sm:block absolute top-4 sm:top-20 right-4 sm:right-20 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
          style={{ x: mx * 30 - 15, y: my * 30 - 15 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-gold-bright/30 via-gold-bright/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-20 bg-gradient-radial from-white/[0.12] via-gold-bright/5 to-transparent rounded-full blur-2xl animate-pulse" />
        </m.div>

        <m.div
          className="hidden sm:block absolute bottom-4 sm:bottom-20 left-4 sm:left-20 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
          style={{ x: -mx * 30 + 15, y: -my * 30 + 15 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-creation-prism-purple/30 via-cosmic-void/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-20 bg-gradient-radial from-creation-prism-purple/10 to-transparent rounded-full blur-2xl" />
        </m.div>

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

        <m.div
          className="hidden md:block absolute right-0 top-0 h-full w-1/2 pointer-events-none select-none"
          style={{ x: mx * 15 - 7.5, y: my * 10 - 5 }}
        >
          <img
            src="/guardians/v2/shinkami-divine-bond.webp"
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-auto max-w-none object-cover object-left opacity-[0.13]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/60 via-transparent to-cosmic-deep/60" />
        </m.div>

        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-transparent to-cosmic-deep" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-gold-bright/20 mb-8">
          <svg className="w-4 h-4 text-gold-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          </svg>
          <span className="text-sm font-medium text-gold-bright">
            The Living Mythology
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
          <span className="bg-gradient-to-r from-gold-bright via-white to-creation-prism-purple bg-clip-text text-transparent">
            Lore of Arcanea
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 font-body italic">
          &quot;Before Lumina spoke, there was only Nero—the Fertile Unknown,
          pregnant with infinite possibility. And when the First Light pierced
          the darkness, neither was diminished.&quot;
        </p>

        <p className="text-sm text-text-muted font-mono tracking-wider mb-12">
          — Archive of Unity, Founding Texts
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 sm:mb-16">
          {[
            { value: "10", label: "Guardians" },
            { value: "10", label: "Gates" },
            { value: "7", label: "Wisdoms" },
            { value: "17", label: "Library Collections" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white group-hover:text-gold-bright transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-text-muted">Descend into the lore</span>
          <m.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </m.div>
        </div>
      </div>
    </section>
  );
}
