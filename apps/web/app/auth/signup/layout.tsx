import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Arcanea — create your creator account and begin your journey through the Ten Gates.',
  openGraph: {
    title: 'Create Account',
    description: 'Join Arcanea — create your creator account and begin your journey through the Ten Gates.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
