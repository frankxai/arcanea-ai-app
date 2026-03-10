import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Code',
  description: 'AI-powered development tools built for creators — code smarter with Arcanea Code, the intelligent coding companion.',
  openGraph: {
    title: 'Arcanea Code | AI-Powered Development',
    description: 'Build smarter with Arcanea Code — AI-powered development tools designed for creative developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
