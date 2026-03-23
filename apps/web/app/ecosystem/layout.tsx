import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem — Arcanea Creative Intelligence',
  description:
    'Interactive constellation map of the Arcanea ecosystem. 27 repos, 35 packages, 54 skills powering creative intelligence across code, lore, art, and music.',
  openGraph: {
    title: 'Arcanea Ecosystem',
    description: 'Interactive constellation map of creative intelligence systems',
    type: 'website',
    url: 'https://arcanea.ai/ecosystem',
    images: [
      {
        url: '/guardians/v3/elara-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'Elara — Guardian of the Starweave Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea Ecosystem',
    description: 'Interactive constellation map of creative intelligence systems',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
