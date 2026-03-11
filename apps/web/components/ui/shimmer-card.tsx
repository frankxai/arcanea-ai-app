'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMouseStore } from '@/hooks/use-mouse-store';

/**
 * ShimmerCard — Premium card with CSS Houdini rotating conic-gradient
 * border + optional cursor-following glow.
 *
 * Uses @property --shimmer-angle for smooth native angle rotation.
 * Requires the shimmer-ring CSS classes in globals.css.
 */

export type ShimmerColor = 'cyan' | 'gold' | 'purple' | 'fire';
export type ShimmerSpeed = 'fast' | 'normal' | 'slow';

export interface ShimmerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Border color preset */
  color?: ShimmerColor;
  /** Rotation speed */
  speed?: ShimmerSpeed;
  /** Only show shimmer on hover */
  hoverOnly?: boolean;
  /** Show cursor-following glow */
  glow?: boolean;
  /** Glow radius in px */
  glowRadius?: number;
  /** Border width in px */
  borderWidth?: number;
  /** Glass tier */
  glass?: 'glass' | 'liquid-glass' | 'glass-strong' | 'none';
}

const glowRgb: Record<ShimmerColor, string> = {
  cyan: '0, 188, 212',
  gold: '255, 215, 0',
  purple: '139, 92, 246',
  fire: '239, 68, 68',
};

const ShimmerCard = React.forwardRef<HTMLDivElement, ShimmerCardProps>(
  (
    {
      className,
      color = 'cyan',
      speed = 'normal',
      hoverOnly = false,
      glow = true,
      glowRadius = 400,
      borderWidth = 1,
      glass = 'glass',
      children,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const glowRef = React.useRef<HTMLDivElement | null>(null);
    const rafId = React.useRef<number>(0);
    const globalMouse = useMouseStore();

    // Position glow via direct DOM mutation (60fps, no re-renders)
    const positionGlow = React.useCallback(
      (clientX: number, clientY: number) => {
        if (!glow || !cardRef.current || !glowRef.current) return;
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          const rect = cardRef.current?.getBoundingClientRect();
          if (!rect || !glowRef.current) return;
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          const rgb = glowRgb[color];

          // Show glow when cursor is near card
          const pad = 100;
          const inside =
            clientX >= rect.left - pad &&
            clientX <= rect.right + pad &&
            clientY >= rect.top - pad &&
            clientY <= rect.bottom + pad;

          glowRef.current.style.background = inside
            ? `radial-gradient(${glowRadius}px circle at ${x}px ${y}px, rgba(${rgb}, 0.12), transparent 60%)`
            : 'transparent';
        });
      },
      [glow, glowRadius, color]
    );

    React.useEffect(() => {
      positionGlow(globalMouse.x, globalMouse.y);
    }, [globalMouse.x, globalMouse.y, positionGlow]);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const speedCls =
      speed === 'fast'
        ? 'shimmer-ring-fast'
        : speed === 'slow'
          ? 'shimmer-ring-slow'
          : '';

    const colorCls = `shimmer-ring-${color}`;

    return (
      <div
        ref={setRefs}
        className={cn(
          'group relative overflow-hidden rounded-2xl',
          hoverOnly && 'shimmer-hover',
          glass !== 'none' && glass,
          className
        )}
        {...props}
      >
        {/* Rotating conic-gradient border */}
        <div
          className={cn(
            'shimmer-ring',
            colorCls,
            speedCls,
            hoverOnly && 'shimmer-ring-hover'
          )}
          aria-hidden
        />

        {/* Inner mask — clips border to ring width */}
        <div
          className="shimmer-mask"
          style={{ inset: borderWidth }}
          aria-hidden
        />

        {/* Cursor-following glow layer */}
        {glow && (
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 z-[2] rounded-2xl transition-none"
            aria-hidden
          />
        )}

        {/* Content */}
        <div className="relative z-[3]">{children}</div>
      </div>
    );
  }
);

ShimmerCard.displayName = 'ShimmerCard';

export { ShimmerCard };
