import { join } from 'node:path';
import { resolveVaultPath, readVaultConfig } from '../utils/files.js';
import { importMarkdownFile } from '../parsers/markdown.js';
import { classifyCommand } from './classify.js';

interface WatchOptions {
  vaultPath?: string;
}

export async function watchCommand(options: WatchOptions): Promise<void> {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const config = readVaultConfig(vaultPath);
  const inboxPath = join(vaultPath, 'inbox');

  console.log(`Watching ${inboxPath} for new files...`);
  console.log(`  Auto-classify: ${config.autoClassify ? 'ON' : 'OFF'}`);
  console.log(`  Auto-process:  ${config.autoProcess ? 'ON' : 'OFF'}`);
  console.log(`  Interval:      ${config.watchInterval}ms`);
  console.log('\nPress Ctrl+C to stop.\n');

  // Dynamic import for chokidar (ESM)
  const chokidar = await import('chokidar');

  const watcher = chokidar.watch(inboxPath, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 200,
    },
  });

  watcher.on('add', (filePath: string) => {
    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`[${timestamp}] New file: ${filePath}`);

    try {
      // Auto-import if it's a raw file dropped in
      if (filePath.endsWith('.md') || filePath.endsWith('.json') || filePath.endsWith('.txt')) {
        console.log(`[${timestamp}] Importing...`);

        if (config.autoClassify) {
          console.log(`[${timestamp}] Running classifier...`);
          classifyCommand({ vaultPath });
        }

        console.log(`[${timestamp}] Done.`);
      }
    } catch (err) {
      console.error(`[${timestamp}] Error processing ${filePath}:`, err);
    }
  });

  watcher.on('error', (error: unknown) => {
    console.error('Watcher error:', error);
  });

  // Keep process alive
  await new Promise<void>(() => {
    // Never resolves — keeps watching until Ctrl+C
  });
}
