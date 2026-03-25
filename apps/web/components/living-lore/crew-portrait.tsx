'use client';

import Image from 'next/image';
import type { CrewMember } from '@/lib/living-lore/types';
import type { CrewVisualSpec } from '@/lib/living-lore/crew-visuals';

interface CrewPortraitProps {
  member: CrewMember;
  visual: CrewVisualSpec;
  size: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imageUrl?: string;
}

const SIZE_MAP = {
  sm: { px: 48, text: 'text-lg', icon: 'text-xl' },
  md: { px: 96, text: 'text-2xl', icon: 'text-3xl' },
  lg: { px: 192, text: 'text-5xl', icon: 'text-6xl' },
  xl: { px: 320, text: 'text-7xl', icon: 'text-8xl' },
} as const;

const RADIUS_MAP = {
  sm: 'rounded-xl',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
  xl: 'rounded-3xl',
} as const;

export function CrewPortrait({
  member,
  visual,
  size,
  className = '',
  imageUrl,
}: CrewPortraitProps) {
  const { px, icon } = SIZE_MAP[size];
  const radius = RADIUS_MAP[size];

  if (imageUrl) {
    return (
      <div
        className={`relative overflow-hidden ${radius} ${className}`}
        style={{ width: px, height: px }}
      >
        <Image
          src={imageUrl}
          alt={`Portrait of ${member.name}`}
          fill
          className="object-cover"
          sizes={`${px}px`}
        />
        {/* Glow ring */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: `inset 0 0 ${px / 4}px ${visual.palette.primary}30, 0 0 ${px / 3}px ${visual.palette.primary}20`,
          }}
        />
      </div>
    );
  }

  // Placeholder gradient card
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${radius} ${className}`}
      style={{
        width: px,
        height: px,
        background: visual.placeholderGradient,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Radial glow behind avatar */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${visual.palette.primary}40 0%, transparent 70%)`,
        }}
      />

      {/* Avatar emoji */}
      <span
        className={`relative z-10 select-none drop-shadow-lg ${icon}`}
        style={{
          filter: `drop-shadow(0 0 ${px / 8}px ${visual.palette.accent}60)`,
        }}
      >
        {member.avatar}
      </span>

      {/* Border glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${radius}`}
        style={{
          boxShadow: `inset 0 0 1px 1px ${visual.palette.primary}25, 0 0 ${px / 4}px ${visual.palette.primary}15`,
        }}
      />
    </div>
  );
}
