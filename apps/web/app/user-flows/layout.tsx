import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Flows — Journey Through the Arcanea Experience',
  description: 'Explore interactive journey maps showing how creators navigate the Arcanea platform, from onboarding through the Ten Gates to mastery.',
  openGraph: {
    title: 'User Flows — Journey Through the Arcanea Experience',
    description: 'Explore interactive journey maps showing how creators navigate the Arcanea platform, from onboarding through the Ten Gates to mastery.',
    type: 'website',
  },
  alternates: { canonical: '/user-flows' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
