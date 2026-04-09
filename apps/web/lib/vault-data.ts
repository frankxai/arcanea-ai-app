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
  strategic: { label: 'Strategic', guardian: 'Aiyami', color: '#fbbf24', tagline: 'Decisions. Outcomes. Strategy.' },
  technical: { label: 'Technical', guardian: 'Lyssandria', color: '#34d399', tagline: 'Patterns. Architecture. Truth.' },
  creative:  { label: 'Creative', guardian: 'Leyla', color: '#60a5fa', tagline: 'Voice. Vision. Flow.' },
  operational: { label: 'Operational', guardian: 'Draconia', color: '#f97316', tagline: 'Execution. Velocity. Fire.' },
  wisdom:    { label: 'Wisdom', guardian: 'Lyria', color: '#a78bfa', tagline: 'Perception. Depth. Sight.' },
  horizon:   { label: 'Horizon', guardian: 'Maylinn', color: '#f472b6', tagline: 'Append-only. Designed to outlast us.' },
};

export const VAULT_CATEGORIES: VaultCategory[] = ['strategic', 'technical', 'creative', 'operational', 'wisdom', 'horizon'];
