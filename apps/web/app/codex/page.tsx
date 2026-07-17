import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LivingCodexExplorer } from '@/components/codex/living-codex-explorer';
import { CODEX_ENTITIES } from '@/lib/lore/living-codex';
import { PhArrowRight, PhSealCheck, PhSparkle } from '@/lib/phosphor-icons';

export const metadata: Metadata = {
  title: 'Living Codex — Godbeasts and Creature Design',
  description:
    'Explore Arcanea’s canon-anchored Godbeasts, their ecology and visual grammar, then forge an original creature blueprint without changing canon.',
  alternates: { canonical: '/codex' },
  openGraph: {
    title: 'Arcanea Living Codex',
    description: 'A visual registry of Arcanea’s Godbeasts and a forge for original creature blueprints.',
    images: [
      {
        url: '/guardians/v2/otome-godbeast.webp',
        width: 1024,
        height: 1024,
        alt: 'Otome, a Godbeast of Arcanea',
      },
    ],
  },
};

export default function CodexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Arcanea Living Codex',
    description: 'A canon-anchored registry of the ten Godbeasts of Arcanea.',
    url: 'https://arcanea.ai/codex',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CODEX_ENTITIES.length,
      itemListElement: CODEX_ENTITIES.map((entity, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://arcanea.ai/codex/${entity.id}`,
        name: entity.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-cosmic-deep text-text-primary">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />

      <section className="relative isolate overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
        <div className="absolute inset-0 -z-20 bg-cosmic-deep" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,hsl(var(--atlantean-primary)/0.18),transparent_36%),radial-gradient(circle_at_20%_70%,hsl(var(--gold-medium)/0.1),transparent_32%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary">
              <PhSealCheck aria-hidden className="h-4 w-4" />
              Canon anchors · creator-owned worlds
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-7xl">
              Study living systems.
              {' '}
              <span className="mt-2 block font-serif font-normal italic text-text-secondary">Forge what comes next.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
              The Living Codex treats creatures as ecology, relationship, silhouette, and consequence—not collectible filler. Explore Arcanea’s ten Godbeasts, then create an original draft that remains yours.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-text-primary px-5 text-sm font-semibold text-cosmic-deep transition hover:bg-brand-primary"
                href="/codex/forge"
              >
                Open Creature Forge
                <PhArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-medium text-text-secondary transition hover:border-white/[0.16] hover:text-text-primary"
                href="/lore/godbeasts"
              >
                Read the original lore archive
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">
              {[
                ['10', 'canon bonds'],
                ['6', 'core elements'],
                ['1', 'exportable draft'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-mono text-lg text-text-primary">{value}</p>
                  <p className="mt-1 text-xs text-text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[440px] sm:min-h-[560px]" aria-label="Selected Godbeast artwork">
            <div className="absolute left-0 top-10 h-[76%] w-[58%] overflow-hidden rounded-2xl border border-white/[0.08] bg-cosmic-surface shadow-2xl">
              <Image
                alt="Kaelith, the colossal stone serpent-dragon"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 32vw"
                src="/guardians/v2/kaelith-godbeast.webp"
              />
            </div>
            <div className="absolute right-0 top-0 h-[52%] w-[48%] overflow-hidden rounded-2xl border border-white/[0.08] bg-cosmic-surface shadow-2xl">
              <Image
                alt="Otome, the colossal whale of deep song"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 28vw"
                src="/guardians/v2/otome-godbeast.webp"
              />
            </div>
            <div className="absolute bottom-0 right-[6%] h-[42%] w-[46%] overflow-hidden rounded-2xl border border-white/[0.08] bg-cosmic-surface shadow-2xl">
              <Image
                alt="Sol, the dragon of crystallized light"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 50vw, 26vw"
                src="/guardians/v2/sol-godbeast.webp"
              />
            </div>
            <div className="absolute bottom-[5%] left-[6%] max-w-[230px] rounded-xl border border-white/[0.08] bg-cosmic-deep/85 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-primary">
                <PhSparkle aria-hidden className="h-4 w-4" />
                Design intelligence
              </div>
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                Every profile exposes the visual decisions that make the being recognizable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LivingCodexExplorer entities={CODEX_ENTITIES} />
    </main>
  );
}
