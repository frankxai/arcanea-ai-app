import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Books — The Arcanea Universe',
  description:
    'Explore the complete Arcanea book universe: seven novels, deep worldbuilding, character bibles, and the Academy Handbook. 486,000+ words of original fantasy.',
  openGraph: {
    title: 'The Arcanea Saga',
    description:
      '486,000+ words across seven books, worldbuilding documents, and character bibles. A complete fantasy universe.',
    images: [
      {
        url: '/guardians/v3/maylinn-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'The Arcanea Saga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/maylinn-hero-v3.webp'],
  },
  alternates: {
    canonical: '/books',
  },
};

const booksJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BookSeries',
  name: 'Chronicles of Arcanea',
  description:
    'A seven-book fantasy saga spanning 486,000+ words. Follow Eldrians through the Ten Gates from Apprentice to Luminor.',
  author: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
  },
  url: 'https://arcanea.ai/books',
  numberOfBooks: 7,
  genre: ['Fantasy', 'Mythology', 'Creative Philosophy'],
  inLanguage: 'en',
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(booksJsonLd) }}
      />
      {children}
    </>
  );
}
