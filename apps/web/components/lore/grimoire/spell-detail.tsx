/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { CaretLeft } from '@/lib/phosphor-icons';
import {
  DISCIPLINES, TIERS, ELEMENT_META, type SpellData,
} from '@/lib/magic-system';
import { ELEMENT_ICONS, DISCIPLINE_ICONS } from './spell-icons';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1 font-medium text-white">{value}</div>
    </div>
  );
}

export function SpellDetail({ spell }: { spell: SpellData }) {
  const EIcon = ELEMENT_ICONS[spell.element];
  const DIcon = DISCIPLINE_ICONS[spell.discipline];
  const tier = TIERS[spell.tier];
  const accent = spell.color ?? ELEMENT_META[spell.element].color;

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-cosmic-deep pb-24">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-cosmic-deep">
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
            <div className="absolute inset-x-0 top-0 h-64" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}33, transparent 70%)` }} />
          </div>
          <div className="relative mx-auto max-w-3xl px-6">
            <Link href={`/lore/grimoire/${spell.discipline}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
              <CaretLeft size={14} /> {DISCIPLINES[spell.discipline].name}
            </Link>
            <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: accent }}>
                <EIcon size={34} weight="duotone" color="#0a0a12" />
              </span>
              <h1 className="text-4xl font-semibold text-white">{spell.name}</h1>
              <p className="mt-2 font-mono text-lg italic text-white/70">"{spell.incantation}"</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/70">
                  <DIcon size={13} /> {DISCIPLINES[spell.discipline].name}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-white/70" style={{ color: tier.color }}>{tier.name}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">{ELEMENT_META[spell.element].name}</span>
              </div>
            </m.div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-white/80">{spell.description}</p>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-wider text-white/40">Effect</div>
            <p className="mt-1 text-white/85">{spell.effect}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Gate" value={spell.gate} />
            <Stat label="Rank" value={tier.rank} />
            <Stat label="Mana" value={spell.manaCost} />
            {spell.castTime && <Stat label="Cast time" value={spell.castTime} />}
            {spell.range && <Stat label="Range" value={spell.range} />}
            {typeof spell.cooldownRounds === 'number' && <Stat label="Cooldown" value={`${spell.cooldownRounds} rounds`} />}
          </div>

          {(spell.tags?.length || spell.counters?.length || spell.guardian) && (
            <div className="mt-6 space-y-2 text-sm text-white/60">
              {spell.guardian && <p>Witnessed by <span className="text-white/85">{spell.guardian}</span>.</p>}
              {spell.counters?.length ? (
                <p>Advantaged against {spell.counters.map((c) => DISCIPLINES[c].name).join(', ')}.</p>
              ) : null}
              {spell.tags?.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {spell.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-xs text-white/50">{t}</span>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </LazyMotion>
  );
}
