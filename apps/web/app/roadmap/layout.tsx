import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Roadmap — Building the Future of Creation',
  description: 'Explore the Arcanea product roadmap, upcoming features, and the long-term vision for a platform where creators and AI build together.',
  openGraph: {
    title: 'Arcanea Roadmap — Building the Future of Creation',
    description: 'Explore the Arcanea product roadmap, upcoming features, and the long-term vision for a platform where creators and AI build together.',
    type: 'website',
  },
  alternates: { canonical: '/roadmap' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
