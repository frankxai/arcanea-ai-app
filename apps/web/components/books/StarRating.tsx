'use client';

/**
 * StarRating — display or interactive 5-star widget built on lucide-react icons.
 *
 * Non-interactive when `onChange` is omitted.
 * Keyboard accessible: arrow keys change preview, space/enter commits,
 * number keys 1-5 set directly.
 */

import { useState, useCallback, KeyboardEvent } from 'react';
import { Star, StarHalf } from 'lucide-react';

export interface StarRatingProps {
  value?: number;
  onChange?: (n: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  count?: number;
  className?: string;
  ariaLabel?: string;
}

const SIZE_MAP: Record<NonNullable<StarRatingProps['size']>, { px: number; text: string; gap: string }> = {
  sm: { px: 16, text: 'text-xs', gap: 'gap-0.5' },
  md: { px: 20, text: 'text-sm', gap: 'gap-1' },
  lg: { px: 28, text: 'text-base', gap: 'gap-1.5' },
};

const FILLED_COLOR = '#00bcd4';
const EMPTY_COLOR = 'rgba(255,255,255,0.2)';

function StarGlyph({ fill, size }: { fill: 'full' | 'half' | 'empty'; size: number }) {
  const transition = 'transition-transform duration-150';
  if (fill === 'half') {
    // Render an empty star behind a half-filled overlay for a true "half" look.
    return (
      <span className={`relative inline-block ${transition}`} style={{ width: size, height: size }}>
        <Star
          size={size}
          fill={EMPTY_COLOR}
          stroke={EMPTY_COLOR}
          strokeWidth={1.5}
          className="absolute inset-0"
        />
        <StarHalf
          size={size}
          fill={FILLED_COLOR}
          stroke={FILLED_COLOR}
          strokeWidth={1.5}
          className="absolute inset-0"
        />
      </span>
    );
  }
  const color = fill === 'full' ? FILLED_COLOR : EMPTY_COLOR;
  return (
    <Star
      size={size}
      fill={color}
      stroke={color}
      strokeWidth={1.5}
      className={transition}
    />
  );
}

export function StarRating({
  value = 0,
  onChange,
  size = 'md',
  showLabel = false,
  count,
  className = '',
  ariaLabel,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = typeof onChange === 'function';
  const display = hover ?? value;
  const sizes = SIZE_MAP[size];

  const commit = useCallback(
    (n: number) => {
      if (!onChange) return;
      const clamped = Math.max(1, Math.min(5, Math.round(n)));
      onChange(clamped);
    },
    [onChange],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const current = Math.max(0, Math.round(value));
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      commit(Math.min(5, current + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      commit(Math.max(1, current - 1));
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      commit(current || 1);
    } else if (/^[1-5]$/.test(e.key)) {
      e.preventDefault();
      commit(parseInt(e.key, 10));
    }
  };

  const label =
    ariaLabel ??
    (interactive ? 'Rate this book from 1 to 5 stars' : `${value.toFixed(1)} out of 5 stars`);

  return (
    <div className={`inline-flex items-center ${sizes.gap} ${className}`}>
      <div
        role={interactive ? 'slider' : 'img'}
        aria-label={label}
        aria-valuemin={interactive ? 1 : undefined}
        aria-valuemax={interactive ? 5 : undefined}
        aria-valuenow={interactive ? Math.round(value) : undefined}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHover(null)}
        className={`inline-flex ${sizes.gap} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50 rounded-md ${
          interactive ? 'cursor-pointer' : ''
        }`}
      >
        {[1, 2, 3, 4, 5].map((i) => {
          let fill: 'full' | 'half' | 'empty';
          if (display >= i) fill = 'full';
          else if (display >= i - 0.5) fill = 'half';
          else fill = 'empty';

          const star = <StarGlyph fill={fill} size={sizes.px} />;

          if (!interactive) {
            return (
              <span key={i} className="inline-block">
                {star}
              </span>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => commit(i)}
              aria-label={`${i} star${i === 1 ? '' : 's'}`}
              className="bg-transparent border-0 p-0 m-0 focus:outline-none hover:scale-110 transition-transform"
            >
              {star}
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className={`ml-2 ${sizes.text} text-white/60`}>
          {value > 0 ? `${value.toFixed(1)} out of 5` : 'Unrated'}
          {typeof count === 'number' && (
            <span className="ml-1 text-white/30">
              ({count.toLocaleString()} {count === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export default StarRating;
