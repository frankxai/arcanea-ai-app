'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import type { RegistryStats } from '@/lib/registry/queries';

interface RegistryHeroProps {
  stats: RegistryStats;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function RegistryHero({ stats }: RegistryHeroProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Ambient gradient mesh */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(800px circle at 20% 20%, rgba(0, 188, 212, 0.08), transparent 50%), radial-gradient(600px circle at 80% 60%, rgba(13, 71, 161, 0.08), transparent 50%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: PREMIUM_EASE }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60 backdrop-blur-sm"
            >
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Open Protocol · v0.2
            </m.div>

            {/* Headline */}
            <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              The Agent
              <br />
              <span className="bg-gradient-to-br from-cyan-200 via-white to-cyan-400/90 bg-clip-text text-transparent">
                Registry.
              </span>
            </h1>

            {/* Sub */}
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
              An open protocol for publishing, discovering, and deploying AI agents across platforms.
              Free to use. Free to fork. Attribution is built in.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 border-t border-white/[0.06] pt-8">
              <StatItem value={stats.total_agents} label="Published agents" delay={0.3} />
              <StatItem value={stats.total_deployments} label="Active deployments" delay={0.4} />
              <StatItem value={stats.total_platforms} label="Platforms" delay={0.5} />
              <StatItem value="MIT" label="License" delay={0.6} />
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

function StatItem({ value, label, delay }: { value: number | string; label: string; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: PREMIUM_EASE }}
    >
      <div className="font-display text-3xl font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</div>
    </m.div>
  );
}
