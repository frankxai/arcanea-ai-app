'use client';

/**
 * StarRating — display or interactive 5-star widget.
 *
 * Non-interactive when `onChange` is omitted.
 * Keyboard accessible: arrow keys change preview, space/enter commits.
 */

import { useState, useCallback, KeyboardEvent } from 'react';

export interface StarRatingProps {
  value?: number;
  onChange?: (n: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  count?: number;
  className?: string;
  ariaLabel?: string;
}

const SIZE_MAP: Record<NonNullable<StarRatingProps['size']>, { star: string; text: string; gap: string }> = {
  sm: { star: 'w-4 h-4', text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 'w-5 h-5', text: 'text-sm', gap: 'gap-1' },
  lg: { star: 'w-7 h-7', text: 'text-base', gap: 'gap-1.5' },
};

const FILLED_COLOR = '#00bcd4';
const EMPTY_COLOR = 'rgba(255,255,255,0.18)';

function StarGlyph({
  fill,
  className,
}: {
  fill: 'full' | 'half' | 'empty';
  className?: string;
}) {
  const id = `star-half-${Math.random().toString(36).slice(2, 9)}`;
  const color = fill === 'empty' ? EMPTY_COLOR : FILLED_COLOR;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {fill === 'half' && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor={FILLED_COLOR} />
            <stop offset="50%" stopColor={EMPTY_COLOR} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.08 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
        fill={fill === 'half' ? `url(#${id})` : color}
        stroke={fill === 'empty' ? 'rgba(255,255,255,0.25)' : FILLED_COLOR}
        strokeWidth="0.75"
      />
    </svg>
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

          const star = (
            <StarGlyph
              fill={fill}
              className={`${sizes.star} transition-all duration-150 ${
                interactive ? 'hover:scale-110' : ''
              }`}
            />
          );

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
              className="bg-transparent border-0 p-0 m-0 focus:outline-none"
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
