"use client";

import { m } from "framer-motion";
import { GlowCard } from "@/components/saga/glow-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GateAgentCardProps {
  id: string;
  name: string;
  description: string;
  gate: string;
  gateColor: string;
  tier: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Gate Agent Card — uses GlowCard pattern with Gate-colored accents
// ---------------------------------------------------------------------------

export function GateAgentCard({
  name,
  description,
  gate,
  gateColor,
  tier,
  className = "",
}: GateAgentCardProps) {
  return (
    <m.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group h-full ${className}`}
    >
      <GlowCard
        className="h-full rounded-2xl"
        glowColor={`${gateColor}14`}
        borderGlowColor={`${gateColor}60`}
      >
        <div
          className="relative h-full rounded-2xl border bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:bg-white/[0.06]"
          style={{ borderColor: `${gateColor}25` }}
        >
          {/* Top accent strip */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ backgroundColor: gateColor, opacity: 0.5 }}
            aria-hidden="true"
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{ background: `radial-gradient(circle at 50% 0%, ${gateColor}20, transparent 60%)` }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-4 flex flex-col h-full">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: gateColor, boxShadow: `0 0 6px ${gateColor}80` }}
                />
                <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border"
                style={{
                  borderColor: `${gateColor}30`,
                  backgroundColor: `${gateColor}10`,
                  color: gateColor,
                }}
              >
                T{tier}
              </span>
            </div>

            {/* Gate badge */}
            <div className="mb-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border"
                style={{
                  borderColor: `${gateColor}25`,
                  backgroundColor: `${gateColor}08`,
                  color: `${gateColor}cc`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: gateColor }}
                  aria-hidden="true"
                />
                {gate} Gate
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-white/50 leading-relaxed flex-1 line-clamp-3">{description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06]">
              <span className="text-[10px] text-white/30 font-mono">SKILL</span>
              <button
                className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-lg px-3 py-1.5 transition-all duration-200"
                style={{
                  backgroundColor: `${gateColor}15`,
                  color: gateColor,
                  border: `1px solid ${gateColor}30`,
                }}
                aria-label={`Activate ${name}`}
              >
                Activate
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </GlowCard>
    </m.div>
  );
}
