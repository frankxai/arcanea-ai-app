import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Library of Arcanea',
  description:
    'Original philosophy and practical wisdom for creators. 17 collections, 34+ texts on craft, creativity, and the creative life.',
  openGraph: {
    title: 'Library of Arcanea',
    description:
      '17 collections of original wisdom — from Laws of Creation to the Book of Shadows. Equipment for living.',
    type: 'website',
  },
};

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="lyria">{children}</div>;
}
