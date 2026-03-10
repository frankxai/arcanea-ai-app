import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Your creative workspace — manage projects, drafts, and works in progress.',
  openGraph: {
    title: 'Workspace',
    description: 'Your creative workspace — manage projects, drafts, and works in progress.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
