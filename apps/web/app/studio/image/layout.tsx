import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Studio',
  description: 'Generate images with AI-powered creation tools — guided by your chosen Guardian and element.',
  openGraph: {
    title: 'Image Studio | Arcanea',
    description: 'Generate images with AI-powered creation tools.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
