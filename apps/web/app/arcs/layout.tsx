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
