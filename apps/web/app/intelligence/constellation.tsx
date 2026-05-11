/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useMemo } from 'react';
import { m } from 'framer-motion';
import type { Agent, AgentTier } from '@/lib/intelligence/agents';

// ───────────────────────────────────────────────────────────────────────────
// Layout — deterministic radial map keyed by tier
// ───────────────────────────────────────────────────────────────────────────

const VB_W = 1200;
const VB_H = 720;
const CENTER = { x: VB_W / 2, y: VB_H / 2 };

const TIER_RADIUS: Record<AgentTier, number> = {
  orchestrator: 0,
  guardian: 200,
  specialist: 295,
  strategic: 360,
  creative: 360,
  persona: 360,
};

const TIER_NODE_RADIUS: Record<AgentTier, number> = {
  orchestrator: 11,
  guardian: 7,
  specialist: 5.5,
  strategic: 4.5,
  creative: 4.5,
  persona: 4.5,
};

// Deterministic 0..1 hash so SSR renders the same as the client.
function hash01(s: string, seed = 0): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  // Mix
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return (h % 100000) / 100000;
}

interface PlacedAgent extends Agent {
  x: number;
  y: number;
  nodeR: number;
  delay: number;
}

function place(agents: Agent[]): PlacedAgent[] {
  // Group by tier so we can spread evenly within each ring.
  const byTier = agents.reduce<Record<AgentTier, Agent[]>>(
    (acc, a) => {
      (acc[a.tier] ||= []).push(a);
      return acc;
    },
    {} as Record<AgentTier, Agent[]>,
  );

  const out: PlacedAgent[] = [];

  for (const tierKey of Object.keys(byTier) as AgentTier[]) {
    const list = byTier[tierKey];
    const r = TIER_RADIUS[tierKey];
    const nodeR = TIER_NODE_RADIUS[tierKey];

    list.forEach((a, idx) => {
      if (tierKey === 'orchestrator') {
        out.push({ ...a, x: CENTER.x, y: CENTER.y, nodeR, delay: 0 });
        return;
      }
      const total = list.length;
      const baseAngle = (idx / total) * Math.PI * 2 - Math.PI / 2;
      // Deterministic per-node organic offset so the constellation does not
      // look like a clock dial.
      const jitterAngle = (hash01(a.id, 1) - 0.5) * 0.18;
      const jitterR = (hash01(a.id, 2) - 0.5) * 32;
      const angle = baseAngle + jitterAngle;
      const radius = r + jitterR;
      out.push({
        ...a,
        x: CENTER.x + Math.cos(angle) * radius,
        y: CENTER.y + Math.sin(angle) * radius * 0.78, // squash vertically — feels cinematic
        nodeR,
        delay: 0.18 + idx * 0.04 + tierBaseDelay(tierKey),
      });
    });
  }

  return out;
}

function tierBaseDelay(tier: AgentTier): number {
  switch (tier) {
    case 'orchestrator':
      return 0;
    case 'guardian':
      return 0.1;
    case 'specialist':
      return 0.5;
    case 'strategic':
    case 'creative':
    case 'persona':
      return 0.85;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

interface ConstellationProps {
  agents: Agent[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function Constellation({
  agents,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: ConstellationProps) {
  const placed = useMemo(() => place(agents), [agents]);
  const lumina = placed.find((a) => a.tier === 'orchestrator');

  return (
    <div
      className="relative mx-auto w-full max-w-[1200px]"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="The Lumina Constellation: Arcanea agents arranged by tier"
      >
        <defs>
          <radialGradient id="lumina-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--arc-brand-arcanean-gold)" stopOpacity="0.55" />
            <stop offset="40%" stopColor="var(--arc-brand-arcanean-gold)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--arc-brand-arcanean-gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-soft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="node-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>

        {/* Concentric rings — barely visible orbital guides */}
        <m.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          {[200, 295, 360].map((r) => (
            <ellipse
              key={r}
              cx={CENTER.x}
              cy={CENTER.y}
              rx={r}
              ry={r * 0.78}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2 6"
              opacity="0.5"
            />
          ))}
        </m.g>

        {/* Connection rays — Lumina to every other node */}
        {lumina &&
          placed
            .filter((p) => p.id !== lumina.id)
            .map((p) => {
              const isLit =
                hoveredId === p.id || selectedId === p.id;
              return (
                <m.line
                  key={`ray-${p.id}`}
                  x1={lumina.x}
                  y1={lumina.y}
                  x2={p.x}
                  y2={p.y}
                  stroke={p.color}
                  strokeWidth={isLit ? 1.1 : 0.4}
                  strokeOpacity={isLit ? 0.55 : 0.08}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.9, delay: p.delay },
                    opacity: { duration: 0.4, delay: p.delay },
                  }}
                />
              );
            })}

        {/* Lumina's golden bloom */}
        {lumina && (
          <m.circle
            cx={lumina.x}
            cy={lumina.y}
            r={140}
            fill="url(#lumina-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.65, 0.4] }}
            transition={{
              opacity: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )}

        {/* Nodes */}
        {placed.map((p) => {
          const isHover = hoveredId === p.id;
          const isSelected = selectedId === p.id;
          const isActive = isHover || isSelected;
          return (
            <m.g
              key={p.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: p.delay,
                ease: [0.22, 0.65, 0.25, 1],
              }}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(p.id)}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(p.id)}
              onBlur={() => onHover(null)}
            >
              {/* Outer halo — pulses on hover, larger pulse for Lumina always */}
              <m.circle
                cx={p.x}
                cy={p.y}
                r={p.nodeR * 4.2}
                fill={p.color}
                fillOpacity={p.tier === 'orchestrator' ? 0.18 : 0.08}
                animate={
                  p.tier === 'orchestrator' || isActive
                    ? { r: [p.nodeR * 4.2, p.nodeR * 5.4, p.nodeR * 4.2] }
                    : {}
                }
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                filter="url(#node-blur)"
              />
              {/* Star core */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? p.nodeR * 1.25 : p.nodeR}
                fill={p.color}
                style={{
                  filter: `drop-shadow(0 0 ${isActive ? 14 : 8}px ${p.color})`,
                  transition: 'r 280ms cubic-bezier(0.22,0.65,0.25,1)',
                }}
              />
              {/* Hit area for easier mobile tap */}
              <circle
                cx={p.x}
                cy={p.y}
                r={Math.max(22, p.nodeR * 3)}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={`${p.name} — ${p.tagline}`}
              />
              {/* Label — visible always for orchestrator + guardians, hover-only otherwise */}
              {(p.tier === 'orchestrator' || p.tier === 'guardian' || isActive) && (
                <m.text
                  x={p.x}
                  y={
                    p.y +
                    (p.tier === 'orchestrator'
                      ? -p.nodeR - 18
                      : p.nodeR + 16)
                  }
                  textAnchor="middle"
                  fill={isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)'}
                  fontSize={p.tier === 'orchestrator' ? 13 : 11}
                  letterSpacing="0.28em"
                  style={{
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: p.delay + 0.2 }}
                >
                  {p.name}
                </m.text>
              )}
            </m.g>
          );
        })}
      </svg>
    </div>
  );
}
