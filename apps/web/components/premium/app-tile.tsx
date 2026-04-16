"use client";

import { m } from "framer-motion";
import Link from "next/link";

// ---------------------------------------------------------------------------
// AppTile — Canva-Apps-equivalent. Installable connector tile for the
// /apps marketplace. Each tile represents one integration with its
// install state, category, and capabilities.
// ---------------------------------------------------------------------------

export interface AppTileProps {
  name: string;
  tagline: string;
  category: string;
  glyph: string;
  color: string;
  installed?: boolean;
  status?: "live" | "beta" | "soon";
  capabilities?: string[];
  href?: string;
  index?: number;
}

const STATUS_LABEL: Record<NonNullable<AppTileProps["status"]>, string> = {
  live: "INSTALL",
  beta: "BETA",
  soon: "JOIN WAITLIST",
};

const STATUS_COLOR: Record<NonNullable<AppTileProps["status"]>, string> = {
  live: "#7fffd4",
  beta: "#ffd700",
  soon: "#94a3b8",
};

export function AppTile({
  name,
  tagline,
  category,
  glyph,
  color,
  installed = false,
  status = "live",
  capabilities,
  href = "#",
  index = 0,
}: AppTileProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 overflow-hidden"
    >
      <Link href={href} className="block p-5">
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at 50% 0%, ${color}12, transparent 60%)`,
          }}
        />

        <div className="relative">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `${color}12`,
                border: `1px solid ${color}25`,
                color: color,
              }}
            >
              {glyph}
            </div>
            {installed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7fffd4]/15 border border-[#7fffd4]/30 text-[9px] font-mono tracking-wider uppercase text-[#7fffd4]">
                <span className="w-1 h-1 rounded-full bg-[#7fffd4]" />
                INSTALLED
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase border"
                style={{
                  background: `${STATUS_COLOR[status]}10`,
                  borderColor: `${STATUS_COLOR[status]}28`,
                  color: STATUS_COLOR[status],
                }}
              >
                {STATUS_LABEL[status]}
              </span>
            )}
          </div>

          {/* Category */}
          <p
            className="text-[10px] font-mono tracking-[0.2em] uppercase mb-1"
            style={{ color: `${color}bb` }}
          >
            {category}
          </p>

          {/* Name */}
          <h3 className="text-base font-display font-semibold text-white/90 mb-1 leading-tight">
            {name}
          </h3>

          {/* Tagline */}
          <p className="text-[12px] text-white/45 leading-snug mb-3 line-clamp-2 min-h-[30px]">
            {tagline}
          </p>

          {/* Capabilities */}
          {capabilities && capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-white/35 bg-white/[0.025] border border-white/[0.05]"
                >
                  {cap}
                </span>
              ))}
              {capabilities.length > 3 && (
                <span className="text-[9px] font-mono text-white/25 px-1">
                  +{capabilities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </m.div>
  );
}
