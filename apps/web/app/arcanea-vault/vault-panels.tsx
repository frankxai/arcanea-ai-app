'use client';

import { useState } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import type { VaultEntry, VaultSummary } from '@/lib/vault-data';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';
import { VaultEntryCard } from './vault-entry-card';

function VaultPanel({ vault, entries }: { vault: VaultSummary; entries: VaultEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const config = VAULT_CONFIG[vault.category];
  const isHorizon = vault.category === 'horizon';

  if (isHorizon) return null; // Horizon gets special treatment below

  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg font-display font-semibold text-[#e6eefc]">{config.label}</h3>
            <span className="text-xs text-[#708094] font-mono tracking-widest uppercase">{config.guardian}</span>
          </div>
          <p className="text-xs text-[#708094] mt-0.5">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono" style={{ color: config.color }}>
            {vault.count} {vault.count === 1 ? 'insight' : 'insights'}
          </span>
          <svg
            className={`w-4 h-4 text-[#708094] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && entries.length > 0 && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {entries.map((entry) => (
                <VaultEntryCard key={entry.id} entry={entry} id={`entry-${entry.id}`} />
              ))}
            </div>
          </m.div>
        )}
        {expanded && entries.length === 0 && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-center py-8">
              <p className="text-[#708094] text-sm">Empty.</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HorizonSection({ entries }: { entries: VaultEntry[] }) {
  const config = VAULT_CONFIG.horizon;

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-[#e6eefc]">Horizon</h3>
          <p className="text-xs text-[#708094]">{config.tagline}</p>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="relative p-6 rounded-2xl border-2 bg-white/[0.02] backdrop-blur-sm"
              style={{ borderColor: `${config.color}18`, boxShadow: `inset 0 0 60px ${config.color}05` }}
            >
              <p className="text-base text-[#e6eefc] leading-relaxed">{entry.content}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-[#708094]">
                {entry.metadata?.raw && 'author' in entry.metadata.raw && (
                  <span className="font-mono">{String(entry.metadata.raw.author)}</span>
                )}
                {entry.tags?.map((tag) => (
                  <span key={tag} className="font-mono px-1.5 py-0.5 rounded bg-white/[0.04]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-center py-12">
          <p className="text-[#708094] text-sm">Empty.</p>
        </div>
      )}
    </section>
  );
}

export function VaultPanels({ vaults, entries }: { vaults: VaultSummary[]; entries: VaultEntry[] }) {
  const entriesByVault = (cat: VaultCategory) =>
    entries.filter((e) => e.vault === cat).sort((a, b) => b.createdAt - a.createdAt);

  const horizonEntries = entriesByVault('horizon');
  const panelVaults = vaults.filter((v) => v.category !== 'horizon');

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-3">
        {panelVaults.map((vault) => (
          <VaultPanel key={vault.category} vault={vault} entries={entriesByVault(vault.category)} />
        ))}
      </div>
      <HorizonSection entries={horizonEntries} />
    </LazyMotion>
  );
}
