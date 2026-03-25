'use client';

import { useScroll, useTransform, m } from 'framer-motion';

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <m.div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] origin-left bg-atlantean-teal-aqua"
      style={{
        scaleX,
        boxShadow:
          '0 0 8px rgba(127,255,212,0.4), 0 0 20px rgba(127,255,212,0.2)',
      }}
    />
  );
}
