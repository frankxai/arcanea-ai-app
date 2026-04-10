import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchVaultCategory } from '@/lib/starlight-api';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultCategory } from '@/lib/vault-data';
import { VaultTimeline } from './vault-timeline';
import { GradientMesh } from '@/components/motion/gradient-mesh';

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return VAULT_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const config = VAULT_CONFIG[category as VaultCategory];
  if (!config) return { title: 'Vault — Arcanea' };

  return {
    title: `${config.label} Vault — ${config.tagline} | Arcanea`,
    description: `${config.label} insights from the Starlight Intelligence System.`,
    openGraph: {
      title: `${config.label} Vault — Arcanea`,
      description: config.tagline,
    },
  };
}

export default async function VaultCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VAULT_CATEGORIES.includes(category as VaultCategory)) notFound();

  const cat = category as VaultCategory;
  const config = VAULT_CONFIG[cat];
  const entries = await fetchVaultCategory(cat);
  entries.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <GradientMesh colors={[config.color, '#0d47a1', '#a78bfa']} intensity={0.05} />
      </div>

      <VaultTimeline category={cat} entries={entries} />
    </div>
  );
}
