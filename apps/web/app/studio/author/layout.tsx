import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Author Studio',
  description:
    'Your author command center. Manage writing projects, agent teams, publishing pipelines, and analytics in one workspace.',
  openGraph: {
    title: 'Author Studio',
    description: 'Manage writing projects, agents, publishing, and analytics.',
    type: 'website',
  },
};

export default function AuthorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
