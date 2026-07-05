import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  GitBranch,
  Image as ImageIcon,
  Network,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  CREATURE_ATLAS_ENTRIES,
  CREATURE_RIGHTS_LABELS,
  getCreatureBySlug,
  type CreatureAtlasElement,
} from "@/lib/atlas/creatures";
import { PromptActions } from "./prompt-actions";
import type { CreatureAtlasEntry } from "@arcanea/world-engine";

interface CreatureDetailPageProps {
  params: Promise<{ slug: string }>;
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

export function generateStaticParams() {
  return CREATURE_ATLAS_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: CreatureDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCreatureBySlug(slug);

  if (!entry) {
    return { title: "Creature not found - Arcanea", robots: { index: false } };
  }

  return {
    title: `${entry.arcaneaVariant.name} - Creature Atlas`,
    description: entry.shortDescription,
    openGraph: {
      title: `${entry.arcaneaVariant.name} - Arcanea Creature Atlas`,
      description: entry.shortDescription,
      type: "article",
    },
    alternates: { canonical: `/atlas/creatures/${entry.slug}` },
  };
}

export default async function CreatureDetailPage({ params }: CreatureDetailPageProps) {
  const { slug } = await params;
  const entry = getCreatureBySlug(slug);

  if (!entry) notFound();

  const related = entry.relationships
    .map((relationship) => ({
      relationship,
      target: getCreatureBySlug(relationship.targetSlug),
    }))
    .filter((item) => Boolean(item.target));

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/atlas/creatures"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-atlantean-aqua"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Creature Atlas
          </Link>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Pill icon={<Shield className="h-3.5 w-3.5" />} label={CREATURE_RIGHTS_LABELS[entry.rightsTier]} />
                <Pill icon={<Sparkles className="h-3.5 w-3.5" />} label={entry.arcaneaVariant.element} />
                <Pill icon={<GitBranch className="h-3.5 w-3.5" />} label={entry.status} />
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {entry.arcaneaVariant.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/60">
                {entry.arcaneaVariant.archetype}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Reference" value={entry.name} />
                <Metric label="Source world" value={entry.source.sourceWorld} />
                <Metric label="Media" value={`${entry.media.length} prompt record`} />
              </div>
            </div>

            <CreatureVisualPlate entry={entry} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Panel title="Reference Layer" icon={<BookOpen className="h-4 w-4" />}>
            <p className="text-sm leading-7 text-white/60">{entry.shortDescription}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FactList title="Habitats" values={entry.habitats} />
              <FactList title="Abilities" values={entry.abilities} />
            </div>
          </Panel>

          <Panel title="Arcanea Variant" icon={<Sparkles className="h-4 w-4" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <FactList title="Visual DNA" values={entry.arcaneaVariant.visualDna} />
              <FactList title="Behavior" values={entry.arcaneaVariant.behavior} />
            </div>
            <div className="mt-5 rounded-lg border border-white/[0.06] bg-black/20 p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-white/35">Canon boundary</p>
              <p className="mt-2 text-sm leading-6 text-white/60">{entry.arcaneaVariant.canonBoundary}</p>
            </div>
          </Panel>

          <Panel title="Prompt Pack" icon={<ImageIcon className="h-4 w-4" />}>
            <div className="mb-4 flex flex-wrap gap-2">
              {entry.promptPack?.suggestedModels.map((model) => (
                <span key={model} className="rounded-full border border-white/[0.06] px-2.5 py-1 text-xs text-white/45">
                  {model}
                </span>
              ))}
            </div>
            <PromptBlock label="Prompt" value={entry.promptPack?.prompt ?? ""} />
            <PromptBlock label="Negative prompt" value={entry.promptPack?.negativePrompt ?? ""} />
            <PromptActions
              slug={entry.slug}
              prompt={entry.promptPack?.prompt ?? ""}
              negativePrompt={entry.promptPack?.negativePrompt ?? ""}
              rightsTier={entry.rightsTier}
              generationPolicy={entry.arcaneaVariant.generationPolicy}
            />
            <span className="mt-3 inline-flex items-center rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-white/45">
              Image policy: {entry.arcaneaVariant.generationPolicy.replaceAll("_", " ")}
            </span>
          </Panel>
        </div>

        <aside className="min-w-0 space-y-6">
          <Panel title="World Graph" icon={<Network className="h-4 w-4" />}>
            {related.length === 0 ? (
              <p className="text-sm text-white/45">No linked entries yet.</p>
            ) : (
              <div className="space-y-3">
                {related.map(({ relationship, target }) => {
                  if (!target) return null;
                  return (
                    <Link
                      key={relationship.targetSlug}
                      href={`/atlas/creatures/${target.slug}`}
                      className="block rounded-lg border border-white/[0.06] bg-black/20 p-3 transition hover:border-atlantean-teal/25"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white/85">{target.arcaneaVariant.name}</p>
                        <ArrowRight className="h-4 w-4 text-white/30" aria-hidden="true" />
                      </div>
                      <p className="mt-1 text-xs text-white/35">{relationship.type.replaceAll("_", " ")}</p>
                      <p className="mt-2 text-xs leading-5 text-white/50">{relationship.label}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Provenance" icon={<Shield className="h-4 w-4" />}>
            <dl className="space-y-3 text-sm">
              <ProvenanceItem label="Rights tier" value={CREATURE_RIGHTS_LABELS[entry.rightsTier]} />
              <ProvenanceItem label="Reference mode" value={entry.source.referenceMode.replaceAll("_", " ")} />
              <ProvenanceItem label="Source work" value={entry.source.sourceWork} />
              {entry.source.franchiseOwner ? (
                <ProvenanceItem label="Rights owner" value={entry.source.franchiseOwner} />
              ) : null}
              <ProvenanceItem label="Steward" value={entry.steward} />
              <ProvenanceItem label="Updated" value={entry.updatedAt} />
            </dl>
          </Panel>

          <Panel title="Citations" icon={<BookOpen className="h-4 w-4" />}>
            <div className="space-y-3">
              {entry.citations.map((citation) => (
                <div key={citation.label} className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                  <p className="text-sm font-medium text-white/75">{citation.label}</p>
                  {citation.note ? <p className="mt-1 text-xs leading-5 text-white/45">{citation.note}</p> : null}
                  {citation.url ? (
                    <Link href={citation.url} className="mt-2 inline-flex items-center gap-1.5 text-xs text-atlantean-aqua">
                      Source
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </section>
    </main>
  );
}

function CreatureVisualPlate({ entry }: { entry: CreatureAtlasEntry }) {
  const style = ELEMENT_STYLES[entry.arcaneaVariant.element];

  return (
    <div className={`relative overflow-hidden rounded-xl border ${style.border} bg-gradient-to-br ${style.bg} p-5`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12),transparent_36%)]" aria-hidden="true" />
      <span className="absolute left-5 top-5 rounded-full border border-white/[0.08] bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
        Provenance schematic
      </span>
      <div className="relative aspect-[5/4]">
        <div className={`absolute left-4 top-4 h-28 w-28 rounded-full ${style.line} opacity-20 blur-2xl`} aria-hidden="true" />
        <div className="absolute bottom-16 left-4 flex items-end gap-3">
          <div className={`h-28 w-40 rounded-[45%] border ${style.border} bg-black/20`} aria-hidden="true" />
          <div className={`h-16 w-16 rounded-full border ${style.border} bg-black/25`} aria-hidden="true" />
          <div className={`h-24 w-1 ${style.line} opacity-50`} aria-hidden="true" />
          <div className={`h-14 w-1 ${style.line} opacity-35`} aria-hidden="true" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <p className="font-mono text-xs uppercase tracking-widest text-white/35">Prompt visual DNA</p>
          <div className="mt-3 grid gap-2">
            {entry.arcaneaVariant.visualDna.map((trait) => (
              <div key={trait} className="flex items-center gap-2 text-sm text-white/60">
                <span className={`h-px w-8 ${style.line}`} aria-hidden="true" />
                <span>{trait}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function FactList({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/35">{title}</p>
      <ul className="mt-3 space-y-2">
        {values.map((value) => (
          <li key={value} className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-sm text-white/60">
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PromptBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-white/35">{label}</p>
      <pre className="max-h-64 w-full max-w-full overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.06] bg-black/30 p-4 text-xs leading-6 text-white/65">
        <code className="break-words">{value}</code>
      </pre>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-white/35">{label}</p>
      <p className="mt-2 text-sm font-medium text-white/80">{value}</p>
    </div>
  );
}

function ProvenanceItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-widest text-white/35">{label}</dt>
      <dd className="mt-1 text-white/65">{value}</dd>
    </div>
  );
}

function Pill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-white/55">
      {icon}
      {label}
    </span>
  );
}
