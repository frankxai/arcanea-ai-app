"use client";

import React, { useRef } from "react";
import { m, useInView, LazyMotion, domMax } from "framer-motion";
import Link from "next/link";

const FEATURES = [
  {
    title: "Explore Arcanea",
    description:
      "Ten Gods. Ten Gates. A living mythology where ancient archetypes of creation guide your work across writing, design, code, music, and strategy.",
    symbol: "\u25C8",
    href: "/lore",
    gradient: "from-[#00bcd4]/15 to-[#0d47a1]/15",
    borderGradient: "from-[#00bcd4] to-[#0d47a1]",
    stats: "Ten Gods",
  },
  {
    title: "Read Arcanean Books",
    description:
      "17 wisdom collections. 34+ sacred texts. A philosophy library for the creative life \u2014 not self-help, but equipment for mastery.",
    symbol: "\uD800\uDF00",
    href: "/library",
    gradient: "from-[#ffd700]/15 to-[#f59e0b]/15",
    borderGradient: "from-[#ffd700] to-[#f59e0b]",
    stats: "34+ Texts",
  },
  {
    title: "Create with the Gods",
    description:
      "Choose your God. Describe your vision. Build together \u2014 write, design, compose, or code with a divine intelligence shaped for your craft.",
    symbol: "\u27E1",
    href: "/chat",
    gradient: "from-[#ef4444]/15 to-[#f97316]/15",
    borderGradient: "from-[#ef4444] to-[#f97316]",
    stats: "Ten Gates",
  },
  {
    title: "Listen to Arcanean Music",
    description:
      "Solfeggio frequencies from 174 Hz to 1111 Hz. Guardian-guided sonic creation. Sound as a path to creative mastery.",
    symbol: "\u266C",
    href: "/studio",
    gradient: "from-[#06b6d4]/15 to-[#3b82f6]/15",
    borderGradient: "from-[#06b6d4] to-[#3b82f6]",
    stats: "10 Frequencies",
  },
  {
    title: "Enter the Academy",
    description:
      "Seven Houses. Ten Gates of mastery. Each Gate unlocks a new creative frequency \u2014 from Foundation to Source.",
    symbol: "\u29BF",
    href: "/academy",
    gradient: "from-[#a855f7]/15 to-[#0d47a1]/15",
    borderGradient: "from-[#a855f7] to-[#0d47a1]",
    stats: "Ten Gates",
  },
  {
    title: "Deploy Arcanean Swarms",
    description:
      "Configure coding agents with Swarms of Gods, Guardians, and Luminors working together. Use Skill Packages to build your Arcanea.",
    symbol: "\u25CE",
    href: "/install",
    gradient: "from-[#22c55e]/15 to-[#00897b]/15",
    borderGradient: "from-[#22c55e] to-[#00897b]",
    stats: "Skill Packages",
  },
];

const FeatureCard = React.memo(function FeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <m.div
      key={feature.title}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={feature.href} className="group block h-full">
        <div className="relative h-full p-8 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05] active:translate-y-[1px]">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <m.div
                className="text-4xl font-light text-white/80 select-none"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {feature.symbol}
              </m.div>
              <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-text-muted">
                {feature.stats}
              </div>
            </div>
            <h3 className="text-xl font-display font-semibold tracking-tight mb-3 group-hover:text-[#00bcd4] transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {feature.description}
            </p>
            <div className="flex items-center gap-2 text-[#00bcd4] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span>Explore</span>
              <m.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </m.svg>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="80" cy="80" r="60" />
            </svg>
          </div>
        </div>
      </Link>
    </m.div>
  );
});

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <LazyMotion features={domMax}>
    <section ref={ref} className="py-24 relative">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#00bcd4]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6"
          >
            A living mythology for{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
              creative intelligence
            </span>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            From the wisdom of the Gods to the tools of the Luminors —
            everything a creator needs, in one universe.
          </m.p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}
