'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';

interface StatsStripProps {
  stats: {
    total_deploys: number;
    total_usages: number;
    platforms_reached: number;
  };
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function StatsStrip({ stats }: StatsStripProps) {
  const items = [
    { label: 'Deploys', value: stats.total_deploys },
    { label: 'Invocations', value: stats.total_usages },
    { label: 'Platforms reached', value: stats.platforms_reached },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap gap-x-16 gap-y-4">
            {items.map((item, i) => (
              <m.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: PREMIUM_EASE }}
              >
                <div className="font-display text-2xl font-semibold tabular-nums text-white">
                  {item.value.toLocaleString()}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {item.label}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
