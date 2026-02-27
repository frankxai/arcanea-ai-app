import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Your Path',
  description: 'Select your creator archetype — Writer, Visual Artist, Musician, Developer, or Polymath.',
  openGraph: {
    title: 'Choose Your Path | Arcanea',
    description: 'Select your creator archetype and begin your journey.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
