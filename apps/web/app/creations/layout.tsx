import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Creations',
  description: 'View and manage your creations on Arcanea — images, stories, code, and more.',
};

export default function CreationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
