/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  alternates: { canonical: '/code' },
};

export default function CodeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
