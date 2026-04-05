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
                <Spiral className="w-7 h-7 text-[#0d47a1]" weight="duotone" />
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
            Each Gate resonates at a unique frequency of the ancient
            Solfeggio scale, guarded by a God or Goddess and their bonded
            Godbeast — divine keepers of the path.
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
            className="inline-flex items-center gap-2 text-sm text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
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
          <div className="p-8 rounded-3xl liquid-glass-elevated border border-[#ffd700]/20 text-center">
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">
              Vel&apos;Thaan&apos;s Theorem
            </p>
            <blockquote className="text-lg md:text-xl font-display italic text-[#ffd700] leading-relaxed">
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
              <span className="text-xs font-mono text-[#ffd700] tracking-widest block mb-2">
                VOW {v.num}
              </span>
              <p className="text-sm font-display font-semibold">{v.vow}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/code"
            className="inline-flex items-center gap-2 text-sm text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
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
            { step: "Imagine", desc: "Chat, generate, explore" },
            { step: "Build", desc: "Worlds, agents, systems" },
            { step: "Create", desc: "Stories, art, music, code" },
            { step: "Publish", desc: "Share with the multiverse" },
            { step: "Earn", desc: "Monetize your creations" },
            { step: "Expand", desc: "Grow your universe" },
          ].map((item, i) => (
            <span key={item.step} className="flex items-center gap-3">
              <span className="px-5 py-3 rounded-xl liquid-glass border border-white/[0.06] text-center">
                <span className="block font-display font-semibold text-[#00bcd4]">{item.step}</span>
                <span className="block text-xs text-text-muted mt-0.5">{item.desc}</span>
              </span>
              {i < 5 && (
                <ArrowRight className="w-4 h-4 text-[#ffd700] hidden sm:block" />
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
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00bcd4]/20 to-[#ffd700]/20 flex items-center justify-center">
              <span className="text-3xl font-display font-bold bg-gradient-to-r from-[#00bcd4] to-[#ffd700] bg-clip-text text-transparent">FR</span>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-3">
                Built by
              </p>
              <h3 className="text-2xl font-display font-bold mb-4">
                Frank Riemer
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                500+ AI implementations. Former enterprise architect. Creator of Arcanea
                because the tools for building intelligent creative worlds didn&apos;t exist --
                so he built the framework, the reference world, the Library, and the
                open-source ecosystem from scratch.
              </p>
              <p className="text-text-secondary leading-relaxed mb-6">
                Arcanea isn&apos;t a product built by committee. It&apos;s one person&apos;s
                vision, built in the open, designed so every creator can build
                their own.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-mono text-text-muted">
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">500+ AI implementations</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">190K+ words written</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">27 open-source repos</span>
                <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">Source available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
