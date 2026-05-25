/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Code',
  description: 'AI-powered development tools built for creators — code smarter with Arcanea Code, the intelligent coding companion.',
  openGraph: {
    title: 'Arcanea Code | AI-Powered Development',
    description: 'Build smarter with Arcanea Code — AI-powered development tools designed for creative developers.',
  },
  alternates: { canonical: '/arcanea-code' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
