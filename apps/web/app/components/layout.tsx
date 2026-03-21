import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Arcanea component library and design system reference.',
  robots: { index: false },
  alternates: { canonical: '/components' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
