"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { GlowCard } from "@/components/ui/glow-card";

export function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const principles = [
    {
      title: "Creation first",
      text: "Every feature exists to help you make something. We do not gamify attention — we serve the creative act.",
      accentHex: "#00bcd4",
    },
    {
      title: "Intelligence with personality",
      text: "Not generic chatbots. Each companion has a philosophy, voice, and domain. Choose the one that sees your challenge clearly.",
      accentHex: "#0d47a1",
    },
    {
      title: "Mythology as framework",
      text: "The lore is not decoration. It is a developmental system — a language for the stages of creative growth that every maker passes through.",
      accentHex: "#ffd700",
    },
    {
      title: "Depth you earn",
      text: "The surface is simple. The deeper you go, the more the system reveals. Frequencies, Gates, Elements, Ranks — discovered, never forced.",
      accentHex: "#00897b",
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-36 relative">
      {/* Atmospheric */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(13,71,161,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.03),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <m.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-gold-bright/40 mb-4">
            Philosophy
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
            What we <span className="text-gradient-gold">believe</span>
          </h2>
        </m.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {principles.map((p, i) => (
            <m.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlowCard
                glass="liquid-glass"
                glowColor={`${p.accentHex}10`}
                lift={false}
                className="p-7 h-full border border-white/[0.08] hover:border-white/[0.14] transition-all duration-500"
              >
                <div
                  className="w-8 h-[3px] rounded-full mb-5"
                  style={{
                    background: `linear-gradient(90deg, ${p.accentHex}, transparent)`,
                  }}
                />
                <h3
                  className="text-lg font-display font-bold mb-3"
                  style={{ color: `${p.accentHex}dd` }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed font-body">
                  {p.text}
                </p>
              </GlowCard>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
