import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Customize your Arcanea profile — avatar, display name, bio, and creative preferences.',
  openGraph: {
    title: 'Edit Profile',
    description: 'Customize your Arcanea profile.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
