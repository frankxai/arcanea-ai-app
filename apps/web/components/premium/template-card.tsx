"use client";

import { m } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// TemplateCard — Canva-inspired starter template card.
// Shows a preview image/gradient, type badge, stats, and "Use template" CTA.
// The atomic unit of the Create Hub and Templates marketplace.
// ---------------------------------------------------------------------------

export interface TemplateCardProps {
  title: string;
  type: "world" | "character" | "story" | "agent" | "music" | "image" | "book";
  subtitle?: string;
  previewGradient?: string;
  previewImage?: string;
  previewNode?: ReactNode;
  stats?: { label: string; value: string }[];
  accentColor?: string;
  badge?: string;
  href: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const TYPE_LABELS: Record<TemplateCardProps["type"], { label: string; emoji: string }> = {
  world: { label: "WORLD", emoji: "🌍" },
  character: { label: "CHARACTER", emoji: "✶" },
  story: { label: "STORY", emoji: "✎" },
  agent: { label: "AGENT", emoji: "◈" },
  music: { label: "MUSIC", emoji: "♪" },
  image: { label: "IMAGE", emoji: "◉" },
  book: { label: "BOOK", emoji: "⌘" },
};

export function TemplateCard({
  title,
  type,
  subtitle,
  previewGradient = "from-[#0d47a1]/40 via-[#00897b]/30 to-[#4a148c]/40",
  previewImage,
  previewNode,
  stats,
  accentColor = "#00bcd4",
  badge,
  href,
  isNew = false,
  isPremium = false,
}: TemplateCardProps) {
  const typeInfo = TYPE_LABELS[type];

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="group block relative rounded-2xl overflow-hidden bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
        style={{
          boxShadow: `0 0 0 1px transparent`,
        }}
      >
        {/* Preview area */}
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${previewGradient}`}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          {previewNode}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Shimmer sweep on hover */}
          <m.div
            className="absolute inset-y-0 -left-full w-[50%] skew-x-[-15deg] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
            animate={{ left: ["-50%", "150%"] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />

          {/* Type badge top-left */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <span className="text-[10px]">{typeInfo.emoji}</span>
            <span
              className="text-[9px] font-mono tracking-wider uppercase"
              style={{ color: `${accentColor}dd` }}
            >
              {typeInfo.label}
            </span>
          </div>

          {/* Status badges top-right */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {isNew && (
              <span className="px-2 py-0.5 rounded-full bg-[#7fffd4]/20 border border-[#7fffd4]/40 text-[9px] font-mono tracking-wider uppercase text-[#7fffd4]">
                NEW
              </span>
            )}
            {isPremium && (
              <span className="px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 text-[9px] font-mono tracking-wider uppercase text-[#ffd700]">
                PRO
              </span>
            )}
          </div>

          {/* Custom badge bottom-left (optional) */}
          {badge && (
            <div className="absolute bottom-3 left-3">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-sm"
                style={{
                  background: `${accentColor}12`,
                  borderColor: `${accentColor}30`,
                  color: accentColor,
                }}
              >
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="p-4">
          <h3 className="text-sm font-display font-semibold text-white/90 leading-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-white/40 mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="w-px h-3 bg-white/[0.08]" />}
                  <span className="text-[10px] font-display font-semibold text-white/50">
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-white/25 font-mono uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* "Use template" hover reveal */}
          <div
            className="mt-3 flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: accentColor }}
          >
            <span>Use template</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// StartBlankCard — "Start from scratch" variant
// ---------------------------------------------------------------------------

export function StartBlankCard({
  label = "Start from scratch",
  href,
  accentColor = "#7fffd4",
}: {
  label?: string;
  href: string;
  accentColor?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-[#7fffd4]/40 bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-300"
      style={{ borderColor: undefined }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <span
          className="text-2xl"
          style={{ color: accentColor }}
        >
          +
        </span>
      </div>
      <span
        className="text-sm font-medium transition-colors"
        style={{ color: `${accentColor}cc` }}
      >
        {label}
      </span>
      <span className="text-[10px] text-white/30 mt-1 font-mono uppercase tracking-wider">
        blank canvas
      </span>
    </Link>
  );
}
