'use client';

import * as React from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CosmicGradient } from '@/components/ui/cosmic-gradient';
import { type Academy } from '@/lib/theme-utils';

export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  academy?: Academy;
  showGradient?: boolean;
  showGrid?: boolean;
}

// Pre-compute stable particle positions to avoid hydration mismatches from Math.random()
const PARTICLE_POSITIONS = [
  { left: '12%', top: '8%' }, { left: '45%', top: '15%' }, { left: '78%', top: '22%' },
  { left: '23%', top: '35%' }, { left: '67%', top: '42%' }, { left: '34%', top: '55%' },
  { left: '89%', top: '18%' }, { left: '56%', top: '68%' }, { left: '11%', top: '72%' },
  { left: '91%', top: '45%' }, { left: '38%', top: '82%' }, { left: '62%', top: '5%' },
  { left: '5%', top: '48%' }, { left: '73%', top: '62%' }, { left: '28%', top: '92%' },
  { left: '82%', top: '78%' }, { left: '48%', top: '38%' }, { left: '15%', top: '25%' },
  { left: '55%', top: '88%' }, { left: '95%', top: '58%' },
];

const PARTICLE_DURATIONS = [
  3.2, 4.1, 3.7, 4.5, 3.0, 4.8, 3.4, 4.3, 3.9, 4.6,
  3.1, 4.0, 3.6, 4.4, 3.3, 4.7, 3.8, 4.2, 3.5, 4.9,
];

const PARTICLE_DELAYS = [
  0.3, 1.2, 2.1, 0.8, 1.7, 2.5, 0.5, 1.9, 2.8, 0.1,
  1.4, 2.3, 0.6, 1.8, 2.7, 0.4, 1.1, 2.0, 0.9, 1.6,
];

export function MainLayout({
  children,
  className,
  academy = 'default',
  showGradient = true,
  showGrid = true,
}: MainLayoutProps) {
  const prefersReduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-cosmic-deep text-text-primary overflow-x-hidden">
        {/* Cosmic Background Effects */}
        {showGradient && (
          <CosmicGradient variant={academy} animated={!prefersReduced} opacity={0.12} />
        )}

        {/* Cosmic Grid Pattern */}
        {showGrid && (
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        )}

        {/* Animated Particles — skip entirely when reduced motion is preferred */}
        {!prefersReduced && (
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {PARTICLE_POSITIONS.map((pos, i) => (
              <m.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-gold-bright/20"
                style={pos}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: PARTICLE_DURATIONS[i],
                  repeat: Infinity,
                  delay: PARTICLE_DELAYS[i],
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <m.main
          className={cn('relative z-10', className)}
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </m.main>
      </div>
    </LazyMotion>
  );
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageContainer({
  children,
  className,
  maxWidth = 'xl',
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 py-8',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
