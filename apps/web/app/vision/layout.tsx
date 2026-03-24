import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vision — Arcanea',
  description:
    'Build your universe with creative intelligence. Six layers of creation, ten Guardians, and an open source civilization.',
};

export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
