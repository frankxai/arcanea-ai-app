import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Welcome to Arcanea — your journey through the Ten Gates begins here.',
  openGraph: {
    title: 'Welcome',
    description: 'Welcome to Arcanea — your journey through the Ten Gates begins here.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
