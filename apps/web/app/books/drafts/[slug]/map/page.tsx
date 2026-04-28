import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ui/coming-soon';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: 'Book Map — Coming Soon — Arcanea',
    description:
      'A living mindmap of every character, location, and arc in this book — coming soon.',
    alternates: { canonical: `/books/drafts/${slug}/map` },
  };
}

export default async function BookMapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <ComingSoonPage
      title="Book Map"
      description="A living mindmap — every character, location, faction, and arc as nodes you can drag, link, and trace across chapters."
      ctaLabel="Back to draft"
      ctaHref={`/books/drafts/${slug}`}
      features={[
        'Auto-seeded from chapters',
        'React Flow canvas',
        'Cross-book universe view',
        'Editable by co-authors',
      ]}
    />
  );
}
