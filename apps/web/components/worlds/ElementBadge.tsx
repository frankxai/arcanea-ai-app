'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ElementName =
  | 'Fire'
  | 'Water'
  | 'Earth'
  | 'Wind'
  | 'Void'
  | 'Spirit'
  | string;

interface ElementConfig {
  bg: string;
  border: string;
  text: string;
  glow: string;
  dot: string;
  symbol: string;
}

const ELEMENT_CONFIG: Record<string, ElementConfig> = {
  Fire: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.25)]',
    dot: 'bg-red-500',
    symbol: '🔥',
  },
  Water: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.25)]',
    dot: 'bg-blue-500',
    symbol: '💧',
  },
  Earth: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-[0_0_8px_rgba(34,197,94,0.25)]',
    dot: 'bg-green-500',
    symbol: '◈',
  },
  Wind: {
    bg: 'bg-slate-200/10',
    border: 'border-slate-200/30',
    text: 'text-slate-300',
    glow: 'shadow-[0_0_8px_rgba(226,232,240,0.15)]',
    dot: 'bg-slate-200',
    symbol: '◎',
  },
  Void: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    glow: 'shadow-[0_0_8px_rgba(139,92,246,0.25)]',
    dot: 'bg-violet-500',
    symbol: '◉',
  },
  Spirit: {
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_8px_rgba(251,191,36,0.25)]',
    dot: 'bg-amber-400',
    symbol: '✦',
  },
};

const FALLBACK_CONFIG: ElementConfig = {
  bg: 'bg-white/5',
  border: 'border-white/10',
  text: 'text-white/60',
  glow: '',
  dot: 'bg-white/40',
  symbol: '◇',
};

export interface ElementBadgeProps {
  element: ElementName;
  size?: 'sm' | 'md' | 'lg';
  showSymbol?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-5 px-2 text-xs gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
  lg: 'h-7 px-3 text-sm gap-2',
};

const DOT_SIZES = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export function ElementBadge({
  element,
  size = 'md',
  showSymbol = false,
  className,
}: ElementBadgeProps) {
  const normalized = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  const config = ELEMENT_CONFIG[normalized] ?? FALLBACK_CONFIG;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-sans font-medium border',
        'backdrop-blur-sm transition-all duration-150',
        config.bg,
        config.border,
        config.text,
        config.glow,
        SIZE_CLASSES[size],
        className
      )}
    >
      {showSymbol ? (
        <span className="text-xs leading-none">{config.symbol}</span>
      ) : (
        <span
          className={cn('rounded-full flex-shrink-0', DOT_SIZES[size], config.dot)}
          aria-hidden="true"
        />
      )}
      {element}
    </span>
  );
}

/**
 * Get the raw glow color string for an element — used for dynamic border/shadow styling.
 */
export function getElementGlowColor(element: string): string {
  const map: Record<string, string> = {
    Fire: 'rgba(239,68,68,0.5)',
    Water: 'rgba(59,130,246,0.5)',
    Earth: 'rgba(34,197,94,0.5)',
    Wind: 'rgba(226,232,240,0.3)',
    Void: 'rgba(139,92,246,0.5)',
    Spirit: 'rgba(251,191,36,0.5)',
  };
  const normalized = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  return map[normalized] ?? 'rgba(127,255,212,0.3)';
}

/**
 * Get the border color class for an element — used for card borders.
 */
export function getElementBorderClass(element: string): string {
  const map: Record<string, string> = {
    Fire: 'border-red-500/40',
    Water: 'border-blue-500/40',
    Earth: 'border-green-500/40',
    Wind: 'border-slate-300/30',
    Void: 'border-violet-500/40',
    Spirit: 'border-amber-400/40',
  };
  const normalized = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  return map[normalized] ?? 'border-[#7fffd4]/30';
}
