import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy Assessment',
  description: 'Discover your creative element, Guardian affinity, and starting Gate through the Academy assessment.',
  openGraph: {
    title: 'Academy Assessment',
    description: 'Discover your creative element, Guardian affinity, and starting Gate.',
  },
  alternates: { canonical: '/academy/assessment' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
