/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy — Arcanea',
  description: 'Master the Ten Gates of creation through guided courses and challenges',
  openGraph: {
    title: 'Academy — Arcanea',
    description: 'Master the Ten Gates of creation through guided courses and challenges',
    url: 'https://www.arcanea.ai/academy/courses',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
