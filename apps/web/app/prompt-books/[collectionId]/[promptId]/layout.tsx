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
