import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultEntry, type VaultData } from './vault-data';

function parseVaultFile(raw: string): VaultEntry[] {
  try {
    const data = JSON.parse(raw);
    if (!data.entries || typeof data.entries !== 'object') return [];
    return Object.values(data.entries) as VaultEntry[];
  } catch {
    return [];
  }
}

export async function loadVaultData(): Promise<VaultData> {
  const vaultDir = path.resolve(process.cwd(), '../../.arcanea/memory/vaults');
  const allEntries: VaultEntry[] = [];

  for (const cat of VAULT_CATEGORIES) {
    try {
      const raw = await readFile(path.join(vaultDir, `${cat}.json`), 'utf-8');
      const entries = parseVaultFile(raw);
      allEntries.push(...entries);
    } catch {
      // Vault file doesn't exist — vault is empty
    }
  }

  allEntries.sort((a, b) => b.createdAt - a.createdAt);

  const vaults = VAULT_CATEGORIES.map((cat) => {
    const catEntries = allEntries.filter((e) => e.vault === cat);
    const config = VAULT_CONFIG[cat];
    return {
      category: cat,
      label: config.label,
      guardian: config.guardian,
      color: config.color,
      count: catEntries.length,
      latestEntry: catEntries[0] ?? null,
    };
  });

  const earliestDate = allEntries.length > 0
    ? Math.min(...allEntries.map((e) => e.createdAt))
    : null;

  return {
    vaults,
    entries: allEntries,
    totalCount: allEntries.length,
    activeVaults: vaults.filter((v) => v.count > 0).length,
    earliestDate,
  };
}
