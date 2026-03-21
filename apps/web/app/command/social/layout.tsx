import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Queue | Command Center',
  description:
    'Schedule and manage social media posts from the Arcanea Command Center — queue content across platforms.',
  alternates: { canonical: '/command/social' },
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
