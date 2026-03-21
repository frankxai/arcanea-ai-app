import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your Arcanea account, preferences, and privacy settings.',
  openGraph: {
    title: 'Settings',
    description: 'Manage your Arcanea account, preferences, and privacy settings.',
  },
  alternates: { canonical: '/settings' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
