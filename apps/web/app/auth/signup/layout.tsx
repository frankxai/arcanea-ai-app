import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Arcanea — create your account and start building with 16 creative intelligences.',
  openGraph: {
    title: 'Create Account',
    description: 'Join Arcanea — create your account and start building with 16 creative intelligences.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
