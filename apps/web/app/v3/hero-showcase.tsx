/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { brand, guardianAccents } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// HeroShowcase — "Created in 30 seconds" visual proof strip
// Renders 3 example creation cards between the hero and below-fold content.
// ---------------------------------------------------------------------------

// Light slate used for character "Wind" element — a near-white neutral
// that reads as ethereal vs the saturated brand accents.
const WIND_NEUTRAL = "var(--arc-text-primary)";

const CARDS = [
  {
    type: "Portal",
    title: "Realm Gate",
    subtitle: "world graph · canon seed",
    elements: [brand.atlanteanTeal, brand.arcaneanGold, guardianAccents.lyria],
    gradient: "from-[var(--arc-brand-cosmic-blue)]/40 via-[var(--arc-brand-cosmic-blue)]/30 to-[var(--arc-brand-cosmic-blue)]/40",
    gradientAlt: "from-[var(--arc-brand-cosmic-blue)]/50 via-[var(--arc-brand-atlantean-teal)]/25 to-[var(--arc-brand-cosmic-blue)]/50",
    borderGlow: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 25%, transparent)",
    status: "Ready now",
    badge: "World OS",
    badgeColor: brand.atlanteanTeal,
    href: "/worlds/create",
    image: "/brand/arcanea-dashboard-hero-premium.png",
  },
  {
    type: "Godbeast",
    title: "Draconis Bond",
    subtitle: "fire gate · scale system",
    elements: [guardianAccents.draconia, brand.arcaneanGold],
    gradient: "from-[var(--arc-fire)]/45 via-[var(--arc-brand-arcanean-gold)]/20 to-[var(--arc-cosmic-void)]/45",
    gradientAlt: "from-[var(--arc-fire)]/45 via-[var(--arc-brand-cosmic-blue)]/25 to-[var(--arc-brand-arcanean-gold)]/35",
    borderGlow: "color-mix(in srgb, var(--arc-fire) 24%, transparent)",
    status: "Canon guide",
    badge: "Canon",
    badgeColor: brand.arcaneanGold,
    href: "/lore/godbeasts",
    image: "/guardians/v4/draconia-hero-v4.webp",
  },
  {
    type: "Saga",
    title: "Dragon Rider",
    subtitle: "episodes · game loop",
    elements: [guardianAccents.draconia, brand.aquamarine, brand.arcaneanGold],
    gradient: "from-[var(--arc-fire)]/40 via-[var(--arc-brand-cosmic-blue)]/30 to-[var(--arc-brand-atlantean-teal)]/25",
    gradientAlt: "from-[var(--arc-fire)]/35 via-[var(--arc-brand-arcanean-gold)]/20 to-[var(--arc-brand-cosmic-blue)]/45",
    borderGlow: "color-mix(in srgb, var(--arc-brand-arcanean-gold) 20%, transparent)",
    status: "Preview",
    badge: "Rider",
    badgeColor: brand.aquamarine,
    href: "/cinema-studio",
    image: "/images/books/heart-of-pyrathis-cover-v2.png",
  },
  {
    type: "Canon",
    title: "Living Lore",
    subtitle: "rules · factions · memory",
    elements: [guardianAccents.lyria, WIND_NEUTRAL, brand.arcaneanGold],
    gradient: "from-[var(--arc-void)]/40 via-[var(--arc-brand-cosmic-blue)]/30 to-[var(--arc-brand-arcanean-gold)]/20",
    gradientAlt: "from-[var(--arc-void)]/35 via-[var(--arc-brand-atlantean-teal)]/25 to-[var(--arc-brand-cosmic-blue)]/45",
    borderGlow: "color-mix(in srgb, var(--arc-void) 20%, transparent)",
    status: "Canon guide",
    badge: "Memory",
    badgeColor: brand.aquamarine,
    href: "/living-lore",
    image: "/guardians/v4/lyria-hero-v4.webp",
  },
  {
    type: "Cinema",
    title: "Portal Trailer",
    subtitle: "Shot list · render prompts",
    elements: [brand.arcaneanGold, brand.atlanteanTeal],
    gradient: "from-[var(--arc-brand-cosmic-blue)]/50 via-[var(--arc-brand-atlantean-teal)]/30 to-[var(--arc-fire)]/40",
    gradientAlt: "from-[var(--arc-brand-cosmic-blue)]/50 via-[var(--arc-brand-atlantean-teal)]/35 to-[var(--arc-fire)]/40",
    borderGlow: "color-mix(in srgb, var(--arc-brand-arcanean-gold) 20%, transparent)",
    status: "Preview",
    badge: "Cinematic",
    badgeColor: brand.arcaneanGold,
    href: "/cinema-studio",
    image: "/images/forge/sky/007-ironclad-airship.png",
  },
  {
    type: "Agent OS",
    title: "Lab Handoff",
    subtitle: "tools · agents · context",
    elements: [brand.arcaneanGold, brand.aquamarine],
    gradient: "from-[var(--arc-brand-arcanean-gold)]/38 via-[var(--arc-cosmic-void)]/45 to-[var(--arc-brand-atlantean-teal)]/28",
    gradientAlt: "from-[var(--arc-brand-atlantean-teal)]/35 via-[var(--arc-cosmic-void)]/45 to-[var(--arc-brand-arcanean-gold)]/35",
    borderGlow: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 24%, transparent)",
    status: "Dev preview",
    badge: "Agent OS",
    badgeColor: brand.atlanteanTeal,
    href: "/mcp",
    image: "/images/forge/space/004-dreadnought-nebula.png",
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
    <Link href={card.href} className="block">
      <m.div
        className="group relative w-full sm:w-[280px] rounded-2xl overflow-hidden cursor-pointer"
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
              `0 0 0 1px color-mix(in srgb, var(--arc-text-primary) 7%, transparent), 0 0 20px 0 transparent`,
              `0 0 0 1px ${card.borderGlow}, 0 0 28px 4px ${card.borderGlow}`,
              `0 0 0 1px color-mix(in srgb, var(--arc-text-primary) 7%, transparent), 0 0 20px 0 transparent`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 rounded-2xl z-0"
          style={{ boxShadow: `0 0 0 1px color-mix(in srgb, var(--arc-text-primary) 7%, transparent)` }}
        />

        {/* Glass background */}
        <div className="absolute inset-0 bg-white/[0.025] backdrop-blur-xl rounded-2xl" />

        {/* Gradient art area */}
        <div className={`relative h-[150px] bg-gradient-to-br ${card.gradient} overflow-hidden`}>
          <Image
            src={card.image}
            alt={`${card.title} preview`}
            fill
            sizes="280px"
            className="object-cover opacity-78 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)]/55 via-transparent to-transparent" />
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
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)]/50 via-transparent to-transparent" />
          {/* Type label */}
          <span className="absolute top-3 left-3 rounded-full border border-white/[0.08] bg-[var(--arc-cosmic-void)]/40 px-2.5 py-1 font-editorial text-sm italic leading-none text-white/58">
            {card.type}
          </span>
          <span
            className="absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-body leading-none"
            style={{
              color: card.badgeColor,
              borderColor: `${card.badgeColor}32`,
              backgroundColor: `${card.badgeColor}0f`,
            }}
          >
            {card.status}
          </span>
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
                      className="w-2 h-2 rounded-full ring-1 ring-[var(--arc-cosmic-void)]/40"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              <span className="text-[10px] text-white/30 font-body">{card.subtitle}</span>
            </div>
            <span
              className="inline-block rounded-full border px-2 py-0.5 text-[11px] font-body"
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
        className="mb-10 text-center font-editorial text-xl italic leading-none text-white/30"
      >
        Every call becomes a proof artifact
      </m.p>

      {/* Card strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-5 max-w-5xl mx-auto">
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
      >
        Missions, worlds, rights, cinema, and agent workflows share one memory layer.
      </m.p>
    </section>
  );
}
