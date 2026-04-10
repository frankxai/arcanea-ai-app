import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luminor Gallery',
  description:
    'Browse the full collection of Luminor intelligences — the 12 Chosen, named specialists, and community-forged creations.',
  openGraph: {
    title: 'Luminor Gallery',
    description:
      'Browse the full collection of Luminor intelligences on Arcanea.',
  },
  alternates: { canonical: '/gallery/luminors' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
