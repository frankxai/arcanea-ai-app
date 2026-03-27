import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Settings',
  description: 'Manage what Arcanea remembers about you — preferences, goals, and context.',
};

export default function MemorySettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
