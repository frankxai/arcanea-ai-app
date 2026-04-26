"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Star } from "@/lib/phosphor-icons";
import { brand, guardianAccents } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// HeroShowcase — "Created in 30 seconds" visual proof strip
// Renders 3 example creation cards between the hero and below-fold content.
// ---------------------------------------------------------------------------

// Light slate used for character "Wind" element — a near-white neutral
// that reads as ethereal vs the saturated brand accents.
const WIND_NEUTRAL = "#e2e8f0";

const CARDS = [
  {
    type: "World",
    title: "Sonorium",
    subtitle: "12 characters · 3 locations",
    elements: [guardianAccents.draconia, guardianAccents.leyla, guardianAccents.lyria],
    gradient: "from-[#0d47a1]/40 via-[#00897b]/30 to-[#4a148c]/40",
    gradientAlt: "from-[#1565c0]/50 via-[#00bcd4]/25 to-[#4a148c]/50",
    borderGlow: "rgba(0,188,212,0.25)",
    stars: 5,
    badge: "Living Universe",
    badgeColor: brand.atlanteanTeal,
    href: "/worlds",
  },
  {
    type: "Character",
    title: "Kael Duskwalker",
    subtitle: "Wind · Rogue · Restless",
    elements: [WIND_NEUTRAL],
    gradient: "from-[#1a237e]/40 via-[#006064]/30 to-[#1b5e20]/40",
    gradientAlt: "from-[#283593]/50 via-[#00838f]/30 to-[#2e7d32]/40",
    borderGlow: "rgba(127,255,212,0.20)",
    stars: 4,
    badge: "Wind",
    badgeColor: brand.aquamarine,
    href: "/chat",
  },
  {
    type: "Image",
    title: "Crystalline Citadel",
    subtitle: "Fantasy · Cinematic Lighting",
    elements: [brand.arcaneanGold, brand.atlanteanTeal],
    gradient: "from-[#4a148c]/50 via-[#00bcd4]/30 to-[#e65100]/40",
    gradientAlt: "from-[#6a1b9a]/50 via-[#0097a7]/35 to-[#ef6c00]/40",
    borderGlow: "rgba(255,215,0,0.20)",
    stars: 5,
    badge: "Cinematic",
    badgeColor: brand.arcaneanGold,
    href: "/imagine",
  },
] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < count;
        return (
          <Star
            key={i}
            size={10}
            weight={filled ? "fill" : "regular"}
            color={filled ? brand.arcaneanGold : "rgba(255,255,255,0.18)"}
          />
        );
      })}
    </div>
  );
}

function ShowcaseCard({
  card,
  delay,
}: {
  card: (typeof CARDS)[number];
  delay: number;
}) {
  return (
    <Link href={card.href} className="block">
      <m.div
        className="relative w-full sm:w-[280px] rounded-2xl overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{
          scale: 1.04,
          y: -4,
          transition: { type: "spring", stiffness: 300, damping: 22 },
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Animated gradient border */}
        <m.div
          className="absolute inset-0 rounded-2xl -z-10"
          animate={{
            boxShadow: [
              `0 0 0 1px rgba(255,255,255,0.07), 0 0 20px 0 transparent`,
              `0 0 0 1px ${card.borderGlow}, 0 0 28px 4px ${card.borderGlow.replace("0.", "0.08")}`,
              `0 0 0 1px rgba(255,255,255,0.07), 0 0 20px 0 transparent`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 rounded-2xl z-0"
          style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.07)` }}
        />

        {/* Glass background */}
        <div className="absolute inset-0 bg-white/[0.025] backdrop-blur-xl rounded-2xl" />

        {/* Gradient art area */}
        <div className={`relative h-[130px] bg-gradient-to-br ${card.gradient} overflow-hidden`}>
          {/* Animated gradient shift */}
          <m.div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradientAlt}`}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: delay + 1, ease: "easeInOut" }}
          />
          {/* Shimmer sweep */}
          <m.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: delay + 0.5, ease: "easeInOut" }}
            style={{ skewX: "-20deg" }}
          />
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Type label */}
          <span className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-wider text-white/50 bg-black/40 px-2 py-0.5 rounded-full border border-white/[0.08]">
            {card.type}
          </span>
          {/* Star rating */}
          <div className="absolute top-3 right-3">
            <StarRating count={card.stars} />
          </div>
        </div>

        {/* Card info */}
        <div className="relative px-4 py-3.5">
          <p className="text-sm font-display font-semibold text-white/85 leading-tight mb-1">
            {card.title}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
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
              <span className="text-[10px] text-white/30 font-body">{card.subtitle}</span>
            </div>
            <span
              className="inline-block text-[9px] px-2 py-0.5 rounded-full border font-mono"
              style={{
                color: card.badgeColor,
                borderColor: `${card.badgeColor}30`,
                backgroundColor: `${card.badgeColor}08`,
              }}
            >
              {card.badge}
            </span>
          </div>
        </div>
      </m.div>
    </Link>
  );
}

export function HeroShowcase() {
  return (
    <section className="relative py-16 md:py-20 px-6">
      {/* Section heading */}
      <m.p
        className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-white/20 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Created in 30 seconds
      </m.p>

      {/* Card strip */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-4xl mx-auto">
        {CARDS.map((card, i) => (
          <ShowcaseCard
            key={card.title}
            card={card}
            delay={0.3 + i * 0.15}
          />
        ))}
      </div>

      {/* Caption */}
      <m.p
        className="text-center mt-10 text-sm text-white/20 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        One sentence &rarr; a living universe. Free to start.
      </m.p>
    </section>
  );
}
