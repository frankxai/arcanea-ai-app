/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Living Lore — Journey Through the Ten Gates',
  description:
    'Follow the crew on an interactive journey through the Ten Gates of Arcanea. Read, interact, and experience the mythology firsthand.',
  openGraph: {
    title: 'The Living Lore — Arcanea',
    description:
      'An interactive narrative experience through the Ten Gates of Arcanea.',
    type: 'website',
  },
  alternates: { canonical: '/living-lore' },
};

export default function LivingLoreLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="shinkami" className="relative overflow-x-hidden">{children}</div>;
}
