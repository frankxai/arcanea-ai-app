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
  },
};

export default function LoreLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="shinkami">{children}</div>;
}
