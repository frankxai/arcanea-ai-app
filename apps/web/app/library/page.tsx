import { Metadata } from "next";
import Link from "next/link";
import { LibraryBrowse } from "./library-browse";
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
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Tab Navigation */}
        <nav className="mb-12 flex items-center gap-2 border-b border-white/[0.05] pb-4">
          <Link
            href="/library"
            className="rounded-xl bg-gradient-to-r from-[#00bcd4]/15 to-[#00897b]/10 border border-[#00bcd4]/25 px-4 py-2 text-sm font-semibold text-[#00bcd4] shadow-[0_0_12px_rgba(0,188,212,0.08)]"
          >
            Browse Library
          </Link>
          <Link
            href="/library/codex"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[#00bcd4]/20 hover:text-[#00bcd4] hover:bg-[#00bcd4]/[0.04] transition-all duration-300"
          >
            Codex
          </Link>
          <Link
            href="/library/graph"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[#00bcd4]/20 hover:text-[#00bcd4] hover:bg-[#00bcd4]/[0.04] transition-all duration-300"
          >
            Relationship Graph
          </Link>
          <Link
            href="/books"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/40 hover:border-[#00bcd4]/20 hover:text-[#00bcd4] hover:bg-[#00bcd4]/[0.04] transition-all duration-300"
          >
            Chronicles
          </Link>
        </nav>

        <LibraryBrowse collections={collections} collectionReadingTimes={collectionReadingTimes} />
      </main>
    </div>
  );
}
