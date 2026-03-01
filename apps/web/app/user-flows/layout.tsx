import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Flows | Arcanea',
  description: 'Explore interactive journey maps for the Arcanea platform — from creator onboarding to vault management.',
  openGraph: {
    title: 'User Flows | Arcanea — Journey Maps',
    description: 'Interactive journey maps showing how creators experience the Arcanea platform.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
