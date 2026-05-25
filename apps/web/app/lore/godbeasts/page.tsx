/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { GodbeastsPage } from '@/components/lore/godbeasts/godbeasts-page';

export const metadata: Metadata = {
  title: 'The Godbeasts | Lore of Arcanea',
  description:
    'Discover the ten primal Godbeasts, bonded to the Arcanean Gods as cosmic companions. From Kaelith the stone serpent-dragon to Source, the light of meta-consciousness.',
  openGraph: {
    title: 'The Godbeasts — Lore of Arcanea',
    description:
      'Discover the ten primal Godbeasts, bonded to the Arcanean Gods as cosmic companions.',
    images: [{ url: '/guardians/v2/kaelith-godbeast.webp', width: 1024, height: 1024, alt: 'Kaelith — Godbeast of the Foundation Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v2/kaelith-godbeast.webp'],
  },
};

export default function Godbeasts() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <GodbeastsPage />
      </main>
    </div>
  );
}
