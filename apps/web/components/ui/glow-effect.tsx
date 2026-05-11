/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import * as React from 'react';
import { m } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type Academy } from '@/lib/theme-utils';

export interface GlowEffectProps {
  variant?: Academy | 'cosmic';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const GlowEffect = React.forwardRef<HTMLDivElement, GlowEffectProps>(
  (
    {
      className,
      variant = 'cosmic',
      intensity = 'medium',
      animated = true,
      children,
      style,
      onClick,
    },
    ref
  ) => {
    const glowColors = {
      cosmic: 'rgba(255, 204, 51, 0.4)',
      default: 'rgba(255, 204, 51, 0.4)',
      atlantean: 'rgba(38, 204, 204, 0.4)',
      draconic: 'rgba(255, 198, 26, 0.4)',
      creation: 'rgba(255, 230, 128, 0.4)',
    };

    const intensityValues = {
      low: { blur: 20, spread: 0 },
      medium: { blur: 30, spread: 5 },
      high: { blur: 40, spread: 10 },
    };

    const { blur, spread } = intensityValues[intensity];
    const color = glowColors[variant];

    if (animated) {
      return (
        <m.div
          ref={ref}
          className={cn('relative', className)}
          style={style}
          onClick={onClick}
          animate={{
            boxShadow: [
              `0 0 ${blur}px ${spread}px ${color}`,
              `0 0 ${blur * 1.5}px ${spread * 1.5}px ${color}`,
              `0 0 ${blur}px ${spread}px ${color}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {children}
        </m.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        style={{
          ...style,
          boxShadow: `0 0 ${blur}px ${spread}px ${color}`,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

GlowEffect.displayName = 'GlowEffect';

export { GlowEffect };
