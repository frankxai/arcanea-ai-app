/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover | Explore Creative Worlds',
  description: 'Explore creators, collections, and creations across the Arcanea universe.',
  openGraph: {
    title: 'Discover',
    description: 'Explore creators, collections, and creations across the Arcanea universe.',
  },
  alternates: { canonical: '/discover' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
