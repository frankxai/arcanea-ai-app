/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Companions',
  description:
    'Creative partners across development, design, writing, and research — each with a distinct personality and expertise. Pick the one that fits your work.',
  openGraph: {
    title: 'Companions',
    description:
      'Creative partners with distinct personalities. Development, design, writing, and research — pick the one that fits your work.',
    type: 'website',
  },
  alternates: { canonical: '/companions' },
};

export default function CompanionsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
