/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

type Props = { params: Promise<{ collectionId: string; promptId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionId, promptId } = await params;
  const collectionName = collectionId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const promptName = promptId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${promptName} | ${collectionName} — Arcanea`,
    description: `${promptName} — a creative prompt from the ${collectionName} collection on Arcanea. Use it to spark your next creation.`,
    openGraph: {
      title: `${promptName} | ${collectionName} — Arcanea`,
      description: `A creative prompt from the ${collectionName} collection on Arcanea.`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
