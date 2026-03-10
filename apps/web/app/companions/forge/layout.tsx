import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Companion Forge',
  description:
    'Choose an archetype and forge your own creative companion in the world of Arcanea.',
};

export default function ForgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
