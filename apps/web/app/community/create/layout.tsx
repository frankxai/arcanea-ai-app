import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create | Arcanea Community',
  description: 'Share a new creation with the Arcanea community — showcase your art, writing, music, or any creative work.',
  openGraph: {
    title: 'Create | Arcanea Community',
    description: 'Share a new creation with the Arcanea community.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
