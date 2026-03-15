import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Arcanean Code — 1 Theorem, 3 Vows, 7 Laws',
  description:
    'The creative philosophy of Arcanea. One theorem, three vows every creator memorizes, and seven laws that guide practice. Write your own code alongside the universal foundation.',
  openGraph: {
    title: 'The Arcanean Code',
    description:
      '"Imperfection that creates endlessly is indistinguishable from God." — The root philosophy behind every Arcanean creation.',
    type: 'website',
  },
};

export default function CodeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
