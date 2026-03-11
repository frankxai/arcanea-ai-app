import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Forge — Create Your Companion',
  description:
    'Choose an archetype, name it, give it personality, and bring your companion to life. Forge a unique AI companion aligned with the Five Elements.',
  openGraph: {
    title: 'The Forge — Create Your Companion',
    description:
      'Forge a unique AI companion. Choose an archetype aligned with the Five Elements, customize its personality, and bring it to life.',
    type: 'website',
  },
};

export default function ForgeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
