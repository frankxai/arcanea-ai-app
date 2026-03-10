import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Gallery',
  description: 'Browse and discover creations from the Arcanea community. Images, stories, worlds, and more.',
  openGraph: {
    title: 'Creator Gallery | Arcanea',
    description: 'Browse and discover creations from the Arcanea community. Images, stories, worlds, and more.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
