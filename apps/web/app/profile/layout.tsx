import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and manage your Arcanea creator profile.',
  openGraph: {
    title: 'Profile',
    description: 'View and manage your Arcanea creator profile.',
  },
  alternates: { canonical: '/profile' },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
