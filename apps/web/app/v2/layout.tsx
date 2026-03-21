import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea v2',
  description:
    'The second-generation Arcanea homepage design — preserved as a reference for the evolution of the platform.',
  robots: { index: false },
  alternates: { canonical: '/v2' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
