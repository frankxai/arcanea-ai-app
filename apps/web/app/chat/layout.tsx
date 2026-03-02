import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat | Arcanea',
  description: 'Create with 16 AI specialists — each with a distinct philosophy and expertise in development, design, writing, or research.',
  openGraph: {
    title: 'Chat | Arcanea',
    description: 'Create with 16 AI specialists — each with a distinct philosophy and expertise in development, design, writing, or research.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
