import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Companions',
  description: 'Browse and chat with AI companions — each with a distinct personality and creative expertise.',
  openGraph: {
    title: 'Companions',
    description: 'Browse and chat with AI companions — each with a distinct personality and creative expertise.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
