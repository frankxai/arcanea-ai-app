/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
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
const formatValue = (value: number, decimals: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

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
  const [mounted, setMounted] = useState(false);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    mass: 1,
  });

  // Only start the count-up animation after client mount, so SSR/no-JS
  // output always shows the final value (good for SEO and a11y).
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Reset to the animated starting point once we're client-side.
    motionValue.set(direction === 'down' ? value : 0);
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [mounted, isInView, motionValue, value, delay, direction]);

  useEffect(() => {
    if (!mounted) return;
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + formatValue(latest, decimals) + suffix;
      }
    });
    return unsubscribe;
  }, [mounted, spring, prefix, suffix, decimals]);

  // SSR / initial render shows the final target value — animation only
  // kicks in client-side after mount, so no-JS and crawlers see real numbers.
  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue(value, decimals)}
      {suffix}
    </span>
  );
}
