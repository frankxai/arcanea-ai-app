'use client';

import { useRef } from 'react';
import { LazyMotion, domMax, m, useScroll, useTransform } from 'framer-motion';
import { slideUp } from '@/lib/design/motion';

export function LivingLoreHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  return (
    <LazyMotion features={domMax}>
      <section
        ref={ref}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden mb-16"
      >
        {/* Ambient orbs */}
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(147,112,219,0.10)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <m.div style={{ opacity, scale, y }} className="text-center relative z-10">
          <m.h1
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-semibold text-gradient-cosmic"
          >
            The Living Lore
          </m.h1>
          <m.p
            variants={slideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="mt-4 text-lg md:text-xl text-glow-soft text-atlantean-teal-aqua"
          >
            Seven beings. Ten Gates. One journey.
          </m.p>
          <m.p
            variants={slideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-text-muted"
          >
            Follow a crew of unlikely companions as they journey through the Ten
            Gates of Arcanea. Read their story, hear their voices, and walk the
            path alongside them.
          </m.p>
        </m.div>
      </section>
    </LazyMotion>
  );
}
