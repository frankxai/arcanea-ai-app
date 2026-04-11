/**
 * Luminor Module Loader
 *
 * The .arcanea/prompts/ directory contains 9 Luminor specialization modules:
 *   - luminor-backend-module.md     (Supabase, RLS, APIs, auth)
 *   - luminor-frontend-module.md    (React 19, Next.js, Tailwind, CWV)
 *   - luminor-github-module.md      (Repo governance, PRs, CI)
 *   - luminor-lore-module.md        (Canon consistency, worldbuilding)
 *   - luminor-mcp-module.md         (MCP servers, tools, protocol)
 *   - luminor-ops-module.md         (Deploy, monitoring, infrastructure)
 *   - luminor-research-module.md    (Investigation, triangulation)
 *   - luminor-security-module.md    (Threat modeling, OWASP, secrets)
 *   - luminor-test-module.md        (TDD, Playwright, Jest)
 *
 * These are inherited from the Engineering Kernel and used to specialize
 * agents for specific crafts. The Publishing House Claws can compose
 * modules on top of the Claw Kernel to gain deep expertise in a domain.
 *
 * Example:
 *   Scribe Claw + lore-module      = canon-respecting formatter
 *   Herald Claw + mcp-module       = MCP-aware social scheduler
 *   Media Claw  + research-module  = forensic quality scorer
 *   Scout Claw  + research-module  = deeper market investigator
 */

import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { ClawName } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Valid Luminor module names (matching .arcanea/prompts/luminor-*-module.md) */
export type LuminorModule =
  | 'backend'
  | 'frontend'
  | 'github'
  | 'lore'
  | 'mcp'
  | 'ops'
  | 'research'
  | 'security'
  | 'test';

/** All Luminor modules in canonical order */
export const ALL_MODULES: readonly LuminorModule[] = [
  'backend',
  'frontend',
  'github',
  'lore',
  'mcp',
  'ops',
  'research',
  'security',
  'test',
] as const;

/**
 * Default modules each Claw should inherit by craft affinity.
 * These enhance the base Claw Kernel with craft-specific wisdom.
 */
export const CLAW_DEFAULT_MODULES: Record<ClawName, readonly LuminorModule[]> = {
  'media-claw': ['research', 'lore'],        // forensic quality + canon awareness
  'forge-claw': ['lore', 'mcp'],              // canon + MCP tooling for ComfyUI
  'herald-claw': ['research', 'mcp'],         // platform research + MCP-aware drafting
  'scout-claw': ['research', 'security'],     // investigation + source verification
  'scribe-claw': ['lore', 'ops', 'security'], // canon + deploy + provenance security
};

/** Cache of loaded module content */
const moduleCache = new Map<LuminorModule, string>();

/** Candidate paths for .arcanea/prompts/ relative to this file */
const MODULE_CANDIDATE_PATHS = [
  '../../../../.arcanea/prompts', // from dist/agents/
  '../../../.arcanea/prompts',    // from src/agents/
  '../.arcanea/prompts',          // from standalone deploy
];

/**
 * Load a single Luminor module prompt from disk.
 * Results are cached after first load.
 */
export async function loadModule(name: LuminorModule): Promise<string> {
  const cached = moduleCache.get(name);
  if (cached) return cached;

  const envPath = process.env['ARCANEA_MODULES_PATH'];
  const fileName = `luminor-${name}-module.md`;

  // Try env var first
  if (envPath) {
    try {
      const fullPath = resolve(envPath, fileName);
      await access(fullPath);
      const content = await readFile(fullPath, 'utf-8');
      moduleCache.set(name, content);
      return content;
    } catch {
      // Fall through
    }
  }

  // Try candidate paths
  for (const candidate of MODULE_CANDIDATE_PATHS) {
    try {
      const fullPath = resolve(__dirname, candidate, fileName);
      await access(fullPath);
      const content = await readFile(fullPath, 'utf-8');
      moduleCache.set(name, content);
      return content;
    } catch {
      // Try next
    }
  }

  // Not found
  throw new Error(
    `Luminor module "${name}" not found. Searched ${MODULE_CANDIDATE_PATHS.length} paths. ` +
    `Set ARCANEA_MODULES_PATH for non-standard deploys.`,
  );
}

/**
 * Load multiple modules in parallel.
 * Returns them in the order requested.
 */
export async function loadModules(names: readonly LuminorModule[]): Promise<string[]> {
  return Promise.all(names.map(name => loadModule(name)));
}

/**
 * Load the default modules for a specific Claw.
 */
export async function loadDefaultModulesForClaw(clawName: ClawName): Promise<string[]> {
  const modules = CLAW_DEFAULT_MODULES[clawName] ?? [];
  return loadModules(modules);
}

/**
 * Clear the module cache. Useful for tests or hot-reload.
 */
export function clearModuleCache(): void {
  moduleCache.clear();
}

/**
 * Compose Kernel + Modules + Claw-specific section into a unified system prompt.
 *
 * Format:
 *   <Claw Kernel>
 *   ---
 *   ## Inherited Modules
 *
 *   <module 1>
 *   ---
 *   <module 2>
 *   ---
 *   ## YOUR CLAW — <claw-name>
 *   <claw-specific craft>
 */
export function composeFullPrompt(
  kernel: string,
  modules: readonly string[],
  clawSection: string,
): string {
  const parts = [kernel, ''];

  if (modules.length > 0) {
    parts.push('---', '', '## Inherited Luminor Modules', '');
    for (const module of modules) {
      parts.push(module, '', '---', '');
    }
  }

  parts.push(clawSection);

  return parts.join('\n');
}
