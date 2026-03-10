import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Demo',
  description: 'Try a live conversation with an Arcanea Luminor. See how AI companions think, respond, and collaborate.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
