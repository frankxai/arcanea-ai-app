import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap | Arcanea',
  description: 'The path ahead — explore the Arcanea product roadmap and upcoming features for creators.',
  openGraph: {
    title: 'Roadmap | Arcanea — The Path Ahead',
    description: 'Explore upcoming features, milestones, and the long-term vision for the Arcanea platform.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
