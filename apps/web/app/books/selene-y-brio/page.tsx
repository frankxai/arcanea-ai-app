import type { Metadata } from 'next';
import { join } from 'path';
import { notFound } from 'next/navigation';
import { IllustratedNovellaReader } from '@/components/books/illustrated-novella-reader';
import { getBookRoot } from '@/lib/content/book-path';
import { isBookPublic } from '@/lib/content/book-visibility';
import { seleneYBrioChapters } from './selene-y-brio.data';

const BOOK_DIR = join(getBookRoot(), 'selene-y-brio');

export async function generateMetadata(): Promise<Metadata> {
  if (!(await isBookPublic(BOOK_DIR))) return { title: 'Book Not Found' };
  return {
    title: 'The Light She Could Not See | Arcanea',
    description: 'An illustrated companion edition from the Selene & Brío series.',
    openGraph: { images: ['/images/books/selene-y-brio/24.webp'] },
  };
}

export default async function SeleneYBrioPage() {
  if (!(await isBookPublic(BOOK_DIR))) notFound();
  return (
    <IllustratedNovellaReader
      title="The Light She Could Not See"
      subtitle="Selene & Brío · Illustrated companion edition"
      author="Arcanea"
      cover={{
        src: '/images/books/selene-y-brio/24.webp',
        alt: 'Selene rides Brío beneath closing violet orchids above a dawn-lit river and distant tepuis.',
        caption: 'The road she chose',
      }}
      chapters={seleneYBrioChapters}
    />
  );
}
