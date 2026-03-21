import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Community — Join the Creative Civilization',
  description: 'Connect with creators, share your work, and build together in the Arcanea community. Join a civilization of creative minds shaping the future.',
  openGraph: {
    title: 'Arcanea Community — Join the Creative Civilization',
    description: 'Connect with creators, share your work, and build together in the Arcanea community. Join a civilization of creative minds shaping the future.',
    type: 'website',
  },
  alternates: { canonical: '/community' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
