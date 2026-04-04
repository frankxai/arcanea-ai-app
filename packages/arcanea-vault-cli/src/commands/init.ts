import { join } from 'node:path';
import {
  ensureDir,
  resolveVaultPath,
  createEmptyRegistry,
  writeRegistry,
  getDefaultConfig,
  writeVaultConfig,
  fileExists,
  INBOX_FOLDERS,
  CLASSIFIED_FOLDERS,
  PROCESSED_FOLDERS,
  PUBLISHED_FOLDERS,
} from '../utils/files.js';

export function initVault(configPath?: string): string {
  const vaultPath = resolveVaultPath(configPath);

  if (fileExists(join(vaultPath, 'registry.json'))) {
    console.log(`Vault already initialized at ${vaultPath}`);
    return vaultPath;
  }

  console.log(`Initializing vault at ${vaultPath}...`);

  // Create inbox folders
  for (const folder of INBOX_FOLDERS) {
    ensureDir(join(vaultPath, 'inbox', folder));
  }

  // Create classified folders
  for (const folder of CLASSIFIED_FOLDERS) {
    ensureDir(join(vaultPath, 'classified', folder));
  }

  // Create processed folders
  for (const folder of PROCESSED_FOLDERS) {
    ensureDir(join(vaultPath, 'processed', folder));
  }

  // Create published folders
  for (const folder of PUBLISHED_FOLDERS) {
    ensureDir(join(vaultPath, 'published', folder));
  }

  // Write registry
  const registry = createEmptyRegistry();
  writeRegistry(vaultPath, registry);

  // Write config
  const config = getDefaultConfig(vaultPath);
  writeVaultConfig(vaultPath, config);

  console.log('Created directory structure:');
  console.log('  inbox/       (chatgpt, claude, perplexity, grok, gemini, tabs, misc)');
  console.log('  classified/  (articles, research, code, creative, images, videos, prompts, ideas)');
  console.log('  processed/   (blog-ready, social-ready, book-chapters, showcase-ready, nft-candidates)');
  console.log('  published/   (website, social, products)');
  console.log('  registry.json');
  console.log('  .vault-config.json');
  console.log(`\nVault ready at ${vaultPath}`);

  return vaultPath;
}
