/**
 * Top-level build orchestrator: parses the manifest, scans the monorepo and
 * sibling repos, optionally enriches with GitHub commit timestamps, merges
 * everything into hydrated EcosystemNode[], and writes derived.ts.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { ManifestSchema } from './schema.js';
import { scanMonorepo } from './scan-monorepo.js';
import { readReposConfig } from './scan-siblings.js';
import { createGitHubClient, enrichWithGitHub, parseGitHubUrl } from './enrich-github.js';
import { mergeAll } from './merge.js';
import { renderDerivedTs, writeDerivedFile } from './write.js';

export interface BuildOptions {
  repoRoot: string;
  skipGitHub?: boolean;
}

export async function build(options: BuildOptions): Promise<{ outPath: string; nodeCount: number; generatedAt: string }> {
  const { repoRoot, skipGitHub = false } = options;
  const now = new Date().toISOString();

  const manifestPath = path.join(repoRoot, '.arcanea/config/manifest.yaml');
  const manifestRaw = await fs.readFile(manifestPath, 'utf8');
  const manifest = ManifestSchema.parse(YAML.parse(manifestRaw));

  const [monorepoPackages, siblingRepos] = await Promise.all([
    scanMonorepo(repoRoot),
    readReposConfig(repoRoot),
  ]);

  const enrichments = new Map<string, { lastCommitAt: string | null }>();
  if (!skipGitHub && process.env.GITHUB_TOKEN) {
    const client = createGitHubClient();
    await Promise.all(
      siblingRepos.map(async (r) => {
        const ghUrl = r.github.startsWith('http') ? r.github : `https://github.com/${r.github}`;
        const parsed = parseGitHubUrl(ghUrl);
        if (!parsed) return;
        try {
          const result = await enrichWithGitHub({ owner: parsed.owner, repo: parsed.repo, branch: r.branch }, client);
          enrichments.set(`${parsed.owner}/${parsed.repo}`, result);
        } catch {
          enrichments.set(`${parsed.owner}/${parsed.repo}`, { lastCommitAt: null });
        }
      }),
    );
  }

  const nodes = mergeAll({ manifest, siblingRepos, monorepoPackages, enrichments, now });
  const contents = renderDerivedTs(nodes, now);
  const outPath = await writeDerivedFile(repoRoot, contents);

  return { outPath, nodeCount: nodes.length, generatedAt: now };
}
