import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agents | Command Center',
  description:
    'Monitor and manage your AI agents in the Arcanea Command Center — view status, activity, and performance.',
  alternates: { canonical: '/command/agents' },
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
