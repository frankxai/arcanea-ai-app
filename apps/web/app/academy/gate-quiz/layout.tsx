import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gate Quiz',
  description: 'Test your mastery of the Ten Gates — from Foundation to Source.',
  openGraph: {
    title: 'Gate Quiz | Academy',
    description: 'Test your mastery of the Ten Gates of Creation.',
  },
  alternates: { canonical: '/academy/gate-quiz' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
