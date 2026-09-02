import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PhArrowUpRight } from '@/lib/phosphor-icons';
import {
  ECOLOGY_BY_ID,
  ECOLOGY_BY_SLUG,
  ECOLOGY_ENTRIES,
} from '@/lib/ecology/catalog';
import {
  atlasLightContract,
  atlasMediaUrl,
  atlasSourceReferences,
  isAtlasVisualReady,
} from '@/lib/ecology/schema';

interface EcologyDossierPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ECOLOGY_ENTRIES.filter(isAtlasVisualReady).map((entry) => ({
    slug: entry.record.slug,
  }));
}

export async function generateMetadata({
  params,
}: EcologyDossierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = ECOLOGY_BY_SLUG.get(slug);
  const mediaUrl = entry ? atlasMediaUrl(entry) : undefined;
  if (!entry || !isAtlasVisualReady(entry) || !mediaUrl)
    return {
      title: 'Ecology record not found',
      robots: { index: false, follow: false },
    };
  const { record } = entry;
  const title = `${record.name} · Living Atlas`;
  const description = `${record.name} is an Arcanea ${record.kind} ${record.canon.state}: ${record.ecology.niche}.`;
  return {
    title,
    description,
    alternates: { canonical: `/lore/ecology/${record.slug}` },
    robots:
      record.canon.state !== 'locked'
        ? { index: false, follow: true }
        : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: mediaUrl, alt: entry.heroMedia.alt ?? record.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mediaUrl],
    },
  };
}

export default async function EcologyDossierPage({
  params,
}: EcologyDossierPageProps) {
  const { slug } = await params;
  const entry = ECOLOGY_BY_SLUG.get(slug);
  if (!entry || !isAtlasVisualReady(entry)) notFound();
  const { record } = entry;
  const imageUrl = atlasMediaUrl(entry);
  const light = atlasLightContract(entry);
  const related = record.ecology.relationships.flatMap((relationship) => {
    const target = ECOLOGY_BY_ID.get(relationship.targetId);
    return target ? [{ relationship, target }] : [];
  });

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] px-5 pb-20 pt-16 text-[var(--arc-text-primary)] sm:px-8 sm:pt-24 lg:px-12 lg:pt-28">
      <div className="mx-auto max-w-[92rem]">
        <nav
          aria-label="Dossier navigation"
          className="mb-8 flex items-center justify-between gap-4 text-xs"
        >
          <Link
            href="/lore/ecology"
            className="text-[var(--arc-text-muted)] hover:text-[var(--arc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
          >
            ← Living Atlas
          </Link>
          <span className="rounded-full border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/[0.03] px-3 py-1.5 uppercase tracking-[0.16em] text-[var(--arc-brand-arcanean-gold)]">
            {record.canon.state} ecology
          </span>
        </nav>

        <header className="grid overflow-hidden rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/55 lg:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]">
          <div className="relative aspect-[4/3] bg-[var(--arc-cosmic-deep)] lg:aspect-auto lg:min-h-[38rem]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={entry.heroMedia.alt ?? record.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--arc-cosmic-surface),var(--arc-cosmic-deep))]">
                <div className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 px-10 py-12 text-center">
                  <p className="font-editorial text-8xl text-[var(--arc-brand-atlantean-teal)]">
                    {record.gate[0]}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--arc-text-muted)]">
                    Visual {entry.heroMedia.status}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
                {record.id} · {record.gate} ·{' '}
                {record.origin.realmName ?? record.origin.worldName}
              </p>
              <h1 className="mt-4 font-editorial text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">
                {record.name}
              </h1>
              <p className="mt-4 text-sm italic text-[var(--arc-text-muted)]">
                {entry.presentation.epithet}
              </p>
              <p className="mt-8 text-lg leading-8 text-[var(--arc-text-secondary)]">
                {record.ecology.niche}
              </p>
            </div>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-border)]">
              <DossierDatum label="Gift" value={record.covenant.gift} />
              <DossierDatum
                label="Price / constraint"
                value={record.covenant.cost}
              />
            </dl>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Morphology">
              <p>{record.taxonomy.morphology}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--arc-brand-atlantean-teal)]">
                Scale ·{' '}
                {record.taxonomy.dimensions.description ??
                  record.taxonomy.scaleClass}
              </p>
            </Panel>
            <Panel title="Energy and life cycle">
              <p>{record.energy.primarySource}</p>
              <p className="mt-3">{record.lifeCycle.growth}</p>
            </Panel>
            <Panel title="Propagation">
              <p>{record.lifeCycle.reproduction}</p>
            </Panel>
            <Panel title="Cultural practice">
              <p>{record.covenant.balance}</p>
            </Panel>
            <Panel title="Exploitation consequence">
              <p>{record.covenant.breachConsequence}</p>
            </Panel>
            <Panel title="Story pressure">
              <ul className="space-y-2">
                {record.narrative.storyUses.map((hook) => (
                  <li key={hook}>— {hook}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Source claims">
              {record.provenance.sourceClaims.length ? (
                <ul className="space-y-4">
                  {record.provenance.sourceClaims.map((item) => (
                    <li key={item.id}>
                      <p>{item.claim}</p>
                      {atlasSourceReferences(entry, item).map((reference) => (
                        <p
                          key={reference}
                          className="mt-1 break-all font-mono text-[10px] text-[var(--arc-brand-atlantean-teal)]"
                        >
                          {reference}
                        </p>
                      ))}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No organism-specific claim is source-attested; this record is
                  an original proposal.
                </p>
              )}
            </Panel>
            <Panel title="Proposal mechanics">
              <ul className="space-y-2">
                {record.provenance.proposalMechanics.map((mechanic) => (
                  <li key={mechanic.id}>— {mechanic.mechanic}</li>
                ))}
              </ul>
            </Panel>
          </div>
          <aside className="space-y-5">
            <Panel title="Light contract">
              <dl className="space-y-3">
                <InlineDatum
                  label="Mechanism"
                  value={light.mechanismLabel.replaceAll('-', ' ')}
                />
                <InlineDatum label="Trigger" value={light.trigger} />
                <InlineDatum label="Signal" value={light.signal} />
                <InlineDatum label="Cost" value={light.cost} />
                <InlineDatum label="Failure" value={light.failureMode} />
              </dl>
            </Panel>
            <Panel title="Canon boundary">
              <p>{record.canon.note}</p>
              <div className="mt-4 space-y-2">
                {record.canon.anchors.map((anchor) => (
                  <p
                    key={anchor}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--arc-brand-arcanean-gold)]"
                  >
                    {anchor}
                  </p>
                ))}
              </div>
            </Panel>
            <Panel title="Media provenance">
              <dl className="space-y-3">
                <InlineDatum label="State" value={entry.heroMedia.status} />
                <InlineDatum
                  label="Generator"
                  value={entry.heroMedia.generationModel ?? 'Not reported'}
                />
                <InlineDatum
                  label="Generated"
                  value={entry.heroMedia.generatedAt ?? 'Pending'}
                />
                <InlineDatum
                  label="Rights"
                  value={entry.heroMedia.rightsRecordId ?? 'Pending'}
                />
              </dl>
            </Panel>
          </aside>
        </section>

        <section
          className="mt-14 border-t border-[var(--arc-cosmic-border)] pt-10"
          aria-labelledby="related-heading"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
                Covenant graph
              </p>
              <h2 id="related-heading" className="mt-2 font-editorial text-4xl">
                Connected organisms
              </h2>
            </div>
            <span className="text-xs text-[var(--arc-text-muted)]">
              {related.length} direct exchanges
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(({ relationship, target }) => {
              const content = (
                <>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--arc-brand-atlantean-teal)]">
                    {relationship.type.replaceAll('-', ' ')}
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl">
                    {target.record.name}
                  </h3>
                  {!isAtlasVisualReady(target) && (
                    <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--arc-brand-arcanean-gold)]">
                      Support record · visual pending
                    </p>
                  )}
                  <p className="mt-3 text-xs leading-5 text-[var(--arc-text-muted)]">
                    {relationship.description}
                  </p>
                  {isAtlasVisualReady(target) && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--arc-text-secondary)]">
                      Open dossier{' '}
                      <PhArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </span>
                  )}
                </>
              );
              return isAtlasVisualReady(target) ? (
                <Link
                  key={target.record.id}
                  href={`/lore/ecology/${target.record.slug}`}
                  className="rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/45 p-5 hover:border-[var(--arc-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                >
                  {content}
                </Link>
              ) : (
                <article
                  key={target.record.id}
                  className="rounded-2xl border border-dashed border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/25 p-5"
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function DossierDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--arc-cosmic-void)]/80 p-4">
      <dt className="text-[9px] uppercase tracking-[0.16em] text-[var(--arc-text-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6 text-[var(--arc-text-secondary)]">
        {value}
      </dd>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)]/45 p-5 sm:p-6">
      <h2 className="text-[9px] uppercase tracking-[0.18em] text-[var(--arc-text-muted)]">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-6 text-[var(--arc-text-secondary)]">
        {children}
      </div>
    </article>
  );
}

function InlineDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--arc-cosmic-border)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[var(--arc-text-muted)]">{label}</dt>
      <dd className="max-w-[14rem] text-right text-[var(--arc-text-secondary)]">
        {value}
      </dd>
    </div>
  );
}
