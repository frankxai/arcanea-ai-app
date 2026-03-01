import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Academy of Creation | Arcanea',
    template: '%s | Academy | Arcanea',
  },
  description:
    'Master the Ten Gates of Creation. Open your channels to the elements and unlock your creative power through the Arcanean Academy.',
  openGraph: {
    title: 'Academy of Creation | Arcanea',
    description:
      'Journey through the Ten Gates — from Foundation at 174 Hz to Source at 1111 Hz. Unlock your creative power through the Arcanean Academy.',
    type: 'website',
  },
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
