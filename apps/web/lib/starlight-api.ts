import 'server-only';

import { VAULT_CATEGORIES, VAULT_CONFIG, type VaultCategory, type VaultEntry, type VaultData } from './vault-data';

const REPO = 'frankxai/Starlight-Intelligence-System';
const API = 'https://api.github.com';

interface RawEntry {
  id?: string;
  insight?: string;
  wish?: string;
  category?: string;
  confidence?: string;
  source?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
}

function headers(): HeadersInit {
  const h: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function normalizeEntry(raw: RawEntry, vault: VaultCategory): VaultEntry {
  const ts = raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now();
  return {
    id: raw.id ?? `${vault}_${ts}`,
    content: raw.insight ?? raw.wish ?? '',
    vault,
    tags: raw.tags ?? [],
    confidence: (raw.confidence as VaultEntry['confidence']) ?? 'medium',
    guardian: null,
    metadata: { category: raw.category ?? null, source: raw.source ?? null, raw: raw.author ? { author: raw.author } : undefined },
    createdAt: ts,
    updatedAt: ts,
    source: raw.source ?? 'public-vault',
  };
}

async function fetchVaultJsonl(category: VaultCategory): Promise<VaultEntry[]> {
  try {
    const res = await fetch(`${API}/repos/${REPO}/contents/public-vault/${category}.jsonl`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return content
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => {
        try { return normalizeEntry(JSON.parse(line), category); }
        catch { return null; }
      })
      .filter(Boolean) as VaultEntry[];
  } catch {
    return [];
  }
}

export async function fetchPublicVaults(): Promise<VaultData> {
  const results = await Promise.all(VAULT_CATEGORIES.map((cat) => fetchVaultJsonl(cat)));
  const allEntries = results.flat().sort((a, b) => b.createdAt - a.createdAt);

  const vaults = VAULT_CATEGORIES.map((cat, i) => {
    const catEntries = results[i];
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

  const earliestDate = allEntries.length > 0 ? Math.min(...allEntries.map((e) => e.createdAt)) : null;

  return {
    vaults,
    entries: allEntries,
    totalCount: allEntries.length,
    activeVaults: vaults.filter((v) => v.count > 0).length,
    earliestDate,
  };
}

export async function fetchVaultCategory(category: VaultCategory): Promise<VaultEntry[]> {
  return fetchVaultJsonl(category);
}
