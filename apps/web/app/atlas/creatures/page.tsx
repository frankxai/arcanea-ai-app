import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Filter,
  GitBranch,
  Image as ImageIcon,
  Network,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  CREATURE_RIGHTS_LABELS,
  getCreatureAtlasFilters,
  getCreatureAtlasStats,
  searchCreatureAtlas,
  type CreatureAtlasElement,
} from "@/lib/atlas/creatures";
import type { CreatureAtlasEntry, CreatureRightsTier } from "@arcanea/world-engine";

export const metadata: Metadata = {
  title: "Creature Atlas - Arcanea",
  description:
    "A rights-aware creature encyclopedia and prompt library for original Arcanea visual variants.",
  openGraph: {
    title: "Arcanea Creature Atlas",
    description:
      "Search fictional creature archetypes, inspect source context, and generate original Arcanea-safe prompt packs.",
  },
};

interface CreatureAtlasPageProps {
  searchParams: Promise<{
    q?: string;
    world?: string;
    element?: string;
    rights?: string;
    taxonomy?: string;
  }>;
}

const ELEMENT_STYLES: Record<
  CreatureAtlasElement,
  {
    text: string;
    border: string;
    bg: string;
    line: string;
  }
> = {
  Fire: {
    text: "text-draconic-crimson-bright",
    border: "border-draconic-crimson/30",
    bg: "from-draconic-crimson/20 via-gold-bright/10 to-cosmic-surface",
    line: "bg-draconic-crimson/60",
  },
  Water: {
    text: "text-atlantean-aqua",
    border: "border-atlantean-teal/30",
    bg: "from-atlantean-teal/20 via-atlantean-primary/10 to-cosmic-surface",
    line: "bg-atlantean-teal/70",
  },
  Earth: {
    text: "text-emerald-300",
    border: "border-emerald-300/20",
    bg: "from-emerald-300/15 via-gold-bright/10 to-cosmic-surface",
    line: "bg-emerald-300/60",
  },
  Wind: {
    text: "text-sky-200",
    border: "border-sky-200/20",
    bg: "from-sky-200/15 via-atlantean-aqua/10 to-cosmic-surface",
    line: "bg-sky-200/60",
  },
  Void: {
    text: "text-violet-300",
    border: "border-violet-300/20",
    bg: "from-violet-300/15 via-cosmic-raised to-cosmic-surface",
    line: "bg-violet-300/60",
  },
  Spirit: {
    text: "text-gold-bright",
    border: "border-gold-bright/25",
    bg: "from-gold-bright/20 via-atlantean-aqua/10 to-cosmic-surface",
    line: "bg-gold-bright/70",
  },
};

export default async function CreatureAtlasPage({ searchParams }: CreatureAtlasPageProps) {
  const params = await searchParams;
  const entries = searchCreatureAtlas({
    query: params.q,
    world: params.world,
    element: (params.element as CreatureAtlasElement | "all" | undefined) || undefined,
    rights: (params.rights as CreatureRightsTier | "all" | undefined) || undefined,
    taxonomy: params.taxonomy,
  });
  const stats = getCreatureAtlasStats();
  const filters = getCreatureAtlasFilters();
  const featured = entries[0] ?? searchCreatureAtlas({ limit: 1 })[0];

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Pill icon={<Database className="h-3.5 w-3.5" />} label={`${stats.total} seed entries`} />
              <Pill icon={<Shield className="h-3.5 w-3.5" />} label="rights-aware" />
              <Pill icon={<GitBranch className="h-3.5 w-3.5" />} label="repo canonical" />
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Creature Atlas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              Search creature archetypes, source worlds, relationships, and Arcanea-original prompt variants.
              Every entry keeps source context visible before you copy prompts, generate media, or promote a visual.
            </p>

            <form action="/atlas/creatures" className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_140px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    name="q"
                    defaultValue={params.q}
                    placeholder="Search creature, source, habitat, ability"
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 pr-3 text-sm text-white outline-none transition focus:border-atlantean-teal/50"
                  />
                </label>

                <Select name="element" defaultValue={params.element ?? "all"} label="Element">
                  <option value="all">All elements</option>
                  {filters.elements.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                </Select>

                <Select name="rights" defaultValue={params.rights ?? "all"} label="Rights">
                  <option value="all">All rights</option>
                  {filters.rights.map((rights) => (
                    <option key={rights} value={rights}>
                      {CREATURE_RIGHTS_LABELS[rights as CreatureRightsTier]}
                    </option>
                  ))}
                </Select>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-atlantean-teal px-4 text-sm font-semibold text-cosmic-void transition hover:bg-atlantean-aqua"
                >
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Filter
                </button>
              </div>
            </form>
          </div>

          {featured ? <FeaturedCreature entry={featured} /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/35">Atlas entries</p>
            <p className="mt-1 text-sm text-white/50">
              {entries.length} shown · {stats.promptReady} prompt-ready · {stats.approvedImages} approved images
            </p>
          </div>
          <Link
            href="/api/atlas/contributions"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/65 transition hover:border-atlantean-teal/30 hover:text-atlantean-aqua"
          >
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            Contribution contract
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-12 text-center">
            <p className="text-lg font-medium text-white">No creatures match.</p>
            <p className="mt-2 text-sm text-white/45">Clear the filters or search a broader archetype.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <CreatureCard key={entry.slug} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Select({
  name,
  defaultValue,
  label,
  children,
}: {
  name: string;
  defaultValue: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm text-white outline-none transition focus:border-atlantean-teal/50"
      >
        {children}
      </select>
    </label>
  );
}

function FeaturedCreature({ entry }: { entry: CreatureAtlasEntry }) {
  const style = ELEMENT_STYLES[entry.arcaneaVariant.element];

  return (
    <aside className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
      <CreatureVisualPlate entry={entry} />
      <div className="mt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill icon={<Sparkles className="h-3.5 w-3.5" />} label={entry.arcaneaVariant.element} tone={style.text} />
          <Pill icon={<ImageIcon className="h-3.5 w-3.5" />} label={entry.arcaneaVariant.generationPolicy.replaceAll("_", " ")} />
        </div>
        <h2 className="text-xl font-semibold text-white">{entry.arcaneaVariant.name}</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">{entry.arcaneaVariant.archetype}</p>
        <Link
          href={`/atlas/creatures/${entry.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-atlantean-aqua transition hover:text-white"
        >
          Open atlas entry
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

function CreatureCard({ entry }: { entry: CreatureAtlasEntry }) {
  const style = ELEMENT_STYLES[entry.arcaneaVariant.element];

  return (
    <Link
      href={`/atlas/creatures/${entry.slug}`}
      className="group flex min-h-[420px] flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-atlantean-teal/25 hover:bg-white/[0.045]"
    >
      <CreatureVisualPlate entry={entry} compact />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs ${style.border} ${style.text}`}>
          {entry.arcaneaVariant.element}
        </span>
        <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-xs text-white/45">
          {CREATURE_RIGHTS_LABELS[entry.rightsTier]}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-white group-hover:text-atlantean-aqua">
        {entry.arcaneaVariant.name}
      </h3>
      <p className="mt-1 text-sm text-white/35">Reference: {entry.name}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{entry.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.taxonomy.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-black/20 px-2 py-1 text-xs text-white/40">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5" aria-hidden="true" />
          {entry.relationships.length} links
        </span>
        <span className="inline-flex items-center gap-1.5 text-atlantean-aqua/80">
          Prompt pack
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function CreatureVisualPlate({
  entry,
  compact = false,
}: {
  entry: CreatureAtlasEntry;
  compact?: boolean;
}) {
  const style = ELEMENT_STYLES[entry.arcaneaVariant.element];
  const traits = entry.arcaneaVariant.visualDna.slice(0, compact ? 3 : 4);

  return (
    <div className={`relative overflow-hidden rounded-lg border ${style.border} bg-gradient-to-br ${style.bg} ${compact ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12),transparent_36%)]" aria-hidden="true" />
      <div className="absolute inset-x-6 top-1/2 h-px bg-white/[0.08]" aria-hidden="true" />
      <div className={`absolute left-8 top-8 h-20 w-20 rounded-full ${style.line} opacity-20 blur-2xl`} aria-hidden="true" />
      <span className="absolute left-4 top-4 rounded-full border border-white/[0.08] bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
        Schematic
      </span>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-4 flex items-end gap-2">
          <div className={`h-20 w-28 rounded-[45%] border ${style.border} bg-black/20`} aria-hidden="true" />
          <div className={`h-12 w-12 rounded-full border ${style.border} bg-black/25`} aria-hidden="true" />
          <div className={`h-16 w-1 ${style.line} opacity-50`} aria-hidden="true" />
          <div className={`h-10 w-1 ${style.line} opacity-35`} aria-hidden="true" />
        </div>
        <div className="grid gap-1">
          {traits.map((trait) => (
            <div key={trait} className="flex items-center gap-2 text-[11px] text-white/55">
              <span className={`h-px w-5 ${style.line}`} aria-hidden="true" />
              <span className="line-clamp-1">{trait}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({
  icon,
  label,
  tone = "text-white/55",
}: {
  icon: ReactNode;
  label: string;
  tone?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs ${tone}`}>
      {icon}
      {label}
    </span>
  );
}
