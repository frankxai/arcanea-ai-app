import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills & Abilities',
  description: 'Discover and master creative skills across the Ten Gates. Track your abilities and unlock new powers.',
  openGraph: {
    title: 'Skills & Abilities',
    description: 'Discover and master creative skills across the Ten Gates. Track your abilities and unlock new powers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
