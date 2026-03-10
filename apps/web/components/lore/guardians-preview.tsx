"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { GlowButton } from "@/components/ui/glow-button";
import { durations, m3Curves } from "@/lib/design/motion";

const GUARDIANS = [
  { name: "Lyssandria", gate: "Foundation", frequency: "174 Hz", godbeast: "Kaelith", element: "Earth", dotColor: "#b45309", description: "Guardian of stability and unshakeable ground" },
  { name: "Leyla", gate: "Flow", frequency: "285 Hz", godbeast: "Veloura", element: "Water", dotColor: "#3b82f6", description: "Guardian of creativity and emotional depth" },
  { name: "Draconia", gate: "Fire", frequency: "396 Hz", godbeast: "Draconis", element: "Fire", dotColor: "#ef4444", description: "Guardian of power, will, and courage" },
  { name: "Maylinn", gate: "Heart", frequency: "417 Hz", godbeast: "Laeylinn", element: "Wind", dotColor: "#22c55e", description: "Guardian of love, healing, and growth" },
  { name: "Alera", gate: "Voice", frequency: "528 Hz", godbeast: "Otome", element: "Fire/Wind", dotColor: "#06b6d4", description: "Guardian of truth and expression" },
  { name: "Lyria", gate: "Sight", frequency: "639 Hz", godbeast: "Yumiko", element: "Water/Void", dotColor: "#a855f7", description: "Guardian of intuition and vision" },
  { name: "Aiyami", gate: "Crown", frequency: "741 Hz", godbeast: "Sol", element: "Fire/Light", dotColor: "#ffd700", description: "Guardian of enlightenment and divinity" },
  { name: "Elara", gate: "Starweave", frequency: "852 Hz", godbeast: "Vaelith", element: "Wind/Void", dotColor: "#ec4899", description: "Guardian of perspective and possibility" },
  { name: "Ino", gate: "Unity", frequency: "963 Hz", godbeast: "Kyuro", element: "All", dotColor: "#e5e5e5", description: "Guardian of partnership and fusion" },
  { name: "Shinkami", gate: "Source", frequency: "1111 Hz", godbeast: "Source", element: "Void/Spirit", dotColor: "#c084fc", description: "The Unified — Meta-consciousness itself" },
];

export function GuardiansPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-atlantean-teal-aqua/20 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-medium text-atlantean-teal-aqua">
              The Ten Guardians
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Keepers of the Gates
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body">
            Ten Gods and Goddesses, each bonded to a primal Godbeast, guarding
            the energy channels that flow through every conscious being.
          </p>
        </m.div>

        {/* Guardian Grid — GlowCards with CSS-only hover */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {GUARDIANS.map((guardian, i) => (
            <m.div
              key={guardian.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05, duration: durations.normal, ease: m3Curves.emphasizedDecelerate }}
            >
              <GlowCard
                glowColor={`radial-gradient(circle, ${guardian.dotColor}18 0%, transparent 70%)`}
                glass="liquid-glass"
                lift
                className="p-6 rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.15] hover:scale-[1.03] transition-all duration-300 group"
              >
                {/* Gate number */}
                <div className="absolute top-3 right-3 text-xs font-mono text-text-muted z-10">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Color dot */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${guardian.dotColor}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: guardian.dotColor }} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-display font-bold text-lg mb-1">{guardian.name}</h3>
                  <p className="text-sm text-text-muted mb-2">{guardian.gate} Gate</p>
                  <p className="text-xs text-atlantean-teal-aqua font-mono">{guardian.frequency}</p>
                </div>

                {/* Hover reveal — CSS only */}
                <div className="mt-0 max-h-0 overflow-hidden opacity-0 group-hover:mt-4 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300">
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-xs text-text-secondary mb-2">{guardian.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Godbeast:</span>
                      <span className="text-white">{guardian.godbeast}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-text-muted">Element:</span>
                      <span className="text-white">{guardian.element}</span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </m.div>
          ))}
        </div>

        {/* CTA — GlowButton */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: durations.normal }}
          className="text-center"
        >
          <GlowButton href="/lore/guardians" variant="secondary" color="cyan" size="md">
            Explore All Guardians
          </GlowButton>
        </m.div>
      </div>
    </section>
  );
}
