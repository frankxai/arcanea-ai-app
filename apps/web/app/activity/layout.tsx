import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity Feed',
  description: "See what's happening across your creative world — likes, follows, and new creations.",
  openGraph: {
    title: 'Activity Feed',
    description: "See what's happening across your creative world — likes, follows, and new creations.",
  },
  alternates: { canonical: '/activity' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
