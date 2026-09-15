/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Weave — Arc Graph | Arcanea',
  description:
    'Visualize the living connections between creations. Every arc is a node, every bond is a thread in the Weave of the creative multiverse.',
  openGraph: {
    title: 'The Weave — Arc Graph | Arcanea',
    description:
      'Interactive force-directed graph of arc creations — characters, worlds, music, agents — and the bonds that connect them.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: { canonical: '/arcs' },
};

export default function ArcsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
