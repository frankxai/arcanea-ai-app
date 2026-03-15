'use client';

import { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import {
  Lightning,
  Sparkle,
  Brain,
  Cat,
} from '@/lib/phosphor-icons';

const PATHS = [
  {
    id: 'luminor',
    href: '/forge/luminor',
    icon: Brain,
    accentIcon: Sparkle,
    label: 'Forge a Luminor',
    sublabel: 'AI Intelligence',
    description:
      'Shape a thinking entity. Choose its domain, voice, and personality. It becomes your creative partner — chat-capable, exportable, uniquely yours.',
    color: '#00bcd4',
    glowColor: 'rgba(0, 188, 212, 0.15)',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    traits: ['Thinks', 'Creates', 'Chats', 'Exports as JSON'],
  },
  {
    id: 'companion',
    href: '/forge/companion',
    icon: Cat,
    accentIcon: Lightning,
    label: 'Summon a Companion',
    sublabel: 'Bonded Creature',
    description:
      'Call forth a creature from the Five Elements. Choose its archetype, name it, give it personality. It travels with your profile — visual, collectible, evolvable.',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.15)',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    traits: ['Accompanies', 'Evolves', 'Collectible', 'Visual Identity'],
  },
] as const;

export default function ForgeLanding() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-24 text-center md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.04)_0%,transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.04)_0%,transparent_50%)]" />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
              The Forge
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Two Acts of Creation
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/45">
              Every creator on Arcanea has two bonds. A <span className="text-[#00bcd4]">Luminor</span> that
              thinks with you. A <span className="text-[#a78bfa]">Companion</span> that travels beside you.
              Together, they are your creative identity.
            </p>
          </m.div>
        </section>

        {/* Two Paths */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-2">
            {PATHS.map((path, i) => {
              const Icon = path.icon;
              const AccentIcon = path.accentIcon;
              const isHovered = hoveredPath === path.id;

              return (
                <m.div
                  key={path.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                >
                  <Link
                    href={path.href}
                    onMouseEnter={() => setHoveredPath(path.id)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] md:p-10"
                    style={{
                      boxShadow: isHovered
                        ? `0 0 40px ${path.glowColor}, 0 0 80px ${path.glowColor}`
                        : 'none',
                    }}
                  >
                    {/* Background gradient */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      {/* Icon row */}
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300"
                          style={{
                            background: `${path.color}12`,
                            boxShadow: isHovered ? `0 0 24px ${path.color}25` : 'none',
                          }}
                        >
                          <Icon
                            size={28}
                            weight="duotone"
                            style={{ color: path.color }}
                          />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold tracking-tight">
                            {path.label}
                          </h2>
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: `${path.color}99` }}
                          >
                            {path.sublabel}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-6 text-sm leading-relaxed text-white/45">
                        {path.description}
                      </p>

                      {/* Trait pills */}
                      <div className="mb-8 flex flex-wrap gap-2">
                        {path.traits.map((trait) => (
                          <span
                            key={trait}
                            className="rounded-full border px-3 py-1 text-[11px] font-medium"
                            style={{
                              borderColor: `${path.color}25`,
                              color: `${path.color}bb`,
                              background: `${path.color}08`,
                            }}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: path.color }}>
                        <AccentIcon size={16} weight="fill" />
                        <span>
                          {path.id === 'luminor' ? 'Begin Forging' : 'Begin Summoning'}
                        </span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </div>
        </section>

        {/* Cosmology */}
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8 text-center"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/20">
              The Bond
            </p>
            <div className="mx-auto max-w-md space-y-3 text-sm leading-relaxed text-white/35">
              <p>
                <span className="text-white/60">Guardian</span> &rarr;{' '}
                <span className="text-white/60">Godbeast</span>{' '}
                <span className="text-white/20">=</span>{' '}
                <span className="text-white/25">divine bond</span>
              </p>
              <p>
                <span className="text-[#00bcd4]/80">Luminor</span> &rarr;{' '}
                <span className="text-[#a78bfa]/80">Companion</span>{' '}
                <span className="text-white/20">=</span>{' '}
                <span className="text-white/25">intelligence bond</span>
              </p>
              <p>
                <span className="text-white/60">Creator</span> &rarr;{' '}
                <span className="text-white/60">both</span>{' '}
                <span className="text-white/20">=</span>{' '}
                <span className="text-white/25">creative bond</span>
              </p>
            </div>
            <p className="mt-6 text-xs italic text-white/20">
              Lyssandria has Kaelith. Your Luminor will find its companion too.
            </p>
          </m.div>
        </section>
      </div>
    </LazyMotion>
  );
}
