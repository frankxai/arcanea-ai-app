/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  alternates: { canonical: '/companions/forge' },
};

export default function ForgeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
