'use client';

/**
 * LiquidGlass — Arcanea's signature Apple-inspired Liquid Glass primitive.
 *
 * Multi-layer material featuring:
 *   1. Backdrop blur + saturate + brightness for the base glass
 *   2. Mouse-reactive radial specular highlight (GPU-only)
 *   3. Conic prismatic border (chromatic aberration)
 *   4. Inner light via inset shadows
 *   5. Framer Motion subtle hover lift (honors prefers-reduced-motion)
 *
 * Additive to existing GlassCard — does NOT replace it.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Variants ─────────────────────────────────────────────────────────────────

const liquidGlassVariants = cva(
  [
    'group/lg relative overflow-hidden rounded-2xl border',
    'transition-all duration-500 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
  ],
  {
    variants: {
      intensity: {
        subtle: 'backdrop-blur-md bg-white/[0.02] border-white/[0.06]',
        medium: 'backdrop-blur-xl bg-white/[0.04] border-white/[0.1]',
        strong: 'backdrop-blur-2xl bg-white/[0.06] border-white/[0.14]',
      },
      tint: {
        neutral: '',
        crystal: 'border-cyan-500/15',
        gold: 'border-amber-500/15',
        fire: 'border-red-500/15',
        void: 'border-purple-500/15',
        water: 'border-blue-500/15',
      },
      glow: {
        none: '',
        soft: 'shadow-[0_0_40px_-10px_rgba(0,188,212,0.15)]',
        medium: 'shadow-[0_0_60px_-10px_rgba(0,188,212,0.25)]',
        intense: 'shadow-[0_0_80px_-10px_rgba(0,188,212,0.4)]',
      },
    },
    defaultVariants: {
      intensity: 'medium',
      tint: 'neutral',
      glow: 'soft',
    },
  }
);

// Per-tint accent colors for the specular highlight + conic border
const TINT_ACCENTS: Record<
  NonNullable<VariantProps<typeof liquidGlassVariants>['tint']>,
  { spec: string; a: string; b: string; c: string }
> = {
  neutral: {
    spec: 'rgba(255,255,255,0.10)',
    a: 'rgba(0,188,212,0.30)',
    b: 'rgba(255,215,0,0.20)',
    c: 'rgba(139,92,246,0.30)',
  },
  crystal: {
    spec: 'rgba(0,220,255,0.14)',
    a: 'rgba(0,188,212,0.40)',
    b: 'rgba(125,249,255,0.25)',
    c: 'rgba(0,136,170,0.35)',
  },
  gold: {
    spec: 'rgba(255,215,0,0.14)',
    a: 'rgba(255,215,0,0.45)',
    b: 'rgba(255,255,255,0.25)',
    c: 'rgba(255,140,0,0.35)',
  },
  fire: {
    spec: 'rgba(255,120,80,0.14)',
    a: 'rgba(239,68,68,0.40)',
    b: 'rgba(255,165,0,0.30)',
    c: 'rgba(190,24,93,0.40)',
  },
  void: {
    spec: 'rgba(168,120,255,0.14)',
    a: 'rgba(139,92,246,0.45)',
    b: 'rgba(236,72,153,0.25)',
    c: 'rgba(59,7,100,0.40)',
  },
  water: {
    spec: 'rgba(96,165,250,0.14)',
    a: 'rgba(13,71,161,0.45)',
    b: 'rgba(56,189,248,0.25)',
    c: 'rgba(30,64,175,0.40)',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LiquidGlassProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>,
    VariantProps<typeof liquidGlassVariants> {
  /** Enables mouse-follow specular highlight + hover lift. Default: true. */
  interactive?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  (
    {
      className,
      intensity,
      tint,
      glow,
      interactive = true,
      children,
      style,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const enableInteractive = interactive && !shouldReduceMotion;

    const [pos, setPos] = React.useState({ x: 50, y: 50, active: false });

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (enableInteractive) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setPos({ x, y, active: true });
        }
        onMouseMove?.(e);
      },
      [enableInteractive, onMouseMove]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setPos((prev) => ({ ...prev, active: false }));
        onMouseLeave?.(e);
      },
      [onMouseLeave]
    );

    const accents = TINT_ACCENTS[tint ?? 'neutral'];

    // Inner light — always applied. Inset shadows create the material depth.
    const innerLightShadow = [
      'inset 0 1px 0 rgba(255,255,255,0.10)',
      'inset 0 -1px 0 rgba(0,0,0,0.20)',
      '0 8px 32px rgba(0,0,0,0.40)',
    ].join(', ');

    return (
      <m.div
        ref={ref}
        className={cn(liquidGlassVariants({ intensity, tint, glow }), className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={enableInteractive ? { scale: 1.01 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.6 }}
        style={{
          WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(110%)',
          backdropFilter: 'blur(20px) saturate(180%) brightness(110%)',
          boxShadow: innerLightShadow,
          willChange: 'transform',
          ...style,
        }}
        {...props}
      >
        {/* Prismatic conic border (chromatic aberration on the edge) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover/lg:opacity-100"
          style={{
            padding: '1px',
            background: `conic-gradient(from 0deg, ${accents.a}, ${accents.b}, ${accents.c}, ${accents.a})`,
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
          }}
        />

        {/* Mouse-follow specular highlight */}
        {enableInteractive && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: pos.active ? 1 : 0,
              background: `radial-gradient(circle 400px at ${pos.x}% ${pos.y}%, ${accents.spec}, transparent 40%)`,
              willChange: 'opacity',
            }}
          />
        )}

        {/* Top edge iridescent sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accents.a}, transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative">{children}</div>
      </m.div>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';

export { liquidGlassVariants };
