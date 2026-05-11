/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import type { RegistryAgent } from '@/lib/registry/queries';

interface AgentHeaderProps {
  agent: RegistryAgent;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const GATE_GRADIENTS: Record<string, string> = {
  Foundation: 'from-[var(--arc-wind)]/15 to-transparent',
  Flow: 'from-[var(--arc-brand-atlantean-teal)]/15 to-transparent',
  Fire: 'from-[var(--arc-fire)]/15 to-transparent',
  Heart: 'from-[var(--arc-brand-arcanean-gold)]/15 to-transparent',
  Voice: 'from-[var(--arc-brand-arcanean-gold)]/15 to-transparent',
  Sight: 'from-[var(--arc-water)]/15 to-transparent',
  Crown: 'from-[var(--arc-brand-arcanean-gold)]/15 to-transparent',
  Starweave: 'from-[var(--arc-brand-cosmic-blue)]/15 to-transparent',
  Unity: 'from-[var(--arc-brand-atlantean-teal)]/15 to-transparent',
  Source: 'from-white/15 to-transparent',
};

export function AgentHeader({ agent }: AgentHeaderProps) {
  const gate = (agent.spec?.gate as string) ?? '';
  const guardian = (agent.spec?.guardian as string) ?? '';
  const gradient = GATE_GRADIENTS[gate] ?? 'from-white/10 to-transparent';

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Ambient gradient from gate */}
        <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: PREMIUM_EASE }}
            className="max-w-3xl"
          >
            {/* Guardian + gate metadata */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
                {agent.category.replace('-', ' ')}
              </span>
              {gate && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {gate} Gate
                </span>
              )}
              {guardian && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  · {guardian}
                </span>
              )}
              {(agent.spec?.status as string) === 'experimental' && (
                <span className="inline-flex items-center rounded-full border border-[var(--arc-brand-arcanean-gold)]/30 bg-[var(--arc-brand-arcanean-gold)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--arc-brand-arcanean-gold)]">
                  Experimental
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="mb-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              {agent.name}
            </h1>

            {/* Title / role */}
            <p className="font-display text-xl text-white/60 md:text-2xl">
              {agent.title.replace(`${agent.name} — `, '')}
            </p>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
