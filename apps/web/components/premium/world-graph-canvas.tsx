"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// WorldGraphCanvas — Animated visualization of the Living World engine.
// Shows how one sentence connects characters, locations, magic, and lore
// into a persistent graph. The differentiator made visible.
// ---------------------------------------------------------------------------

interface Node {
  id: string;
  label: string;
  type: "character" | "location" | "magic" | "lore" | "seed";
  x: number;
  y: number;
  color: string;
  size: "sm" | "md" | "lg";
  delay: number;
}

interface Edge {
  from: string;
  to: string;
  delay: number;
}

const NODES: Node[] = [
  { id: "seed", label: "a cyberpunk detective", type: "seed", x: 50, y: 50, color: "#7fffd4", size: "lg", delay: 0 },
  { id: "char-1", label: "Kael Duskwalker", type: "character", x: 20, y: 25, color: "#ef4444", size: "md", delay: 0.4 },
  { id: "char-2", label: "Mira Vex", type: "character", x: 78, y: 22, color: "#a855f7", size: "md", delay: 0.6 },
  { id: "loc-1", label: "Neon District", type: "location", x: 15, y: 70, color: "#3b82f6", size: "md", delay: 0.8 },
  { id: "loc-2", label: "The Underspire", type: "location", x: 80, y: 75, color: "#3b82f6", size: "sm", delay: 1.0 },
  { id: "mag-1", label: "Signal Weaving", type: "magic", x: 50, y: 12, color: "#ffd700", size: "sm", delay: 1.2 },
  { id: "lore-1", label: "The Shard Accord", type: "lore", x: 50, y: 88, color: "#c084fc", size: "sm", delay: 1.4 },
];

const EDGES: Edge[] = [
  { from: "seed", to: "char-1", delay: 0.5 },
  { from: "seed", to: "char-2", delay: 0.7 },
  { from: "seed", to: "loc-1", delay: 0.9 },
  { from: "seed", to: "loc-2", delay: 1.1 },
  { from: "seed", to: "mag-1", delay: 1.3 },
  { from: "seed", to: "lore-1", delay: 1.5 },
  { from: "char-1", to: "loc-1", delay: 1.7 },
  { from: "char-2", to: "loc-2", delay: 1.9 },
  { from: "char-1", to: "mag-1", delay: 2.1 },
  { from: "char-2", to: "lore-1", delay: 2.3 },
];

const TYPE_LABEL: Record<Node["type"], string> = {
  character: "CHARACTER",
  location: "LOCATION",
  magic: "MAGIC",
  lore: "LORE",
  seed: "SEED",
};

const SIZE_PX: Record<NonNullable<Node["size"]>, number> = {
  sm: 56,
  md: 72,
  lg: 96,
};

export function WorldGraphCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl bg-white/[0.02] border border-white/[0.05]" />
    );
  }

  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] to-white/[0.005] border border-white/[0.06] rounded-2xl backdrop-blur-sm" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient orbs */}
      <m.div
        className="absolute left-[20%] top-[30%] w-[300px] h-[300px] rounded-full bg-[#00bcd4]/[0.06] blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        className="absolute right-[20%] bottom-[20%] w-[260px] h-[260px] rounded-full bg-[#7c3aed]/[0.05] blur-[110px]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* SVG edges layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {EDGES.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          return (
            <m.line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#edgeGrad)"
              strokeWidth="0.15"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: edge.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        })}
      </svg>

      {/* Nodes layer */}
      <div className="absolute inset-0">
        {NODES.map((node) => {
          const sizePx = SIZE_PX[node.size];
          return (
            <m.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: sizePx,
                height: sizePx,
                marginLeft: -sizePx / 2,
                marginTop: -sizePx / 2,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: node.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Pulse ring for seed */}
              {node.type === "seed" && (
                <m.div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${node.color}66` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Node bubble */}
              <div
                className="relative w-full h-full rounded-full backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden"
                style={{
                  background: `${node.color}10`,
                  border: `1px solid ${node.color}40`,
                  boxShadow: `0 0 24px ${node.color}22, 0 0 0 1px ${node.color}15 inset`,
                }}
              >
                <span
                  className="text-[8px] font-mono tracking-[0.15em] uppercase mb-0.5"
                  style={{ color: `${node.color}bb` }}
                >
                  {TYPE_LABEL[node.type]}
                </span>
                <span
                  className="text-[10px] md:text-[11px] font-display font-semibold text-white/85 text-center px-1.5 leading-tight"
                  style={{ fontSize: node.size === "lg" ? "12px" : undefined }}
                >
                  {node.label}
                </span>
              </div>
            </m.div>
          );
        })}
      </div>

      {/* Legend — bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-5 px-4 py-2 rounded-full bg-black/30 border border-white/[0.06] backdrop-blur-md">
        {[
          { label: "CHARACTER", color: "#ef4444" },
          { label: "LOCATION", color: "#3b82f6" },
          { label: "MAGIC", color: "#ffd700" },
          { label: "LORE", color: "#c084fc" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[9px] font-mono tracking-wider text-white/40">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
