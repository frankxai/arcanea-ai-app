"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  PhSparkle,
  PhBrain,
  PhPalette,
  PhBookOpen,
  PhZap,
  PhShield,
  PhChatCircle,
  PhLayers,
  PhWand,
  PhGraduationCap,
  PhUsers,
} from '@/lib/phosphor-icons';

const MAIN_FEATURES = [
  {
    icon: PhSparkle,
    title: "16 AI Specialists",
    description:
      "Each specialist has mastered a specific domain — patterns of how the greatest creators actually work. They will challenge a weak idea before you waste time building it.",
    gradient: "from-atlantean-teal-aqua to-creation-prism-purple",
    highlight: "atlantean-teal-aqua",
  },
  {
    icon: PhBrain,
    title: "Seven Wisdoms Framework",
    description:
      "Stuck? Lost? Afraid? Seven diagnostic lenses for the most common creative blocks. Sophron sees structure. Kardia feels heart. Valora demands courage. Each Wisdom reveals what you cannot see alone.",
    gradient: "from-gold-bright to-draconic-crimson",
    highlight: "gold-bright",
  },
  {
    icon: PhUsers,
    title: "Ten Gates of Mastery",
    description:
      "Each Gate corresponds to a specific creative capacity — from grounding your vision (174 Hz) to achieving meta-consciousness about creation itself (1111 Hz). Not gamification. A developmental framework.",
    gradient: "from-creation-prism-purple to-atlantean-teal-aqua",
    highlight: "creation-prism-purple",
  },
];

const CAPABILITY_GRID = [
  {
    icon: PhChatCircle,
    title: "Guardian-Guided Dialogue",
    description: "Conversations shaped by archetypal wisdom, not generic prompts",
  },
  {
    icon: PhPalette,
    title: "Visual Creation",
    description: "Generate images and concept art through elemental aesthetics",
  },
  {
    icon: PhBookOpen,
    title: "Story & World Building",
    description: "Build mythologies, narratives, and living lore systems",
  },
  {
    icon: PhWand,
    title: "Music Composition",
    description: "Compose at the frequencies of the Ten Gates",
  },
  {
    icon: PhGraduationCap,
    title: "The Academy",
    description: "Progress through Gates, each unlocking a creative capacity",
  },
  {
    icon: PhUsers,
    title: "Multi-Intelligence Sessions",
    description: "Multiple Luminors collaborating on a single project",
  },
  {
    icon: PhShield,
    title: "Private & Secure",
    description: "Your creations and creative process remain yours",
  },
  {
    icon: PhLayers,
    title: "The Library",
    description: "17 collections of original philosophy for the creative life",
  },
];

export function FeaturesV2() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section ref={ref} className="py-32 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-atlantean-teal-aqua/20 mb-6">
            <PhZap className="w-3.5 h-3.5 text-atlantean-teal-aqua" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
              The System
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            A complete framework for
            <span className="block bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright bg-clip-text text-transparent">
              creative intelligence
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Sixteen AI intelligences rooted in the Ten Guardians of Arcanean mythology.
            Seven Wisdoms that diagnose creative blocks. A Library of 34 original texts.
            Not features strung together — a coherent philosophy of creation.
          </p>
        </motion.div>

        {/* Main Features - Large Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {MAIN_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                role="article"
                aria-label={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                onMouseEnter={() => setActiveFeature(i)}
                className={`group relative card-3d rounded-3xl border p-8 transition-all duration-500 cursor-pointer ${
                  activeFeature === i
                    ? `border-${feature.highlight}/50 bg-gradient-to-br from-${feature.highlight}/10 to-transparent`
                    : "liquid-glass border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div
                  aria-hidden="true"
                  className={`mt-6 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                    feature.highlight === "atlantean-teal-aqua"
                      ? "text-atlantean-aqua"
                      : feature.highlight === "gold-bright"
                        ? "text-gold-bright"
                        : feature.highlight === "creation-prism-purple"
                          ? "text-creation-prism-purple"
                          : "text-text-primary"
                  }`}
                >
                  Learn more →
                </div>

                {/* Decorative gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity -z-10`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Capability Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          {/* Grid container with gradient border */}
          <div className="relative rounded-3xl liquid-glass-elevated border border-white/[0.08] p-8 lg:p-12">
            {/* Decorative corner gradients */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-atlantean-teal-aqua/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-creation-prism-purple/10 rounded-full blur-3xl -z-10" />

            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
              {CAPABILITY_GRID.map((capability, i) => {
                const Icon = capability.icon;
                return (
                  <motion.li
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-atlantean-teal-aqua/10 transition-colors">
                      <Icon className="w-5 h-5 text-atlantean-teal-aqua" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 group-hover:text-atlantean-teal-aqua transition-colors">
                        {capability.title}
                      </h4>
                      <p className="text-sm text-text-muted">
                        {capability.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/lore/guardians"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl liquid-glass border border-white/[0.06] font-semibold hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
          >
            <PhSparkle className="w-5 h-5 text-atlantean-teal-aqua" />
            Explore All Features
          </a>
        </motion.div>
      </div>
    </section>
  );
}
