/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { type Academy } from '@/lib/theme-utils';

export interface CosmicGradientProps {
  variant?: 'cosmic' | Academy;
  animated?: boolean;
  opacity?: number;
  className?: string;
}

const CosmicGradient = React.forwardRef<HTMLDivElement, CosmicGradientProps>(
  (
    {
      className,
      variant = 'cosmic',
      animated = true,
      opacity = 0.15,
    },
    ref
  ) => {
    const gradientVariants = {
      cosmic:
        'bg-gradient-to-br from-atlantean-teal/20 via-gold-bright/20 to-draconic-crimson/20',
      default:
        'bg-gradient-to-br from-atlantean-teal/20 via-gold-bright/20 to-draconic-crimson/20',
      atlantean:
        'bg-gradient-to-br from-atlantean-deep via-atlantean-primary to-atlantean-teal',
      draconic:
        'bg-gradient-to-br from-draconic-crimson via-draconic-gold to-draconic-sky',
      creation:
        'bg-gradient-to-br from-creation-gold via-creation-prism-blue to-creation-prism-purple',
    };

    const baseClassName = cn(
      'absolute inset-0 -z-10',
      gradientVariants[variant],
      'bg-[length:200%_200%]',
      animated && 'animate-cosmic-gradient',
      className
    );

    return (
      <div
        ref={ref}
        className={baseClassName}
        style={{
          opacity,
          ...(animated
            ? { animation: 'cosmic-gradient-drift 20s linear infinite' }
            : {}),
        }}
      />
    );
  }
);

CosmicGradient.displayName = 'CosmicGradient';

export { CosmicGradient };
