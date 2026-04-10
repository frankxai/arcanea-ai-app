'use client';

import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic hover — element attracts toward cursor with spring physics.
 * Use on primary CTAs for premium feel. Strength is pixel radius (default 16).
 */
export function Magnetic({ children, className = '', strength = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.snappy);
  const springY = useSpring(y, SPRING.snappy);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ x: springX, y: springY }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
