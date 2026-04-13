'use client';

import * as React from 'react';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Glass blur intensity */
  intensity?: 'subtle' | 'standard' | 'heavy';
  /** Accent color for glow + tint (any hex) */
  tint?: string;
  /** Outer glow ring on hover (Ein UI pattern) */
  glow?: boolean;
  /** Mouse-tracking sheen highlight */
  sheen?: boolean;
  /** SVG fractalNoise overlay for organic texture */
  noise?: boolean;
  /** 3D tilt on hover — combines glass + tilt in one component (Ein UI pattern) */
  tilt?: boolean;
  /** Tilt intensity in degrees */
  tiltIntensity?: number;
}

const INTENSITY_MAP = {
  subtle:   { blur: '12px', sat: '140%', bg: 'rgba(255,255,255,0.02)' },
  standard: { blur: '20px', sat: '180%', bg: 'rgba(255,255,255,0.035)' },
  heavy:    { blur: '32px', sat: '200%', bg: 'rgba(255,255,255,0.05)' },
} as const;

/**
 * LiquidGlass v2 — Best-of-breed glass primitive.
 *
 * Absorbs from Ein UI: outer glow ring, translateZ content depth,
 * gradient highlight, 3D tilt option, forwardRef.
 *
 * Retains from v1: fractalNoise texture, saturation boost,
 * configurable tint, mouse-tracking sheen, intensity presets.
 *
 * Composition layers (back to front):
 *   0. Outer glow ring (-inset-2 blur-xl, tint-colored) — hover only
 *   1. Glass surface (backdrop-blur + saturate + brightness)
 *   2. Gradient highlight (top-to-bottom white gradient)
 *   3. SVG fractalNoise (organic texture, optional)
 *   4. Mouse-tracking sheen (radial gradient at cursor, optional)
 *   5. Content at translateZ(20px) for depth separation
 *
 * Edge highlights via inset box-shadow.
 */
const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  (
    {
      children,
      className = '',
      intensity = 'standard',
      tint = '#ffffff',
      glow = false,
      sheen = true,
      noise = true,
      tilt = false,
      tiltIntensity = 10,
      style,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [pos, setPos] = React.useState({ x: -9999, y: -9999 });
    const [hovering, setHovering] = React.useState(false);
    const [transform, setTransform] = React.useState({ rotateX: 0, rotateY: 0 });
    const cfg = INTENSITY_MAP[intensity];

    // Parse hex for rgba glow
    const glowRgba = React.useMemo(() => {
      const n = parseInt(tint.replace('#', ''), 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      return `${r}, ${g}, ${b}`;
    }, [tint]);

    function handleMove(e: React.MouseEvent<HTMLDivElement>) {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (sheen) setPos({ x, y });

      if (tilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setTransform({
          rotateX: ((y - centerY) / centerY) * -tiltIntensity,
          rotateY: ((x - centerX) / centerX) * tiltIntensity,
        });
      }
    }

    function handleLeave() {
      setHovering(false);
      setPos({ x: -9999, y: -9999 });
      if (tilt) setTransform({ rotateX: 0, rotateY: 0 });
    }

    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{ perspective: tilt ? '1000px' : undefined, ...style }}
        {...props}
      >
        {/* Layer 0: Outer glow ring (Ein UI pattern) */}
        {glow && (
          <div
            className="absolute -inset-2 rounded-[inherit] blur-xl transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(${glowRgba}, 0.4), rgba(${glowRgba}, 0.15))`,
              opacity: hovering ? 0.7 : 0.25,
            }}
          />
        )}

        {/* Glass surface */}
        <div
          ref={innerRef}
          onMouseMove={handleMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={handleLeave}
          className="relative overflow-hidden rounded-[inherit] isolate"
          style={{
            backgroundColor: cfg.bg,
            backdropFilter: `blur(${cfg.blur}) saturate(${cfg.sat}) brightness(${hovering ? 1.08 : 1})`,
            WebkitBackdropFilter: `blur(${cfg.blur}) saturate(${cfg.sat}) brightness(${hovering ? 1.08 : 1})`,
            boxShadow: `
              inset 0 1px 0 0 rgba(${glowRgba}, 0.12),
              inset 0 0 0 1px rgba(${glowRgba}, 0.06),
              0 1px 3px rgba(0,0,0,0.12),
              0 8px 32px -8px rgba(0,0,0,0.28)
            `,
            transform: tilt
              ? `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`
              : undefined,
            transformStyle: tilt ? 'preserve-3d' : undefined,
            transition: 'backdrop-filter 400ms cubic-bezier(0.22,1,0.36,1), transform 200ms ease-out, box-shadow 300ms ease',
          }}
        >
          {/* Layer 2: Gradient highlight (top-to-bottom light catch — Ein UI pattern) */}
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.08] to-transparent" />

          {/* Layer 3: SVG fractalNoise (organic glass texture) */}
          {noise && (
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.018] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
          )}

          {/* Layer 4: Mouse-tracking sheen */}
          {sheen && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hovering ? 0.4 : 0,
                background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(${glowRgba}, 0.15), transparent 55%)`,
              }}
            />
          )}

          {/* Layer 5: Content with depth separation */}
          <div
            className="relative"
            style={{ transform: tilt ? 'translateZ(20px)' : undefined }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
LiquidGlass.displayName = 'LiquidGlass';

export { LiquidGlass };
