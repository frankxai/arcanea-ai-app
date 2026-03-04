import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat | Arcanea',
  description: 'Create with 10 creative intelligences — each with a distinct philosophy and creative domain.',
  openGraph: {
    title: 'Chat | Arcanea',
    description: 'Create with 10 creative intelligences — each with a distinct philosophy and creative domain.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
