"use client";

import React, { useState } from "react";
import type { RealmDefinition } from "@arcanea/schemas";
import { Waveform } from "@/lib/phosphor-icons";
import { brand, elements, gold, cosmic } from "@arcanea/design-system";

interface RealmNodeLayout {
  id: string;
  x: number;
  y: number;
  color: string;
  glow: string;
}

const REALM_POSITIONS: Record<string, RealmNodeLayout> = {
  eldria_prime: {
    id: "eldria_prime",
    x: 480,
    y: 90,
    color: brand.arcaneanGold,
    glow: "rgba(255, 215, 0, 0.4)",
  },
  astraea_spires: {
    id: "astraea_spires",
    x: 750,
    y: 170,
    color: elements.water.bright,
    glow: "rgba(120, 166, 255, 0.4)",
  },
  aurevalde: {
    id: "aurevalde",
    x: 780,
    y: 390,
    color: elements.fire.base,
    glow: "rgba(255, 107, 53, 0.4)",
  },
  matter_reach: {
    id: "matter_reach",
    x: 520,
    y: 440,
    color: elements.wind.base,
    glow: "rgba(0, 255, 136, 0.4)",
  },
  shadowfen: {
    id: "shadowfen",
    x: 180,
    y: 400,
    color: elements.void.base,
    glow: "rgba(153, 102, 255, 0.4)",
  },
  mar_arcano: {
    id: "mar_arcano",
    x: 200,
    y: 190,
    color: brand.atlanteanTeal,
    glow: "rgba(0, 188, 212, 0.4)",
  },
  veldoria: {
    id: "veldoria",
    x: 460,
    y: 260,
    color: gold.bright,
    glow: "rgba(255, 204, 51, 0.4)",
  },
};

const CANONICAL_EDGES: [string, string][] = [
  ["eldria_prime", "veldoria"],
  ["eldria_prime", "astraea_spires"],
  ["eldria_prime", "mar_arcano"],
  ["veldoria", "aurevalde"],
  ["veldoria", "mar_arcano"],
  ["mar_arcano", "shadowfen"],
  ["shadowfen", "matter_reach"],
  ["aurevalde", "matter_reach"],
  ["astraea_spires", "aurevalde"],
];

interface RealmConstellationProps {
  realms: Record<string, RealmDefinition>;
  selectedRealmAId: string;
  selectedRealmBId: string;
  onSelectRealmA: (id: string) => void;
  onSelectRealmB: (id: string) => void;
  corridorStatus: "open" | "closed" | "drifting";
  stability: number;
  harmonicDelta: number;
}

export function RealmConstellation({
  realms,
  selectedRealmAId,
  selectedRealmBId,
  onSelectRealmA,
  onSelectRealmB,
  corridorStatus,
  stability,
  harmonicDelta,
}: RealmConstellationProps) {
  const [hoveredRealmId, setHoveredRealmId] = useState<string | null>(null);

  const activeA = REALM_POSITIONS[selectedRealmAId];
  const activeB = REALM_POSITIONS[selectedRealmBId];

  const hoveredRealm = hoveredRealmId ? realms[hoveredRealmId] : null;

  return (
    <div className="relative w-full rounded-3xl bg-black/40 border border-white/[0.08] overflow-hidden backdrop-blur-xl p-4 sm:p-6 select-none">
      {/* Background Header Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--arc-brand-arcanean-gold,#d4af37)]">
          <Waveform className="w-4 h-4 animate-pulse" />
          <span>Interactive Leyline Mandala</span>
        </div>
        <p className="text-xs text-white/50 mt-1 max-w-sm">
          Click nodes to assign Origin (A) or Target (B). Witness the standing-wave corridor lock.
        </p>
      </div>

      {/* Corridor HUD Overlay */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              corridorStatus === "open"
                ? "bg-emerald-400 animate-ping"
                : corridorStatus === "drifting"
                ? "bg-amber-400 animate-pulse"
                : "bg-rose-400"
            }`}
          />
          <span className="text-white/80 uppercase">
            {corridorStatus} · {(stability * 100).toFixed(0)}% Stability
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] max-h-[520px] relative">
        <svg
          viewBox="0 0 960 520"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Radial Gradients for Glows */}
            <radialGradient id="source-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={brand.arcaneanGold} stopOpacity="0.3" />
              <stop offset="100%" stopColor={brand.arcaneanGold} stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Concentric Harmonic Waves */}
          <circle cx="480" cy="260" r="120" fill="none" stroke="white" strokeOpacity="0.03" strokeDasharray="3 6" />
          <circle cx="480" cy="260" r="200" fill="none" stroke="white" strokeOpacity="0.02" strokeDasharray="4 8" />
          <circle cx="480" cy="260" r="300" fill="none" stroke="white" strokeOpacity="0.015" strokeDasharray="5 10" />

          {/* Canonical Leyline Edges */}
          {CANONICAL_EDGES.map(([aId, bId]) => {
            const posA = REALM_POSITIONS[aId];
            const posB = REALM_POSITIONS[bId];
            if (!posA || !posB) return null;

            const isCurrentPair =
              (selectedRealmAId === aId && selectedRealmBId === bId) ||
              (selectedRealmAId === bId && selectedRealmBId === aId);

            if (isCurrentPair) return null; // Drawn below with active highlight

            return (
              <line
                key={`edge-${aId}-${bId}`}
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke="white"
                strokeOpacity="0.12"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Active Corridor Beam between selectedRealmAId and selectedRealmBId */}
          {activeA && activeB && (
            <g>
              <line
                x1={activeA.x}
                y1={activeA.y}
                x2={activeB.x}
                y2={activeB.y}
                stroke={
                  corridorStatus === "open"
                    ? elements.wind.base
                    : corridorStatus === "drifting"
                    ? gold.bright
                    : elements.fire.base
                }
                strokeWidth="3.5"
                filter="url(#glow)"
                strokeOpacity="0.8"
              />
              <line
                x1={activeA.x}
                y1={activeA.y}
                x2={activeB.x}
                y2={activeB.y}
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                className="animate-pulse"
              />

              {/* Midpoint Resonance Badge */}
              <g
                transform={`translate(${(activeA.x + activeB.x) / 2}, ${(activeA.y + activeB.y) / 2})`}
              >
                <circle r="18" fill={cosmic.void} stroke="white" strokeOpacity="0.3" strokeWidth="1" />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="white"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {harmonicDelta}Hz
                </text>
              </g>
            </g>
          )}

          {/* Realm Nodes */}
          {Object.entries(REALM_POSITIONS).map(([id, pos]) => {
            const realm = realms[id];
            if (!realm) return null;

            const isA = selectedRealmAId === id;
            const isB = selectedRealmBId === id;
            const isHovered = hoveredRealmId === id;

            return (
              <g
                key={id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredRealmId(id)}
                onMouseLeave={() => setHoveredRealmId(null)}
                onClick={() => {
                  if (isA) {
                    // Already A, do nothing
                  } else if (isB) {
                    // Already B, swap
                    onSelectRealmB(selectedRealmAId);
                    onSelectRealmA(id);
                  } else {
                    // Set as Target B by default
                    onSelectRealmB(id);
                  }
                }}
              >
                {/* Outer Pulse Ring */}
                <circle
                  r={isA || isB || isHovered ? "38" : "28"}
                  fill={pos.glow}
                  opacity={isA || isB ? 0.35 : isHovered ? 0.25 : 0.12}
                  className="transition-all duration-300"
                />

                {/* Focus/Selection Ring */}
                {(isA || isB) && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={isA ? elements.wind.base : brand.atlanteanTeal}
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ animationDuration: "10s" }}
                  />
                )}

                {/* Central Core Circle */}
                <circle
                  r={isA || isB ? "18" : "14"}
                  fill={cosmic.void}
                  stroke={pos.color}
                  strokeWidth={isA || isB ? "2.5" : "1.5"}
                />

                {/* Inner Dot */}
                <circle
                  r="5"
                  fill={pos.color}
                  filter="url(#glow)"
                />

                {/* Node Label Below */}
                <text
                  y="34"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight={isA || isB ? "600" : "500"}
                  className="tracking-wide"
                >
                  {realm.name}
                </text>

                {/* Frequency Hz Badge */}
                <text
                  y="46"
                  textAnchor="middle"
                  fill={pos.color}
                  fontSize="10"
                  fontFamily="monospace"
                  opacity="0.9"
                >
                  {realm.frequencyHz} Hz
                </text>

                {/* Origin / Target Pill */}
                {isA && (
                  <g transform="translate(0, -28)">
                    <rect x="-24" y="-8" width="48" height="16" rx="8" fill={elements.wind.base} />
                    <text textAnchor="middle" dy="3.5" fill="black" fontSize="9" fontWeight="bold">
                      ORIGIN (A)
                    </text>
                  </g>
                )}
                {isB && (
                  <g transform="translate(0, -28)">
                    <rect x="-24" y="-8" width="48" height="16" rx="8" fill={brand.atlanteanTeal} />
                    <text textAnchor="middle" dy="3.5" fill="black" fontSize="9" fontWeight="bold">
                      TARGET (B)
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Detail Card */}
      {hoveredRealm && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 p-4 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl pointer-events-none transition-all duration-200">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display font-medium text-white text-sm">
              {hoveredRealm.name}
            </h4>
            <span className="text-[11px] font-mono text-[var(--arc-brand-gold)]">
              {hoveredRealm.frequencyHz} Hz
            </span>
          </div>
          <p className="text-xs text-white/50 mb-2 capitalize">
            Gate: {hoveredRealm.dominantGate} · Element: {hoveredRealm.primaryElement}
          </p>
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
            {hoveredRealm.geography.terrain}
          </p>
        </div>
      )}
    </div>
  );
}
