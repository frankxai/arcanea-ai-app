import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Arcanea Visual Encyclopedia',
  description:
    'Explore Arcanea Kinforms, characters, creatures, places, and cinematic scenes as a connected proposal-lore visual system.',
  openGraph: {
    title: 'Arcanea Visual Encyclopedia',
    description:
      'A connected, reviewable visual encyclopedia built through the Ten Gates of Arcanea.',
    type: 'website',
  },
  alternates: { canonical: '/gallery' },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}
