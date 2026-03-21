import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Arcanea — create your account and start building worlds, stories, music, and more.',
  openGraph: {
    title: 'Create Account',
    description: 'Join Arcanea — create your account and start building worlds, stories, music, and more.',
  },
  alternates: { canonical: '/auth/signup' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
