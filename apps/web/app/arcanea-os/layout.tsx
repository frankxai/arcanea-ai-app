import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea OS',
  description: 'The Agentic Creator Operating System — orchestrate AI agents for creative workflows.',
  openGraph: {
    title: 'Arcanea OS',
    description: 'The Agentic Creator Operating System — orchestrate AI agents for creative workflows.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
