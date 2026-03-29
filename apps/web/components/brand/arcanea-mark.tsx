'use client';

/**
 * Arcanea Brand Mark — the crystalline angular "A" gate.
 *
 * Uses the actual arcanea-mark.jpg brand asset (the premium crystalline A).
 * Single source of truth for the brand icon throughout the app.
 */

import Image from 'next/image';
import markSrc from '@/assets/brand/arcanea-mark.jpg';

interface ArcaneanMarkProps {
  size?: number;
  className?: string;
  glow?: boolean;
  animate?: 'none' | 'pulse' | 'breathe';
}

export function ArcaneanMark({ size = 24, className = '', glow = false, animate = 'none' }: ArcaneanMarkProps) {
  const animClass = animate === 'pulse'
    ? 'animate-pulse'
    : animate === 'breathe'
      ? 'animate-[breathe_2s_ease-in-out_infinite]'
      : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${animClass} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {glow && (
        <div
          className="absolute inset-[-4px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,188,212,0.2) 0%, rgba(0,188,212,0.06) 50%, transparent 70%)',
            filter: 'blur(3px)',
          }}
        />
      )}
      <Image
        src={markSrc}
        alt=""
        width={size}
        height={size}
        className="relative rounded-[3px] object-cover"
        style={{ width: size, height: size }}
        priority={size >= 40}
        unoptimized={size <= 24}
      />
    </div>
  );
}

/** Small mark for inline use (message avatars, 20px) */
export function ArcaneanMarkSmall({ className = '' }: { className?: string }) {
  return <ArcaneanMark size={20} className={className} />;
}

/** Medium mark with glow (empty state, thinking, 40px) */
export function ArcaneanMarkGlow({ className = '', animate = 'none' as ArcaneanMarkProps['animate'] }) {
  return <ArcaneanMark size={40} glow animate={animate} className={className} />;
}

export default ArcaneanMark;
