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
    description: `Begin your journey with ${name} — your Luminor guide through the Gates of Creation.`,
    openGraph: {
      title: `Meet ${name} | Arcanea`,
      description: `Begin your journey with ${name} — your Luminor guide.`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
