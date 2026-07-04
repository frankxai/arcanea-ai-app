'use client';

import { brand } from '../tokens.js';

export interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  className?: string;
}

/**
 * BorderBeam — animated border highlight.
 * Magic UI primitive ported 2026-04-18.
 *
 * Required keyframes (added to arcanea-design-preset.js):
 *   border-beam: 'border-beam var(--duration, 15s) infinite linear'
 *
 * Place inside a container with `position: relative`. The beam rides the border.
 */
export function BorderBeam({
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = brand.atlanteanTeal,
  colorTo = brand.arcaneanGold,
  delay = 0,
  className,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': `${duration}s`,
          '--anchor': anchor,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={[
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam',
        'after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)]',
        'after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
