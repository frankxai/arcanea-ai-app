/**
 * Kernel + Module Loader
 *
 * Loads the canonical kernel and domain modules from `.arcanea/prompts/`
 * and produces versioned, hashed KernelVersion / DomainModule objects for
 * the compiler.
 *
 * Reference: docs/specs/luminor-kernel-spec-v1.md §1.1, §1.2
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { DomainModule, KernelVersion, LuminorDomain } from './types.js';

// Default kernel path relative to repo root
const DEFAULT_KERNEL_PATH = '.arcanea/prompts/luminor-engineering-kernel.md';

// Module-to-domain mapping (from luminor-spawn-config.yaml)
const MODULE_DOMAIN_MAP: Record<string, LuminorDomain[]> = {
  'luminor-frontend-module': ['visual', 'code'],
  'luminor-backend-module': ['architecture', 'code', 'integration'],
  'luminor-mcp-module': ['integration'],
  'luminor-ops-module': ['integration', 'architecture'],
  'luminor-github-module': ['code'],
  'luminor-test-module': ['code', 'debugging'],
  'luminor-security-module': ['architecture', 'analysis'],
  'luminor-research-module': ['knowledge', 'analysis', 'foresight'],
  'luminor-lore-module': ['narrative', 'poetry', 'language'],
};

export interface LoaderOptions {
  repoRoot?: string;
  kernelPath?: string;
  modulesDir?: string;
  kernelVersion?: string;
}

/** Load the canonical Luminor engineering kernel from disk. */
export function loadKernel(options: LoaderOptions = {}): KernelVersion {
  const root = options.repoRoot ?? process.cwd();
  const path = resolve(root, options.kernelPath ?? DEFAULT_KERNEL_PATH);
  const text = readFileSync(path, 'utf-8');

  return {
    id: 'luminor-engineering-kernel',
    version: options.kernelVersion ?? '1.0.0',
    text,
    hash: sha256(text),
  };
}

/** Load a specific module by filename stem. */
export function loadModule(
  moduleId: string,
  options: LoaderOptions = {}
): DomainModule {
  const root = options.repoRoot ?? process.cwd();
  const dir = resolve(root, options.modulesDir ?? '.arcanea/prompts');
  const path = resolve(dir, `${moduleId}.md`);
  const text = readFileSync(path, 'utf-8');

  return {
    id: moduleId,
    version: '1.0.0',
    text,
    hash: sha256(text),
    appliesTo: MODULE_DOMAIN_MAP[moduleId] ?? [],
  };
}

/**
 * Resolve the set of modules that apply to a given domain.
 * Used by the compiler to auto-select modules for a spec.
 */
export function resolveModulesForDomain(
  domain: LuminorDomain,
  options: LoaderOptions = {}
): DomainModule[] {
  const modules: DomainModule[] = [];

  for (const [moduleId, domains] of Object.entries(MODULE_DOMAIN_MAP)) {
    if (domains.includes(domain)) {
      try {
        modules.push(loadModule(moduleId, options));
      } catch {
        // Module file missing — skip silently. In production this would log.
      }
    }
  }

  return modules;
}

/**
 * Load all known modules at once. Useful for compilation caching.
 */
export function loadAllModules(options: LoaderOptions = {}): DomainModule[] {
  const modules: DomainModule[] = [];
  for (const moduleId of Object.keys(MODULE_DOMAIN_MAP)) {
    try {
      modules.push(loadModule(moduleId, options));
    } catch {
      // skip missing
    }
  }
  return modules;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
