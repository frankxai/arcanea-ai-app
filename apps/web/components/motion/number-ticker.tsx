'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  /** Target number to count to */
  value: number;
  /** How long before starting (seconds) */
  delay?: number;
  /** Decimal places (0 = integer) */
  decimals?: number;
  /** Prefix like "$" or "" */
  prefix?: string;
  /** Suffix like "+", "K", "M" */
  suffix?: string;
  /** className for the span */
  className?: string;
  /** Animation duration hint — actual spring physics */
  direction?: 'up' | 'down';
}

/**
 * NumberTicker — April 2026 animated count-up.
 *
 * Uses Framer Motion's useSpring with useMotionValue for physics-based number
 * interpolation. Triggers once when entering viewport, with a configurable delay.
 * Formats with locale-aware separators (1,000 not 1000).
 *
 * Pairs with stat grids in hero sections. Replaces hardcoded numbers with
 * a whileInView triggered animation.
 */
export function NumberTicker({
  value,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  direction = 'up',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, motionValue, value, delay, direction]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix +
          latest.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix, decimals]);

  // Initial render shows 0 (or value if direction down) — spring hydrates client-side
  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
