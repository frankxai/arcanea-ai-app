import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CODEX_ENTITIES, getCodexEntity } from '@/lib/lore/living-codex';
import { PhArrowLeft, PhArrowRight, PhSealCheck, PhSparkle } from '@/lib/phosphor-icons';

interface CodexEntityPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CODEX_ENTITIES.map((entity) => ({ slug: entity.id }));
}

export async function generateMetadata({ params }: CodexEntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entity = getCodexEntity(slug);
  if (!entity) return {};

  return {
    title: `${entity.name} — ${entity.form} · Living Codex`,
    description: `${entity.summary} Explore ${entity.name}'s ecology, signature capability, bond, and visual design signals.`,
    alternates: { canonical: `/codex/${entity.id}` },
    openGraph: {
      title: `${entity.name} | Arcanea Living Codex`,
      description: entity.summary,
      images: [{ url: entity.image, width: 1024, height: 1024, alt: `${entity.name}, ${entity.form}` }],
    },
  };
}

export default async function CodexEntityPage({ params }: CodexEntityPageProps) {
  const { slug } = await params;
  const entity = getCodexEntity(slug);
  if (!entity) notFound();

  const index = CODEX_ENTITIES.findIndex((candidate) => candidate.id === entity.id);
  const nextEntity = CODEX_ENTITIES[(index + 1) % CODEX_ENTITIES.length];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entity.name,
    description: entity.summary,
    url: `https://arcanea.ai/codex/${entity.id}`,
    image: `https://arcanea.ai${entity.image}`,
    inDefinedTermSet: 'https://arcanea.ai/codex',
    additionalType: 'https://schema.org/Thing',
  };

  return (
    <main className="min-h-screen bg-cosmic-deep text-text-primary">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <Link className="inline-flex items-center gap-2 text-sm text-text-muted transition hover:text-brand-primary" href="/codex">
          <PhArrowLeft aria-hidden className="h-4 w-4" />
          Living Codex
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="relative min-h-[480px] overflow-hidden rounded-3xl border border-white/[0.08] bg-cosmic-surface sm:min-h-[680px]">
          <Image
            alt={`${entity.name}, ${entity.form}`}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            src={entity.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7 sm:right-7">
            {[entity.element, entity.secondaryElement, `${entity.gate} Gate`].filter(Boolean).map((tag) => (
              <span className="rounded-full border border-white/[0.1] bg-cosmic-deep/70 px-3 py-1.5 text-xs text-text-secondary backdrop-blur-md" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <article className="flex flex-col justify-center py-4 lg:py-10">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary">
            <PhSealCheck aria-hidden className="h-4 w-4" />
            Locked name and bond
          </div>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-text-primary sm:text-6xl">{entity.name}</h1>
          <p className="mt-3 font-serif text-2xl italic text-text-secondary">{entity.form}</p>
          <p className="mt-8 text-lg leading-8 text-text-secondary">{entity.summary}</p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06]">
            {[
              ['Guardian', entity.guardian],
              ['Gate', entity.gate],
              ['Primary affinity', entity.element],
              ['Secondary affinity', entity.secondaryElement ?? 'None'],
            ].map(([label, value]) => (
              <div className="bg-cosmic-deep p-5" key={label}>
                <dt className="text-xs text-text-muted">{label}</dt>
                <dd className="mt-2 text-sm font-medium text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 space-y-8">
            <section>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">Signature capability</p>
              <p className="leading-7 text-text-secondary">{entity.signature}</p>
            </section>
            <section>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">Ecology and behavior</p>
              <p className="leading-7 text-text-secondary">{entity.ecology}</p>
            </section>
            <section>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">Recognition signals</p>
              <div className="flex flex-wrap gap-2">
                {entity.designSignals.map((signal) => (
                  <span className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-text-secondary" key={signal}>
                    {signal}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-7 sm:flex-row">
            <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-text-primary px-4 text-sm font-semibold text-cosmic-deep transition hover:bg-brand-primary" href="/codex/forge">
              <PhSparkle aria-hidden className="h-4 w-4" />
              Forge an original being
            </Link>
            <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm text-text-secondary transition hover:text-text-primary" href={`/lore/guardians/${entity.guardianSlug}`}>
              Meet {entity.guardian}
            </Link>
          </div>
        </article>
      </section>

      <section className="border-t border-white/[0.06]">
        <Link className="group mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-12 sm:px-8" href={`/codex/${nextEntity.id}`}>
          <div>
            <p className="text-xs text-text-muted">Continue through the Codex</p>
            <p className="mt-2 font-display text-2xl font-semibold text-text-primary">{nextEntity.name}</p>
          </div>
          <PhArrowRight aria-hidden className="h-6 w-6 text-text-muted transition group-hover:translate-x-1 group-hover:text-brand-primary" />
        </Link>
      </section>
    </main>
  );
}
