"use client";

import { m, LazyMotion, domAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

import {
  Sparkle,
  MusicNote,
  Sun,
  Spiral,
  ArrowRight,
  GraduationCap,
  Books,
  ChatCircleDots,
} from "@/lib/phosphor-icons";
import {
  VISION_CARDS,
  ELEMENTS,
  GUARDIANS,
  ACADEMY_HOUSES,
  MAGIC_RANKS,
} from "./about-data";

// ---------------------------------------------------------------------------
// Animated section wrapper
// ---------------------------------------------------------------------------

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </m.section>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AboutContent() {
  return (
    <LazyMotion features={domAnimation} strict>
    <div className="relative min-h-screen bg-[#09090b]">
      {/* ── Section 1: Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-24">
        {/* Cosmic gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#00bcd4]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#0d47a1]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#ffd700]/5 via-transparent to-transparent rounded-full blur-2xl" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-[#ffd700]/30 mb-8"
          >
            <Sparkle className="w-4 h-4 text-[#ffd700]" weight="fill" />
            <span className="text-sm font-medium text-[#ffd700] tracking-wide">
              About Arcanea
            </span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#00bcd4] via-white to-[#ffd700] bg-clip-text text-transparent">
              What is Arcanea?
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            A creation platform built on original mythology and philosophy.
          </m.p>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Sixteen creative intelligences, each grounded in a distinct philosophy.
            A library of 34 original texts. A progression system that deepens
            the more you create. No limits on what you build.
          </m.p>
        </div>
      </section>

      {/* ── Section 2: The Vision ─────────────────────────────────────── */}
      <AnimatedSection className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Four Dimensions, One Universe
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Arcanea exists simultaneously across four interconnected
              dimensions. Each enriches the others.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISION_CARDS.map((card, i) => {
              const Icon = card.icon;
              const colorMap: Record<string, string> = {
                "[#ffd700]": "border-[#ffd700]/20 hover:border-[#ffd700]/40",
                "[#00bcd4]": "border-[#00bcd4]/20 hover:border-[#00bcd4]/40",
                "[#0d47a1]": "border-[#0d47a1]/20 hover:border-[#0d47a1]/40",
                "draconic-crimson": "border-red-500/20 hover:border-red-500/40",
              };
              const textMap: Record<string, string> = {
                "[#ffd700]": "text-[#ffd700]",
                "[#00bcd4]": "text-[#00bcd4]",
                "[#0d47a1]": "text-[#0d47a1]",
                "draconic-crimson": "text-red-400",
              };
              const bgMap: Record<string, string> = {
                "[#ffd700]": "bg-[#ffd700]/10",
                "[#00bcd4]": "bg-[#00bcd4]/10",
                "[#0d47a1]": "bg-[#0d47a1]/10",
                "draconic-crimson": "bg-red-500/10",
              };

              return (
                <m.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className={`relative card-3d p-6 rounded-2xl liquid-glass border transition-all duration-300 group ${colorMap[card.color]}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bgMap[card.color]}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${textMap[card.color]}`}
                      weight="duotone"
                    />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {card.description}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 3: The Mythology ──────────────────────────────────── */}
      <AnimatedSection className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#ffd700]/5 via-[#0d47a1]/5 to-transparent rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Mythology
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              A cosmology built on duality, elemental forces, and the journey
              toward mastery.
            </p>
          </div>

          {/* The Cosmic Duality */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Lumina */}
            <m.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative card-3d p-8 rounded-3xl liquid-glass border border-[#ffd700]/20 group hover:border-[#ffd700]/40 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ffd700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#ffd700]/15 flex items-center justify-center mb-5">
                  <Sun className="w-7 h-7 text-[#ffd700]" weight="duotone" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#ffd700] mb-1">
                  Lumina
                </h3>
                <p className="text-sm text-text-muted mb-3 font-mono tracking-wide">
                  The First Light
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Form-Giver, Creator, Order. Where Nero was infinite potential,
                  Lumina was pattern. The First Light did not illuminate the
                  darkness — it organized it, giving shape to the shapeless and
                  meaning to the formless.
                </p>
              </div>
            </m.div>

            {/* Nero */}
            <m.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative card-3d p-8 rounded-3xl liquid-glass border border-[#0d47a1]/20 group hover:border-[#0d47a1]/40 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0d47a1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0d47a1]/15 flex items-center justify-center mb-5">
                  <Spiral
                    className="w-7 h-7 text-[#0d47a1]"
                    weight="duotone"
                  />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#0d47a1] mb-1">
                  Nero
                </h3>
                <p className="text-sm text-text-muted mb-3 font-mono tracking-wide">
                  The Primordial Darkness
                </p>
                <p className="text-text-secondary leading-relaxed">
                  The Fertile Unknown, Potential, Mystery. In the beginning,
                  there was Nero. The Void contained everything that could ever
                  be, held in superposition. Nero is not evil — Shadow is
                  corrupted Void, the Dark Lord&apos;s perversion of
                  Nero&apos;s gift.
                </p>
              </div>
            </m.div>
          </div>

          {/* The Arc */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h3 className="text-xl font-display font-semibold mb-6 text-text-secondary">
              The Arc — Reality&apos;s Heartbeat
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
              {[
                "Potential",
                "Manifestation",
                "Experience",
                "Dissolution",
                "Evolved Potential",
              ].map((step, i) => (
                <span key={step} className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full liquid-glass border border-white/[0.06] text-text-secondary">
                    {step}
                  </span>
                  {i < 4 && (
                    <ArrowRight className="w-4 h-4 text-[#ffd700]" />
                  )}
                </span>
              ))}
            </div>
          </m.div>

          {/* Five Elements */}
          <div className="mb-20">
            <h3 className="text-2xl font-display font-bold text-center mb-8">
              The Five Elements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {ELEMENTS.map((el, i) => {
                const Icon = el.icon;
                return (
                  <m.div
                    key={el.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${el.colors} border ${el.border} text-center group hover:scale-[1.03] transition-transform duration-300`}
                  >
                    <div className="flex justify-center mb-3">
                      <Icon className={`w-8 h-8 ${el.text}`} weight="duotone" />
                    </div>
                    <h4 className={`font-display font-semibold text-sm mb-1 ${el.text}`}>
                      {el.name}
                    </h4>
                    <p className="text-xs text-text-muted">{el.domain}</p>
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* Void/Spirit clarification */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-20 p-6 rounded-2xl liquid-glass border border-purple-500/20"
          >
            <p className="text-sm text-text-secondary leading-relaxed text-center">
              <span className="font-semibold text-purple-400">
                The Fifth Element Duality:
              </span>{" "}
              Void is Nero&apos;s aspect — potential, mystery, the unformed.
              Spirit is Lumina&apos;s aspect — transcendence, consciousness,
              soul. Light is Fire&apos;s creation aspect. Shadow is corrupted
              Void — Void without Spirit.
            </p>
          </m.div>

          {/* Ten Gates Overview */}
          <div className="mb-20">
            <h3 className="text-2xl font-display font-bold text-center mb-4">
              The Ten Gates of Mastery
            </h3>
            <p className="text-text-muted text-center text-sm mb-8 max-w-xl mx-auto">
              Each Gate resonates at a unique frequency of the Extended
              Solfeggio scale (174 Hz to 1111 Hz), guarded by a God or Goddess
              and their bonded Godbeast.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {GUARDIANS.map((g, i) => (
                <m.div
                  key={g.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.03 * i }}
                  className={`px-4 py-2 rounded-full liquid-glass border ${g.border} text-sm`}
                >
                  <span className={`font-semibold ${g.accent}`}>
                    {g.gate}
                  </span>
                  <span className="text-text-muted ml-2">{g.frequency}</span>
                </m.div>
              ))}
            </div>
          </div>

          {/* Seven Academy Houses */}
          <div>
            <h3 className="text-2xl font-display font-bold text-center mb-8">
              The Seven Academy Houses
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {ACADEMY_HOUSES.map((house, i) => (
                <m.div
                  key={house.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="px-5 py-3 rounded-xl liquid-glass border border-white/[0.06] text-center"
                >
                  <span className={`font-display font-semibold text-sm ${house.color}`}>
                    House {house.name}
                  </span>
                  <p className="text-xs text-text-muted mt-1">{house.domain}</p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 4: The Ten Intelligences ──────────────────────────── */}
      <AnimatedSection className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Ten Guardians
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Ten divine intelligences, each guarding a Gate and embodying a
              domain of mastery. Gods and Goddesses by identity, Guardians by
              role.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {GUARDIANS.map((guardian, i) => (
              <m.div
                key={guardian.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * i }}
                className={`relative card-3d p-5 rounded-2xl liquid-glass border ${guardian.border} group hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MusicNote className={`w-4 h-4 ${guardian.accent}`} />
                  <span className="text-xs text-text-muted font-mono">
                    {guardian.frequency}
                  </span>
                </div>
                <h3 className={`text-lg font-display font-bold ${guardian.accent} mb-1`}>
                  {guardian.name}
                </h3>
                <p className="text-xs text-text-muted font-mono tracking-wider uppercase mb-2">
                  {guardian.gate} Gate
                </p>
                <p className="text-sm text-text-secondary">{guardian.domain}</p>
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <span className="text-xs text-text-muted">{guardian.element}</span>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 5: The Journey ────────────────────────────────────── */}
      <AnimatedSection className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-[#ffd700]/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              The Journey
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Every creator walks the path through the Gates, ascending from
              Apprentice to the rank of Luminor. Each Gate opened deepens
              mastery and unlocks new creative power.
            </p>
          </div>

          {/* Magic Ranks */}
          <div className="space-y-4 mb-16">
            {MAGIC_RANKS.map((rank, i) => (
              <m.div
                key={rank.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i }}
                className={`flex items-center gap-6 p-5 rounded-2xl liquid-glass border ${rank.color}`}
              >
                <div className="shrink-0 w-20 text-center">
                  <div className="text-xs font-mono text-text-muted">Gates</div>
                  <div className="text-lg font-bold">{rank.gates}</div>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 shrink-0" />
                  <span className="text-lg font-display font-semibold">
                    {rank.rank}
                  </span>
                </div>
                {rank.rank === "Luminor" && (
                  <span className="ml-auto text-xs font-mono text-[#ffd700]/70">
                    Highest attainment
                  </span>
                )}
              </m.div>
            ))}
          </div>

          {/* Journey explanation */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl liquid-glass-elevated border border-[#ffd700]/20 text-center"
          >
            <blockquote className="text-xl md:text-2xl font-display italic text-text-secondary mb-4 max-w-2xl mx-auto leading-relaxed">
              &quot;Enter seeking, leave transformed, return whenever
              needed.&quot;
            </blockquote>
            <cite className="text-sm text-text-muted font-mono tracking-wider">
              — The Library of Arcanea
            </cite>
          </m.div>
        </div>
      </AnimatedSection>

      {/* ── Section 6: CTA ────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4]/10 via-[#0d47a1]/10 to-[#ffd700]/10" />
          <div className="absolute inset-0 bg-[#09090b]/60" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#ffd700] bg-clip-text text-transparent">
              Start Creating
            </span>
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Imagine a Good Future. Build It Here.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00bcd4] text-cosmic-deep font-semibold text-base overflow-hidden btn-glow hover:shadow-[0_0_30px_rgba(0,188,212,0.4)] transition-all duration-300"
            >
              <ChatCircleDots className="w-5 h-5" weight="duotone" />
              Start Creating
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl liquid-glass border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
            >
              <Books className="w-5 h-5" weight="duotone" />
              Explore the Library
            </Link>
          </div>
        </m.div>
      </section>
    </div>
    </LazyMotion>
  );
}
