'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * GlowCard — Mouse-tracking cursor light effect.
 *
 * A radial glow follows the cursor across the card surface,
 * illuminating the area under the mouse. Inspired by Doppler.
 *
 * Uses CSS custom properties for zero-JS overhead on the render loop:
 * the mousemove handler only updates two CSS vars, and CSS handles the rest.
 *
 * Glass tier can be applied alongside: `<GlowCard className="liquid-glass">`.
 */

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color — defaults to crystal (teal). */
  glowColor?: string;
  /** Glow size in px — defaults to 300. */
  glowSize?: number;
  /** Whether to apply hover-lift effect. */
  lift?: boolean;
  /** Glass tier class to apply (glass, liquid-glass, etc). Defaults to "glass". */
  glass?: 'glass-subtle' | 'glass' | 'glass-strong' | 'liquid-glass' | 'liquid-glass-elevated' | 'iridescent-glass' | 'none';
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, glowColor, glowSize = 300, lift = true, glass = 'glass', children, onMouseMove, onMouseLeave, style, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const glowRef = React.useRef<HTMLDivElement | null>(null);

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !glowRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glowRef.current.style.transform = `translate(${x - glowSize / 2}px, ${y - glowSize / 2}px)`;
        glowRef.current.style.opacity = '1';
        onMouseMove?.(e);
      },
      [glowSize, onMouseMove]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (glowRef.current) {
          glowRef.current.style.opacity = '0';
        }
        onMouseLeave?.(e);
      },
      [onMouseLeave]
    );

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const glowBg = glowColor
      ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
      : 'radial-gradient(circle, rgba(127, 255, 212, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)';

    return (
      <div
        ref={setRefs}
        className={cn(
          'relative overflow-hidden rounded-2xl transition-all',
          glass !== 'none' && glass,
          lift && 'hover-lift',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        {...props}
      >
        {/* Cursor glow orb */}
        <div
          ref={glowRef}
          aria-hidden
          style={{
            position: 'absolute',
            width: glowSize,
            height: glowSize,
            background: glowBg,
            borderRadius: '50%',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 300ms ease',
            zIndex: 0,
          }}
        />
        {/* Content sits above the glow */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlowCard.displayName = 'GlowCard';

export { GlowCard };
