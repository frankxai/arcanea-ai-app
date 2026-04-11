'use client';

import { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Glass intensity — higher = more blur + saturation */
  intensity?: 'subtle' | 'standard' | 'heavy';
  /** Border tint color */
  tint?: string;
  /** Optional noise overlay for organic feel */
  noise?: boolean;
  /** Mouse-tracking sheen effect */
  sheen?: boolean;
}

const INTENSITY_MAP = {
  subtle:   { blur: '12px', sat: '140%', bg: 'rgba(255,255,255,0.02)' },
  standard: { blur: '20px', sat: '180%', bg: 'rgba(255,255,255,0.035)' },
  heavy:    { blur: '32px', sat: '200%', bg: 'rgba(255,255,255,0.05)' },
} as const;

/**
 * LiquidGlass — April 2026 premium glass with real depth.
 *
 * Multi-layer composition:
 *   1. Backdrop blur + saturation boost (real glass refraction)
 *   2. Subtle noise overlay (optional, organic)
 *   3. Mouse-tracking sheen highlight (optional)
 *   4. Inner border ring (depth cue)
 *   5. Brightness boost on hover
 *
 * Content stays static. Only the glass surface breathes.
 * Matches shadcn/aceternity-tier quality without the dependency.
 */
export function LiquidGlass({
  children,
  className = '',
  intensity = 'standard',
  tint = '#ffffff',
  noise = true,
  sheen = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [hovering, setHovering] = useState(false);
  const cfg = INTENSITY_MAP[intensity];

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={sheen ? handleMove : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`relative overflow-hidden isolate ${className}`}
      style={{
        backgroundColor: cfg.bg,
        backdropFilter: `blur(${cfg.blur}) saturate(${cfg.sat}) brightness(${hovering ? 1.08 : 1})`,
        WebkitBackdropFilter: `blur(${cfg.blur}) saturate(${cfg.sat}) brightness(${hovering ? 1.08 : 1})`,
        boxShadow: `
          inset 0 1px 0 0 ${tint}15,
          inset 0 0 0 1px ${tint}08,
          0 1px 2px 0 rgba(0,0,0,0.1),
          0 8px 32px -8px rgba(0,0,0,0.3)
        `,
        transition: 'backdrop-filter 400ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Layer 1: SVG displacement noise (organic glass texture) */}
      {noise && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Layer 2: Mouse-tracking sheen (radial gradient follows cursor) */}
      {sheen && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: hovering ? 0.35 : 0,
            background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, ${tint}20, transparent 60%)`,
          }}
        />
      )}

      {/* Layer 3: Top edge highlight (light catching on top rim) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${tint}25, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
