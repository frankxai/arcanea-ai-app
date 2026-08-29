import type { Metadata } from 'next';
import { CinematicBookOverview } from '@/components/books/cinematic-book-overview';
import {
  CINEMATIC_BOOK_DESCRIPTION,
  CINEMATIC_BOOK_TITLE,
  getCinematicBookStats,
  getCinematicChapter,
} from '@/lib/books/cinematic-edition';
import {
  getCinematicBookAccess,
  isCinematicCheckoutConfigured,
} from '@/lib/books/polar-access';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${CINEMATIC_BOOK_TITLE} — Chronicles of Arcanea`,
  description: CINEMATIC_BOOK_DESCRIPTION,
  alternates: { canonical: '/books' },
  openGraph: {
    title: `${CINEMATIC_BOOK_TITLE} — Chronicles of Arcanea`,
    description: CINEMATIC_BOOK_DESCRIPTION,
    type: 'book',
  },
};

export default async function BooksPage() {
  const stats = await getCinematicBookStats();
  const firstChapter = stats.chapters[0]
    ? await getCinematicChapter(stats.chapters[0].id, true)
    : null;
  const access = await getCinematicBookAccess();

  return (
    <CinematicBookOverview
      chapters={stats.chapters}
      wordCount={stats.wordCount}
      readTime={stats.readTime}
      openingContent={firstChapter?.content ?? ''}
      access={access}
      checkoutConfigured={isCinematicCheckoutConfigured()}
    />
  );
}
