import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parse } from 'yaml';

// Locate models.yaml relative to this file so it works both from source
// (src/index.ts) and from a built dist/ folder.
const here = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = resolve(here, '..', 'models.yaml');

export type Tier = 'free' | 'sub' | 'byok' | 'premium';
export type AuthContext = Tier | 'display-only';

export interface ModelPricing {
  input: number;
  output: number;
}

export interface Model {
  provider: string;
  family: string;
  upstream?: string;
  context: number;
  sweBench?: number;
  tier: Tier;
  byokPrice?: ModelPricing;
  strengths: string[];
  aliases?: string[];
  deprecated?: string;
  notes?: string;
}

export interface Task {
  description: string;
  primary: string[];
  fallback?: string[];
  contextMin?: number;
  rationale: string;
}

export interface Surface {
  description: string;
  prefer: string;
  authContext: AuthContext[];
  taskOverrides?: Record<string, string[]>;
}

export interface Delegation {
  binary: string;
  port?: number;
  useFor: string[];
  rationale: string;
}

export interface RouterSpec {
  version: string;
  lastUpdated: string;
  maintainer: string;
  models: Record<string, Model>;
  tasks: Record<string, Task>;
  surfaces: Record<string, Surface>;
  delegation: Record<string, Delegation>;
}

let cached: RouterSpec | null = null;

export function loadSpec(): RouterSpec {
  if (cached) return cached;
  const raw = readFileSync(SPEC_PATH, 'utf8');
  cached = parse(raw) as RouterSpec;
  return cached;
}

/**
 * Resolve a task-class to an ordered list of model candidates for a given surface.
 *
 * The first candidate available under the surface's authContext wins.
 */
export function resolveTask(
  taskId: string,
  surfaceId: string,
  spec: RouterSpec = loadSpec(),
): string[] {
  const surface = spec.surfaces[surfaceId];
  if (!surface) throw new Error(`Unknown surface: ${surfaceId}`);

  const override = surface.taskOverrides?.[taskId];
  if (override) return override;

  const task = spec.tasks[taskId];
  if (!task) throw new Error(`Unknown task: ${taskId}`);

  const candidates = [...task.primary, ...(task.fallback ?? [])];

  return candidates.filter((modelId) => {
    const model = spec.models[modelId];
    if (!model) return false;
    return surface.authContext.length === 0 || surface.authContext.includes(model.tier);
  });
}

/**
 * Find the first model in a candidate list that is not deprecated and exists.
 */
export function pickModel(candidates: string[], spec: RouterSpec = loadSpec()): string | null {
  for (const id of candidates) {
    const model = spec.models[id];
    if (model && !model.deprecated) return id;
  }
  return candidates[0] ?? null;
}
