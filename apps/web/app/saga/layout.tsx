/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Arcanea Saga — A Journey Through the Ten Gates',
  description:
    'The Chronicles of Arcanea and the wider saga — twenty-two works in draft, readable chapter by chapter, alongside the founding myths, the series bible, character bibles, and the Academy Handbook.',
  openGraph: {
    title: 'The Arcanea Saga',
    description:
      'Twenty-two works in draft. Nothing finished, everything readable. Written in the open, chapter by chapter.',
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
