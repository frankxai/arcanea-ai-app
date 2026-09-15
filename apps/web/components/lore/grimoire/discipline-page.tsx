/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { CaretLeft } from '@/lib/phosphor-icons';
import {
  DISCIPLINES, TIERS, TIER_ORDER, ELEMENT_META, getMatrix, type Discipline,
} from '@/lib/magic-system';
import { DISCIPLINE_ICONS, ELEMENT_ICONS } from './spell-icons';

export function DisciplinePage({ discipline }: { discipline: Discipline }) {
  const d = DISCIPLINES[discipline];
  const Icon = DISCIPLINE_ICONS[discipline];
  const matrix = getMatrix(discipline);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-cosmic-deep pb-24">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-cosmic-deep">
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
          </div>
          <div className="relative mx-auto max-w-4xl px-6">
            <Link href="/lore/grimoire" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
              <CaretLeft size={14} /> The Grimoire
            </Link>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: d.color }}>
                <Icon size={30} weight="duotone" color="#0a0a12" />
              </span>
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">{d.name}</h1>
                <p className="text-sm text-white/40">{d.german} · {d.school}</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{d.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6">
          {TIER_ORDER.map((t) => {
            const spells = matrix[t];
            if (!spells.length) return null;
            const tier = TIERS[t];
            return (
              <div key={t} className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: tier.color }} />
                  <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Gate {tier.gates[0]}{tier.gates[1] !== tier.gates[0] ? `–${tier.gates[1]}` : ''} · {tier.rank}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {spells.map((spell, i) => {
                    const EIcon = ELEMENT_ICONS[spell.element];
                    return (
                      <m.div key={spell.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                        <Link
                          href={`/lore/grimoire/spell/${spell.id}`}
                          className="group block rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/[0.05]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: spell.color ?? ELEMENT_META[spell.element].color, opacity: 0.9 }}>
                              <EIcon size={18} weight="duotone" color="#0a0a12" />
                            </span>
                            <div className="min-w-0">
                              <span className="block font-medium text-white">{spell.name}</span>
                              <span className="block font-mono text-xs italic text-white/50">{spell.incantation}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-white/60">{spell.effect}</p>
                          <p className="mt-2 text-xs text-white/40">{ELEMENT_META[spell.element].name} · {spell.manaCost} mana</p>
                        </Link>
                      </m.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </LazyMotion>
  );
}
