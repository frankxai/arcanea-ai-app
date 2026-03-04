import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover | Explore Creative Worlds | Arcanea',
  description: 'Explore creators, collections, and creations across the Arcanea universe.',
  openGraph: {
    title: 'Discover | Arcanea',
    description: 'Explore creators, collections, and creations across the Arcanea universe.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
