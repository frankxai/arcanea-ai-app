import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Gallery of Creation',
  description:
    'Explore creations channeled through the Ten Gates and Five Elements. Art, code, stories, and music from the Arcanea community.',
  openGraph: {
    title: 'Gallery of Creation',
    description:
      'Explore creations channeled through the Ten Gates and Five Elements by creators of every rank.',
    type: 'website',
  },
  alternates: { canonical: '/gallery' },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
