/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// ── Types ────────────────────────────────────────────────────────────────────

export type VaultCategory = 'strategic' | 'technical' | 'creative' | 'operational' | 'wisdom' | 'horizon';

export interface VaultEntry {
  id: string;
  content: string;
  vault: VaultCategory;
  tags: string[];
  confidence: 'high' | 'medium' | 'low';
  guardian: string | null;
  metadata: {
    category?: string | null;
    source?: string | null;
    raw?: Record<string, unknown>;
  };
  createdAt: number;
  updatedAt: number;
  source: string;
}

export interface VaultSummary {
  category: VaultCategory;
  label: string;
  guardian: string;
  color: string;
  count: number;
  latestEntry: VaultEntry | null;
}

export interface VaultData {
  vaults: VaultSummary[];
  entries: VaultEntry[];
  totalCount: number;
  activeVaults: number;
  earliestDate: number | null;
}

// ── Vault Config ─────────────────────────────────────────────────────────────

export const VAULT_CONFIG: Record<VaultCategory, { label: string; guardian: string; color: string; tagline: string }> = {
  strategic: { label: 'Strategic', guardian: 'Aiyami', color: 'var(--arc-brand-arcanean-gold)', tagline: 'Decisions and outcomes.' },
  technical: { label: 'Technical', guardian: 'Lyssandria', color: 'var(--arc-wind)', tagline: 'Architecture and patterns.' },
  creative:  { label: 'Creative', guardian: 'Leyla', color: 'var(--arc-brand-cosmic-blue)', tagline: 'Voice and vision.' },
  operational: { label: 'Operational', guardian: 'Draconia', color: 'var(--arc-fire)', tagline: 'Execution and discipline.' },
  wisdom:    { label: 'Wisdom', guardian: 'Lyria', color: 'var(--arc-void)', tagline: 'Depth and pattern recognition.' },
  horizon:   { label: 'Horizon', guardian: 'Maylinn', color: 'var(--arc-void)', tagline: 'Append-only. Permanent record.' },
};

export const VAULT_CATEGORIES: VaultCategory[] = ['strategic', 'technical', 'creative', 'operational', 'wisdom', 'horizon'];
