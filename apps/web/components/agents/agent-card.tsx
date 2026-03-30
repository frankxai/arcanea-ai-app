"use client";

import Link from "next/link";
import { m } from "framer-motion";

export interface AgentCardProps {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  priceCredits: number;
  element: string;
  icon: string;
  color: string;
  gradient: string;
  rating: number;
  usageCount: number;
  isFeatured: boolean;
}

const ELEMENT_COLORS: Record<string, { dot: string; badge: string; glow: string }> = {
  Fire:   { dot: "bg-red-500",    badge: "bg-red-500/10 text-red-400 border-red-500/20",    glow: "rgba(239,68,68,0.2)" },
  Water:  { dot: "bg-blue-500",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",  glow: "rgba(59,130,246,0.2)" },
  Earth:  { dot: "bg-green-500",  badge: "bg-green-500/10 text-green-400 border-green-500/20", glow: "rgba(34,197,94,0.2)" },
  Wind:   { dot: "bg-slate-300",  badge: "bg-slate-300/10 text-slate-300 border-slate-300/20", glow: "rgba(248,250,252,0.15)" },
  Void:   { dot: "bg-violet-500", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", glow: "rgba(139,92,246,0.2)" },
  Spirit: { dot: "bg-[#fbbf24]",  badge: "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20", glow: "rgba(251,191,36,0.2)" },
};

function StarRating({ rating }: { rating: number }) {
  if (rating === 0) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < full ? "text-[#ffd700]" : i === full && half ? "text-[#ffd700]/60" : "text-white/15"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-[10px] text-white/40 ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatUsageCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

export function AgentCard({
  id,
  name,
  title,
  description,
  priceCredits,
  element,
  icon,
  color,
  gradient,
  rating,
  usageCount,
  isFeatured,
}: AgentCardProps) {
  const elementStyle = ELEMENT_COLORS[element] ?? ELEMENT_COLORS.Fire;

  return (
    <m.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-full"
    >
      <Link
        href={`/agents/${id}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 rounded-2xl"
        aria-label={`${name} — ${title}, ${priceCredits} credits`}
      >
        {/* Featured gold border */}
        {isFeatured && (
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.5), rgba(255,215,0,0.1), rgba(255,215,0,0.4))",
              padding: "1px",
            }}
            aria-hidden="true"
          />
        )}

        <div
          className={`relative h-full rounded-2xl border bg-white/[0.04] backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:bg-white/[0.07] ${
            isFeatured
              ? "border-[#ffd700]/30 group-hover:border-[#ffd700]/50"
              : "border-white/[0.08] group-hover:border-white/[0.15]"
          }`}
          style={{
            boxShadow: `0 0 0 0 ${elementStyle.glow}`,
          }}
        >
          {/* Element gradient accent strip */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60"
            style={{ background: gradient }}
            aria-hidden="true"
          />

          {/* Hover glow overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{ background: `radial-gradient(circle at 50% 0%, ${elementStyle.glow}, transparent 60%)` }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-5 flex flex-col h-full">
            {/* Price badge — top right */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0"
                style={{ background: gradient, boxShadow: `0 4px 16px ${elementStyle.glow}` }}
                aria-hidden="true"
              >
                {icon}
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700]"
                  aria-label={`${priceCredits} credits`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {priceCredits}
                </span>
                {isFeatured && (
                  <span className="text-[9px] font-bold tracking-widest text-[#ffd700]/80 uppercase">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Name + title */}
            <h3
              className="text-base font-bold text-white leading-tight mb-0.5"
              style={{ color }}
            >
              {name}
            </h3>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-2">{title}</p>

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed flex-1 mb-4 line-clamp-3">
              {description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                {/* Element badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${elementStyle.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${elementStyle.dot}`} aria-hidden="true" />
                  {element}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <StarRating rating={rating} />
                {usageCount > 0 && (
                  <span className="text-[10px] text-white/30">
                    {formatUsageCount(usageCount)} runs
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
