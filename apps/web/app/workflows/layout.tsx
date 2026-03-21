import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Workflows — Automate Your Creative Process',
  description: 'Discover automation workflows built for creators. Streamline your creative practice with intelligent pipelines powered by the Arcanea platform.',
  openGraph: {
    title: 'Arcanea Workflows — Automate Your Creative Process',
    description: 'Discover automation workflows built for creators. Streamline your creative practice with intelligent pipelines powered by the Arcanea platform.',
    type: 'website',
  },
  alternates: { canonical: '/workflows' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
