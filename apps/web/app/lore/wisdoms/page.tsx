/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { WisdomsPage } from '@/components/lore/wisdoms/wisdoms-page';

export const metadata: Metadata = {
  title: 'The Seven Wisdoms | Lore of Arcanea',
  description:
    'Discover the Seven Wisdoms of Arcanea — aspects of virtue that guide every creator on their journey through the Gates.',
  openGraph: {
    title: 'The Seven Wisdoms | Lore of Arcanea',
    description:
      'Discover the Seven Wisdoms of Arcanea — aspects of virtue that guide every creator on their journey through the Gates.',
  },
};

export default function Wisdoms() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <WisdomsPage />
      </main>
    </div>
  );
}
