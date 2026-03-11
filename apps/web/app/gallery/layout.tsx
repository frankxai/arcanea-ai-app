import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Gallery',
  description: 'Browse and discover creations from the Arcanea community. Images, stories, code, music, and more.',
  openGraph: {
    title: 'Creator Gallery',
    description: 'Browse and discover creations from the Arcanea community. Images, stories, code, music, and more.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
