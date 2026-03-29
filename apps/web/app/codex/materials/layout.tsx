import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Material Codex | Arcanea',
  description:
    'Explore the crystals, metals, and shards of Arcanea — materials born from crystallized Eldrian harmony, grounded in real meteoritics.',
  openGraph: {
    title: 'Material Codex | Arcanea',
    description:
      'Explore the crystals, metals, and shards of Arcanea — materials born from crystallized Eldrian harmony, grounded in real meteoritics.',
  },
};

export default function MaterialCodexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
