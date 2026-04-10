'use client';

import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import type { RegistryAgent } from '@/lib/registry/queries';

interface AgentCardProps {
  agent: RegistryAgent;
  index: number;
}

// Guardian gate → accent mapping (no fantasy game feel; subtle metadata)
const GATE_ACCENTS: Record<string, string> = {
  Foundation: 'text-emerald-300/80',
  Flow: 'text-sky-300/80',
  Fire: 'text-rose-300/80',
  Heart: 'text-pink-300/80',
  Voice: 'text-amber-300/80',
  Sight: 'text-indigo-300/80',
  Crown: 'text-yellow-300/80',
  Starweave: 'text-violet-300/80',
  Unity: 'text-cyan-300/80',
  Source: 'text-white/80',
};

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function AgentCard({ agent, index }: AgentCardProps) {
  const gate = (agent.spec?.gate as string) ?? '';
  const guardian = (agent.spec?.guardian as string) ?? '';
  const gateAccent = GATE_ACCENTS[gate] ?? 'text-white/70';

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          duration: 0.5,
          delay: Math.min(index * 0.03, 0.4),
          ease: PREMIUM_EASE,
        }}
      >
        <Link href={`/registry/${agent.id}`} className="group block">
          <m.div
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
            className="relative h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            {/* Subtle gradient accent on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 188, 212, 0.06), transparent 40%)',
              }}
            />

            <div className="relative flex h-full flex-col">
              {/* Header: Category tag + gate metadata */}
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {agent.category.replace('-', ' ')}
                </span>
                {gate && (
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${gateAccent}`}>
                    {gate}
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="mb-2 font-display text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                {agent.name}
              </h3>

              {/* Title / role */}
              <p className="mb-3 text-sm font-medium text-white/60">
                {agent.title.replace(`${agent.name} — `, '')}
              </p>

              {/* Description */}
              <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/50">
                {agent.description}
              </p>

              {/* Capabilities (first 3) */}
              <div className="mt-auto flex flex-wrap gap-1.5">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-white/40"
                  >
                    {cap}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="font-mono text-[10px] text-white/30">
                    +{agent.capabilities.length - 3}
                  </span>
                )}
              </div>

              {/* Footer: attribution + open badge */}
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">
                <span className="font-mono text-[10px] text-white/30">
                  {guardian ? `by ${guardian}` : 'Arcanea'}
                </span>
                {agent.is_open && (
                  <span className="font-mono text-[10px] text-emerald-300/70">Open · MIT</span>
                )}
              </div>
            </div>
          </m.div>
        </Link>
      </m.div>
    </LazyMotion>
  );
}
