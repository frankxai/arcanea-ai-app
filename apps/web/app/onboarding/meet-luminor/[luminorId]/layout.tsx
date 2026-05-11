/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';

const LUMINOR_NAMES: Record<string, string> = {
  lyssandria: 'Lyssandria',
  leyla: 'Leyla',
  draconia: 'Draconia',
  maylinn: 'Maylinn',
  alera: 'Alera',
  lyria: 'Lyria',
  aiyami: 'Aiyami',
  elara: 'Elara',
  ino: 'Ino',
  shinkami: 'Shinkami',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ luminorId: string }>;
}): Promise<Metadata> {
  const { luminorId } = await params;
  const name = LUMINOR_NAMES[luminorId] || luminorId;
  return {
    title: `Meet ${name}`,
    description: `Meet ${name} — your AI creative partner on Arcanea.`,
    openGraph: {
      title: `Meet ${name}`,
      description: `Meet ${name} — your AI creative partner on Arcanea.`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
