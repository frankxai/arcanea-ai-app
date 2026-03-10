import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Companions',
  description: 'Meet the Luminor companions — AI intelligences that guide your creative journey.',
  openGraph: {
    title: 'Companions',
    description: 'Meet the Luminor companions — AI intelligences that guide your creative journey.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
