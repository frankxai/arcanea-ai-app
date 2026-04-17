import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { parse, stringify } from 'yaml';

export type Tier = 'free' | 'sub' | 'byok';
export type TierPreference = 'sub-first' | 'free-first' | 'byok-first' | 'cheapest';

export interface UserConfig {
  /** User's tier preference for routing. Determines fallback order. */
  preference: TierPreference;
  /** Known auth per runtime. Set by `arcanea-code doctor`. */
  auth: Partial<Record<'claude' | 'opencode' | 'codex' | 'gemini', AuthRecord>>;
  /** Optional default surface override (e.g. 'oh-my-arcanea' to always prefer free). */
  defaultSurface?: string;
}

export interface AuthRecord {
  /** Is the CLI installed and reachable? */
  installed: boolean;
  /** What tier is this user authenticated under (sub|byok|free|unknown)? */
  tier: Tier | 'unknown';
  /** Last detected timestamp. */
  checkedAt: string;
}

const CONFIG_DIR = join(homedir(), '.arcanea');
const CONFIG_PATH = join(CONFIG_DIR, 'config.yaml');

const DEFAULT_CONFIG: UserConfig = {
  preference: 'sub-first',
  auth: {},
};

export function loadConfig(): UserConfig {
  if (!existsSync(CONFIG_PATH)) return { ...DEFAULT_CONFIG };
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf8');
    const parsed = parse(raw) as Partial<UserConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: UserConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_PATH, stringify(config), 'utf8');
}

export function configPath(): string {
  return CONFIG_PATH;
}

/**
 * Given a user preference, reorder candidate models so the preferred tier is first.
 * Never removes candidates — only reorders. Unavailable runtimes are filtered later.
 */
export function applyPreference(
  candidates: string[],
  modelTiers: Map<string, Tier>,
  preference: TierPreference,
): string[] {
  const rank = (tier: Tier): number => {
    switch (preference) {
      case 'sub-first':
        return tier === 'sub' ? 0 : tier === 'byok' ? 1 : 2;
      case 'byok-first':
        return tier === 'byok' ? 0 : tier === 'sub' ? 1 : 2;
      case 'free-first':
      case 'cheapest':
        return tier === 'free' ? 0 : tier === 'sub' ? 1 : 2;
    }
  };
  return [...candidates].sort((a, b) => {
    const ta = modelTiers.get(a);
    const tb = modelTiers.get(b);
    if (!ta || !tb) return 0;
    return rank(ta) - rank(tb);
  });
}
