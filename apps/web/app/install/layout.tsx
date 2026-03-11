import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Install',
  description: 'Get started with Arcanea — install the platform, CLI tools, and companion apps to begin your creative journey.',
  openGraph: {
    title: 'Install — Get Started',
    description: 'Install the Arcanea platform, CLI tools, and companion apps to begin your creative journey.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
