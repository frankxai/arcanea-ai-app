'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { brand } from '../tokens';

export interface SpotlightProps {
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Spotlight — cursor-following radial highlight.
 * Magic UI primitive ported 2026-04-18.
 *
 * Place inside a relative container. Respects prefers-reduced-motion (disables on request).
 */
export function Spotlight({
  color = brand.atlanteanTeal,
  size = 400,
  className,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current?.parentElement;
    if (!el) return;
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, [handleMove, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      className={['pointer-events-none absolute inset-0 transition-opacity duration-300', className || '']
        .filter(Boolean)
        .join(' ')}
      style={{
        background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}20, transparent 60%)`,
      }}
    />
  );
}
