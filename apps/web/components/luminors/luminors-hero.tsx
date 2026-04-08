'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { HERO_PHRASES } from './luminors-data';

export function AmbientOrb({
  size,
  color,
  position,
  delay = 0,
}: {
  size: number;
  color: string;
  position: string;
  delay?: number;
}) {
  return (
    <m.div
      className={`absolute rounded-full pointer-events-none ${position}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
      }}
      animate={{
        x: [0, 40, 0, -30, 0],
        y: [0, -30, 0, 25, 0],
        scale: [1, 1.15, 1, 0.9, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

export function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % HERO_PHRASES.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  const phrase = HERO_PHRASES[index];

  return (
    <span
      className="relative inline-flex flex-col sm:inline overflow-hidden"
      style={{ minHeight: '1.15em' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={index}
          className="inline-block"
          initial={{ y: 40, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={phrase.gradient}>{phrase.verb}</span>
          <span className="text-white"> {phrase.object}</span>
        </m.span>
      </AnimatePresence>
    </span>
  );
}
