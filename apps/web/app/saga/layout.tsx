import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Arcanea Saga — A Seven-Book Journey Through the Ten Gates',
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

export default function SagaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
