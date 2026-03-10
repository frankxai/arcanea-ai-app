import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Center',
  description: 'Your creative command center — overview of progress, stats, and next steps.',
  openGraph: {
    title: 'Command Center | Arcanea',
    description: 'Your creative command center — overview of progress, stats, and next steps.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
