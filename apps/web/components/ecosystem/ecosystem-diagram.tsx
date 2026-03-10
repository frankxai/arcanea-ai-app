"use client";

import { useEffect, useRef, useState } from "react";
import {
  PhPlanetX,
  PhDatabase,
  PhCode,
  PhGraphNetwork,
  PhBrowser,
  PhLightning,
  PhLink,
  PhPaintBrush,
  PhChatTeardrop,
  type PhosphorIcon,
} from '@/lib/phosphor-icons';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  Icon: PhosphorIcon;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HUB_NODES: Node[] = [
  { id: "chat", label: "Chat", Icon: PhChatTeardrop, color: "#00bcd4" },
  { id: "imagine", label: "Imagine", Icon: PhPaintBrush, color: "#00bcd4" },
  { id: "studio", label: "Studio", Icon: PhPlanetX, color: "#00bcd4" },
  { id: "records", label: "Records", Icon: PhDatabase, color: "#00bcd4" },
];

const INNER_TOOLS: (Node & { angle: number; description: string })[] = [
  {
    id: "vault",
    label: "Arcanea Vault",
    sublabel: "Chrome Extension",
    description: "Export AI conversations from ChatGPT, Claude, Gemini",
    Icon: PhDatabase,
    color: "#00bcd4",
    angle: 0,
  },
  {
    id: "code",
    label: "Arcanea Code",
    sublabel: "VS Code Extension",
    description: "Guardian AI sidebar inside your editor",
    Icon: PhCode,
    color: "#8b5cf6",
    angle: 120,
  },
  {
    id: "flow",
    label: "Arcanea Flow",
    sublabel: "Multi-Agent OS",
    description: "Orchestrate 60+ Guardian agents in parallel",
    Icon: PhGraphNetwork,
    color: "#ffd700",
    angle: 240,
  },
];

const OUTER_TOOLS: (Node & { angle: number; description: string })[] = [
  {
    id: "chatgpt",
    label: "ChatGPT Overlay",
    description: "Inject Guardian intelligence into ChatGPT",
    Icon: PhBrowser,
    color: "#74aa9c",
    angle: 0,
  },
  {
    id: "claude",
    label: "Claude Overlay",
    description: "Bring Arcanea lore into Claude conversations",
    Icon: PhBrowser,
    color: "#cc785c",
    angle: 72,
  },
  {
    id: "gemini",
    label: "Gemini Overlay",
    description: "Arcanea system prompts for Google Gemini",
    Icon: PhBrowser,
    color: "#4285f4",
    angle: 144,
  },
  {
    id: "workflows",
    label: "n8n Workflows",
    description: "3 Guardian automation templates",
    Icon: PhLightning,
    color: "#ea4b71",
    angle: 216,
  },
  {
    id: "onchain",
    label: "Arcanea On-Chain",
    description: "Story Protocol + Base NFT IP protection",
    Icon: PhLink,
    color: "#6366f1",
    angle: 288,
  },
];

// ─── Orbit Node ───────────────────────────────────────────────────────────────

function OrbitNode({
  node,
  radius,
  orbitDeg,
  size,
}: {
  node: Node & { angle: number; description: string };
  radius: number;
  orbitDeg: number;
  size: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(false);
  const totalAngle = (node.angle + orbitDeg) * (Math.PI / 180);
  const x = radius * Math.cos(totalAngle);
  const y = radius * Math.sin(totalAngle);

  const boxSize = size === "md" ? 80 : 64;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
      role="img"
      aria-label={`${node.label}: ${node.description}`}
    >
      {/* Glow on hover */}
      {hovered && (
        <circle
          r={boxSize / 2 + 8}
          fill={node.color}
          opacity={0.12}
          style={{ filter: "blur(8px)" }}
        />
      )}
      {/* Node box */}
      <foreignObject
        x={-boxSize / 2}
        y={-boxSize / 2}
        width={boxSize}
        height={boxSize}
        style={{ overflow: "visible" }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-xl border transition-all duration-200"
          style={{
            width: boxSize,
            height: boxSize,
            background: hovered
              ? `color-mix(in srgb, ${node.color} 18%, rgba(10,10,20,0.9))`
              : "rgba(10,10,20,0.85)",
            borderColor: hovered
              ? `color-mix(in srgb, ${node.color} 60%, transparent)`
              : "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <node.Icon
            weight="thin"
            size={size === "md" ? 20 : 16}
            style={{ color: node.color }}
          />
          <span
            className="text-center font-display leading-tight mt-1"
            style={{
              fontSize: size === "md" ? 9 : 8,
              color: hovered ? node.color : "rgba(255,255,255,0.7)",
            }}
          >
            {node.label}
          </span>
        </div>
      </foreignObject>

      {/* Tooltip */}
      {hovered && (
        <foreignObject
          x={-80}
          y={boxSize / 2 + 4}
          width={160}
          height={60}
          style={{ overflow: "visible", pointerEvents: "none" }}
        >
          <div
            className="rounded-lg border text-center px-2 py-1.5"
            style={{
              background: "rgba(10,10,20,0.95)",
              borderColor: `color-mix(in srgb, ${node.color} 30%, transparent)`,
            }}
          >
            <p className="font-mono text-white/[0.70] font-medium" style={{ fontSize: 9 }}>
              {node.label}
            </p>
            {(node as Node & { sublabel?: string }).sublabel && (
              <p className="font-mono opacity-50" style={{ fontSize: 8, color: node.color }}>
                {(node as Node & { sublabel?: string }).sublabel}
              </p>
            )}
            <p className="text-white/[0.30] mt-0.5" style={{ fontSize: 8 }}>
              {node.description}
            </p>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EcosystemDiagram() {
  const [innerAngle, setInnerAngle] = useState(0);
  const [outerAngle, setOuterAngle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const animate = (time: number) => {
      const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = time;
      // Inner ring: 1 revolution per 60s → 6 deg/s
      setInnerAngle((a) => (a + delta * 6) % 360);
      // Outer ring: counter-clockwise, 1 revolution per 90s → 4 deg/s
      setOuterAngle((a) => (a - delta * 4 + 360) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  // SVG dimensions — responsive via viewBox
  const cx = 300;
  const cy = 300;
  const innerRadius = 120;
  const outerRadius = 220;

  return (
    <div className="w-full" aria-label="Arcanea ecosystem diagram">
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">
          Architecture
        </p>
        <h2 className="text-fluid-xl font-display font-bold">
          The Arcanea Ecosystem
        </h2>
        <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
          Every product orbits the arcanea.ai platform hub. Hover to explore.
        </p>
      </div>

      <div className="flex justify-center">
        <svg
          viewBox="0 0 600 600"
          className="w-full max-w-[600px]"
          style={{ maxHeight: "600px" }}
          role="img"
          aria-label="Interactive Arcanea product ecosystem diagram"
        >
          {/* Outer orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
            strokeDasharray="4 8"
          />
          {/* Inner orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius}
            fill="none"
            stroke="rgba(0,188,212,0.06)"
            strokeWidth={1}
            strokeDasharray="3 6"
          />

          {/* Connection lines from hub to inner tools */}
          {INNER_TOOLS.map((node) => {
            const totalAngle = ((node.angle + innerAngle) * Math.PI) / 180;
            const nodeX = cx + innerRadius * Math.cos(totalAngle);
            const nodeY = cy + innerRadius * Math.sin(totalAngle);
            return (
              <line
                key={node.id}
                x1={cx}
                y1={cy}
                x2={nodeX}
                y2={nodeY}
                stroke={node.color}
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />
            );
          })}

          {/* Hub glow */}
          <circle
            cx={cx}
            cy={cy}
            r={60}
            fill="rgba(0,188,212,0.04)"
            style={{ filter: "blur(12px)" }}
          />

          {/* Hub circle */}
          <circle
            cx={cx}
            cy={cy}
            r={52}
            fill="rgba(10,10,20,0.92)"
            stroke="rgba(0,188,212,0.25)"
            strokeWidth={1}
          />

          {/* Hub label */}
          <text
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            fill="#00bcd4"
            fontSize={10}
            fontFamily="Cinzel, serif"
            fontWeight={600}
            letterSpacing={1}
          >
            arcanea.ai
          </text>
          <text
            x={cx}
            y={cy + 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize={7}
            fontFamily="monospace"
          >
            Chat · Imagine
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize={7}
            fontFamily="monospace"
          >
            Studio · Records
          </text>

          {/* Inner orbit tools */}
          <g transform={`translate(${cx}, ${cy})`}>
            {INNER_TOOLS.map((node) => (
              <OrbitNode
                key={node.id}
                node={node}
                radius={innerRadius}
                orbitDeg={innerAngle}
                size="md"
              />
            ))}
          </g>

          {/* Outer orbit tools */}
          <g transform={`translate(${cx}, ${cy})`}>
            {OUTER_TOOLS.map((node) => (
              <OrbitNode
                key={node.id}
                node={node}
                radius={outerRadius}
                orbitDeg={outerAngle}
                size="sm"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-crystal" />
          <span className="text-xs text-text-secondary">Core Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-crystal/40" style={{ borderStyle: "dashed" }} />
          <span className="text-xs text-text-secondary">Developer Tools</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-white/[0.12]" />
          <span className="text-xs text-text-secondary">Integrations</span>
        </div>
      </div>
    </div>
  );
}
