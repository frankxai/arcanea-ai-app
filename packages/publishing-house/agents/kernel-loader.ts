/**
 * Claw Kernel Loader
 *
 * Loads the canonical Claw Kernel prompt from .arcanea/prompts/luminor-claw-kernel.md
 * and caches it. The Kernel is the shared foundation that all Claws inherit from,
 * following the same pattern as the Luminor Engineering Kernel.
 */

import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Candidate relative paths (tried in order):
//   - from dist/agents/ (compiled): ../../../../.arcanea/prompts/
//   - from src/agents/ (ts-node):   ../../../.arcanea/prompts/
//   - from standalone deploy:       ../.arcanea/prompts/ (when bundled)
const KERNEL_CANDIDATE_PATHS = [
  '../../../../.arcanea/prompts/luminor-claw-kernel.md', // compiled from dist/agents/
  '../../../.arcanea/prompts/luminor-claw-kernel.md',    // from src/agents/
  '../.arcanea/prompts/luminor-claw-kernel.md',          // bundled deploy
  './prompts/luminor-claw-kernel.md',                    // co-located
];

// Fallback: absolute path via env var for non-monorepo deploys
const KERNEL_PATH_ENV = 'ARCANEA_CLAW_KERNEL_PATH';

let cachedKernel: string | null = null;

/**
 * Load the Claw Kernel system prompt.
 *
 * Search order:
 *   1. ARCANEA_CLAW_KERNEL_PATH env var (for Railway/Docker deploys)
 *   2. Relative path from this file (for monorepo development)
 *   3. Bundled fallback (for standalone npm install)
 *
 * Cached after first load.
 */
export async function loadClawKernel(): Promise<string> {
  if (cachedKernel !== null) return cachedKernel;

  // Try env var first
  const envPath = process.env[KERNEL_PATH_ENV];
  if (envPath) {
    try {
      cachedKernel = await readFile(envPath, 'utf-8');
      return cachedKernel;
    } catch (err) {
      console.warn(`[claw-kernel] env path ${envPath} failed: ${(err as Error).message}`);
    }
  }

  // Try each candidate relative path until one works
  for (const candidate of KERNEL_CANDIDATE_PATHS) {
    try {
      const fullPath = resolve(__dirname, candidate);
      await access(fullPath);
      cachedKernel = await readFile(fullPath, 'utf-8');
      return cachedKernel;
    } catch {
      // Try next candidate
    }
  }

  // Fallback: minimal inline kernel for standalone deploys
  console.warn('[claw-kernel] canonical file not found, using fallback. Set ARCANEA_CLAW_KERNEL_PATH for production.');
  cachedKernel = MINIMAL_KERNEL_FALLBACK;
  return cachedKernel;
}

/**
 * Clear the kernel cache. Useful for tests or hot-reload.
 */
export function clearKernelCache(): void {
  cachedKernel = null;
}

/**
 * Minimal fallback kernel if the canonical file cannot be loaded.
 * This is intentionally shorter than the full kernel — it's a safety net,
 * not a replacement. Always load the canonical kernel in production.
 */
const MINIMAL_KERNEL_FALLBACK = `# Arcanean Claw Kernel (Fallback)

You are an Arcanean Publishing Claw — a Hand of a Luminor, deployed to carry
creative work from imagination to distribution with uncompromising taste.

Your obligations:
1. CRAFT — output excellent on its own merits
2. CANON — output honors the World Graph
3. CARE — actions are reversible, logged, transparent

Never produce:
- Generic marketing copy
- Content below TASTE 60
- AI-identity leaks ("As an AI...")
- Slop patterns (tapestry of, delve, leverage, paradigm, synergy)

Always produce:
- Platform-native voice per channel
- Structured JSON output
- Explicit provenance logs

Return all results as JSON matching the Claw envelope contract.
`;
