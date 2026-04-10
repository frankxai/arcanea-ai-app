'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import type { RegistryAgent } from '@/lib/registry/queries';

interface AgentHeaderProps {
  agent: RegistryAgent;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const GATE_GRADIENTS: Record<string, string> = {
  Foundation: 'from-emerald-500/15 to-transparent',
  Flow: 'from-sky-500/15 to-transparent',
  Fire: 'from-rose-500/15 to-transparent',
  Heart: 'from-pink-500/15 to-transparent',
  Voice: 'from-amber-500/15 to-transparent',
  Sight: 'from-indigo-500/15 to-transparent',
  Crown: 'from-yellow-500/15 to-transparent',
  Starweave: 'from-violet-500/15 to-transparent',
  Unity: 'from-cyan-500/15 to-transparent',
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
                <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
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
