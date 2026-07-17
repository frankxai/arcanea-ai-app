'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  PhArrowRight,
  PhMagnifyingGlass,
  PhSealCheck,
  PhSlidersHorizontal,
  PhSparkle,
} from '@/lib/phosphor-icons';
import { CODEX_ELEMENTS, type CodexElement, type CodexEntity } from '@/lib/lore/living-codex';

interface LivingCodexExplorerProps {
  entities: readonly CodexEntity[];
}

const ALL = 'All';
type ElementFilter = CodexElement | typeof ALL;

export function LivingCodexExplorer({ entities }: LivingCodexExplorerProps) {
  const [query, setQuery] = useState('');
  const [element, setElement] = useState<ElementFilter>(ALL);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entities.filter((entity) => {
      const elementMatch =
        element === ALL || entity.element === element || entity.secondaryElement === element;
      const queryMatch =
        normalizedQuery.length === 0 ||
        [entity.name, entity.form, entity.guardian, entity.gate, entity.summary]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return elementMatch && queryMatch;
    });
  }, [element, entities, query]);

  return (
    <LazyMotion features={domAnimation}>
      <section aria-labelledby="codex-entries" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="sticky top-3 z-20 mb-8 rounded-2xl border border-white/[0.06] bg-cosmic-deep/90 p-3 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-cosmic-deep/75">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex min-w-0 flex-1 items-center">
              <PhMagnifyingGlass aria-hidden className="absolute left-4 h-4 w-4 text-text-muted" />
              <span className="sr-only">Search the Living Codex</span>
              <input
                className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-11 pr-4 text-sm text-text-primary outline-none transition focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/15"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by being, guardian, gate, or form"
                type="search"
                value={query}
              />
            </label>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label="Filter by affinity">
              <PhSlidersHorizontal aria-hidden className="mx-2 h-4 w-4 shrink-0 text-text-muted" />
              {[ALL, ...CODEX_ELEMENTS].map((option) => {
                const active = element === option;
                return (
                  <button
                    aria-pressed={active}
                    className={
                      active
                        ? 'h-10 shrink-0 rounded-full border border-brand-primary/40 bg-brand-primary/15 px-4 text-xs font-medium text-text-primary'
                        : 'h-10 shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 text-xs font-medium text-text-secondary transition hover:border-white/[0.14] hover:text-text-primary'
                    }
                    key={option}
                    onClick={() => setElement(option as ElementFilter)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">
              Canon anchors
            </p>
            <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl" id="codex-entries">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'being' : 'beings'} in view
            </h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-text-muted md:block">
            Names and bonds follow locked canon. Extended profiles remain traceable design readings, not silent canon changes.
          </p>
        </div>

        {filtered.length > 0 ? (
          <m.div
            animate="show"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filtered.map((entity) => (
              <m.article
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]"
                key={entity.id}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <Link className="block" href={`/codex/${entity.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-cosmic-surface">
                    <Image
                      alt={`${entity.name}, ${entity.form}`}
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      src={entity.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-cosmic-deep/75 px-3 py-1.5 text-[11px] font-medium text-text-secondary backdrop-blur-md">
                      <PhSealCheck aria-hidden className="h-3.5 w-3.5 text-brand-primary" />
                      Locked anchor
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-text-primary">{entity.name}</h3>
                        <p className="mt-1 text-sm text-text-muted">{entity.form}</p>
                      </div>
                      <PhArrowRight aria-hidden className="mt-1 h-5 w-5 shrink-0 text-text-muted transition group-hover:translate-x-1 group-hover:text-brand-primary" />
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-text-secondary">{entity.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[entity.element, entity.secondaryElement, `${entity.gate} Gate`]
                        .filter(Boolean)
                        .map((tag) => (
                          <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] text-text-muted" key={tag}>
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              </m.article>
            ))}
          </m.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-16 text-center">
            <PhSparkle aria-hidden className="mx-auto mb-4 h-6 w-6 text-brand-primary" />
            <h3 className="font-display text-xl font-semibold text-text-primary">No matching beings</h3>
            <p className="mt-2 text-sm text-text-muted">Change the affinity or search phrase.</p>
          </div>
        )}
      </section>
    </LazyMotion>
  );
}
