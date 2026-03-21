import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Demo',
  description: 'Try a live conversation with an Arcanea companion. See how AI companions think, respond, and collaborate.',
  openGraph: {
    title: 'Chat Demo',
    description: 'Try a live conversation with an Arcanea companion.',
  },
  alternates: { canonical: '/chat-demo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
