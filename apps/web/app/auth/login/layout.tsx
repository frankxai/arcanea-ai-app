import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Arcanea account and continue your creative journey.',
  openGraph: {
    title: 'Sign In | Arcanea',
    description: 'Sign in to your Arcanea account and continue your creative journey.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
