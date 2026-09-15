/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Library of Arcanea',
  description:
    'Original philosophy and practical wisdom for creators. 17 collections, 34+ texts on craft, creativity, and the creative life.',
  openGraph: {
    title: 'Library of Arcanea',
    description:
      '17 collections of original wisdom — from Laws of Creation to the Book of Shadows. Equipment for living.',
    type: 'website',
  },
  alternates: { canonical: '/library' },
};

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <div data-guardian="lyria">{children}</div>;
}
