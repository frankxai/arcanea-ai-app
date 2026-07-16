/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

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
  const prefersReducedMotion = useReducedMotion();
  // SSR and first paint show the resting value — crawlers, reduced-motion users,
  // and slow devices must never read "0 public repos". The count-up is an
  // enhancement layered on top, not the source of truth.
  const restValue = direction === 'down' ? 0 : value;
  const motionValue = useMotionValue(restValue);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    mass: 1,
  });

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const timeout = setTimeout(() => {
      motionValue.jump(direction === 'down' ? value : 0);
      motionValue.set(direction === 'down' ? 0 : value);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, prefersReducedMotion, motionValue, value, delay, direction]);

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

  const formattedRest =
    prefix +
    restValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return (
    <span ref={ref} className={className}>
      {formattedRest}
    </span>
  );
}
