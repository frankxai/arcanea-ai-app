import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge a Luminor',
  description:
    'Shape a Luminor intelligence to think and create alongside you. Define its personality, expertise, and creative style.',
  openGraph: {
    title: 'Forge a Luminor',
    description:
      'Shape a Luminor intelligence to think and create alongside you on Arcanea.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
