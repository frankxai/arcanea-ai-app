import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { homedir } from 'node:os';
import type { Registry, VaultConfig } from '../types/index.js';

export function resolveVaultPath(configPath?: string): string {
  if (configPath) {
    return resolve(configPath.replace(/^~/, homedir()));
  }
  return join(homedir(), 'arcanea-vault');
}

export function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'untitled';
}

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function readRegistry(vaultPath: string): Registry {
  const registryPath = join(vaultPath, 'registry.json');
  if (!existsSync(registryPath)) {
    return createEmptyRegistry();
  }
  const raw = readFileSync(registryPath, 'utf-8');
  return JSON.parse(raw) as Registry;
}

export function writeRegistry(vaultPath: string, registry: Registry): void {
  const registryPath = join(vaultPath, 'registry.json');
  writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
}

export function readVaultConfig(vaultPath: string): VaultConfig {
  const configPath = join(vaultPath, '.vault-config.json');
  if (!existsSync(configPath)) {
    return getDefaultConfig(vaultPath);
  }
  const raw = readFileSync(configPath, 'utf-8');
  return JSON.parse(raw) as VaultConfig;
}

export function writeVaultConfig(vaultPath: string, config: VaultConfig): void {
  const configPath = join(vaultPath, '.vault-config.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export function generateId(platform: string): string {
  const ts = Date.now().toString(36);
  const rand = randomBytes(4).toString('hex');
  return `${platform}-${ts}-${rand}`;
}

export function createEmptyRegistry(): Registry {
  return {
    version: '1.0.0',
    created: new Date().toISOString(),
    items: [],
    stats: {
      totalImported: 0,
      totalClassified: 0,
      totalProcessed: 0,
      totalPublished: 0,
      byPlatform: {},
      byType: {},
      byGrade: {},
    },
  };
}

export function getDefaultConfig(vaultPath: string): VaultConfig {
  return {
    vaultPath,
    autoClassify: true,
    autoProcess: false,
    watchInterval: 5000,
    defaultExportFormat: 'markdown',
    pipeline: {
      articles: '/polish-content',
      research: '/arcanea-research',
      code: 'archive',
      creative: '/excellence-book-writing',
      images: '/arcanea-claw',
      videos: '/arcanea-claw',
      prompts: '/harvest',
      ideas: 'archive',
    },
  };
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function readTextFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

export function writeTextFile(path: string, content: string): void {
  writeFileSync(path, content, 'utf-8');
}

export const INBOX_FOLDERS = ['chatgpt', 'claude', 'perplexity', 'grok', 'gemini', 'tabs', 'misc'] as const;
export const CLASSIFIED_FOLDERS = ['articles', 'research', 'code', 'creative', 'images', 'videos', 'prompts', 'ideas'] as const;
export const PROCESSED_FOLDERS = ['blog-ready', 'social-ready', 'book-chapters', 'showcase-ready', 'nft-candidates'] as const;
export const PUBLISHED_FOLDERS = ['website', 'social', 'products'] as const;
