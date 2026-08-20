import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getVisualEncyclopediaEntries } from '@/lib/visual-encyclopedia/publication';
import { ENTRY_BY_SLUG, VISUAL_ENCYCLOPEDIA_ENTRIES } from '@/lib/visual-encyclopedia/catalog';
import type { VisualQualityScore } from '@/lib/visual-encyclopedia/schema';

interface DossierPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export function generateStaticParams() {
  return VISUAL_ENCYCLOPEDIA_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: DossierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = ENTRY_BY_SLUG.get(slug);
  if (!entry) return { title: 'Visual record not found' };

  return {
    title: `${entry.name} · Arcanea Visual Encyclopedia`,
    description: `${entry.name} is an Arcanea ${entry.kind} proposal: ${entry.role}.`,
    alternates: { canonical: `/gallery/${entry.slug}` },
    robots: entry.canon.state === 'proposal' ? { index: false, follow: true } : undefined,
  };
}

export default async function VisualDossierPage({ params }: DossierPageProps) {
  const { slug } = await params;
  const entries = await getVisualEncyclopediaEntries();
  const entry = entries.find((candidate) => candidate.slug === slug);
  if (!entry) notFound();

  const byId = new Map(entries.map((candidate) => [candidate.id, candidate]));
  const related = entry.relationships.flatMap((id) => {
    const match = byId.get(id);
    return match ? [match] : [];
  });

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] px-5 pb-20 pt-28 text-[var(--arc-text-primary)] sm:px-8 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[92rem]">
        <nav className="mb-8 flex items-center justify-between text-xs">
          <Link href="/gallery" className="text-white/45 transition hover:text-white">← Visual encyclopedia</Link>
          <span className="rounded-full border border-amber-100/15 bg-amber-100/[0.035] px-3 py-1.5 uppercase tracking-[0.16em] text-amber-100/65">{entry.canon.state} lore</span>
        </nav>

        <header className="grid overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-white/[0.028] lg:grid-cols-[minmax(0,1.25fr)_minmax(24rem,0.75fr)]">
          <div className="relative min-h-[28rem] bg-black/25 lg:min-h-[46rem]">
            {entry.media.url ? (
              <Image src={entry.media.url} alt={entry.media.alt ?? entry.name} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px]">
                <div className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/20 px-8 py-10 text-center"><p className="font-serif text-7xl text-[var(--arc-brand-atlantean-teal)]/60">{entry.gate[0]}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">Media {entry.media.status}</p></div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--arc-brand-atlantean-teal)]">{entry.id} · {entry.gate} Gate · {entry.kind}</p>
              <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-white sm:text-6xl">{entry.name}</h1>
              <p className="mt-4 text-sm text-white/38">{entry.origin}</p>
              <p className="mt-8 text-lg leading-8 text-white/65">{entry.role}</p>
            </div>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
              <DossierDatum label="Gift" value={entry.gift} />
              <DossierDatum label="Cost / constraint" value={entry.cost} />
            </dl>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Visual DNA"><p>{entry.visualDNA}</p></Panel>
            <Panel title="Camera language"><p>{entry.camera}</p></Panel>
            <Panel title="Emotional direction"><p>{entry.emotion}</p></Panel>
            <Panel title="Cinematic use"><p>{entry.cinemaUse}</p></Panel>
            <Panel title="Content system"><div className="flex flex-wrap gap-2">{entry.contentUses.map((use) => <span key={use} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-xs text-white/55">{use}</span>)}</div></Panel>
            <Panel title="Canon boundary"><p>{entry.canon.note}</p><p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-100/50">Anchor · {entry.canon.anchor}</p></Panel>
          </div>

          <aside className="space-y-5">
            <Panel title="Quality gate"><Quality score={entry.review.score} state={entry.review.state} /></Panel>
            <Panel title="Media provenance">
              <dl className="space-y-3 text-xs">
                <InlineDatum label="State" value={entry.media.status} />
                <InlineDatum label="Model" value={entry.media.generationModel ?? 'Not generated'} />
                <InlineDatum label="Date" value={entry.media.generatedAt ?? 'Pending'} />
                <InlineDatum label="Source hash" value={entry.media.sha256 ? `${entry.media.sha256.slice(0, 12)}…` : 'Pending'} />
                {entry.media.renditionSha256 ? <InlineDatum label="Rendition hash" value={`${entry.media.renditionSha256.slice(0, 12)}…`} /> : null}
                {entry.media.registryAssetId ? <InlineDatum label="Registry" value={shortId(entry.media.registryAssetId)} /> : null}
                {entry.media.renditionId ? <InlineDatum label="Rendition" value={shortId(entry.media.renditionId)} /> : null}
                {entry.media.publicationReviewId ? <InlineDatum label="Publication review" value={shortId(entry.media.publicationReviewId)} /> : null}
                {entry.media.rightsRecordId ? <InlineDatum label="Rights record" value={shortId(entry.media.rightsRecordId)} /> : null}
                {entry.media.publishedAt ? <InlineDatum label="Published" value={entry.media.publishedAt} /> : null}
              </dl>
            </Panel>
          </aside>
        </section>

        <section className="mt-12 border-t border-white/[0.08] pt-9">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">Story graph</p><h2 className="mt-2 font-serif text-3xl text-white">Connected records</h2></div><span className="text-xs text-white/30">{related.length} direct links</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.id} href={`/gallery/${item.slug}`} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.04]"><p className="font-mono text-[9px] uppercase tracking-widest text-[var(--arc-brand-atlantean-teal)]">{item.id} · {item.kind}</p><h3 className="mt-2 font-serif text-xl text-white">{item.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-white/38">{item.role}</p></Link>)}</div>
        </section>
      </div>
    </main>
  );
}

function DossierDatum({ label, value }: { label: string; value: string }) {
  return <div className="bg-[var(--arc-cosmic-void)]/90 p-4"><dt className="text-[10px] uppercase tracking-[0.16em] text-white/28">{label}</dt><dd className="mt-2 text-sm leading-6 text-white/62">{value}</dd></div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"><h2 className="text-[10px] uppercase tracking-[0.18em] text-white/30">{title}</h2><div className="mt-4 text-sm leading-6 text-white/58">{children}</div></article>;
}

function InlineDatum({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><dt className="text-white/30">{label}</dt><dd className="max-w-[12rem] text-right text-white/58">{value}</dd></div>;
}

function shortId(value: string) {
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function Quality({ score, state }: { score: VisualQualityScore | null; state: string }) {
  if (!score) return <p className="capitalize text-white/42">{state}; numeric score not backfilled.</p>;
  const axes: Array<[string, number]> = [['Craft', score.craft], ['Composition', score.composition], ['Originality', score.originality], ['Canon', score.canonAlignment], ['Emotion', score.emotionalForce], ['Access', score.accessibility]];
  return <div><div className="mb-4 flex items-end justify-between"><span className="font-mono text-3xl text-white">{score.total}<span className="text-sm text-white/25">/30</span></span><span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] uppercase tracking-widest text-white/45">{score.verdict}</span></div><div className="space-y-2.5">{axes.map(([label, value]) => <div key={label} className="grid grid-cols-[5rem_1fr_1rem] items-center gap-2 text-[10px]"><span className="text-white/32">{label}</span><span className="h-1 overflow-hidden rounded-full bg-white/[0.06]"><span className="block h-full bg-[var(--arc-brand-atlantean-teal)]" style={{ width: `${value * 20}%` }} /></span><span className="font-mono text-white/35">{value}</span></div>)}</div></div>;
}
