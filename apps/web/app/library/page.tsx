/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";
import { LibraryBrowse } from "./library-browse";
import { LibraryHero } from "./library-hero";
import { getCollections, getTextsInCollection } from "../../lib/content";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Library of Arcanea — 190K+ Words of Creative Philosophy",
  description:
    "Browse the Library of Arcanea — 190K+ words of original philosophy, poetry, legend, and practice for creators across 20 collections. Equipment for living.",
  openGraph: {
    title: "Library of Arcanea",
    description: "190K+ words of original philosophy, poetry, legend, and practice for creators across 20 collections. Equipment for living.",
    images: [{ url: '/guardians/v3/maylinn-hero-v3.webp', width: 1024, height: 1024, alt: 'Maylinn — Guardian of the Heart Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/maylinn-hero-v3.webp'],
  },
};

export default async function LibraryPage() {
  const collections = await getCollections();

  // Compute per-collection reading time totals (sum of all text reading times)
  const readingTimeEntries = await Promise.all(
    collections.map(async (c) => {
      try {
        const texts = await getTextsInCollection(c.slug);
        const totalMinutes = texts.reduce(
          (sum, t) => sum + (t.frontmatter.readingTime ?? 0),
          0
        );
        return [c.slug, totalMinutes] as const;
      } catch {
        return [c.slug, 0] as const;
      }
    })
  );
  const collectionReadingTimes: Record<string, number> = Object.fromEntries(readingTimeEntries);

  // Total text count across all collections (for hero stats)
  const textsCount = collections.reduce((sum, c) => sum + (c.textCount ?? 0), 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Library of Arcanea',
    description:
      '190,000+ words of wisdom, legend, poetry, and practice for the creative soul across 20 collections of original content.',
    url: 'https://arcanea.ai/library',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collections.length,
      itemListElement: collections.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `https://arcanea.ai/library/${c.slug}`,
      })),
    },
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Premium hero — full-width, above the constrained main */}
      <LibraryHero collectionsCount={collections.length} textsCount={textsCount} />

      {/* Decorative divider */}
      <div className="mx-auto max-w-7xl px-6" aria-hidden>
        <div
          className="h-px w-full mb-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.08) 25%, rgba(127,255,212,0.14) 50%, rgba(255,215,0,0.08) 75%, transparent 100%)",
          }}
        />
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        {/* Tab Navigation */}
        <nav className="mb-12 flex items-center gap-2 border-b border-white/[0.05] pb-4">
          <Link
            href="/library"
            className="rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-[var(--arc-brand-cosmic-blue)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 px-4 py-2 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] shadow-[0_0_12px_rgba(0,188,212,0.08)]"
          >
            Browse Library
          </Link>
          <Link
            href="/library/codex"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/[0.04] transition-all duration-300"
          >
            Codex
          </Link>
          <Link
            href="/library/graph"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/[0.04] transition-all duration-300"
          >
            Relationship Graph
          </Link>
          <Link
            href="/books"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/[0.04] transition-all duration-300"
          >
            Chronicles
          </Link>
        </nav>

        <LibraryBrowse collections={collections} collectionReadingTimes={collectionReadingTimes} />
      </main>
    </div>
  );
}
