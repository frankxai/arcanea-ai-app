"use client";

import Link from "next/link";
import { m } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PremiumCardProps {
  id: string;
  title: string;
  subtitle: string;
  pitch: string;
  price: string;
  ctaLabel: string;
  href: string;
  /** Unicode character or emoji used as the visual icon */
  iconSymbol: string;
  /** Accent colour used for the border and glow (CSS colour string) */
  accentColor: string;
  /** Background gradient applied to the card surface */
  backgroundGradient: string;
  /** Box-shadow glow string */
  glowShadow: string;
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const PREMIUM_PRODUCTS: PremiumCardProps[] = [
  {
    id: "grimoire",
    title: "The Grimoire",
    subtitle: "Your Personal Creative Universe",
    pitch: "Answer 10 questions. Wake up to a universe.",
    price: "From $197",
    ctaLabel: "Begin the Ritual",
    href: "/agents/grimoire",
    iconSymbol: "\u{1F4D6}", // book
    accentColor: "#ffd700",
    backgroundGradient:
      "linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(255,180,0,0.03) 40%, rgba(9,9,11,0.85) 100%)",
    glowShadow: "0 0 40px rgba(255,215,0,0.18), 0 0 80px rgba(255,180,0,0.08)",
  },
  {
    id: "sessions",
    title: "Guardian Sessions",
    subtitle: "1:1 Creative Intelligence",
    pitch: "Book a Guardian. Bring your project. Create together.",
    price: "From $47/session",
    ctaLabel: "Book a Session",
    href: "/agents/sessions",
    iconSymbol: "\u{1F52E}", // crystal ball
    accentColor: "#78a6ff",
    backgroundGradient:
      "linear-gradient(135deg, rgba(120,166,255,0.07) 0%, rgba(80,120,220,0.03) 40%, rgba(9,9,11,0.85) 100%)",
    glowShadow: "0 0 40px rgba(120,166,255,0.18), 0 0 80px rgba(80,120,220,0.08)",
  },
  {
    id: "license",
    title: "Intelligence License",
    subtitle: "Full Creative Access",
    pitch: "All 10 Guardians. Monthly Emanation drops. The complete creative system.",
    price: "$29/month",
    ctaLabel: "Subscribe",
    href: "/agents/license",
    iconSymbol: "\u26A1", // lightning
    accentColor: "#7fffd4",
    backgroundGradient:
      "linear-gradient(135deg, rgba(127,255,212,0.07) 0%, rgba(0,188,180,0.03) 40%, rgba(9,9,11,0.85) 100%)",
    glowShadow: "0 0 40px rgba(127,255,212,0.18), 0 0 80px rgba(0,188,180,0.08)",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PremiumCard({
  title,
  subtitle,
  pitch,
  price,
  ctaLabel,
  href,
  iconSymbol,
  accentColor,
  backgroundGradient,
  glowShadow,
}: PremiumCardProps) {
  return (
    <m.div
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative group w-full"
    >
      {/* Ambient glow layer — only visible on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: glowShadow }}
        aria-hidden="true"
      />

      {/* Card surface */}
      <div
        className="relative rounded-2xl border backdrop-blur-xl overflow-hidden"
        style={{
          background: backgroundGradient,
          borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
          // Fallback for older browsers that don't support color-mix
          borderWidth: "1px",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl select-none"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${accentColor}20, transparent 70%)`,
              border: `1px solid ${accentColor}25`,
            }}
            aria-hidden="true"
          >
            {iconSymbol}
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-mono tracking-widest uppercase mb-1"
              style={{ color: accentColor }}
            >
              {subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              {pitch}
            </p>
          </div>

          {/* Price + CTA block */}
          <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-4">
            <div>
              <span className="text-3xl md:text-4xl font-display font-bold text-white">
                {price}
              </span>
            </div>
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 whitespace-nowrap"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}10)`,
                border: `1px solid ${accentColor}50`,
                color: accentColor,
                // Ring color via CSS variable for focus-visible
              }}
              aria-label={`${ctaLabel} — ${title}`}
            >
              {ctaLabel}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}44, transparent)`,
          }}
          aria-hidden="true"
        />
      </div>
    </m.div>
  );
}
