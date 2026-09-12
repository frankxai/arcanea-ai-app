"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PhArrowUpRight,
  PhFilm,
  PhGraphNetwork,
  PhGridFour,
  PhMagnifyingGlass,
  PhSparkle,
} from "@/lib/phosphor-icons";
import {
  GATES,
  type EntryKind,
  type GateName,
  type ReviewState,
  type VisualEncyclopediaEntry,
} from "@/lib/visual-encyclopedia/schema";

type ViewMode = "catalog" | "graph" | "cinema";
type FilterValue<T extends string> = T | "all";

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

interface CinemaChapter {
  chapter: number;
  gate: GateName;
  guardian: string;
  primaryScene: string | null;
  environments: string[];
  cast: string[];
  beats: Array<{ id: string; use: string }>;
}

interface VisualEncyclopediaProps {
  entries: VisualEncyclopediaEntry[];
  graphEdges: GraphEdge[];
  cinema: CinemaChapter[];
}

const KINDS: EntryKind[] = [
  "kinform",
  "character",
  "creature",
  "place",
  "scene",
];
const REVIEW_STATES: ReviewState[] = [
  "planned",
  "generating",
  "review",
  "approved",
  "revise",
  "rejected",
  "published",
];

export function VisualEncyclopedia({
  entries,
  graphEdges,
  cinema,
}: VisualEncyclopediaProps) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<FilterValue<EntryKind>>("all");
  const [gate, setGate] = useState<FilterValue<GateName>>("all");
  const [review, setReview] = useState<FilterValue<ReviewState>>("all");
  const [view, setView] = useState<ViewMode>("catalog");
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? "");

  const byId = useMemo(
    () => new Map(entries.map((entry) => [entry.id, entry])),
    [entries],
  );
  const selected = byId.get(selectedId) ?? entries[0];
  const relatedIds = useMemo(
    () => new Set([...(selected?.relationships ?? []), selected?.id ?? ""]),
    [selected],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      const matchesText =
        !needle ||
        [
          entry.id,
          entry.name,
          entry.role,
          entry.gift,
          entry.origin,
          ...entry.contentUses,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle);
      return (
        matchesText &&
        (kind === "all" || entry.kind === kind) &&
        (gate === "all" || entry.gate === gate) &&
        (review === "all" || entry.review.state === review)
      );
    });
  }, [entries, gate, kind, query, review]);

  const counts = useMemo(
    () => ({
      approved: entries.filter(
        (entry) =>
          entry.review.state === "approved" ||
          entry.review.state === "published",
      ).length,
      published: entries.filter((entry) => entry.media.status === "published")
        .length,
      relationships: graphEdges.length,
    }),
    [entries, graphEdges.length],
  );

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)]">
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full border border-[var(--arc-brand-atlantean-teal)]/[0.08]" />
        <div className="pointer-events-none absolute right-8 top-44 h-52 w-52 rounded-full border border-white/[0.04]" />
        <div className="relative mx-auto max-w-[92rem] px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-36">
          <div className="flex max-w-5xl flex-col gap-7">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
              <span className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/[0.06] px-3 py-1.5 text-[var(--arc-brand-atlantean-teal)]">
                Proposal encyclopedia
              </span>
              <span>
                Historical visual evidence · {entries.length} proposal records ·
                separate from the current campaign
              </span>
              <Link
                href="/constellation"
                className="rounded-full border border-white/[0.1] px-3 py-1.5 text-white/55 transition hover:border-[var(--arc-brand-atlantean-teal)]/40 hover:text-white"
              >
                Meet the Living Constellation
              </Link>
            </div>
            <div>
              <p className="mb-4 font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">
                ARCANEA / VISUAL INTELLIGENCE
              </p>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-white sm:text-7xl lg:text-8xl">
                A world you can inspect.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
                Thirty foundation masters plus one hundred new Kinforms,
                characters, creatures, places, and cinematic scenes—mapped
                through the Ten Gates as one connected visual system.
              </p>
            </div>
            <dl className="grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
              <Stat value={entries.length} label="Records" />
              <Stat value={counts.approved} label="Approved masters" />
              <Stat value={counts.published} label="Registry-published" />
              <Stat value={counts.relationships} label="Story links" />
            </dl>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-white/[0.07] bg-[var(--arc-cosmic-void)]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 py-3 focus-within:border-[var(--arc-brand-atlantean-teal)]/60 lg:max-w-xl">
              <PhMagnifyingGlass className="h-4 w-4 shrink-0 text-white/35" />
              <span className="sr-only">Search encyclopedia</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a name, role, gift, or content use…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arc-cosmic-void)]"
              />
              <span className="font-mono text-xs text-white/30">
                {filtered.length}
              </span>
            </label>
            <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
              <ViewButton
                active={view === "catalog"}
                onClick={() => setView("catalog")}
                icon={PhGridFour}
                label="Catalog"
              />
              <ViewButton
                active={view === "graph"}
                onClick={() => setView("graph")}
                icon={PhGraphNetwork}
                label="Graph"
              />
              <ViewButton
                active={view === "cinema"}
                onClick={() => setView("cinema")}
                icon={PhFilm}
                label="Cinema"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <SelectFilter
              label="Kind"
              value={kind}
              onChange={(value) => setKind(value as FilterValue<EntryKind>)}
              options={KINDS}
            />
            <SelectFilter
              label="Gate"
              value={gate}
              onChange={(value) => setGate(value as FilterValue<GateName>)}
              options={[...GATES]}
            />
            <SelectFilter
              label="Review"
              value={review}
              onChange={(value) => setReview(value as FilterValue<ReviewState>)}
              options={REVIEW_STATES}
            />
            {(query ||
              kind !== "all" ||
              gate !== "all" ||
              review !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setKind("all");
                  setGate("all");
                  setReview("all");
                }}
                className="shrink-0 rounded-lg px-3 py-2 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[92rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {view === "catalog" && (
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <CatalogGrid
              entries={filtered}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
            {selected && <Inspector entry={selected} byId={byId} />}
          </div>
        )}
        {view === "graph" && (
          <GraphView
            entries={filtered}
            selected={selected}
            relatedIds={relatedIds}
            onSelect={setSelectedId}
            graphEdges={graphEdges}
          />
        )}
        {view === "cinema" && (
          <CinemaView
            chapters={cinema}
            byId={byId}
            onSelect={(id) => {
              setSelectedId(id);
              setView("catalog");
            }}
          />
        )}
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[var(--arc-cosmic-void)]/90 p-4">
      <dt className="font-mono text-2xl text-white">{value}</dt>
      <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/35">
        {label}
      </dd>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof PhGridFour;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${active ? "bg-white/[0.09] text-white shadow-sm" : "text-white/38 hover:text-white/70"}`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
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
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-white/38">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-medium capitalize text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arc-cosmic-void)]"
      >
        <option value="all" className="bg-slate-950">
          All
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CatalogGrid({
  entries,
  selectedId,
  onSelect,
}: {
  entries: VisualEncyclopediaEntry[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  if (!entries.length)
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.12] px-6 py-24 text-center text-sm text-white/40">
        No records match this lens.
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          selected={entry.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function EntryCard({
  entry,
  selected,
  onSelect,
}: {
  entry: VisualEncyclopediaEntry;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className={`group overflow-hidden rounded-2xl border text-left transition duration-300 ${selected ? "border-[var(--arc-brand-atlantean-teal)]/55 bg-white/[0.065]" : "border-white/[0.08] bg-white/[0.028] hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/25">
        {entry.media.url ? (
          <Image
            src={entry.media.url}
            alt={entry.media.alt ?? entry.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
          />
        ) : (
          <Blueprint entry={entry} />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Pill>{entry.id}</Pill>
          <Pill>{entry.review.state}</Pill>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full border border-white/[0.12] bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55 backdrop-blur-md">
          {entry.media.status}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--arc-brand-atlantean-teal)]">
              {entry.gate} · {entry.kind}
            </p>
            <h2 className="mt-1 font-serif text-xl leading-tight text-white">
              {entry.name}
            </h2>
          </div>
          {entry.review.score && (
            <span className="font-mono text-xs text-white/40">
              {entry.review.score.total}/30
            </span>
          )}
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/43">
          {entry.role}
        </p>
      </div>
    </button>
  );
}

function Blueprint({ entry }: { entry: VisualEncyclopediaEntry }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/[0.04]">
        <span className="font-serif text-4xl text-[var(--arc-brand-atlantean-teal)]/70">
          {entry.gate.slice(0, 1)}
        </span>
        <span className="absolute -bottom-7 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
          Visual pending
        </span>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.12] bg-black/65 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/65 backdrop-blur-md">
      {children}
    </span>
  );
}

function Inspector({
  entry,
  byId,
}: {
  entry: VisualEncyclopediaEntry;
  byId: Map<string, VisualEncyclopediaEntry>;
}) {
  return (
    <aside className="top-36 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.035] xl:sticky">
      {entry.media.url && (
        <div className="relative aspect-[16/10]">
          <Image
            src={entry.media.url}
            alt={entry.media.alt ?? entry.name}
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
          {entry.id} · Batch {String(entry.batch).padStart(2, "0")}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-white">{entry.name}</h2>
        <p className="mt-2 text-sm text-white/42">{entry.origin}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Datum label="Gift" value={entry.gift} />
          <Datum label="Cost" value={entry.cost} />
        </div>
        <section className="mt-5 border-t border-white/[0.08] pt-5">
          <h3 className="text-xs uppercase tracking-[0.16em] text-white/35">
            Cinematic use
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {entry.cinemaUse}
          </p>
        </section>
        <section className="mt-5 border-t border-white/[0.08] pt-5">
          <h3 className="text-xs uppercase tracking-[0.16em] text-white/35">
            Connected records
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.relationships.map((id) => (
              <span
                key={id}
                title={byId.get(id)?.name}
                className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[10px] text-white/55"
              >
                {id}
              </span>
            ))}
          </div>
        </section>
        <section className="mt-5 rounded-xl border border-amber-200/15 bg-amber-200/[0.035] p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-100/80">
            <PhSparkle className="h-4 w-4" />
            Proposal lore
          </div>
          <p className="mt-2 text-xs leading-5 text-white/40">
            {entry.canon.note}
          </p>
        </section>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="capitalize text-white/40">
            Review: {entry.review.state}
          </span>
          <div className="flex items-center gap-4">
            <Link
              href={`/gallery/${entry.slug}`}
              className="flex items-center gap-1.5 text-white/65 hover:text-white"
            >
              Full dossier <PhArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/command/inbox"
              className="flex items-center gap-1.5 text-[var(--arc-brand-atlantean-teal)] hover:text-white"
            >
              Review desk <PhArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-white/58">{value}</p>
    </div>
  );
}

function GraphView({
  entries,
  selected,
  relatedIds,
  onSelect,
  graphEdges,
}: {
  entries: VisualEncyclopediaEntry[];
  selected?: VisualEncyclopediaEntry;
  relatedIds: Set<string>;
  onSelect: (id: string) => void;
  graphEdges: GraphEdge[];
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {GATES.map((gate) => (
          <section
            key={gate}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-white">{gate}</h2>
              <span className="font-mono text-[9px] text-white/28">
                {entries.filter((entry) => entry.gate === gate).length}
              </span>
            </div>
            <div className="space-y-1.5">
              {entries
                .filter((entry) => entry.gate === gate)
                .map((entry) => (
                  <button
                    type="button"
                    key={entry.id}
                    onClick={() => onSelect(entry.id)}
                    className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${entry.id === selected?.id ? "border-[var(--arc-brand-atlantean-teal)]/60 bg-[var(--arc-brand-atlantean-teal)]/[0.08] text-white" : relatedIds.has(entry.id) ? "border-white/[0.13] bg-white/[0.05] text-white/75" : "border-transparent text-white/38 hover:bg-white/[0.04] hover:text-white/70"}`}
                  >
                    <span className="font-mono text-[9px]">{entry.id}</span>
                    <span className="truncate text-xs">{entry.name}</span>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
      <aside className="top-36 h-fit rounded-2xl border border-white/[0.1] bg-white/[0.035] p-5 xl:sticky">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
          Relationship lens
        </p>
        <h2 className="mt-2 font-serif text-2xl text-white">
          {selected?.name ?? "Select a record"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/45">
          The graph highlights direct narrative relationships without turning
          the encyclopedia into an unreadable node cloud.
        </p>
        <div className="mt-5 space-y-2">
          {graphEdges
            .filter(
              (edge) =>
                edge.source === selected?.id || edge.target === selected?.id,
            )
            .map((edge) => {
              const peer =
                edge.source === selected?.id ? edge.target : edge.source;
              return (
                <button
                  type="button"
                  key={`${edge.source}-${edge.target}`}
                  onClick={() => onSelect(peer)}
                  className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] p-3 text-left text-xs text-white/60 hover:border-white/[0.16] hover:text-white"
                >
                  <span>{peer}</span>
                  <span className="text-white/25">{edge.relation}</span>
                </button>
              );
            })}
        </div>
      </aside>
    </div>
  );
}

function CinemaView({
  chapters,
  byId,
  onSelect,
}: {
  chapters: CinemaChapter[];
  byId: Map<string, VisualEncyclopediaEntry>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {chapters.map((chapter) => (
        <article
          key={chapter.chapter}
          className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] lg:grid-cols-[13rem_1fr]"
        >
          <header className="border-b border-white/[0.08] bg-black/20 p-5 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
              Chapter {String(chapter.chapter).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-serif text-2xl text-white">
              {chapter.gate}
            </h2>
            <p className="mt-1 text-xs text-white/35">
              Guardian {chapter.guardian}
            </p>
            <div className="mt-6 text-[10px] uppercase tracking-widest text-white/25">
              {chapter.cast.length} cast · {chapter.environments.length} places
            </div>
          </header>
          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-5">
            {chapter.beats.map((beat, index) => {
              const entry = byId.get(beat.id);
              if (!entry) return null;
              return (
                <button
                  type="button"
                  key={beat.id}
                  onClick={() => onSelect(beat.id)}
                  className="group bg-[var(--arc-cosmic-void)] p-4 text-left transition hover:bg-white/[0.035]"
                >
                  <span className="font-mono text-[9px] text-white/25">
                    {String(index + 1).padStart(2, "0")} / {beat.id}
                  </span>
                  <h3 className="mt-2 font-serif text-lg text-white/85 group-hover:text-white">
                    {entry.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/38">
                    {beat.use}
                  </p>
                </button>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
