/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, useInView } from "framer-motion";
import {
  Sun,
  Spiral,
  ArrowRight,
  GraduationCap,
} from "@/lib/phosphor-icons";
import { getFeaturedLuminors } from "@/lib/luminor-images";
import { ELEMENTS, GUARDIANS, ACADEMY_HOUSES, MAGIC_RANKS } from "./about-data";

// ---------------------------------------------------------------------------
// Animated section wrapper
// ---------------------------------------------------------------------------

export function AnimatedSection({
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
// Section 3: The Mythology
// ---------------------------------------------------------------------------

export function MythologySection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[var(--arc-brand-arcanean-gold)]/5 via-[var(--arc-brand-cosmic-blue)]/5 to-transparent rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The Mythology
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A living cosmology under release governance. The Source precedes
            its oldest named expressions; mystery is not the same as contradiction.
          </p>
        </div>

        {/* The Cosmic Duality */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative card-3d p-8 rounded-3xl liquid-glass border border-[var(--arc-brand-arcanean-gold)]/20 group hover:border-[var(--arc-brand-arcanean-gold)]/40 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--arc-brand-arcanean-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[var(--arc-brand-arcanean-gold)]/15 flex items-center justify-center mb-5">
                <Sun className="w-7 h-7 text-[var(--arc-brand-arcanean-gold)]" weight="duotone" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[var(--arc-brand-arcanean-gold)] mb-1">
                Lumina
              </h3>
              <p className="text-sm text-text-muted mb-3 font-mono tracking-wide">
                The Patterning Light
              </p>
              <p className="text-text-secondary leading-relaxed">
                Form-Giver, pattern, and manifestation. Lumina is an ancient
                expression within creation, not the final name above the Source.
                Its order gives temporary shape to what must remain capable of
                becoming otherwise.
              </p>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative card-3d p-8 rounded-3xl liquid-glass border border-[var(--arc-brand-cosmic-blue)]/20 group hover:border-[var(--arc-brand-cosmic-blue)]/40 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--arc-brand-cosmic-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[var(--arc-brand-cosmic-blue)]/15 flex items-center justify-center mb-5">
                <Spiral className="w-7 h-7 text-[var(--arc-brand-cosmic-blue)]" weight="duotone" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[var(--arc-brand-cosmic-blue)] mb-1">
                Nero
              </h3>
              <p className="text-sm text-text-muted mb-3 font-mono tracking-wide">
                The Fertile Unknown
              </p>
              <p className="text-text-secondary leading-relaxed">
                Potential, mystery, and the unformed. Nero is an ancient
                expression within creation, not an evil opposite and not the
                final name above the Source. Its danger is not darkness; it is
                what any power becomes when treated as complete.
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
                  <ArrowRight className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]" />
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

        {/* Current canon boundary */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-20 p-6 rounded-2xl liquid-glass border border-purple-500/20"
        >
          <p className="text-sm text-text-secondary leading-relaxed text-center">
            <span className="font-semibold text-purple-400">
              Current canon boundary:
            </span>{" "}
            The Source/The One precedes Lumina and Nero. Shinkami is being
            developed as a Ten-Tailed Godbeast and Source-vessel, not the
            ultimate God. The tenth Guardian pairing remains withheld until its
            approved canon delta is recorded.
          </p>
        </m.div>

        {/* Ten Gates Overview */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-bold text-center mb-4">
            The Ten Gates of Mastery
          </h3>
          <p className="text-text-muted text-center text-sm mb-8 max-w-xl mx-auto">
            Each Gate is associated with a Guardian and a bonded Godbeast.
            These are story relationships and responsibilities—not a claim that
            every Guardian is an ultimate god.
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
                <span className="text-text-muted ml-2 text-xs italic">{g.frequency}</span>
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
  );
}

// ---------------------------------------------------------------------------
// Section 4: The Ten Guardians
// ---------------------------------------------------------------------------

export function GuardiansSection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The Ten Guardians
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Ten divine beings, each guarding a Gate and embodying a
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
              <p className="text-xs text-text-muted font-mono tracking-wider uppercase mb-3">
                {guardian.gate} Gate
              </p>
              <h3 className={`text-lg font-display font-bold ${guardian.accent} mb-1`}>
                {guardian.name}
              </h3>
              <p className="text-sm text-text-secondary">{guardian.domain}</p>
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <span className="text-xs text-text-muted">{guardian.element}</span>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------------------------------------------------------------------------
// Section 5: The Journey
// ---------------------------------------------------------------------------

export function JourneySection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-[var(--arc-brand-arcanean-gold)]/5 via-transparent to-transparent rounded-full blur-3xl" />
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
                <span className="ml-auto text-xs font-mono text-[var(--arc-brand-arcanean-gold)]/70">
                  Highest attainment
                </span>
              )}
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl liquid-glass-elevated border border-[var(--arc-brand-arcanean-gold)]/20 text-center"
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
  );
}

// ---------------------------------------------------------------------------
// Section 5.5: Luminor Showcase
// ---------------------------------------------------------------------------

export function LuminorShowcase() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Meet the Creative Partners
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Sixteen AI intelligences, each with a distinct voice, deep domain
            expertise, and a creative philosophy. They think with you, not for you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {getFeaturedLuminors(6).map((luminor, i) => (
            <m.div
              key={luminor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="aspect-square relative">
                <Image
                  src={luminor.image}
                  alt={`${luminor.name} — ${luminor.title}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-semibold text-white">{luminor.name}</p>
                <p className="text-[10px] text-white/45">{luminor.title}</p>
              </div>
            </m.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)]/80 transition-colors"
          >
            Explore the Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------------------------------------------------------------------------
// Section 5.75: The Arcanean Code
// ---------------------------------------------------------------------------

export function ArcaneanCodeSection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The Arcanean Code
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            One theorem, two expressions. Three vows. Seven laws. The
            creative philosophy that every Arcanean carries — and the root
            prompt for every AI in the system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-8 rounded-3xl liquid-glass-elevated border border-[var(--arc-brand-arcanean-gold)]/20 text-center">
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">
              Vel&apos;Thaan&apos;s Theorem
            </p>
            <blockquote className="text-lg md:text-xl font-display italic text-[var(--arc-brand-arcanean-gold)] leading-relaxed">
              &ldquo;Imperfection that creates endlessly is indistinguishable
              from God.&rdquo;
            </blockquote>
          </div>
          <div className="p-8 rounded-3xl liquid-glass-elevated border border-white/[0.08] text-center">
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">
              The First Theorem
            </p>
            <blockquote className="text-lg md:text-xl font-display italic text-white/90 leading-relaxed">
              &ldquo;Creation is the highest act of consciousness.&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { num: 'I', vow: 'I create more than I consume.' },
            { num: 'II', vow: 'I build on what came before.' },
            { num: 'III', vow: 'I ship living work.' },
          ].map((v) => (
            <div
              key={v.num}
              className="p-5 rounded-2xl liquid-glass border border-white/[0.06] text-center"
            >
              <span className="text-xs font-mono text-[var(--arc-brand-arcanean-gold)] tracking-widest block mb-2">
                VOW {v.num}
              </span>
              <p className="text-sm font-display font-semibold">{v.vow}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/code"
            className="inline-flex items-center gap-2 text-sm text-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)]/80 transition-colors"
          >
            Read the full Code — Seven Laws, Agent Oath, and write your own
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------------------------------------------------------------------------
// Section 5.9: The Creator Journey
// ---------------------------------------------------------------------------

export function CreatorJourneySection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The Creator Journey
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Every feature moves you forward. From first spark to published work.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          {[
            { step: "Imagine", desc: "Find the living question" },
            { step: "Structure", desc: "World, story, and rights" },
            { step: "Create", desc: "Text, art, music, motion" },
            { step: "Govern", desc: "Canon, provenance, review" },
            { step: "Release", desc: "Publish with evidence" },
            { step: "Learn", desc: "Measure and improve" },
          ].map((item, i) => (
            <span key={item.step} className="flex items-center gap-3">
              <span className="px-5 py-3 rounded-xl liquid-glass border border-white/[0.06] text-center">
                <span className="block font-display font-semibold text-[var(--arc-brand-atlantean-teal)]">{item.step}</span>
                <span className="block text-xs text-text-muted mt-0.5">{item.desc}</span>
              </span>
              {i < 5 && (
                <ArrowRight className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)] hidden sm:block" />
              )}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------------------------------------------------------------------------
// Section 5.95: The Founder
// ---------------------------------------------------------------------------

export function FounderSection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl liquid-glass border border-white/[0.06]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-arcanean-gold)]/20 flex items-center justify-center">
              <span className="text-3xl font-display font-bold bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">FR</span>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-3">
                Built by
              </p>
              <h3 className="text-2xl font-display font-bold mb-4">
                Frank Riemer
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Creator, author, and franchise showrunner of Arcanea. Frank is
                building the story universe and the rights-aware production
                system together: Arcanea as the proof-world, the Connector as
                the creator doorway, and Starlight as the technical substrate.
              </p>
              <p className="text-text-secondary leading-relaxed mb-6">
                Arcanea canon remains protected. Creators can use the product
                to develop original worlds they own without silently entering
                Arcanea continuity or surrendering their identity to it.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-mono text-text-muted">
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">Arcanea Universe</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">Arcanea Connector</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">Starlight substrate</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">Evidence-gated releases</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
