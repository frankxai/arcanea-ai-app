import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Platform — The Creative Intelligence Stack',
  description: 'Explore the Arcanea platform architecture: AI companions, the Ten Gates progression system, and tools that turn creative vision into reality.',
  openGraph: {
    title: 'Arcanea Platform — The Creative Intelligence Stack',
    description: 'Explore the Arcanea platform architecture: AI companions, the Ten Gates progression system, and tools that turn creative vision into reality.',
    type: 'website',
  },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children;
}
