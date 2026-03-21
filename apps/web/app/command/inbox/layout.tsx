import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inbox | Command Center',
  description:
    'Manage your media assets and inbox in the Arcanea Command Center — upload, organize, and publish content.',
  alternates: { canonical: '/command/inbox' },
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
