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
    images: [{ url: '/guardians/v3/shinkami-hero-v3.webp', width: 1024, height: 1024, alt: 'Shinkami — Guardian of the Source Gate' }],
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
