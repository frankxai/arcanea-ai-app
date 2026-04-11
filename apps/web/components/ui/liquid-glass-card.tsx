'use client';

/**
 * LiquidGlassCard — higher-level composition of LiquidGlass with slot
 * components that match the shadcn/ui Card API for drop-in use.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LiquidGlass, type LiquidGlassProps } from './liquid-glass';

export const LiquidGlassCard = LiquidGlass;
export type { LiquidGlassProps as LiquidGlassCardProps };

export const LiquidGlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
));
LiquidGlassCardHeader.displayName = 'LiquidGlassCardHeader';

export const LiquidGlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display font-semibold text-lg text-white/95 tracking-wide leading-snug',
      className
    )}
    {...props}
  />
));
LiquidGlassCardTitle.displayName = 'LiquidGlassCardTitle';

export const LiquidGlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-white/50 font-sans leading-relaxed', className)}
    {...props}
  />
));
LiquidGlassCardDescription.displayName = 'LiquidGlassCardDescription';

export const LiquidGlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-6 pt-0', className)} {...props} />
));
LiquidGlassCardContent.displayName = 'LiquidGlassCardContent';

export const LiquidGlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center px-6 pb-6 pt-4 border-t border-white/[0.06] mt-auto gap-3',
      className
    )}
    {...props}
  />
));
LiquidGlassCardFooter.displayName = 'LiquidGlassCardFooter';
