/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPublicVaults } from '@/lib/starlight-api';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';
import { VaultConstellation3D } from './vault-constellation-3d';
import { VaultPanels } from './vault-panels';
import { SplitText } from '@/components/motion/split-text';
import { Reveal, StaggerReveal } from '@/components/motion/reveal';
import { Magnetic } from '@/components/motion/magnetic';
import { GradientMesh } from '@/components/motion/gradient-mesh';

export const metadata: Metadata = {
  title: 'Starlight Vaults — Memory that compounds | Arcanea',
  description: 'Persistent memory for AI agents. 6 semantic vaults powering every Arcanea session. Local-first. Portable. Yours.',
  openGraph: {
    title: 'Starlight Vaults — Arcanea',
    description: 'Persistent memory for AI agents. Every session builds on the last.',
    type: 'website',
  },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function VaultPage() {
  const data = await fetchPublicVaults();

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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <GradientMesh colors={['var(--arc-brand-atlantean-teal)', 'var(--arc-void)', 'var(--arc-void)']} intensity={0.07} />
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* ── Header ── */}
        <section className="pt-24 pb-12 text-center">
          <Reveal delay={0} y={12} blur>
            <p className="text-xs font-mono tracking-[0.3em] text-[var(--arc-text-muted)] mb-6 uppercase">
              Persistent memory for AI agents
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text="Memory that compounds."
            className="text-4xl md:text-6xl font-display font-bold text-[var(--arc-text-primary)] mb-6 tracking-tight"
            delay={0.2}
            stagger={0.035}
          />

          <Reveal delay={0.8} y={12}>
            <p className="text-lg text-[var(--arc-text-secondary)] max-w-xl mx-auto">
              {data.totalCount > 0 ? (
                <>
                  <span className="font-mono text-[var(--arc-text-primary)]">{data.totalCount}</span>
                  {' '}insights across{' '}
                  <span className="font-mono text-[var(--arc-text-primary)]">{data.activeVaults}</span>
                  {' '}vaults.
                  {data.earliestDate && (
                    <span className="text-[var(--arc-text-muted)]"> Since {formatDate(data.earliestDate)}.</span>
                  )}
                </>
              ) : (
                'Empty. Deploy your vault to begin.'
              )}
            </p>
          </Reveal>

          {/* Stat chips */}
          {data.totalCount > 0 && (
            <StaggerReveal className="flex flex-wrap justify-center gap-2 mt-8" delay={1.0}>
              {data.vaults.map((v) => {
                const config = VAULT_CONFIG[v.category as VaultCategory];
                return (
                  <Reveal key={v.category} y={8} blur={false} as="span">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                      style={{
                        color: v.count > 0 ? config.color : 'var(--arc-text-muted)',
                        borderColor: v.count > 0 ? `${config.color}30` : 'rgba(255,255,255,0.06)',
                        backgroundColor: v.count > 0 ? `${config.color}08` : 'transparent',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.count > 0 ? config.color : 'var(--arc-text-muted)' }} />
                      {config.label}: {v.count}
                    </span>
                  </Reveal>
                );
              })}
            </StaggerReveal>
          )}
        </section>

        {/* ── Constellation ── */}
        <Reveal delay={0} y={32} blur={false} className="mb-20">
          <VaultConstellation3D entries={data.entries} />
        </Reveal>

        {/* ── Vault Panels ── */}
        <Reveal y={24} className="pb-16">
          <VaultPanels vaults={data.vaults} entries={data.entries} />
        </Reveal>

        {/* ── CTAs ── */}
        <Reveal y={16} className="pb-32 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link
                href="/starlight-intelligence"
                className="inline-block px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[var(--arc-text-primary)] hover:bg-white/[0.08] transition-colors"
              >
                How it works
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="https://starlightintelligence.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
              >
                Deploy your vault
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
