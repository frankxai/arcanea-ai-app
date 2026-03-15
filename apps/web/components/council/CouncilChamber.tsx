"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { CouncilSeat, type CouncilSeatData } from "./CouncilSeat";
import { COUNCIL_ADVISORS } from "@/lib/council/types";

const COUNCIL_SEATS: CouncilSeatData[] = COUNCIL_ADVISORS.map((a) => ({
  seat: a.seat_order,
  name: a.character,
  domain: a.domain,
  hz: a.frequency_alignment,
  imprint: a.capability,
  color: a.color,
}));

// Position seats evenly around a circle
function getSeatPosition(index: number, total: number, radiusPx: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * radiusPx,
    y: Math.sin(angle) * radiusPx,
  };
}

export function CouncilChamber() {
  const [activeSeat, setActiveSeat] = useState<CouncilSeatData | null>(null);
  const radius = 200;

  function handleSeatClick(seat: CouncilSeatData) {
    setActiveSeat((prev) => (prev?.seat === seat.seat ? null : seat));
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col items-center gap-10">
        {/* Chamber ring */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: radius * 2 + 140, height: radius * 2 + 140 }}
          aria-label="Council Chamber — 9 advisor seats"
          role="group"
        >
          {/* Outer decorative ring */}
          <div
            className="absolute inset-0 rounded-full opacity-[0.07]"
            style={{
              border: "1px solid rgba(0,188,212,0.6)",
              boxShadow: "0 0 60px rgba(0,188,212,0.08)",
            }}
            aria-hidden
          />
          {/* Inner faint ring */}
          <div
            className="absolute rounded-full opacity-[0.04]"
            style={{
              width: radius * 2 - 20,
              height: radius * 2 - 20,
              border: "1px dashed rgba(255,255,255,0.5)",
            }}
            aria-hidden
          />

          {/* Center */}
          <m.div
            className="absolute flex flex-col items-center justify-center gap-3 z-10"
            animate={
              activeSeat
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.6, scale: 0.96 }
            }
            transition={{ duration: 0.3 }}
          >
            {activeSeat ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-display font-bold text-white"
                  style={{
                    background: `radial-gradient(circle, ${activeSeat.color}30, transparent 70%)`,
                    border: `1px solid ${activeSeat.color}40`,
                    boxShadow: `0 0 30px ${activeSeat.color}30`,
                  }}
                >
                  {activeSeat.name.slice(0, 1)}
                </div>
                <div className="text-center max-w-[140px]">
                  <p className="font-display text-sm font-bold text-white/80">
                    {activeSeat.domain}
                  </p>
                  <p
                    className="font-mono text-[10px] mt-0.5"
                    style={{ color: activeSeat.color }}
                  >
                    {activeSeat.name}
                  </p>
                  <p className="font-body text-[11px] text-white/40 leading-snug mt-1">
                    {activeSeat.imprint}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full border border-white/[0.06] flex items-center justify-center">
                  <span className="text-white/20 text-xl">&#x2736;</span>
                </div>
                <p className="font-mono text-[10px] text-white/25 text-center max-w-[100px] leading-snug uppercase tracking-wider">
                  Select an advisor
                </p>
              </>
            )}
          </m.div>

          {/* Seats positioned around circle */}
          {COUNCIL_SEATS.map((seat, i) => {
            const { x, y } = getSeatPosition(i, COUNCIL_SEATS.length, radius);
            const centerOffset = radius + 70;
            return (
              <div
                key={seat.seat}
                className="absolute"
                style={{
                  left: centerOffset + x - 36,
                  top: centerOffset + y - 36,
                }}
              >
                <div className="relative">
                  <CouncilSeat
                    data={seat}
                    isActive={activeSeat?.seat === seat.seat}
                    onClick={handleSeatClick}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Begin session CTA */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/council/convening"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,188,212,0.35)] text-[#09090b]"
            style={{ background: "linear-gradient(135deg, #00bcd4 0%, #0d47a1 100%)" }}
          >
            <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white">
              &#x25B6;
            </span>
            Start a Session
          </Link>
        </m.div>
      </div>
    </LazyMotion>
  );
}
