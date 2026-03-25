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
