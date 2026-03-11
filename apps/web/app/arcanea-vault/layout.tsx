import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Vault',
  description: 'Your personal creative vault — save, organize, and protect your most precious creations.',
  openGraph: {
    title: 'Arcanea Vault',
    description: 'Your personal creative vault — save, organize, and protect your most precious creations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
