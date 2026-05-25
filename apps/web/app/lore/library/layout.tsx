/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Library',
  description: 'Browse the Library of Arcanea — 17 collections, 34+ original texts of wisdom, poetry, and practical guidance for creators.',
  openGraph: {
    title: 'The Library | Lore of Arcanea',
    description: '17 collections of sacred texts — laws, legends, parables, rituals, and wisdom for the creative life.',
  },
  alternates: { canonical: '/lore/library' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
