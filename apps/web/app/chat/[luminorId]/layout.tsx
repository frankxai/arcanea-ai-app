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
