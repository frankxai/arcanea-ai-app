/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

type Props = { params: Promise<{ collectionId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionId } = await params;
  const name = collectionId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${name} | Prompt Books — Arcanea`,
    description: `Explore the ${name} prompt collection — curated creative prompts to spark your imagination on Arcanea.`,
    openGraph: {
      title: `${name} | Prompt Books — Arcanea`,
      description: `Explore the ${name} prompt collection on Arcanea.`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
