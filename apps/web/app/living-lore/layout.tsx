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
