import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflows | Arcanea',
  description: 'Automate your creative process — explore n8n workflows and automation tools built for Arcanea creators.',
  openGraph: {
    title: 'Workflows | Arcanea — Creator Automation',
    description: 'Explore n8n-powered automation workflows to supercharge your creative practice.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
