import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Studio',
  description: 'Generate images with creation tools — guided by your chosen companion and element.',
  openGraph: {
    title: 'Image Studio',
    description: 'Generate images with creation tools.',
  },
  alternates: { canonical: '/studio/image' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
