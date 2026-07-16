/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
    title: 'Book Map — Coming Soon',
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
