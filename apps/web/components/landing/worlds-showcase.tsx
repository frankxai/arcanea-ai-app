/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";
import { elementNameAccents, neutralFallback } from "@arcanea/design-system";

const SHOWCASE_WORLDS = [
  {
    name: "Arcanea Prime",
    tagline: "The original world of Luminors, Guardians, and the Ten Gates",
    gradient: "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    elements: ["Fire", "Water", "Earth", "Wind", "Void"],
    href: "/lore",
  },
  {
    name: "The Shadowfen",
    tagline: "Where Malachar's corruption seeps through fractured reality",
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-cosmic-void), var(--arc-earth))",
    elements: ["Void", "Fire"],
    href: "/lore",
  },
  {
    name: "Starweave Academy",
    tagline: "Seven houses, ten gates, and a thousand stories waiting to unfold",
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold), var(--arc-brand-atlantean-teal))",
    elements: ["Spirit", "Water", "Wind"],
    href: "/lore",
  },
];

const ELEMENT_HEX: Record<string, string> = {
  Fire: elementNameAccents.Fire,
  Water: elementNameAccents.Water,
  Earth: elementNameAccents.Earth,
  Wind: elementNameAccents.Wind,
  Void: elementNameAccents.Void,
  Spirit: elementNameAccents.Spirit,
};

export function WorldsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.05),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--arc-void)]/50 mb-4">
            The Multiverse
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-5">
            Explore{" "}
            <span className="text-gradient-cosmic">living worlds</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-body">
            Discover universes built by creators. Fork, star, and build on each
            other&apos;s worlds — or create your own from scratch.
          </p>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
          {SHOWCASE_WORLDS.map((world, i) => (
            <m.div
              key={world.name}
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={world.href} className="group block h-full">
                <GlowCard
                  glass="none"
                  glowColor="rgba(124,58,237,0.14)"
                  className="h-full border border-white/[0.08] hover:border-[var(--arc-void)]/35 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative min-h-[260px]">
                    {/* Gradient background */}
                    <div
                      className="absolute inset-0 group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ background: world.gradient }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10" />

                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                      {/* Element dots */}
                      <div className="flex items-center gap-1.5 mb-3">
                        {world.elements.map((el) => (
                          <span
                            key={el}
                            className="w-2 h-2 rounded-full ring-1 ring-white/10"
                            style={{ backgroundColor: ELEMENT_HEX[el] ?? neutralFallback }}
                            title={el}
                          />
                        ))}
                      </div>

                      <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-2">
                        {world.name}
                      </h3>
                      <p className="text-sm text-white/55 leading-relaxed mb-4">
                        {world.tagline}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm text-[var(--arc-void)]/75 group-hover:text-[var(--arc-void)] transition-colors">
                        Enter this world <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </m.div>
          ))}
        </div>

        {/* Action links */}
        <m.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/worlds"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-[var(--arc-void)] transition-colors"
          >
            Browse All Worlds
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="hidden sm:inline text-white/10">|</span>
          <Link
            href="/chat?mode=world"
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--arc-void)]/10 to-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-void)]/20 text-[var(--arc-void)] hover:bg-[var(--arc-void)]/15 transition-all"
          >
            Create Your World
            <ArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
