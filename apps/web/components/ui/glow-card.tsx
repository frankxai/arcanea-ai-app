'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMouseStore } from '@/hooks/use-mouse-store';

/**
 * GlowCard — Mouse-tracking cursor light effect.
 *
 * A radial glow follows the cursor across the card surface,
 * illuminating the area under the mouse. Inspired by Doppler.
 */

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color — defaults to crystal (teal). */
  glowColor?: string;
  /** Glow size in px — defaults to 300. */
  glowSize?: number;
  /** Whether to apply hover-lift effect. */
  lift?: boolean;
  /** Glass tier class to apply (glass, liquid-glass, etc). Defaults to "glass". */
  glass?: 'liquid-glass' | 'glass' | 'glass-strong' | 'liquid-glass-elevated' | 'iridescent-glass' | 'none';
  /** Border glow on hover — adds a subtle gradient border. */
  borderGlow?: boolean;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, glowColor, glowSize = 300, lift = true, glass = 'glass', borderGlow = false, children, onMouseMove, onMouseLeave, style, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const glowRef = React.useRef<HTMLDivElement | null>(null);
    const globalMouse = useMouseStore();

    const positionGlow = React.useCallback(
      (clientX: number, clientY: number) => {
        if (!cardRef.current || !glowRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        glowRef.current.style.transform = `translate(${x - glowSize / 2}px, ${y - glowSize / 2}px)`;
        
        // Spotlight effect: show glow when mouse is near the card
        const padding = 150; 
        if (
          clientX >= rect.left - padding &&
          clientX <= rect.right + padding &&
          clientY >= rect.top - padding &&
          clientY <= rect.bottom + padding
        ) {
          glowRef.current.style.opacity = '1';
        } else {
          glowRef.current.style.opacity = '0';
        }
      },
      [glowSize]
    );

    // Sync with global mouse for site-wide interaction
    React.useEffect(() => {
      positionGlow(globalMouse.x, globalMouse.y);
    }, [globalMouse.x, globalMouse.y, positionGlow]);

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onMouseMove?.(e);
      },
      [onMouseMove]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
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
      : 'radial-gradient(circle, rgba(0, 188, 212, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)';

    return (
      <div
        ref={setRefs}
        className={cn(
          'relative overflow-hidden rounded-2xl transition-all duration-300',
          glass !== 'none' && glass,
          lift && 'hover-lift',
          borderGlow && 'border border-white/[0.06] hover:border-white/[0.14]',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        {...props}
      >
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
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlowCard.displayName = 'GlowCard';

export { GlowCard };
