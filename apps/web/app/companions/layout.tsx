import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Companions',
  description:
    'Creative partners across development, design, writing, and research — each with a distinct personality and expertise. Pick the one that fits your work.',
  openGraph: {
    title: 'Companions',
    description:
      'Creative partners with distinct personalities. Development, design, writing, and research — pick the one that fits your work.',
    type: 'website',
  },
};

export default function CompanionsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
