'use client';

/**
 * Arcanea Mascot — The Intelligence Made Visible
 *
 * Reusable component with 8 variants, mood auto-mapping, size presets,
 * glow effects, ghost overlay mode, and speech bubbles.
 *
 * Modeled after FrankOmega.tsx — same API surface, Arcanea identity.
 */

import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ── Variant registry ────────────────────────────────────────────────────────

const VARIANTS = {
  primary:       { file: 'arcanea-primary',       label: 'Arcanea' },
  creating:      { file: 'arcanea-creating',      label: 'Arcanea Creating' },
  thinking:      { file: 'arcanea-thinking',      label: 'Arcanea Thinking' },
  'crossed-arms': { file: 'arcanea-crossed-arms', label: 'Arcanea Confident' },
  'hero-flight': { file: 'arcanea-hero-flight',   label: 'Arcanea Hero' },
  pointing:      { file: 'arcanea-pointing',      label: 'Arcanea Pointing' },
  'side-profile': { file: 'arcanea-side-profile', label: 'Arcanea Profile' },
  welcoming:     { file: 'arcanea-welcoming',     label: 'Arcanea Welcome' },
} as const;

export type MascotVariant = keyof typeof VARIANTS;
export type MascotMood = 'neutral' | 'creating' | 'thinking' | 'confident' | 'welcoming' | 'action';

const MOOD_MAP: Record<MascotMood, MascotVariant> = {
  neutral: 'primary',
  creating: 'creating',
  thinking: 'thinking',
  confident: 'crossed-arms',
  welcoming: 'welcoming',
  action: 'hero-flight',
};

// ── Size presets ────────────────────────────────────────────────────────────

const SIZE_MAP = {
  xs:    { w: 32,  h: 32,  cls: 'w-8 h-8' },
  sm:    { w: 48,  h: 48,  cls: 'w-12 h-12' },
  md:    { w: 80,  h: 80,  cls: 'w-20 h-20' },
  lg:    { w: 128, h: 128, cls: 'w-32 h-32' },
  xl:    { w: 192, h: 192, cls: 'w-48 h-48' },
  hero:  { w: 320, h: 320, cls: 'w-60 h-60 sm:w-80 sm:h-80' },
  ghost: { w: 320, h: 320, cls: 'w-56 h-56 lg:w-80 lg:h-80' },
} as const;

export type MascotSize = keyof typeof SIZE_MAP;

// ── Props ───────────────────────────────────────────────────────────────────

interface ArcaneMascotProps {
  variant?: MascotVariant;
  mood?: MascotMood;
  size?: MascotSize;
  glow?: boolean;
  ghost?: boolean;
  animate?: boolean;
  float?: boolean;
  speech?: string;
  rounded?: boolean;
  className?: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ArcaneMascot({
  variant,
  mood,
  size = 'md',
  glow = false,
  ghost = false,
  animate = true,
  float = false,
  speech,
  rounded = false,
  className = '',
}: ArcaneMascotProps) {
  const [speechVisible, setSpeechVisible] = useState(!!speech);
  const resolvedVariant = variant ?? (mood ? MOOD_MAP[mood] : 'primary');
  const { file, label } = VARIANTS[resolvedVariant];
  const { w, h, cls } = SIZE_MAP[size];

  const src = `/images/mascot/${file}.png`;

  const wrapperClasses = [
    'relative inline-block',
    cls,
    ghost ? 'opacity-[0.08] pointer-events-none select-none' : '',
    float ? 'animate-[mascot-float_3s_ease-in-out_infinite]' : '',
    className,
  ].filter(Boolean).join(' ');

  const imageClasses = [
    'object-contain',
    rounded ? 'rounded-full' : '',
    glow ? 'drop-shadow-[0_0_20px_rgba(127,255,212,0.3)]' : '',
  ].filter(Boolean).join(' ');

  const content = (
    <div className={wrapperClasses}>
      <Image
        src={src}
        alt={label}
        width={w}
        height={h}
        className={imageClasses}
        priority={size === 'hero' || size === 'ghost'}
      />

      {/* Speech bubble */}
      <AnimatePresence>
        {speech && speechVisible && (
          <m.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full max-w-[200px] rounded-xl bg-[#0e1420] border border-white/[0.08] px-3 py-2 text-xs text-white/80 shadow-lg"
          >
            {speech}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#0e1420] border-r border-b border-white/[0.08]" />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!animate) return content;

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {content}
      </m.div>
    </LazyMotion>
  );
}

// ── Convenience exports ─────────────────────────────────────────────────────

export function ArcaneMascotGhost({ className = '' }: { className?: string }) {
  return <ArcaneMascot variant="primary" size="ghost" ghost animate={false} className={className} />;
}

export function ArcaneMascotAvatar({ className = '' }: { className?: string }) {
  return <ArcaneMascot variant="primary" size="sm" rounded glow animate={false} className={className} />;
}

export function ArcaneMascotCreating({ className = '' }: { className?: string }) {
  return <ArcaneMascot variant="creating" size="hero" glow float className={className} />;
}
