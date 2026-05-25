/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Ten Gates',
  description: 'Journey through the Ten Gates of Creation — from Foundation at 174 Hz to Source at 1111 Hz. Each Gate opens a new dimension of creative mastery.',
  openGraph: {
    title: 'The Ten Gates | Lore of Arcanea',
    description: 'From Foundation to Source — ten frequencies, ten Guardians, ten dimensions of creative power.',
    images: [{ url: '/guardians/v3/lyssandria-hero-v3.webp', width: 1024, height: 1024, alt: 'Lyssandria — Guardian of the Foundation Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/lyssandria-hero-v3.webp'],
  },
  alternates: { canonical: '/lore/gates' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
