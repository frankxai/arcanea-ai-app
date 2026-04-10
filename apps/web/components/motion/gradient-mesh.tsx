'use client';

import { LazyMotion, domAnimation, m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { SPRING } from '@/lib/motion';

interface Props {
  className?: string;
  colors?: string[];
  intensity?: number;
}

/**
 * Animated gradient mesh background — three radial gradients that drift slowly
 * and respond to mouse position with a subtle parallax.
 * Performant CSS-only (no WebGL). Use as fixed background layer.
 */
export function GradientMesh({
  className = '',
  colors = ['#00bcd4', '#a78bfa', '#f472b6'],
  intensity = 0.08,
}: Props) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, SPRING.slow);
  const springY = useSpring(mouseY, SPRING.slow);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const [c1, c2, c3] = colors;
  const hex = (c: string, a: number) => {
    const n = parseInt(c.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <m.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 800px 600px at ${springX.get() * 100}% ${springY.get() * 100}%, ${hex(c1, intensity)}, transparent 60%)`,
            x: useSpring(useMotionValue(0), SPRING.slow),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 900px 700px at 80% 20%, ${hex(c2, intensity * 0.7)}, transparent 55%)`,
            animation: 'mesh-drift-a 20s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 700px 600px at 20% 80%, ${hex(c3, intensity * 0.6)}, transparent 55%)`,
            animation: 'mesh-drift-b 25s ease-in-out infinite alternate',
          }}
        />
        {/* Noise texture overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <style jsx>{`
          @keyframes mesh-drift-a {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-40px, 30px); }
          }
          @keyframes mesh-drift-b {
            0% { transform: translate(0, 0); }
            100% { transform: translate(35px, -25px); }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
