import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Ten Gates',
  description: 'Journey through the Ten Gates of Creation — from Foundation at 174 Hz to Source at 1111 Hz. Each Gate opens a new dimension of creative mastery.',
  openGraph: {
    title: 'The Ten Gates | Lore of Arcanea',
    description: 'From Foundation to Source — ten frequencies, ten Guardians, ten dimensions of creative power.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
