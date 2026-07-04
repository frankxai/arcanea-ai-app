/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  DISCIPLINES, TIERS, TIER_ORDER, ELEMENT_META, getMatrix,
  type Discipline, type SpellTier,
} from '@/lib/magic-system';
import { DISCIPLINE_ICONS, ELEMENT_ICONS } from './spell-icons';

const DISCIPLINE_ORDER: Discipline[] = ['attack', 'defense', 'summoning'];

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-cosmic-deep">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 bg-aurora opacity-30" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <m.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-4 text-sm uppercase tracking-[0.3em] text-white/50"
        >
          The Grimoire of Arcanea
        </m.p>
        <m.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl"
        >
          The Magic System
        </m.h1>
        <m.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70"
        >
          Every spell in Arcanea is classified on four axes — its <strong className="text-white/90">element</strong>,
          its <strong className="text-white/90">discipline</strong>, its <strong className="text-white/90">tier</strong>,
          and the <strong className="text-white/90">Gate</strong> a caster must have opened to wield it. Three
          disciplines, seven tiers, the Ten Gates.
        </m.p>
      </div>
    </section>
  );
}

function DisciplineCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-8 text-center text-2xl font-semibold text-white">The Three Disciplines</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {DISCIPLINE_ORDER.map((id, i) => {
          const d = DISCIPLINES[id];
          const Icon = DISCIPLINE_ICONS[id];
          return (
            <m.div
              key={id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/lore/grimoire/${id}`}
                className="group block h-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: d.color, opacity: 0.95 }}
                >
                  <Icon size={26} weight="duotone" color="#0a0a12" />
                </div>
                <h3 className="text-xl font-semibold text-white">{d.name}</h3>
                <p className="mt-1 text-sm text-white/40">{d.german} · {d.school}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{d.description}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-white/40">
                  Strong against <span className="text-white/70">{DISCIPLINES[d.counters].name}</span>
                </p>
              </Link>
            </m.div>
          );
        })}
      </div>
    </section>
  );
}

function TierScale() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-semibold text-white">The Seven Tiers</h2>
      <p className="mb-8 text-center text-sm text-white/50">Power and sanctity, gated by the Gates a caster has opened.</p>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        {TIER_ORDER.map((t: SpellTier, i) => {
          const tier = TIERS[t];
          return (
            <div
              key={t}
              className={`flex items-center gap-4 px-5 py-4 ${i % 2 ? 'bg-white/[0.02]' : 'bg-white/[0.035]'}`}
            >
              <span className="w-6 text-sm font-semibold text-white/40">{tier.order}</span>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tier.color }} />
              <span className="w-28 font-medium text-white">{tier.name}</span>
              <span className="w-28 text-sm italic text-white/40">{tier.german}</span>
              <span className="hidden w-44 text-sm text-white/60 sm:inline">
                Gate {tier.gates[0]}{tier.gates[1] !== tier.gates[0] ? `–${tier.gates[1]}` : ''} · {tier.rank}
              </span>
              <span className="flex-1 text-sm text-white/60">{tier.blurb}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Matrix() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-8 text-center text-2xl font-semibold text-white">The Discipline × Tier Matrix</h2>
      <div className="space-y-10">
        {DISCIPLINE_ORDER.map((d) => {
          const matrix = getMatrix(d);
          return (
            <div key={d}>
              <h3 className="mb-3 text-lg font-semibold text-white">{DISCIPLINES[d].name}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TIER_ORDER.map((t) =>
                  matrix[t].map((spell) => {
                    const EIcon = ELEMENT_ICONS[spell.element];
                    return (
                      <Link
                        key={spell.id}
                        href={`/lore/grimoire/spell/${spell.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-all hover:border-white/20 hover:bg-white/[0.05]"
                      >
                        <span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: spell.color ?? ELEMENT_META[spell.element].color, opacity: 0.9 }}
                        >
                          <EIcon size={18} weight="duotone" color="#0a0a12" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-white">{spell.name}</span>
                          <span className="block text-xs text-white/40">{TIERS[spell.tier].name} · {ELEMENT_META[spell.element].name}</span>
                        </span>
                      </Link>
                    );
                  }),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function GrimoirePage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-cosmic-deep pb-24">
        <Hero />
        <DisciplineCards />
        <TierScale />
        <Matrix />
      </div>
    </LazyMotion>
  );
}
