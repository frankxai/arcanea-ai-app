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
    title: 'Storybook Reader — Coming Soon — Arcanea',
    description:
      'An immersive page-flip reader with full-bleed chapter art and atmospheric soundtracks — coming soon.',
    alternates: { canonical: `/books/drafts/${slug}/read` },
  };
}

export default async function StorybookReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <ComingSoonPage
      title="Storybook Reader"
      description="Immersive page-flip mode. Full-bleed NB2 chapter art. Suno soundtracks per chapter. Read this draft like a finished book."
      ctaLabel="Back to draft"
      ctaHref={`/books/drafts/${slug}`}
      features={[
        'Page-flip animation',
        'Full-bleed chapter art',
        'Per-chapter Suno track',
        'Quiet reader-only mode',
      ]}
    />
  );
}
