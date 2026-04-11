'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Shimmer color */
  shimmerColor?: string;
  /** Shimmer duration in seconds */
  duration?: number;
  /** Disable shimmer — useful for dark buttons on light bg */
  disabled?: boolean;
}

/**
 * ShimmerButton — April 2026 premium CTA wrapper.
 *
 * Wraps any button/link with a moving shine effect that sweeps across the
 * surface on a loop. Combined with Magnetic (cursor attraction) it creates
 * a tactile, inviting CTA that feels deliberate rather than generic.
 *
 * Pattern: pseudo-element with skewed linear-gradient animated via
 * background-position. Zero JS, pure CSS — perfect 60fps.
 */
export function ShimmerButton({
  children,
  className = '',
  shimmerColor = 'rgba(255,255,255,0.4)',
  duration = 3,
  disabled = false,
}: Props) {
  if (disabled) return <>{children}</>;

  return (
    <div className={`relative inline-block overflow-hidden rounded-[inherit] ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `linear-gradient(110deg, transparent 25%, ${shimmerColor} 50%, transparent 75%)`,
          backgroundSize: '200% 100%',
          animation: `shimmer-sweep ${duration}s ease-in-out infinite`,
          mixBlendMode: 'overlay',
        }}
      />
      <style jsx>{`
        @keyframes shimmer-sweep {
          0%,
          40% {
            background-position: 200% 0;
          }
          60%,
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
