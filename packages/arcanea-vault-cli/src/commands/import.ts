import { join, extname } from 'node:path';
import { statSync } from 'node:fs';
import { resolveVaultPath, readRegistry, writeRegistry, generateId, fileExists } from '../utils/files.js';
import { parseFrontmatter } from '../utils/frontmatter.js';
import { readFileSync } from 'node:fs';
import { importChatGPTFile } from '../parsers/chatgpt.js';
import { importClaudeFile } from '../parsers/claude.js';
import { importPerplexityFile } from '../parsers/perplexity.js';
import { importMarkdownFile } from '../parsers/markdown.js';
import { importBulk } from '../parsers/bulk.js';
import type { RegistryItem } from '../types/index.js';

interface ImportOptions {
  source?: string;
  vaultPath?: string;
}

export function importCommand(fileOrDir: string, options: ImportOptions): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const inboxPath = join(vaultPath, 'inbox');

  if (!fileExists(join(vaultPath, 'registry.json'))) {
    console.error('Vault not initialized. Run: arcanea-vault init');
    process.exit(1);
  }

  const stat = statSync(fileOrDir);
  let importedFiles: string[];

  if (stat.isDirectory() || fileOrDir.endsWith('.zip')) {
    const result = importBulk(fileOrDir, inboxPath);
    importedFiles = result.imported;
    if (result.errors.length > 0) {
      console.warn(`\nWarnings (${result.errors.length} errors):`);
      for (const err of result.errors) {
        console.warn(`  ${err.file}: ${err.error}`);
      }
    }
    console.log(`\nBulk import: ${result.imported.length}/${result.total} files imported`);
  } else {
    const ext = extname(fileOrDir).toLowerCase();
    const source = options.source || detectSource(fileOrDir, ext);

    switch (source) {
      case 'chatgpt':
        importedFiles = importChatGPTFile(fileOrDir, inboxPath);
        break;
      case 'claude':
        importedFiles = importClaudeFile(fileOrDir, inboxPath);
        break;
      case 'perplexity':
        importedFiles = importPerplexityFile(fileOrDir, inboxPath);
        break;
      default:
        importedFiles = importMarkdownFile(fileOrDir, inboxPath);
    }
  }

  // Update registry
  const registry = readRegistry(vaultPath);
  for (const filePath of importedFiles) {
    if (!filePath.endsWith('.md')) continue;

    const content = readFileSync(filePath, 'utf-8');
    const { data } = parseFrontmatter(content);
    const source = (data.source as string) || 'misc';

    const item: RegistryItem = {
      id: generateId(source),
      title: (data.title as string) || 'Untitled',
      source,
      importedAt: new Date().toISOString(),
      tags: (data.tags as string[]) || [],
      path: filePath,
      wordCount: (data.wordCount as number) || 0,
    };

    registry.items.push(item);
    registry.stats.totalImported++;
    registry.stats.byPlatform[source] = (registry.stats.byPlatform[source] || 0) + 1;
  }

  writeRegistry(vaultPath, registry);

  console.log(`Imported ${importedFiles.filter(f => f.endsWith('.md')).length} conversation(s) to vault`);
  for (const f of importedFiles) {
    console.log(`  + ${f}`);
  }
}

function detectSource(filePath: string, ext: string): string {
  const name = filePath.toLowerCase();
  if (ext === '.json' && (name.includes('conversations') || name.includes('chatgpt'))) return 'chatgpt';
  if (name.includes('claude')) return 'claude';
  if (name.includes('perplexity')) return 'perplexity';
  if (name.includes('grok')) return 'grok';
  if (name.includes('gemini')) return 'gemini';
  return 'misc';
}
