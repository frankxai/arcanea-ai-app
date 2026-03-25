'use client';

import { useEffect, useState } from 'react';

/**
 * BondMeter -- Visual bond level progress bar with glow effect,
 * milestone markers, and animated fill on mount.
 */

interface BondMeterProps {
  level: number;
  maxLevel?: number;
  color: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { height: 'h-1', text: 'text-[10px]', gap: 'gap-1' },
  md: { height: 'h-1.5', text: 'text-xs', gap: 'gap-1.5' },
  lg: { height: 'h-2', text: 'text-sm', gap: 'gap-2' },
} as const;

const MILESTONES = [10, 25, 50, 75, 100];

export function BondMeter({
  level,
  maxLevel = 100,
  color,
  showLabel = false,
  size = 'md',
}: BondMeterProps) {
  const pct = Math.min(100, Math.max(0, (level / maxLevel) * 100));
  const cfg = sizeConfig[size];

  // Animate from 0 to actual width on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Determine the next unlock threshold
  const nextUnlock = MILESTONES.find((t) => t > level) ?? maxLevel;

  return (
    <div
      className={`flex flex-col ${cfg.gap} w-full`}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={maxLevel}
      aria-label={`Bond level ${level} of ${maxLevel}`}
    >
      {showLabel && (
        <div
          className={`flex items-center justify-between ${cfg.text} font-body`}
        >
          <span className="text-text-muted">
            Bond Level{' '}
            <span style={{ color }} className="font-semibold">
              {level}
            </span>
          </span>
          <span className="text-text-dim">Next unlock at {nextUnlock}</span>
        </div>
      )}

      <div
        className={`relative w-full ${cfg.height} rounded-full overflow-hidden bg-white/[0.06]`}
      >
        {/* Milestone markers */}
        {MILESTONES.map((milestone) => {
          const pos = (milestone / maxLevel) * 100;
          return (
            <div
              key={milestone}
              className="absolute top-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-white/[0.15] z-10"
              style={{ left: `${pos}%`, marginLeft: '-3px' }}
              title={`Milestone: ${milestone}`}
            />
          );
        })}

        {/* Fill bar with animated width and glow */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: mounted ? `${pct}%` : '0%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
            transition: 'width 1s cubic-bezier(0.05, 0.7, 0.1, 1)',
          }}
        />
      </div>
    </div>
  );
}
