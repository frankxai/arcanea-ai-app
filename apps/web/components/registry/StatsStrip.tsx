/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';

interface StatsStripProps {
  stats: {
    total_deploys: number | null;
    total_usages: number;
    platforms_reached: number | null;
  };
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function StatsStrip({ stats }: StatsStripProps) {
  const items: Array<{ label: string; value: number | null }> = [
    { label: 'Deploys', value: stats.total_deploys },
    { label: 'Invocations', value: stats.total_usages },
    { label: 'Platforms reached', value: stats.platforms_reached },
  ];
  const visibleItems = items.filter(
    (item): item is { label: string; value: number } => item.value !== null
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap gap-x-16 gap-y-4">
            {visibleItems.map((item, i) => (
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
