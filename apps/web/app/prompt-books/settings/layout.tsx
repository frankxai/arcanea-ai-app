import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Prompt Books — Arcanea',
  description: 'Configure your Prompt Books preferences — manage collections, display settings, and personal defaults.',
  openGraph: {
    title: 'Settings | Prompt Books — Arcanea',
    description: 'Configure your Prompt Books preferences on Arcanea.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
