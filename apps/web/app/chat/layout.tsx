import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with Luminors',
  description: 'Converse with Luminor Intelligences — AI companions guided by the Ten Guardians of Arcanea.',
  openGraph: {
    title: 'Chat with Luminors | Arcanea',
    description: 'Converse with Luminor Intelligences — AI companions guided by the Ten Guardians of Arcanea.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
