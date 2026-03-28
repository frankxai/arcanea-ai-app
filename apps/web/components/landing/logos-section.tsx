'use client';

import { m, useInView, LazyMotion, domAnimation } from 'framer-motion';
import { useRef } from 'react';

const ECOSYSTEM_ITEMS = [
  { name: 'Next.js 16', label: 'Framework' },
  { name: 'Supabase', label: 'Database' },
  { name: 'Vercel AI SDK', label: 'Intelligence' },
  { name: 'TypeScript', label: 'Language' },
  { name: 'React 19', label: 'UI' },
  { name: '37 Packages', label: 'Ecosystem' },
  { name: 'Source Available', label: 'Developer Access' },
  { name: '10 Guardians', label: 'Archetypes' },
];

export function LogosSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <LazyMotion features={domAnimation}>
    <section ref={ref} className="py-16 border-y border-white/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm text-text-muted uppercase tracking-wider mb-10"
        >
          Built with modern intelligence infrastructure
        </m.p>

        {/* Animated ecosystem strip */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cosmic-deep to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cosmic-deep to-transparent z-10" />

          {/* Scrolling items */}
          <m.div
            className="flex gap-16 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Double for seamless loop */}
            {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, i) => (
              <m.div
                key={`${item.name}-${i}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.5 } : {}}
                transition={{ delay: 0.1 * (i % ECOSYSTEM_ITEMS.length) }}
                whileHover={{ opacity: 0.9 }}
                className="flex-shrink-0 text-center cursor-default"
              >
                <div className="text-lg font-display font-semibold text-white whitespace-nowrap">
                  {item.name}
                </div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">
                  {item.label}
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}
