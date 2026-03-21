import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea v4',
  description:
    'The fourth-generation Arcanea homepage design — preserved as a reference for the evolution of the platform.',
  robots: { index: false },
  alternates: { canonical: '/v4' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
