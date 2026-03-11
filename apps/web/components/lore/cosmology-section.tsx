"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { durations, m3Curves, staggers } from "@/lib/design/motion";

const PRIMORDIALS = [
  {
    name: "Lumina",
    title: "The First Light",
    aspect: "Form-Giver, Creator, Order",
    description:
      "From the stirring came separation. Lumina blazed forth not as fire but as form. Where Nero was infinite potential, Lumina was pattern. The First Light did not illuminate the darkness—it organized it.",
    glowColor: "radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.04) 40%, transparent 70%)",
    borderColor: "border-gold-bright/20 hover:border-gold-bright/40",
    textColor: "text-gold-bright",
    bgColor: "bg-gold-bright/20",
    gradientOverlay: "from-gold-bright/10 to-transparent",
    icon: "sun",
  },
  {
    name: "Nero",
    title: "The Primordial Darkness",
    aspect: "Fertile Unknown, Potential, Mystery",
    description:
      "In the beginning, there was Nero. The Void contained everything that could ever be, held in superposition, waiting. Every possible world, every potential soul, every future creation—all rested in the fertile darkness.",
    glowColor: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)",
    borderColor: "border-creation-prism-purple/20 hover:border-creation-prism-purple/40",
    textColor: "text-creation-prism-purple",
    bgColor: "bg-creation-prism-purple/20",
    gradientOverlay: "from-creation-prism-purple/10 to-transparent",
    icon: "moon",
  },
];

const ELEMENTS = [
  { name: "Fire", domain: "Energy, transformation", dotColor: "#ef4444" },
  { name: "Water", domain: "Flow, healing, memory", dotColor: "#00bcd4" },
  { name: "Earth", domain: "Stability, growth", dotColor: "#22c55e" },
  { name: "Wind", domain: "Freedom, speed, change", dotColor: "#c4b5fd" },
  { name: "Void/Spirit", domain: "Potential & transcendence", dotColor: "#8b5cf6" },
];

export function CosmologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-bright/5 via-creation-prism-purple/5 to-transparent rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-creation-prism-purple/20 mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="text-sm font-medium text-creation-prism-purple">
              Cosmic Origins
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            The Primordial Duality
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body">
            Neither Light nor Darkness alone could create. Together, they became
            the eternal duality from which all existence springs.
          </p>
        </m.div>

        {/* Primordials — GlowCard */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {PRIMORDIALS.map((p, i) => (
            <m.div
              key={p.name}
              initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: durations.slow, ease: m3Curves.emphasized }}
            >
              <GlowCard
                glowColor={p.glowColor}
                glass="liquid-glass"
                borderGlow
                className={`p-8 rounded-3xl ${p.borderColor} transition-all duration-500 group`}
              >
                {/* Glow overlay */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${p.gradientOverlay}`} />

                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${p.bgColor}`}>
                  {p.icon === "sun" ? (
                    <svg className={`w-8 h-8 ${p.textColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg className={`w-8 h-8 ${p.textColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`text-3xl font-display font-bold mb-2 ${p.textColor}`}>
                    {p.name}
                  </h3>
                  <p className="text-lg text-text-secondary mb-2 font-body italic">{p.title}</p>
                  <p className="text-sm text-text-muted mb-4">{p.aspect}</p>
                  <p className="text-text-secondary leading-relaxed">{p.description}</p>
                </div>
              </GlowCard>
            </m.div>
          ))}
        </div>

        {/* The Arc */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: durations.slow, ease: m3Curves.emphasizedDecelerate }}
          className="text-center mb-24"
        >
          <h3 className="text-2xl font-display font-bold mb-6">
            The Arc — Reality&apos;s Heartbeat
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            {["Potential (Nero)", "→", "Manifestation", "→", "Experience", "→", "Dissolution", "→", "Evolved Potential"].map((step, i) => (
              <span
                key={i}
                className={step === "→" ? "text-gold-bright text-lg" : "px-4 py-2 rounded-full liquid-glass border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200"}
              >
                {step}
              </span>
            ))}
          </div>
          <p className="mt-6 text-text-muted max-w-2xl mx-auto">
            Death is not ending but transformation. Destruction enables
            creation. Every ending enriches the next beginning.
          </p>
        </m.div>

        {/* Five Elements — GlowCards */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: durations.slow }}
        >
          <h3 className="text-2xl font-display font-bold text-center mb-8">
            The Five Elements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ELEMENTS.map((element, i) => (
              <m.div
                key={element.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.05, duration: durations.normal, ease: m3Curves.emphasizedDecelerate }}
              >
                <GlowCard
                  glowColor={`radial-gradient(circle, ${element.dotColor}18 0%, transparent 70%)`}
                  glass="liquid-glass"
                  lift
                  className="p-6 rounded-2xl border border-white/[0.06] text-center hover:border-white/[0.12] transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${element.dotColor}15` }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: element.dotColor }} />
                  </div>
                  <h4 className="font-display font-semibold mb-1">{element.name}</h4>
                  <p className="text-xs text-text-muted">{element.domain}</p>
                </GlowCard>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
