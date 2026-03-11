import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password',
  description: 'Set a new password for your Arcanea account.',
  openGraph: {
    title: 'Set New Password',
    description: 'Set a new password for your Arcanea account.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
