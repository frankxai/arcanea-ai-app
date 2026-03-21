import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strategy | Community',
  description: 'Explore community growth strategies and contribution guidelines for the Arcanea creator collective.',
  openGraph: {
    title: 'Strategy | Community',
    description: 'Explore community growth strategies and contribution guidelines for the Arcanea creator collective.',
  },
  alternates: { canonical: '/community/strategy' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
