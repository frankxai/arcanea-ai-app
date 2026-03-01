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
