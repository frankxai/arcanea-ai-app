"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { LuminorAvatar } from "./LuminorAvatar";

export interface CouncilSeatData {
  seat: number;
  name: string;
  hz: number;
  domain: string;
  imprint: string;
  color: string;
}

interface CouncilSeatProps {
  data: CouncilSeatData;
  isActive: boolean;
  onClick: (seat: CouncilSeatData) => void;
}

export function CouncilSeat({ data, isActive, onClick }: CouncilSeatProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <button
        className="flex flex-col items-center gap-2 group focus:outline-none"
        onClick={() => onClick(data)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`${data.domain} — ${data.name}`}
        aria-pressed={isActive}
      >
        {/* Avatar with glow */}
        <div className="relative">
          <LuminorAvatar
            name={data.name}
            frequency={data.hz}
            color={data.color}
            size="md"
            isActive={isActive || hovered}
          />

          {/* Active ring */}
          {isActive && (
            <m.div
              className="absolute inset-[-4px] rounded-full"
              style={{ border: `2px solid ${data.color}` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          )}
        </div>

        {/* Name + domain */}
        <div className="text-center min-w-[72px]">
          <p
            className="font-display text-xs font-bold leading-tight transition-colors"
            style={{ color: isActive || hovered ? data.color : "rgba(255,255,255,0.8)" }}
          >
            {data.name}
          </p>
          <p className="font-mono text-[9px] text-white/30 leading-tight mt-0.5">
            {data.hz} Hz
          </p>
        </div>

        {/* Hover imprint tooltip */}
        <AnimatePresence>
          {hovered && (
            <m.div
              className="absolute z-20 bottom-full mb-3 left-1/2 -translate-x-1/2 w-52 rounded-xl border px-3 py-2.5 pointer-events-none"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              style={{
                background: "hsl(240,6%,8%)",
                borderColor: `${data.color}30`,
                boxShadow: `0 4px 24px ${data.color}20`,
              }}
            >
              <p
                className="font-display text-xs font-semibold mb-1"
                style={{ color: data.color }}
              >
                {data.domain}
              </p>
              <p className="font-body text-[11px] text-white/50 leading-relaxed">
                {data.imprint}
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </button>
    </LazyMotion>
  );
}
