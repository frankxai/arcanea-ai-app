/**
 * Read the curated cross-repo registry at `.arcanea/config/repos.json`.
 *
 * Returns typed `SiblingRepo[]` for the ecosystem manifest generator.
 * The registry is the source of truth for sibling repos (frankxai/* GitHub
 * orgs) — fields like `layer`, `gate`, `hemisphere` are added per Task 2.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

export interface SiblingRepo {
  name: string;
  description: string;
  /** Either `owner/repo` or full URL — generator must normalise. */
  github: string;
  publicUrl?: string | null;
  role: string;
  branch: string;
  visibility?: string;
  active: boolean;
  publishes?: string[];
  layer?: string;
  gate?: string;
  hemisphere?: string;
  status_override?: string;
}

interface ReposConfig {
  lastUpdated: string;
  repos: SiblingRepo[];
}

export async function readReposConfig(repoRoot: string): Promise<SiblingRepo[]> {
  const configPath = path.join(repoRoot, '.arcanea/config/repos.json');
  const raw = await fs.readFile(configPath, 'utf8');
  const parsed = JSON.parse(raw) as ReposConfig;
  return parsed.repos;
}
