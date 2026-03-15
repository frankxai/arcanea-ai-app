/**
 * @arcanea/media — Watcher Daemon
 * Watches a directory for new files and auto-processes them.
 * Guardian: Maylinn (Heart Gate, 417 Hz) — Healing, continuous care
 *
 * Usage:
 *   const w = new MediaWatcher({ rootPath: 'G:/My Drive/Arcanea', ... });
 *   await w.start();  // runs until w.stop()
 */

import { EventEmitter } from 'node:events';
import type { WatcherOptions, MediaEvent } from './types.js';
import { scanDirectory } from './scanner.js';
import { processEntry } from './processor.js';
import { MediaCatalog } from './catalog.js';

export class MediaWatcher extends EventEmitter {
  private watcher: unknown = null;
  private catalog: MediaCatalog;
  private opts: WatcherOptions;

  constructor(opts: WatcherOptions) {
    super();
    this.opts    = opts;
    this.catalog = new MediaCatalog(opts.manifestPath);
  }

  async start(): Promise<void> {
    // Dynamic import so chokidar is optional
    let chokidar: typeof import('chokidar');
    try {
      chokidar = await import('chokidar');
    } catch {
      throw new Error('chokidar not installed — run: npm install chokidar');
    }

    const IMAGE_VIDEO = /\.(png|jpg|jpeg|webp|gif|mp4|mov|webm|avi)$/i;

    this.watcher = chokidar.watch(this.opts.rootPath, {
      ignored:    /(^|[/\\])\../,  // skip hidden files
      persistent: true,
      awaitWriteFinish: { stabilityThreshold: 2000 },
    });

    (this.watcher as ReturnType<typeof chokidar.watch>)
      .on('add', async (filePath: string) => {
        if (!IMAGE_VIDEO.test(filePath)) return;
        await this.handleNew(filePath);
      })
      .on('unlink', (filePath: string) => {
        const entry = this.catalog.all.find(e => e.original_path === filePath);
        if (entry) {
          const event: MediaEvent = { type: 'remove', id: entry.id, path: filePath };
          this.emit('media', event);
          this.opts.onEvent?.(event);
        }
      });

    console.log(`[Arcanea Media] Watching: ${this.opts.rootPath}`);
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      await (this.watcher as { close(): Promise<void> }).close();
      this.watcher = null;
    }
  }

  private async handleNew(filePath: string): Promise<void> {
    // Avoid double-processing
    const existing = this.catalog.all.find(e => e.original_path === filePath);
    if (existing) return;

    try {
      // Re-scan just this file by scanning the whole dir (incremental)
      const all    = await scanDirectory(this.opts.rootPath);
      const entry  = all.find(e => e.original_path === filePath);
      if (!entry) return;

      this.catalog.fromScan(all, this.opts.rootPath);

      const event: MediaEvent = { type: 'add', entry };
      this.emit('media', event);
      this.opts.onEvent?.(event);

      if (this.opts.autoProcess && this.opts.processOptions?.outputDir) {
        const result = await processEntry(entry, this.opts.processOptions);
        if (result.success && result.entry) {
          this.catalog.updateFromProcessResult(entry.id, result.entry);
        }
      }

      this.catalog.save();
    } catch (e) {
      console.error('[Arcanea Media] Watcher error:', e);
    }
  }
}
