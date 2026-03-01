import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Arcanea',
  description: 'Join the Creator Collective — connect with creators, share your work, and build together in the Arcanea community.',
  openGraph: {
    title: 'Community | Arcanea — Join the Creator Collective',
    description: 'Connect with creators, share your work, and build together in the Arcanea community.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
