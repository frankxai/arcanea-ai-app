import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Your Path',
  description: 'Select your creator archetype — Writer, Visual Artist, Musician, Developer, or Polymath.',
  openGraph: {
    title: 'Choose Your Path',
    description: 'Select your creator archetype — Writer, Visual Artist, Musician, Developer, or Polymath.',
  },
  alternates: { canonical: '/onboarding/creator-type' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
