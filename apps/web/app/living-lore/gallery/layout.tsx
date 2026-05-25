/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Crew — Character Gallery',
  description:
    'Meet the seven beings who journey through the Ten Gates of Arcanea. Explore their visual identities, elements, and stories.',
  openGraph: {
    title: 'The Crew — Living Lore Gallery',
    description:
      'Seven beings. Seven perspectives. One journey through the Ten Gates.',
    type: 'website',
  },
  alternates: { canonical: '/living-lore/gallery' },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
