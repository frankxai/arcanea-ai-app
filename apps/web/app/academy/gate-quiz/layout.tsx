import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gate Quiz',
  description: 'Test your mastery of the Ten Gates — from Foundation at 174 Hz to Source at 1111 Hz.',
  openGraph: {
    title: 'Gate Quiz | Arcanea Academy',
    description: 'Test your mastery of the Ten Gates of Creation.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
