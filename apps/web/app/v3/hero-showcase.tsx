"use client";

import { m } from "framer-motion";

// ---------------------------------------------------------------------------
// HeroShowcase — "Created in 30 seconds" visual proof strip
// Renders 3 example creation cards between the hero and below-fold content.
// ---------------------------------------------------------------------------

const CARDS = [
  {
    type: "World",
    title: "Sonorium",
    subtitle: "12 characters · 3 locations",
    elements: ["#ef4444", "#3b82f6", "#a855f7"],
    gradient: "from-[#0d47a1]/40 via-[#00897b]/30 to-[#4a148c]/40",
  },
  {
    type: "Character",
    title: "Kael Duskwalker",
    subtitle: "Wind · Rogue · Restless",
    elements: ["#e2e8f0"],
    gradient: "from-[#1a237e]/40 via-[#006064]/30 to-[#1b5e20]/40",
    badge: "Wind",
    badgeColor: "#e2e8f0",
  },
  {
    type: "Image",
    title: "Crystalline Citadel",
    subtitle: "Fantasy · Cinematic Lighting",
    elements: [],
    gradient: "from-[#4a148c]/50 via-[#00bcd4]/30 to-[#e65100]/40",
  },
] as const;

function ShowcaseCard({
  card,
  delay,
}: {
  card: (typeof CARDS)[number];
  delay: number;
}) {
  return (
    <m.div
      className="relative w-full sm:w-[200px] rounded-xl overflow-hidden border border-white/[0.06] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/[0.025]" />

      {/* Gradient art area */}
      <div
        className={`relative h-[100px] bg-gradient-to-br ${card.gradient}`}
      >
        {/* Floating animation overlay */}
        <m.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay }}
        />
        {/* Type label */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-black/30 px-2 py-0.5 rounded-full">
          {card.type}
        </span>
      </div>

      {/* Card info */}
      <div className="relative px-3 py-3">
        <p className="text-sm font-display font-semibold text-white/80 leading-tight">
          {card.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {card.elements.length > 0 && (
            <div className="flex -space-x-0.5">
              {card.elements.map((color, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full ring-1 ring-black/40"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
          <span className="text-[11px] text-white/30">{card.subtitle}</span>
        </div>
        {"badge" in card && card.badge && (
          <span
            className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border border-white/10"
            style={{ color: card.badgeColor }}
          >
            {card.badge}
          </span>
        )}
      </div>
    </m.div>
  );
}

export function HeroShowcase() {
  return (
    <section className="relative py-16 md:py-20 px-6">
      {/* Section heading */}
      <m.p
        className="text-center text-xs font-mono uppercase tracking-[0.2em] text-white/25 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Created in 30 seconds
      </m.p>

      {/* Card strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        {CARDS.map((card, i) => (
          <ShowcaseCard
            key={card.title}
            card={card}
            delay={0.5 + i * 0.2}
          />
        ))}
      </div>

      {/* Caption */}
      <m.p
        className="text-center mt-8 text-sm text-white/25 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        One sentence &rarr; a living universe. Free to start.
      </m.p>
    </section>
  );
}
