/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Foundation — The Living Lore Volume 1',
  description:
    'Seven strangers. One broken Gate. A journey that will change everything.',
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-guardian="leyla">{children}</div>;
}
