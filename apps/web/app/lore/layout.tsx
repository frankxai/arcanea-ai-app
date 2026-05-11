/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lore of Arcanea',
  description:
    'The mythology of Arcanea — Lumina and Nero, the Ten Guardians, Five Elements, and the eternal battle against the Dark Lord Malachar.',
  openGraph: {
    title: 'Lore of Arcanea',
    description:
      'Explore the living mythology — Guardians, Godbeasts, Elements, and the cosmic duality that shapes all creation.',
    type: 'website',
    images: [
      {
        url: '/guardians/v3/shinkami-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'Shinkami — Guardian of the Source Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/shinkami-hero-v3.webp'],
  },
  alternates: { canonical: '/lore' },
};

export default function LoreLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="shinkami">{children}</div>;
}
