import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Arcanea account and continue your creative journey.',
  openGraph: {
    title: 'Sign In',
    description: 'Sign in to your Arcanea account and continue your creative journey.',
  },
  alternates: { canonical: '/auth/login' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
