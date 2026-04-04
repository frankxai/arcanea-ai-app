import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace | Arcanea',
  description: 'Your creative workspace — manage sessions, creations, and works in progress with creative tools.',
  openGraph: {
    title: 'Workspace | Arcanea',
    description: 'Your creative workspace — manage sessions, creations, and works in progress with creative tools.',
  },
  alternates: { canonical: '/workspace' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
