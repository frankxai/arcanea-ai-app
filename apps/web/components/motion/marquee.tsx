'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Direction of scroll */
  direction?: 'left' | 'right';
  /** Animation duration in seconds (lower = faster) */
  duration?: number;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Fade edges with gradient mask */
  fade?: boolean;
  className?: string;
}

/**
 * Marquee — April 2026 infinite horizontal scroll.
 *
 * Duplicates children twice and animates via CSS transform translateX for
 * seamless loop. Uses CSS animation (not JS) for smooth 60fps at low cost.
 * Edge fade mask prevents abrupt cut-off at container boundaries.
 *
 * Use for trust-bar logos, testimonials, or ticker strips. Pair with
 * existing glass cards for premium feel.
 */
export function Marquee({
  children,
  direction = 'left',
  duration = 40,
  pauseOnHover = true,
  fade = true,
  className = '',
}: Props) {
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{
        maskImage: fade
          ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          : undefined,
        WebkitMaskImage: fade
          ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          : undefined,
      }}
    >
      <div
        className="flex shrink-0 gap-8 pr-8"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 gap-8 pr-8"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          animationPlayState: 'running',
        }}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
