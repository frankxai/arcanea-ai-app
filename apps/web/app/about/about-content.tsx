/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";
import { PUBLIC_REPO_SUMMARY } from "@/lib/public-repo-registry";
import { FACTS } from "@/lib/facts";
import Image from 'next/image';

import { m, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import {
  Sparkle,
  ChatCircleDots,
  Books,
} from "@/lib/phosphor-icons";
import { VISION_CARDS } from "./about-data";
import {
  AnimatedSection,
  MythologySection,
  GuardiansSection,
  JourneySection,
  LuminorShowcase,
  ArcaneanCodeSection,
  CreatorJourneySection,
  FounderSection,
} from "./about-sections";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AboutContent() {
  return (
    <LazyMotion features={domAnimation} strict>
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* ── Section 1: Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-radial from-[var(--arc-brand-atlantean-teal)]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-[var(--arc-brand-cosmic-blue)]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[var(--arc-brand-arcanean-gold)]/5 via-transparent to-transparent rounded-full blur-2xl" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Mascot — creating variant, the soul of Arcanea */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <Image
              src="/images/mascot/arcanea-creating.png"
              alt="Arcanea"
              width={200}
              height={200}
              className="object-contain drop-shadow-[0_0_40px_rgba(127,255,212,0.2)] animate-[mascot-float_3s_ease-in-out_infinite]"
             />
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-[var(--arc-brand-arcanean-gold)]/30 mb-8"
          >
            <Sparkle className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]" weight="fill" />
            <span className="text-sm font-medium text-[var(--arc-brand-arcanean-gold)] tracking-wide">
              About Arcanea
            </span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-white to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
              Enter Living Worlds. Build Your Own.
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Arcanea is a protected story universe and a creator system for building worlds you own.
            {FACTS.luminors} configured specialist minds. Ten Guardians. One governed release at a time.
          </m.p>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Enter Arcanea through its stories, Guardians, Godbeasts, music, and worlds.
            Use the Arcanea Connector to develop your own continuity with explicit
            rights, provenance, and release states. The Starlight substrate remains
            a separate technical layer governed component by component.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-mono text-white/30"
          >
            <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">
              Built by Frank Riemer
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">
              Arcanea Universe + Connector
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">
              Next.js + Vercel AI SDK
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/[0.06]">
              Rights-Aware Interfaces
            </span>
          </m.div>
        </div>
      </section>

      {/* ── Section 1.5: Stats Bar ─────────────────────────────────────── */}
      <StatsBar />

      {/* ── Section 1.75: Our Intelligence ────────────────────────────── */}
      <IntelligenceSection />

      {/* ── Section 2: The Vision ─────────────────────────────────────── */}
      <VisionSection />

      {/* ── Section 2.5: The Analogy ───────────────────────────────────── */}
      <AnalogySection />

      {/* ── Section 3: The Mythology ──────────────────────────────────── */}
      <MythologySection />

      {/* ── Section 4: The Ten Guardians ──────────────────────────────── */}
      <GuardiansSection />

      {/* ── Section 5: The Journey ────────────────────────────────────── */}
      <JourneySection />

      {/* ── Section 5.5: Luminor Showcase ─────────────────────────────── */}
      <LuminorShowcase />

      {/* ── Section 5.75: The Arcanean Code ─────────────────────────── */}
      <ArcaneanCodeSection />

      {/* ── Section 5.9: The Creator Journey ──────────────────────────── */}
      <CreatorJourneySection />

      {/* ── Section 5.95: The Founder ──────────────────────────────────── */}
      <FounderSection />

      {/* ── Section 6: CTA ────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/10 via-[var(--arc-brand-cosmic-blue)]/10 to-[var(--arc-brand-arcanean-gold)]/10" />
          <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]/60" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
              Start Creating
            </span>
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Imagine a Good Future. Build It Here.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--arc-brand-atlantean-teal)] text-cosmic-deep font-semibold text-base overflow-hidden btn-glow hover:shadow-[0_0_30px_rgba(0,188,212,0.4)] transition-all duration-300"
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

// ---------------------------------------------------------------------------
// Inline sub-sections (small enough to keep here)
// ---------------------------------------------------------------------------

function StatsBar() {
  return (
    <AnimatedSection className="pb-20 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { value: String(FACTS.guardians), label: "Guardians" },
            { value: String(FACTS.gates), label: "Mastery Gates" },
            { value: String(FACTS.elements), label: "Elements" },
            { value: String(FACTS.luminors), label: "Configured Specialists" },
            { value: "1", label: "Flagship in Development" },
          ].map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
              className="text-center p-5 rounded-2xl liquid-glass border border-white/[0.06]"
            >
              <p className="text-2xl md:text-3xl font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted tracking-wide">
                {stat.label}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function IntelligenceSection() {
  return (
    <AnimatedSection className="pb-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--arc-brand-atlantean-teal)]/50 mb-4">
            Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Intelligence
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Not a wrapper around GPT. A purpose-built creative intelligence
            system with proprietary knowledge, specialized agents, and a
            three-layer architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            { num: "13", label: "Configured AI Specialists", desc: "Each grounded in a specific creative domain - writing, research, design, music, code, strategy, and world-building. Not one general AI. Thirteen configured minds.", border: "border-[var(--arc-brand-atlantean-teal)]/20", numBg: "bg-[var(--arc-brand-atlantean-teal)]/10", numColor: "text-[var(--arc-brand-atlantean-teal)]" },
            { num: "1", label: "Protected Story Universe", desc: "Arcanea canon, characters, names, and release assets are governed separately from creator tools and technical components.", border: "border-[var(--arc-brand-arcanean-gold)]/20", numBg: "bg-[var(--arc-brand-arcanean-gold)]/10", numColor: "text-[var(--arc-brand-arcanean-gold)]" },
            { num: "3", label: "Three-Layer Architecture", desc: "Starlight Intelligence (memory + learning) feeds Intelligence OS (orchestration + routing), which powers the Platform (creation tools you interact with).", border: "border-[var(--arc-brand-cosmic-blue)]/20", numBg: "bg-[var(--arc-brand-cosmic-blue)]/10", numColor: "text-[var(--arc-brand-cosmic-blue)]" },
            { num: "10", label: "Progression Gates", desc: "From Apprentice to Luminor mastery. Each Gate unlocks deeper AI capabilities, specialized training, and creative power. Progress earned through creation.", border: "border-purple-500/20", numBg: "bg-purple-500/10", numColor: "text-purple-400" },
          ].map((card) => (
            <div key={card.num} className={`p-6 rounded-2xl liquid-glass border ${card.border}`}>
              <div className={`w-10 h-10 rounded-xl ${card.numBg} flex items-center justify-center mb-4`}>
                <span className={`${card.numColor} font-display font-bold text-sm`}>{card.num}</span>
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{card.label}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl liquid-glass border border-white/[0.06] text-center">
          <h3 className="text-lg font-display font-semibold mb-3">Published Technical Components</h3>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto mb-4">
            The public registry currently tracks {PUBLIC_REPO_SUMMARY.public} public repositories and {PUBLIC_REPO_SUMMARY.packages} package references.
            Each component is governed by its own license. No repository license grants rights to Arcanea canon, characters, artwork, music, or trademarks.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-mono text-white/25">
            <span>Next.js 16</span>
            <span className="text-white/10">·</span>
            <span>React 19</span>
            <span className="text-white/10">·</span>
            <span>Supabase</span>
            <span className="text-white/10">·</span>
            <span>Vercel</span>
            <span className="text-white/10">·</span>
            <span>Claude</span>
            <span className="text-white/10">·</span>
            <span>Gemini</span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function VisionSection() {
  return (
    <AnimatedSection className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Six Layers, One Multiverse
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            All six coexist. None is &ldquo;the real Arcanea.&rdquo;
            Together they form a creative multiverse where
            imagination becomes reality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISION_CARDS.map((card, i) => {
            const Icon = card.icon;
            const colorMap: Record<string, string> = {
              "[var(--arc-brand-arcanean-gold)]": "border-[var(--arc-brand-arcanean-gold)]/20 hover:border-[var(--arc-brand-arcanean-gold)]/40",
              "[var(--arc-brand-atlantean-teal)]": "border-[var(--arc-brand-atlantean-teal)]/20 hover:border-[var(--arc-brand-atlantean-teal)]/40",
              "[var(--arc-brand-cosmic-blue)]": "border-[var(--arc-brand-cosmic-blue)]/20 hover:border-[var(--arc-brand-cosmic-blue)]/40",
              "draconic-crimson": "border-red-500/20 hover:border-red-500/40",
            };
            const textMap: Record<string, string> = {
              "[var(--arc-brand-arcanean-gold)]": "text-[var(--arc-brand-arcanean-gold)]",
              "[var(--arc-brand-atlantean-teal)]": "text-[var(--arc-brand-atlantean-teal)]",
              "[var(--arc-brand-cosmic-blue)]": "text-[var(--arc-brand-cosmic-blue)]",
              "draconic-crimson": "text-red-400",
            };
            const bgMap: Record<string, string> = {
              "[var(--arc-brand-arcanean-gold)]": "bg-[var(--arc-brand-arcanean-gold)]/10",
              "[var(--arc-brand-atlantean-teal)]": "bg-[var(--arc-brand-atlantean-teal)]/10",
              "[var(--arc-brand-cosmic-blue)]": "bg-[var(--arc-brand-cosmic-blue)]/10",
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
  );
}

function AnalogySection() {
  return (
    <AnimatedSection className="pb-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="p-8 rounded-3xl liquid-glass border border-white/[0.06]">
          <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-6 text-center">
            Think of it like
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-lg font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-2">Unreal Engine</p>
              <p className="text-sm text-text-secondary">Not a game — the engine for making games</p>
            </div>
            <div>
              <p className="text-lg font-display font-bold text-[var(--arc-brand-arcanean-gold)] mb-2">D&amp;D</p>
              <p className="text-sm text-text-secondary">Not a story — the system for infinite stories</p>
            </div>
            <div>
              <p className="text-lg font-display font-bold text-white/80 mb-2">WordPress</p>
              <p className="text-sm text-text-secondary">Not a website — the framework for building websites</p>
            </div>
          </div>
          <p className="text-sm text-text-muted text-center mt-6 leading-relaxed max-w-2xl mx-auto">
            arcanea.ai is both a working product you can use today (chat, imagine, create)
            and the reference world showing what the framework can build. You use it. You learn from it.
            Then you build your own.
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
