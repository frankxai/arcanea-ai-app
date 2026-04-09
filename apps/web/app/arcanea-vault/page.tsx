import { Metadata } from 'next';
import { loadVaultData } from '@/lib/vault-loader';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';
import { VaultConstellation } from './vault-constellation';
import { VaultPanels } from './vault-panels';

export const metadata: Metadata = {
  title: 'Starlight Vaults — Intelligence That Compounds | Arcanea',
  description: 'A living constellation of accumulated insights across 6 semantic vaults. Strategic, technical, creative, operational, wisdom, and horizon — memory that grows.',
  openGraph: {
    title: 'Starlight Vaults — Arcanea',
    description: 'A living constellation of intelligence. 6 vaults. Growing since the first insight.',
    type: 'website',
  },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function VaultPage() {
  const data = await loadVaultData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Starlight Vaults',
    url: 'https://arcanea.ai/arcanea-vault',
    description: `${data.totalCount} insights across ${data.activeVaults} vaults.`,
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_30%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(ellipse_at_70%_70%,rgba(244,114,182,0.06),transparent_50%)]" />
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <section className="pt-20 pb-8 text-center">
          <p className="text-xs font-mono tracking-[0.3em] text-[#708094] mb-4 uppercase">
            Starlight Intelligence System
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#e6eefc] mb-4">
            Starlight Vaults
          </h1>
          <p className="text-lg text-[#9bb1d0] max-w-xl mx-auto">
            {data.totalCount > 0 ? (
              <>
                <span className="font-mono text-[#e6eefc]">{data.totalCount}</span>
                {' '}insights across{' '}
                <span className="font-mono text-[#e6eefc]">{data.activeVaults}</span>
                {' '}vaults.
                {data.earliestDate && (
                  <span className="text-[#708094]"> Growing since {formatDate(data.earliestDate)}.</span>
                )}
              </>
            ) : (
              'A constellation waiting for its first light.'
            )}
          </p>

          {/* Stat chips */}
          {data.totalCount > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {data.vaults.map((v) => {
                const config = VAULT_CONFIG[v.category as VaultCategory];
                return (
                  <span
                    key={v.category}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                    style={{
                      color: v.count > 0 ? config.color : '#708094',
                      borderColor: v.count > 0 ? `${config.color}30` : 'rgba(255,255,255,0.06)',
                      backgroundColor: v.count > 0 ? `${config.color}08` : 'transparent',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.count > 0 ? config.color : '#708094' }} />
                    {config.label}: {v.count}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Constellation ── */}
        <section className="mb-16">
          <VaultConstellation entries={data.entries} />
        </section>

        {/* ── Vault Panels ── */}
        <section className="pb-24">
          <VaultPanels vaults={data.vaults} entries={data.entries} />
        </section>
      </main>
    </div>
  );
}
