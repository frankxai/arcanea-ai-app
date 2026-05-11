/**
 * Discover workspace packages in `packages/` and `apps/` of a repo root.
 *
 * Reads each candidate directory's package.json and reports name, version,
 * relative path (forward-slashes), and whether `src/mcp/server.ts` exists.
 * Used by the ecosystem manifest generator to merge in-repo packages with
 * the curated manifest.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

export interface MonorepoPackage {
  name: string;
  version: string;
  /** Path relative to repo root, normalised to forward-slashes. */
  path: string;
  /** True if `src/mcp/server.ts` exists in the package. */
  hasMcpServer: boolean;
  bin?: Record<string, string>;
  description?: string;
}

const PACKAGE_DIRS = ['packages', 'apps'];

export async function scanMonorepo(repoRoot: string): Promise<MonorepoPackage[]> {
  const results: MonorepoPackage[] = [];
  for (const dir of PACKAGE_DIRS) {
    const fullDir = path.join(repoRoot, dir);
    let entries: string[];
    try {
      entries = await fs.readdir(fullDir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const pkgPath = path.join(fullDir, entry);
      const pkgJsonPath = path.join(pkgPath, 'package.json');
      try {
        const stat = await fs.stat(pkgPath);
        if (!stat.isDirectory()) continue;
        const raw = await fs.readFile(pkgJsonPath, 'utf8');
        const pkg = JSON.parse(raw);
        if (!pkg.name) continue;

        const mcpPath = path.join(pkgPath, 'src/mcp/server.ts');
        const hasMcpServer = await fileExists(mcpPath);

        results.push({
          name: pkg.name,
          version: pkg.version ?? '0.0.0',
          path: path.relative(repoRoot, pkgPath).split(path.sep).join('/'),
          hasMcpServer,
          bin: pkg.bin,
          description: pkg.description,
        });
      } catch {
        continue;
      }
    }
  }
  return results;
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
