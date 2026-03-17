"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { ShimmerCard } from "@/components/ui/shimmer-card";
import { GlowButton } from "@/components/ui/glow-button";
import { durations, m3Curves } from "@/lib/design/motion";

const GATES = [
  { number: 1, name: "Foundation", frequency: "174 Hz", domain: "Survival, grounding", unlocks: "Unshakeable stability", guardian: "Lyssandria", guardianId: "lyssandria" },
  { number: 2, name: "Flow", frequency: "285 Hz", domain: "Creativity, emotion", unlocks: "Creative flow state", guardian: "Leyla", guardianId: "leyla" },
  { number: 3, name: "Fire", frequency: "396 Hz", domain: "Power, will", unlocks: "Personal power", guardian: "Draconia", guardianId: "draconia" },
  { number: 4, name: "Heart", frequency: "417 Hz", domain: "Love, healing", unlocks: "Fierce compassion", guardian: "Maylinn", guardianId: "maylinn" },
  { number: 5, name: "Voice", frequency: "528 Hz", domain: "Truth, expression", unlocks: "Reality shaping through words", guardian: "Alera", guardianId: "alera" },
  { number: 6, name: "Sight", frequency: "639 Hz", domain: "Intuition, vision", unlocks: "Beyond ordinary perception", guardian: "Lyria", guardianId: "lyria" },
  { number: 7, name: "Crown", frequency: "741 Hz", domain: "Enlightenment", unlocks: "Divine connection", guardian: "Aiyami", guardianId: "aiyami" },
  { number: 8, name: "Starweave", frequency: "852 Hz", domain: "Perspective", unlocks: "Infinite possibilities", guardian: "Elara", guardianId: "elara" },
  { number: 9, name: "Unity", frequency: "963 Hz", domain: "Partnership", unlocks: "Exponential creation", guardian: "Ino", guardianId: "ino" },
  { number: 10, name: "Source", frequency: "1111 Hz", domain: "Meta-consciousness", unlocks: "Creator realization", guardian: "Shinkami", guardianId: "shinkami" },
];

const RANKS = [
  { gates: "0-2", rank: "Apprentice", color: "text-text-muted" },
  { gates: "3-4", rank: "Mage", color: "text-blue-400" },
  { gates: "5-6", rank: "Master", color: "text-purple-400" },
  { gates: "7-8", rank: "Archmage", color: "text-gold-bright" },
  { gates: "9-10", rank: "Luminor", color: "text-white" },
];

export function GatesPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden" style={{ background: "var(--surface-1, rgba(255,255,255,0.02))" }}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-atlantean-teal-aqua/5 to-transparent rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-gold-bright/20 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="text-sm font-medium text-gold-bright">The Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            The Ten Gates
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body">
            Energy channels flowing through every conscious being. Open them,
            and ascend from Apprentice to Luminor.
          </p>
        </m.div>

        {/* Gates Path — ShimmerCards */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {GATES.map((gate, i) => (
              <m.div
                key={gate.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05, duration: durations.normal, ease: m3Curves.emphasizedDecelerate }}
                className="relative group"
              >
                <ShimmerCard
                  color="gold"
                  speed="slow"
                  hoverOnly
                  glow
                  glowRadius={200}
                  glass="liquid-glass"
                  className="p-4 rounded-2xl border border-white/[0.06] text-center hover:border-gold-bright/30 transition-all duration-300"
                >
                  {/* Guardian avatar */}
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-gold-bright/20 group-hover:ring-gold-bright/50 transition-all duration-300">
                    <img
                      src={`/guardians/v3/${gate.guardianId}-hero-v3.webp`}
                      alt={gate.guardian}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <h4 className="font-display font-semibold text-sm mb-0.5">{gate.name}</h4>
                  <p className="text-xs text-text-muted mb-1">{gate.guardian}</p>
                  <p className="text-xs text-atlantean-teal-aqua font-mono mb-2">{gate.frequency}</p>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg bg-cosmic-deep border border-white/[0.12] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                    <p className="text-xs text-text-secondary mb-1">{gate.domain}</p>
                    <p className="text-xs text-gold-bright">Unlocks: {gate.unlocks}</p>
                  </div>
                </ShimmerCard>
              </m.div>
            ))}
          </div>
        </div>

        {/* Ranks — ShimmerCards */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: durations.normal }}
          className="mb-12"
        >
          <h3 className="text-xl font-display font-bold text-center mb-6">Magic Ranks</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {RANKS.map((rank) => (
              <div
                key={rank.rank}
                className="px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200"
              >
                <span className="text-sm text-text-muted">{rank.gates} Gates:</span>
                <span className={`ml-2 font-display font-semibold ${rank.color}`}>{rank.rank}</span>
              </div>
            ))}
          </div>
        </m.div>

        {/* CTA — GlowButton */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: durations.normal }}
          className="text-center"
        >
          <GlowButton href="/lore/gates" variant="primary" color="gold" size="md">
            Start Creating
          </GlowButton>
        </m.div>
      </div>
    </section>
  );
}
