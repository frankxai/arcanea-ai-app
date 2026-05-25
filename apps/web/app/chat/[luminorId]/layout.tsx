/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { type Metadata } from 'next';
import { getLuminor } from '@/lib/luminors/config';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ luminorId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ luminorId: string }>;
}): Promise<Metadata> {
  const { luminorId } = await params;
  const luminor = getLuminor(luminorId);

  if (!luminor) {
    return {
      title: 'Chat',
      description: 'Chat with a creative companion for development, design, writing, or research.',
    };
  }

  return {
    title: `Chat with ${luminor.name}`,
    description: `${luminor.name} — ${luminor.tagline}. ${luminor.specialty} companion on Arcanea.`,
    openGraph: {
      title: `Chat with ${luminor.name}`,
      description: `${luminor.name} — ${luminor.tagline}`,
    },
  };
}

export default async function LuminorChatLayout({ children, params }: LayoutProps) {
  // params is consumed by generateMetadata; layout just passes children through
  void params;
  return <>{children}</>;
}
