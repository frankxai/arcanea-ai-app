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
