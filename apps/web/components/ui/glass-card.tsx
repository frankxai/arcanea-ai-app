'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassCard — Premium liquid-starlight card with iridescent border,
 * cosmic metal base, and mouse-reactive prismatic refraction.
 */

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number;
  glow?: 'none' | 'subtle' | 'medium' | 'strong';
}

const GLOW_SHADOW: Record<string, string> = {
  none: '',
  subtle: '0 0 40px rgba(100, 255, 218, 0.06)',
  medium: '0 0 60px rgba(100, 255, 218, 0.10)',
  strong: '0 0 80px rgba(100, 255, 218, 0.16)',
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = 0.6, glow = 'subtle', children, style, onMouseMove, onMouseLeave, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [highlight, setHighlight] = React.useState({ x: 50, y: 50, active: false });

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setHighlight({ x, y, active: true });
      onMouseMove?.(e);
    }, [onMouseMove]);

    const handleMouseLeave = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      setHighlight(prev => ({ ...prev, active: false }));
      onMouseLeave?.(e);
    }, [onMouseLeave]);

    const glowShadow = GLOW_SHADOW[glow] || '';

    return (
      <div
        ref={(node) => {
          (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn('relative rounded-2xl overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'linear-gradient(145deg, rgba(18,18,24,0.88) 0%, rgba(12,12,18,0.94) 100%)',
          backdropFilter: 'blur(48px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.9)',
          border: '1px solid rgba(100, 255, 218, 0.08)',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.05)',
            'inset 0 -1px 0 rgba(0,0,0,0.25)',
            '0 16px 48px rgba(0,0,0,0.35)',
            glowShadow,
          ].filter(Boolean).join(', '),
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {/* Prismatic refraction overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: highlight.active ? intensity : 0,
            background: `radial-gradient(600px circle at ${highlight.x}% ${highlight.y}%, rgba(100,255,218,0.06), rgba(124,77,255,0.03), transparent 60%)`,
          }}
        />
        {/* Iridescent top edge */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(100,255,218,0.15), rgba(124,77,255,0.10), transparent)',
          }}
        />
        {children}
      </div>
    );
  },
);

GlassCard.displayName = 'GlassCard';
export { GlassCard };
