'use client';

/**
 * Arcanea Brand Mark — the crystalline "A" gate.
 *
 * Used everywhere: navbar, chat avatar, thinking indicator, empty state.
 * Single source of truth for the brand icon.
 */

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      className={`${animClass} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`arcGrad-${size}`} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00bcd4" />
          <stop offset="48%" stopColor="#0d47a1" />
          <stop offset="100%" stopColor="#00897b" />
        </linearGradient>
        {glow && (
          <radialGradient id={`arcGlow-${size}`} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      {glow && <ellipse cx="20" cy="18" rx="16" ry="14" fill={`url(#arcGlow-${size})`} />}
      <path
        fillRule="evenodd"
        d="M 4 37 L 4 18 Q 4 4 20 4 Q 36 4 36 18 L 36 37 L 30 37 L 30 19 Q 30 10 20 10 Q 10 10 10 19 L 10 37 Z"
        fill={`url(#arcGrad-${size})`}
      />
      <rect x="4" y="24" width="32" height="4" rx="2" fill={`url(#arcGrad-${size})`} />
      <circle cx="20" cy="4" r="2.5" fill="#ffffff" opacity="0.75" />
    </svg>
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
