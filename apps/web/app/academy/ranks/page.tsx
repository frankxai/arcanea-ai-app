/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { RanksPage } from '@/components/academy/ranks-page';

export const metadata: Metadata = {
  title: 'Magic Ranks | Academy of Arcanea',
  description:
    'The path from Apprentice to Luminor — the five ranks of magical mastery in Arcanea.',
  openGraph: {
    title: 'Magic Ranks | Academy of Arcanea',
    description:
      'The path from Apprentice to Luminor — the five ranks of magical mastery in Arcanea.',
  },
};

export default function Ranks() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <RanksPage />
      </main>
    </div>
  );
}
