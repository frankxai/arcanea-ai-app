import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy — Arcanea',
  description: 'Master the Ten Gates of creation through guided courses and challenges',
  openGraph: {
    title: 'Academy — Arcanea',
    description: 'Master the Ten Gates of creation through guided courses and challenges',
    url: 'https://www.arcanea.ai/academy/courses',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
