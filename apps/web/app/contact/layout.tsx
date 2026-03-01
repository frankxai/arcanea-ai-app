import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Arcanea',
  description: 'Reach the Arcanea Academy — get in touch with our team, report issues, or explore partnership opportunities.',
  openGraph: {
    title: 'Contact | Arcanea — Reach the Academy',
    description: 'Get in touch with the Arcanea team for support, partnerships, or general inquiries.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
