'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  PhArrowUpRight,
  PhLeaf,
  PhLink,
  PhMagnifyingGlass,
  PhMapTrifold,
  PhSparkle,
} from '@/lib/phosphor-icons';
import {
  ECOLOGY_KINDS,
  ECOLOGY_GATES,
  atlasLightContract,
  atlasMediaUrl,
  isAtlasVisualReady,
  type AtlasEntryView,
  type EcologyKind,
  type EcologyGate,
} from '@/lib/ecology/schema';

import styles from './living-atlas.module.css';

type FilterValue<T extends string> = T | 'all';

interface LivingAtlasProps {
  entries: AtlasEntryView[];
}

const delayClasses = [
  styles.delayOne,
  styles.delayTwo,
  styles.delayThree,
  styles.delayFour,
];

export function LivingAtlas({ entries }: LivingAtlasProps) {
  const atlasEntries = useMemo(
    () => entries.filter(isAtlasVisualReady),
    [entries],
  );
  const availableKinds = useMemo(
    () =>
      ECOLOGY_KINDS.filter((candidate) =>
        atlasEntries.some((entry) => entry.record.kind === candidate),
      ),
    [atlasEntries],
  );
  const [query, setQuery] = useState('');
  const [gate, setGate] = useState<FilterValue<EcologyGate>>('all');
  const [kind, setKind] = useState<FilterValue<EcologyKind>>('all');
  const [selectedId, setSelectedId] = useState(
    atlasEntries.find((entry) => entry.record.slug === 'choirheart-rose')
      ?.record.id ??
      atlasEntries[0]?.record.id ??
      '',
  );
  const [traceVersion, setTraceVersion] = useState(0);

  const byId = useMemo(
    () => new Map(entries.map((entry) => [entry.record.id, entry])),
    [entries],
  );
  const hero =
    atlasEntries.find((entry) => entry.record.slug === 'choirheart-rose') ??
    atlasEntries[0];
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return atlasEntries.filter((entry) => {
      const searchable = [
        entry.record.name,
        entry.presentation.epithet,
        entry.record.origin.realmName,
        entry.record.origin.biome,
        entry.record.ecology.niche,
        atlasLightContract(entry).mechanismLabel,
      ]
        .join(' ')
        .toLocaleLowerCase();
      return (
        (!needle || searchable.includes(needle)) &&
        (gate === 'all' || entry.record.gate === gate) &&
        (kind === 'all' || entry.record.kind === kind)
      );
    });
  }, [atlasEntries, gate, kind, query]);
  const selected =
    filtered.find((entry) => entry.record.id === selectedId) ?? filtered[0];

  function resetTrace() {
    setTraceVersion(0);
  }

  function selectEntry(id: string) {
    setSelectedId(id);
    resetTrace();
  }

  const relationships =
    selected?.record.ecology.relationships.flatMap((relationship) => {
      const target = byId.get(relationship.targetId);
      return target ? [{ relationship, target }] : [];
    }) ?? [];

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)]">
      <header className="relative overflow-hidden border-b border-[var(--arc-cosmic-border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[var(--arc-brand-atlantean-teal)] opacity-[0.06] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[var(--arc-brand-arcanean-gold)] opacity-[0.025] blur-3xl"
        />
        <div className="container-page relative pb-14 pt-20 sm:pb-20 sm:pt-28 lg:max-w-[92rem] lg:pt-32">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)]">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--arc-text-muted)]">
                <span className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/[0.06] px-3 py-1.5 text-[var(--arc-brand-atlantean-teal)]">
                  Evidence-aware ecology
                </span>
                <span>Living Atlas · Wave 01</span>
              </div>
              <p className="mt-8 font-mono text-xs tracking-[0.16em] text-[var(--arc-brand-atlantean-teal)]">
                ARCANEA / COVENANT ECOLOGY
              </p>
              <h1 className="mt-4 max-w-4xl font-editorial text-5xl leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
                Nothing here glows without reason.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--arc-text-secondary)] sm:text-lg sm:leading-8">
                A field atlas of organisms that trade, warn, remember, shelter,
                and pay a measurable price for wonder.
              </p>
            </div>
            {hero && <HeroSpecimen entry={hero} entries={atlasEntries} />}
          </div>
        </div>
      </header>

      <section
        className="sticky top-[var(--nav-h)] z-30 border-b border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-void)]/95 backdrop-blur-xl"
        aria-label="Atlas filters"
      >
        <div className="container-page flex flex-col gap-3 py-4 lg:max-w-[92rem] lg:flex-row lg:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)]/40 px-4 py-3 focus-within:border-[var(--arc-brand-atlantean-teal)] focus-within:ring-2 focus-within:ring-[var(--arc-brand-atlantean-teal)]/30 lg:max-w-xl">
            <PhMagnifyingGlass
              aria-hidden
              className="h-4 w-4 shrink-0 text-[var(--arc-text-muted)]"
            />
            <span className="sr-only">Search the Living Atlas</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetTrace();
              }}
              placeholder="Search organism, biome, signal…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--arc-text-disabled)]"
            />
            <span
              aria-hidden
              className="font-mono text-xs text-[var(--arc-text-muted)]"
            >
              {filtered.length}
            </span>
          </label>
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
            <SelectFilter
              label="Gate"
              value={gate}
              options={[...ECOLOGY_GATES]}
              onChange={(value) => {
                setGate(value as FilterValue<EcologyGate>);
                resetTrace();
              }}
            />
            {availableKinds.length > 1 && (
              <SelectFilter
                label="Life"
                value={kind}
                options={availableKinds}
                onChange={(value) => {
                  setKind(value as FilterValue<EcologyKind>);
                  resetTrace();
                }}
              />
            )}
            {(query || gate !== 'all' || kind !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setGate('all');
                  setKind('all');
                  resetTrace();
                }}
                className="shrink-0 rounded-lg px-3 py-2 text-xs text-[var(--arc-text-muted)] hover:text-[var(--arc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
              >
                Clear
              </button>
            )}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            Showing {filtered.length}{' '}
            {filtered.length === 1 ? 'organism' : 'organisms'}.
            {selected ? ` ${selected.record.name} selected.` : ''}
          </p>
        </div>
      </section>

      <section
        className="container-page py-10 lg:max-w-[92rem] lg:py-16"
        aria-labelledby="garden-heading"
      >
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
              Specimen garden
            </p>
            <h2
              id="garden-heading"
              className="mt-2 font-editorial text-4xl sm:text-5xl"
            >
              Read the living system.
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-[var(--arc-text-muted)] md:block">
            Select an organism, then trace what it gives, receives, and risks.
          </p>
        </div>
        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div>
            <Catalog
              entries={filtered}
              selectedId={selected?.record.id}
              onSelect={selectEntry}
            />
          </div>
          {selected && (
            <Inspector entry={selected} className="hidden xl:block" />
          )}
        </div>
      </section>

      {selected && (
        <section
          className="border-y border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-deep)]/35"
          aria-labelledby="covenant-heading"
        >
          <div className="container-page py-14 lg:max-w-[92rem] lg:py-20">
            <div className="grid gap-9 lg:grid-cols-[22rem_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
                  Causal lens
                </p>
                <h2
                  id="covenant-heading"
                  className="mt-3 font-editorial text-4xl leading-none"
                >
                  Trace the covenant.
                </h2>
                <p className="mt-5 text-sm leading-6 text-[var(--arc-text-secondary)]">
                  The pulse is not ornament. It follows the dependency chain and
                  exposes what fails when one participant disappears.
                </p>
                <button
                  type="button"
                  onClick={() => setTraceVersion((version) => version + 1)}
                  className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-brand-atlantean-teal)]/[0.08] px-4 py-2.5 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:border-[var(--arc-brand-atlantean-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                >
                  <PhLink aria-hidden className="h-4 w-4" />
                  Trace from {selected.record.name}
                </button>
                <p className="sr-only" aria-live="polite">
                  {traceVersion > 0
                    ? relationships.length
                      ? `Covenant traced from ${selected.record.name} through ${relationships.map(({ target }) => target.record.name).join(', ')}.`
                      : `No published covenant edges from ${selected.record.name}.`
                    : ''}
                </p>
              </div>
              <div
                key={traceVersion}
                className={`${styles.pulseField} ${traceVersion > 0 ? styles.traceRun : ''} grid gap-3 sm:grid-cols-2`}
              >
                <CovenantNode entry={selected} primary />
                {relationships
                  .slice(0, 4)
                  .map(({ relationship, target }, index) => (
                    <CovenantNode
                      key={`${selected.record.id}-${target.record.id}`}
                      entry={target}
                      relation={relationship.type}
                      consequence={relationship.ifBroken}
                      className={delayClasses[index]}
                    />
                  ))}
                {!relationships.length && (
                  <div className="rounded-2xl border border-dashed border-[var(--arc-cosmic-border-bright)] p-8 text-sm text-[var(--arc-text-muted)]">
                    No published covenant edges for this record yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-14 lg:max-w-[92rem] lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Principle
            icon={PhSparkle}
            title="Signal, not decoration"
            body="Every luminous response declares a trigger, biological cost, message, and failure mode."
          />
          <Principle
            icon={PhLink}
            title="Relationship before inventory"
            body="Records become useful when their dependencies, exchanges, and collapse paths are explicit."
          />
          <Principle
            icon={PhMapTrifold}
            title="Canon with provenance"
            body="Sources, canon state, prompt language, media evidence, and human approval travel with the organism."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[var(--arc-cosmic-void)] p-4">
      <dt className="font-mono text-2xl">{value}</dt>
      <dd className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--arc-text-muted)]">
        {label}
      </dd>
    </div>
  );
}

function HeroSpecimen({
  entry,
  entries,
}: {
  entry: AtlasEntryView;
  entries: AtlasEntryView[];
}) {
  const imageUrl = atlasMediaUrl(entry);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)] shadow-[var(--arc-shadow-elevation-3)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={entry.heroMedia.alt ?? entry.record.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="object-cover"
          />
        ) : (
          <SpecimenPlaceholder entry={entry} />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-transparent to-transparent"
        />
        <div className="absolute left-4 top-4 rounded-full border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-void)]/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--arc-text-secondary)] backdrop-blur-md">
          Hero specimen · {entry.record.canon.state}
        </div>
        <p className="absolute inset-x-0 bottom-0 p-4 font-editorial text-3xl sm:p-5">
          {entry.record.name}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-px bg-[var(--arc-cosmic-border)]">
        <Stat value={entries.length} label="Records" />
        <Stat
          value={
            new Set(
              entries.map(
                (item) =>
                  item.record.origin.realmName ?? item.record.origin.worldName,
              ),
            ).size
          }
          label="Realms"
        />
        <Stat
          value={
            entries.filter(
              (item) => item.record.provenance.sourceClaims.length > 0,
            ).length
          }
          label="Source names"
        />
        <Stat
          value={entries.reduce(
            (sum, item) => sum + item.record.ecology.relationships.length,
            0,
          )}
          label="Covenants"
        />
      </dl>
    </div>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)]/40 px-3 py-2 text-xs text-[var(--arc-text-muted)] focus-within:border-[var(--arc-brand-atlantean-teal)] focus-within:ring-2 focus-within:ring-[var(--arc-brand-atlantean-teal)]/30">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-medium capitalize text-[var(--arc-text-primary)] outline-none"
      >
        <option value="all" className="bg-[var(--arc-cosmic-deep)]">
          All
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[var(--arc-cosmic-deep)]"
          >
            {option.replaceAll('-', ' ')}
          </option>
        ))}
      </select>
    </label>
  );
}

function Catalog({
  entries,
  selectedId,
  onSelect,
}: {
  entries: AtlasEntryView[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  if (!entries.length)
    return (
      <div className="rounded-2xl border border-dashed border-[var(--arc-cosmic-border-bright)] px-6 py-24 text-center text-sm text-[var(--arc-text-muted)]">
        No organisms match this lens.
      </div>
    );
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <SpecimenCard
          key={entry.record.id}
          entry={entry}
          selected={entry.record.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function SpecimenCard({
  entry,
  selected,
  onSelect,
}: {
  entry: AtlasEntryView;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const imageUrl = atlasMediaUrl(entry);
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border focus-within:border-[var(--arc-brand-atlantean-teal)] ${selected ? 'border-[var(--arc-brand-atlantean-teal)]/55 bg-[var(--arc-cosmic-surface)]' : 'border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/45 hover:border-[var(--arc-text-muted)]'}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--arc-cosmic-deep)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <SpecimenPlaceholder entry={entry} />
        )}
        <div className="absolute left-3 top-3 rounded-full border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-void)]/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[var(--arc-text-secondary)] backdrop-blur-md">
          {entry.record.canon.state}
        </div>
      </div>
      <div className="p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--arc-brand-atlantean-teal)]">
          {entry.record.gate} · {entry.record.kind}
        </p>
        <h3 className="mt-2 font-editorial text-2xl leading-none">
          {entry.record.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--arc-text-muted)]">
          {entry.presentation.epithet}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Select ${entry.record.name} for atlas details`}
        aria-pressed={selected}
        onClick={() => onSelect(entry.record.id)}
        className="absolute inset-0 z-10 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
      />
      {selected && (
        <div className="relative z-20 border-t border-[var(--arc-cosmic-border)] px-4 pb-4 pt-3 xl:hidden">
          <p className="text-xs leading-5 text-[var(--arc-text-secondary)]">
            {entry.record.covenant.gift}
          </p>
          <Link
            href={`/lore/ecology/${entry.record.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
          >
            Open field dossier{' '}
            <PhArrowUpRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </article>
  );
}

function SpecimenPlaceholder({ entry }: { entry: AtlasEntryView }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--arc-cosmic-surface),var(--arc-cosmic-deep))]">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[var(--arc-brand-atlantean-teal)]/25">
        <div className="absolute inset-4 rounded-full border border-[var(--arc-brand-atlantean-teal)]/15" />
        <PhLeaf
          aria-hidden
          className="h-9 w-9 text-[var(--arc-brand-atlantean-teal)]"
        />
        <span className="absolute -bottom-7 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--arc-text-muted)]">
          Visual in review · {entry.record.id}
        </span>
      </div>
    </div>
  );
}

function Inspector({
  entry,
  className,
}: {
  entry: AtlasEntryView;
  className?: string;
}) {
  const imageUrl = atlasMediaUrl(entry);
  const light = atlasLightContract(entry);
  return (
    <aside
      className={`${className ?? ''} top-40 overflow-hidden rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/60 xl:sticky`}
    >
      {imageUrl && (
        <div className="relative aspect-[16/10]">
          <Image
            src={imageUrl}
            alt={entry.heroMedia.alt ?? entry.record.name}
            fill
            sizes="448px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
          {entry.record.id} ·{' '}
          {entry.record.origin.realmName ?? entry.record.origin.worldName}
        </p>
        <h2 className="mt-2 font-editorial text-4xl leading-none">
          {entry.record.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--arc-text-secondary)]">
          {entry.record.ecology.niche}
        </p>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-border)] sm:grid-cols-2 xl:grid-cols-1">
          <Datum label="Gift" value={entry.record.covenant.gift} />
          <Datum label="Price" value={entry.record.covenant.cost} />
        </dl>
        <div className="mt-5 rounded-xl border border-[var(--arc-brand-arcanean-gold)]/15 bg-[var(--arc-brand-arcanean-gold)]/[0.025] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--arc-brand-arcanean-gold)]">
            Light contract · {light.mechanismLabel.replaceAll('-', ' ')}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--arc-text-secondary)]">
            {light.signal}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--arc-text-muted)]">
            Cost: {light.cost}
          </p>
        </div>
        <Link
          href={`/lore/ecology/${entry.record.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
        >
          Open field dossier <PhArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--arc-cosmic-void)]/75 p-4">
      <dt className="text-[9px] uppercase tracking-[0.16em] text-[var(--arc-text-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-xs leading-5 text-[var(--arc-text-secondary)]">
        {value}
      </dd>
    </div>
  );
}

function CovenantNode({
  entry,
  relation,
  consequence,
  primary,
  className,
}: {
  entry: AtlasEntryView;
  relation?: string;
  consequence?: string;
  primary?: boolean;
  className?: string;
}) {
  const light = atlasLightContract(entry);
  return (
    <article
      className={`${styles.node} ${className ?? ''} rounded-2xl border ${primary ? 'border-[var(--arc-brand-atlantean-teal)]/45 bg-[var(--arc-brand-atlantean-teal)]/[0.07]' : 'border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-void)]/70'} p-5`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--arc-brand-atlantean-teal)]">
        {primary ? 'Origin signal' : relation?.replace('-', ' ')}
      </p>
      <h3 className="mt-2 font-editorial text-2xl">{entry.record.name}</h3>
      {!isAtlasVisualReady(entry) && (
        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--arc-brand-arcanean-gold)]">
          Support record · visual pending
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-[var(--arc-text-muted)]">
        {consequence ?? light.signal}
      </p>
    </article>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof PhSparkle;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/45 p-6">
      <Icon
        aria-hidden
        className="h-5 w-5 text-[var(--arc-brand-atlantean-teal)]"
      />
      <h2 className="mt-5 font-editorial text-2xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--arc-text-muted)]">
        {body}
      </p>
    </article>
  );
}
