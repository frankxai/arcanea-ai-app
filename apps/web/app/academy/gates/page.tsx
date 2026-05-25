/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { GatesPage } from '@/components/academy/gates-page';

export const metadata: Metadata = {
  title: 'The Ten Gates | Academy of Arcanea',
  description:
    'Journey through the Ten Gates of Creation — from Foundation to Source. Each Gate opens a new dimension of creative power.',
  openGraph: {
    title: 'The Ten Gates | Academy of Arcanea',
    description:
      'From Foundation to Source — a vertical pathway through ten dimensions of creative mastery.',
  },
};

export default function Gates() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <GatesPage />
      </main>
    </div>
  );
}
