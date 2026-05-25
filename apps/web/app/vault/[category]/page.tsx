/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <GradientMesh colors={[config.color, 'var(--arc-brand-cosmic-blue)', 'var(--arc-void)']} intensity={0.05} />
      </div>

      <VaultTimeline category={cat} entries={entries} />
    </div>
  );
}
