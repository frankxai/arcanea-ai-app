import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Providers',
  description:
    'Configure your AI provider API keys for the Intelligence Gateway. Connect OpenAI, Anthropic, Google, xAI, DeepSeek, and more.',
  openGraph: {
    title: 'AI Providers | Settings',
    description:
      'Configure AI provider API keys for the Arcanea Intelligence Gateway.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
