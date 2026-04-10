'use client';

import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SPRING } from '@/lib/motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * 3D tilt on hover — cursor position drives rotateX/rotateY via spring physics.
 * Subtle by default (intensity 8). Use intensity=15 for more dramatic effect.
 */
export function TiltCard({ children, className = '', intensity = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), SPRING.gentle);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), SPRING.gentle);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
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
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
