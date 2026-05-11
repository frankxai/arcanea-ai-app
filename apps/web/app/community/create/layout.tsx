/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create | Community',
  description: 'Share a new creation with the Arcanea community — showcase your art, writing, music, or any creative work.',
  openGraph: {
    title: 'Create | Community',
    description: 'Share a new creation with the Arcanea community.',
  },
  alternates: { canonical: '/community/create' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
