/**
 * @arcanea/flow — Luminor-powered agent orchestration
 *
 * Reads the Luminor Engineering Kernel + domain modules and constructs
 * agent prompts with maximum intelligence injected at spawn time.
 *
 * Usage:
 *   import { buildLuminorPrompt, getRecommendedModel } from '@arcanea/flow';
 *   const prompt = buildLuminorPrompt('coder', 'Build a React component');
 *   const model  = getRecommendedModel('coder'); // 'sonnet'
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import * as yaml from 'js-yaml';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpawnConfig {
  kernel: string;
  modules: Record<string, string | null>;
  model_routing: Record<string, string>;
}

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

export interface LuminorPromptResult {
  prompt: string;
  agentType: string;
  hasModule: boolean;
  model: ModelTier;
}

// ─── Path Resolution ──────────────────────────────────────────────────────────

/**
 * Walk up from the current working directory to find .arcanea/prompts/.
 * Works from any depth inside the monorepo.
 */
export function findPromptsDir(): string {
  let dir = process.cwd();
  for (let i = 0; i < 12; i++) {
    const candidate = join(dir, '.arcanea', 'prompts');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    'Cannot find .arcanea/prompts/ — run from inside the Arcanea monorepo'
  );
}

// ─── Config Loading ───────────────────────────────────────────────────────────

let _cachedConfig: SpawnConfig | null = null;

/**
 * Load and parse luminor-spawn-config.yaml.
 * Result is cached for the process lifetime.
 */
export function loadConfig(forceReload = false): SpawnConfig {
  if (_cachedConfig && !forceReload) return _cachedConfig;
  const promptsDir = findPromptsDir();
  const configPath = join(promptsDir, 'luminor-spawn-config.yaml');
  if (!existsSync(configPath)) {
    throw new Error(`Missing spawn config: ${configPath}`);
  }
  _cachedConfig = yaml.load(readFileSync(configPath, 'utf-8')) as SpawnConfig;
  return _cachedConfig;
}

// ─── Prompt Loaders ───────────────────────────────────────────────────────────

/**
 * Load the Luminor Engineering Kernel (the universal base prompt).
 */
export function loadKernel(): string {
  const promptsDir = findPromptsDir();
  const config = loadConfig();
  const kernelPath = join(promptsDir, config.kernel);
  if (!existsSync(kernelPath)) {
    throw new Error(`Missing kernel file: ${kernelPath}`);
  }
  return readFileSync(kernelPath, 'utf-8');
}

/**
 * Load the domain module for a given agent type.
 * Falls back to 'default' mapping if the exact type is not registered.
 * Returns null if no module is configured (kernel-only agent).
 */
export function loadModule(agentType: string): string | null {
  const promptsDir = findPromptsDir();
  const config = loadConfig();

  const moduleFile =
    agentType in config.modules
      ? config.modules[agentType]
      : config.modules['default'];

  if (!moduleFile) return null;

  const modulePath = join(promptsDir, moduleFile);
  if (!existsSync(modulePath)) {
    // Non-fatal: warn and continue with kernel only
    console.warn(`[arcanea-flow] Module file not found: ${modulePath}`);
    return null;
  }
  return readFileSync(modulePath, 'utf-8');
}

// ─── Model Routing ────────────────────────────────────────────────────────────

/** Internal map from agent type to routing role */
const AGENT_ROLE_MAP: Record<string, string> = {
  // Scout tier (haiku)
  researcher: 'scout',
  Explore: 'scout',
  'code-review-swarm': 'scout',

  // Worker tier (sonnet)
  coder: 'worker',
  frontend: 'worker',
  backend: 'worker',
  'backend-dev': 'worker',
  reviewer: 'worker',
  tester: 'worker',
  ops: 'worker',
  mcp: 'worker',
  'mcp-sdk-architect': 'worker',
  'mcp-transport-engineer': 'worker',
  'security-auditor': 'worker',
  'accessibility-auditor': 'worker',
  'pr-manager': 'worker',
  lore: 'worker',
  'Arcanea Lore Master': 'worker',
  'Arcanea World Expander': 'worker',
  'Arcanea Character Crafter': 'worker',
  'creative-master': 'worker',

  // Architect tier (opus)
  'system-architect': 'architect',
  planner: 'architect',
  'security-architect': 'architect',
};

/**
 * Get the recommended model tier for an agent type.
 * Uses the spawn config's model_routing table, with agent→role mapping.
 */
export function getRecommendedModel(agentType: string): ModelTier {
  const config = loadConfig();
  const role = AGENT_ROLE_MAP[agentType] ?? 'worker';
  const model = config.model_routing[role] ?? 'sonnet';
  return model as ModelTier;
}

// ─── Core API ─────────────────────────────────────────────────────────────────

/**
 * Build a complete Luminor-powered agent prompt.
 *
 * Formula: Kernel + (optional Domain Module) + Task Instructions
 *
 * @param agentType  - Agent role key matching luminor-spawn-config.yaml
 * @param taskInstructions - The actual work instructions for this agent
 * @returns Assembled prompt string ready to pass to any LLM
 *
 * @example
 * const prompt = buildLuminorPrompt('coder', 'Implement a JWT auth middleware');
 * // → [Luminor kernel] + [frontend module] + [task]
 */
export function buildLuminorPrompt(
  agentType: string,
  taskInstructions: string
): string {
  const kernel = loadKernel();
  const module = loadModule(agentType);

  const parts: string[] = [kernel];

  if (module) {
    parts.push('\n\n---\n');
    parts.push(module);
  }

  parts.push('\n\n---\n');
  parts.push(`## TASK\n\n${taskInstructions}`);

  return parts.join('\n');
}

/**
 * Build a Luminor prompt and return full metadata alongside it.
 * Useful when callers need to know which model to route to.
 */
export function buildLuminorSpawn(
  agentType: string,
  taskInstructions: string
): LuminorPromptResult {
  const module = loadModule(agentType);
  const prompt = buildLuminorPrompt(agentType, taskInstructions);
  const model = getRecommendedModel(agentType);

  return {
    prompt,
    agentType,
    hasModule: module !== null,
    model,
  };
}

/**
 * List all registered agent types from the spawn config.
 */
export function listAgentTypes(): string[] {
  const config = loadConfig();
  return Object.keys(config.modules).filter((k) => k !== 'default');
}
