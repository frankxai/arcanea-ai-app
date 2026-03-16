import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea v1',
  description:
    'The original Arcanea homepage design — preserved as a reference for the evolution of the platform.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
