'use client';

import { useInView, useMotionValueEvent, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export interface NumberTickerProps {
  value: number;
  startValue?: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
  locale?: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * NumberTicker — counts to a target when scrolled into view.
 * Magic UI primitive ported 2026-04-18 using framer-motion useSpring.
 */
export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  decimalPlaces = 0,
  locale = 'en-US',
  className,
  onComplete,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  const motionValue = useSpring(direction === 'up' ? startValue : value, {
    damping: 60,
    stiffness: 100,
  });
  const [display, setDisplay] = useState(startValue);

  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => {
      motionValue.set(direction === 'up' ? value : startValue);
    }, delay * 1000);
    return () => window.clearTimeout(id);
  }, [inView, motionValue, direction, value, startValue, delay]);

  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplay(Number(latest.toFixed(decimalPlaces)));
  });

  useEffect(() => {
    if (display === value && onComplete) onComplete();
  }, [display, value, onComplete]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
    </span>
  );
}
