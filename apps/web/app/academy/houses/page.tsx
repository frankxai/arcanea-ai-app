/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { HousesPage } from '@/components/academy/houses-page';

export const metadata: Metadata = {
  title: 'The Seven Houses | Academy of Arcanea',
  description:
    'Discover the Seven Academy Houses of Arcanea — each a path of creation aligned with a cosmic force.',
  openGraph: {
    title: 'The Seven Houses | Academy of Arcanea',
    description:
      'Discover the Seven Academy Houses of Arcanea — each a path of creation aligned with a cosmic force.',
  },
};

export default function Houses() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <HousesPage />
      </main>
    </div>
  );
}
