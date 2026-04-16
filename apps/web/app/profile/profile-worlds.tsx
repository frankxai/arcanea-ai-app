"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { TemplateCard } from "@/components/premium/template-card";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WORLDS = [
  {
    title: "The Fractured Meridian",
    type: "world" as const,
    subtitle: "Post-convergence continent • 12 factions • 40+ characters",
    previewGradient: "from-[#0d47a1]/60 via-[#00897b]/40 to-[#4a148c]/50",
    stats: [
      { label: "characters", value: "47" },
      { label: "chapters", value: "12" },
    ],
    accentColor: "#00bcd4",
    href: "/worlds",
    badge: "Featured",
  },
  {
    title: "Vel'Tara Station",
    type: "world" as const,
    subtitle: "Space noir • Synthetic companions • Signal protocols",
    previewGradient: "from-[#1a237e]/60 via-[#6a1b9a]/40 to-[#0d47a1]/50",
    stats: [
      { label: "characters", value: "18" },
      { label: "episodes", value: "7" },
    ],
    accentColor: "#7fffd4",
    href: "/worlds",
    isNew: true,
  },
  {
    title: "Origin Sea",
    type: "world" as const,
    subtitle: "Primordial ocean • Gate mythology • Cosmology layer",
    previewGradient: "from-[#006064]/60 via-[#00838f]/40 to-[#01579b]/50",
    stats: [
      { label: "lore docs", value: "24" },
      { label: "gates", value: "6" },
    ],
    accentColor: "#ffd700",
    href: "/worlds",
  },
];

export function ProfileWorlds() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="mb-16">
        <m.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-1">
              Creator
            </p>
            <h2 className="text-xl font-display font-bold text-white tracking-[-0.02em]">
              Worlds I&apos;ve built
            </h2>
          </div>
          <a
            href="/worlds"
            className="text-xs font-mono text-[#7fffd4]/60 hover:text-[#7fffd4] transition-colors flex items-center gap-1"
          >
            View all
            <span>&rarr;</span>
          </a>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLDS.map((world, i) => (
            <m.div
              key={world.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            >
              <TemplateCard {...world} />
            </m.div>
          ))}
        </div>
      </section>
    </LazyMotion>
  );
}
