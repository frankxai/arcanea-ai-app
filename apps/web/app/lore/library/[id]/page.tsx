import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollection } from '../collections-data';

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ id: collection.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const collection = getCollection(id);

  if (!collection) {
    return { title: 'Collection Not Found — The Library of Arcanea' };
  }

  return {
    title: `${collection.title} — The Library of Arcanea`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} — The Library of Arcanea`,
      description: collection.description,
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = getCollection(id);

  if (!collection) {
    notFound();
  }

  const Icon = collection.icon;
  const related = COLLECTIONS.filter(
    (c) => c.category === collection.category && c.id !== collection.id,
  ).slice(0, 3);

  const colorClasses: Record<string, { bg: string; text: string }> = {
    'gold-bright': { bg: 'bg-gold-bright/20', text: 'text-gold-bright' },
    'atlantean-teal-aqua': { bg: 'bg-atlantean-teal-aqua/20', text: 'text-atlantean-teal-aqua' },
    'creation-prism-purple': { bg: 'bg-creation-prism-purple/20', text: 'text-creation-prism-purple' },
    'draconic-crimson': { bg: 'bg-draconic-crimson/20', text: 'text-draconic-crimson' },
  };
  const colors = colorClasses[collection.color] ?? colorClasses['gold-bright'];

  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-8">
        <Link
          href="/lore/library"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold-bright transition-colors mb-8"
        >
          &larr; Back to the Library
        </Link>

        <section className="rounded-3xl liquid-glass p-10">
          <div className="flex items-start gap-5 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                {collection.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mt-1">
                {collection.title}
              </h1>
            </div>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            {collection.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-muted">{collection.texts} {collection.texts === 1 ? 'text' : 'texts'}</span>
            <span className={colors.text}>{collection.situation}</span>
          </div>
        </section>

        <section className="mt-8 rounded-2xl liquid-glass p-8 text-center">
          <p className="text-text-secondary mb-4">
            Full text for this collection is being prepared for the Library.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl bg-gold-bright/10 border border-gold-bright/20 px-5 py-2.5 text-sm font-semibold text-gold-bright hover:bg-gold-bright/15 transition-colors"
          >
            Browse the full Library
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-text-primary">
              More {collection.category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => {
                const RelatedIcon = r.icon;
                return (
                  <Link
                    key={r.id}
                    href={`/lore/library/${r.id}`}
                    className="rounded-xl liquid-glass p-4 hover:border-white/[0.12] transition-colors"
                  >
                    <RelatedIcon className="w-6 h-6 text-text-muted" />
                    <p className="mt-2 text-sm font-semibold text-text-primary">{r.title}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
