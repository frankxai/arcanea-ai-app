import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Arcanea — Get in Touch',
  description: 'Reach the Arcanea team for support, partnerships, or general inquiries. We are building the future of creative intelligence together.',
  openGraph: {
    title: 'Contact Arcanea — Get in Touch',
    description: 'Reach the Arcanea team for support, partnerships, or general inquiries. We are building the future of creative intelligence together.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
