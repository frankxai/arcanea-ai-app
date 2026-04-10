'use client';

import { useEffect, useState } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion';

interface Props {
  /** CSS selector for elements that should enlarge the cursor on hover */
  hoverSelector?: string;
}

/**
 * Premium custom cursor — small white dot that follows the mouse with spring physics
 * and enlarges into a ring when hovering over interactive elements.
 * Desktop only. Falls back to native cursor on touch devices.
 */
export function CursorFollower({ hoverSelector = 'a, button, [role="button"]' }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 30, mass: 0.5 });

  useEffect(() => {
    // Only enable on devices with fine pointer (desktop)
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;
    setEnabled(true);

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function handleLeave() {
      setVisible(false);
    }

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target?.matches?.(hoverSelector) || target?.closest?.(hoverSelector)) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    }

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseover', handleOver);
    };
  }, [hoverSelector, x, y, visible]);

  if (!enabled) return null;

  return (
    <LazyMotion features={domAnimation}>
      {/* Outer ring — grows on hover */}
      <m.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-white/20 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: visible ? 1 : 0,
          borderColor: hovering ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
        }}
        transition={SPRING.snappy}
      />
      {/* Inner dot — tight follow */}
      <m.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white mix-blend-difference"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovering ? 0 : 4,
          height: hovering ? 0 : 4,
          opacity: visible && !hovering ? 1 : 0,
        }}
        transition={SPRING.bouncy}
      />
    </LazyMotion>
  );
}
