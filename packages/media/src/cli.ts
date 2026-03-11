#!/usr/bin/env node
/**
 * @arcanea/media CLI
 *
 * arcanea-media scan   [root] [--manifest path]        Catalog all media
 * arcanea-media process [root] [--out path] [--approved] Convert + thumbnail
 * arcanea-media dedup  [--manifest path] [--apply]     Find + archive dupes
 * arcanea-media watch  [root] [--auto-process]         Daemon mode
 * arcanea-media stats  [--manifest path]               Show stats
 * arcanea-media export [--manifest path] [--out path]  Export approved files
 *
 * Guardian: Alera (Voice Gate, 528 Hz) — Expression, truth
 */

import { argv, exit } from 'node:process';
import { resolve } from 'node:path';
import { scanDirectory }    from './scanner.js';
import { processBatch, PROCESSING_COSTS } from './processor.js';
import { MediaCatalog }     from './catalog.js';
import { MediaWatcher }     from './watcher.js';

const args = argv.slice(2);
const cmd  = args[0];

function flag(name: string): string | null {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}
function has(name: string): boolean { return args.includes(name); }

function printStats(catalog: MediaCatalog): void {
  const s = catalog.stats;
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   ARCANEA MEDIA CATALOG              ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`  Total files : ${s.total_files}`);
  console.log(`  Total size  : ${s.total_size_mb} MB`);
  console.log(`  Duplicates  : ${s.duplicates}`);
  console.log(`  Generated   : ${s.generated.slice(0, 10)}`);
  console.log('\n  BY TYPE:');
  for (const [k, v] of Object.entries(s.by_type)) {
    console.log(`    ${k.padEnd(8)}: ${v}`);
  }
  console.log('\n  BY GUARDIAN:');
  for (const [k, v] of Object.entries(s.by_guardian)) {
    const bar = '#'.repeat(Math.min(v, 35));
    console.log(`    ${k.padEnd(14)} ${String(v).padStart(4)}  ${bar}`);
  }
  console.log('\n  BY SOURCE:');
  for (const [k, v] of Object.entries(s.by_source)) {
    console.log(`    ${k.padEnd(14)}: ${v}`);
  }
  console.log('╚══════════════════════════════════════╝\n');
}

async function main(): Promise<void> {
  switch (cmd) {

    case 'scan': {
      const root     = resolve(args[1] ?? '.');
      const manifest = flag('--manifest') ?? './arcanea-manifest.json';
      console.log(`\nScanning: ${root}`);
      const entries = await scanDirectory(root, p => {
        if (p.processed % 100 === 0) process.stdout.write(`\r  ${p.processed}/${p.found}...`);
      });
      const catalog = new MediaCatalog(manifest);
      catalog.fromScan(entries, root);
      catalog.save();
      console.log('\n');
      printStats(catalog);
      console.log(`Manifest: ${manifest}\n`);
      break;
    }

    case 'process': {
      const root       = resolve(args[1] ?? '.');
      const manifest   = flag('--manifest') ?? './arcanea-manifest.json';
      const outputDir  = flag('--out')      ?? './arcanea-processed';
      const approved   = has('--approved');
      const catalog    = new MediaCatalog(manifest);

      console.log(`\nProcessing${approved ? ' (approved only)' : ''}: ${root}`);
      console.log(`Output: ${outputDir}\n`);
      console.log('Costs: all local processing — $0');

      const results = await processBatch(
        catalog.all,
        { outputDir, approvedOnly: approved },
        (done, total, result) => {
          const name = result.entry.suggested_name.slice(0, 40).padEnd(40);
          const saved = result.savedBytes ? `(-${Math.round(result.savedBytes/1024)}KB)` : '';
          const status = result.success ? 'OK ' : 'ERR';
          process.stdout.write(`\r  [${status}] ${done}/${total}  ${name} ${saved}`);
        }
      );

      const ok  = results.filter(r => r.success).length;
      const err = results.filter(r => !r.success).length;
      const savedMB = Math.round(results.reduce((s, r) => s + (r.savedBytes ?? 0), 0) / 1_048_576);

      console.log(`\n\n  Done: ${ok} processed, ${err} errors, ${savedMB} MB saved\n`);

      // Update catalog with new paths
      for (const r of results) {
        if (r.success && r.entry) {
          catalog.updateFromProcessResult(r.entry.id, r.entry);
        }
      }
      catalog.save();
      break;
    }

    case 'dedup': {
      const manifest = flag('--manifest') ?? './arcanea-manifest.json';
      const apply    = has('--apply');
      const catalog  = new MediaCatalog(manifest);
      const dupes    = catalog.duplicates();

      console.log(`\nDuplicates found: ${dupes.length}`);
      dupes.slice(0, 10).forEach(e =>
        console.log(`  ${e.original_name.slice(0, 60).padEnd(60)} → dup of: ${e.duplicate_of?.slice(0, 8)}`)
      );
      if (dupes.length > 10) console.log(`  ... and ${dupes.length - 10} more`);

      if (apply) {
        const count = catalog.archiveAllDuplicates();
        catalog.save();
        console.log(`\nArchived ${count} duplicates in manifest.\n`);
      } else {
        console.log('\nRun with --apply to archive them in the manifest.\n');
      }
      break;
    }

    case 'watch': {
      const root       = resolve(args[1] ?? '.');
      const manifest   = flag('--manifest') ?? './arcanea-manifest.json';
      const autoProcess= has('--auto-process');
      const outputDir  = flag('--out') ?? './arcanea-processed';

      const watcher = new MediaWatcher({
        rootPath:      root,
        manifestPath:  manifest,
        autoProcess,
        processOptions: { outputDir },
        onEvent: e => {
          if (e.type === 'add')    console.log(`\n[+] ${e.entry.suggested_name}`);
          if (e.type === 'remove') console.log(`\n[-] ${e.path}`);
        },
      });

      await watcher.start();
      console.log(`\nWatching ${root}. Press Ctrl+C to stop.\n`);
      process.on('SIGINT', async () => { await watcher.stop(); exit(0); });
      break;
    }

    case 'stats': {
      const manifest = flag('--manifest') ?? './arcanea-manifest.json';
      const catalog  = new MediaCatalog(manifest);
      printStats(catalog);
      break;
    }

    case 'costs': {
      console.log('\n  PROCESSING COSTS (all local):');
      for (const [k, v] of Object.entries(PROCESSING_COSTS)) {
        console.log(`    ${k.padEnd(22)}: ${v}`);
      }
      console.log('');
      break;
    }

    case 'export': {
      const manifest = flag('--manifest') ?? './arcanea-manifest.json';
      const outFile  = flag('--out')      ?? './arcanea-export.json';
      const catalog  = new MediaCatalog(manifest);
      const approved = catalog.exportForSite();
      const { writeFileSync } = await import('node:fs');
      writeFileSync(outFile, JSON.stringify({ exported: new Date().toISOString(), media: approved }, null, 2));
      console.log(`\nExported ${approved.length} approved files → ${outFile}\n`);
      break;
    }

    default: {
      console.log(`
  @arcanea/media — Media Intelligence CLI

  Commands:
    scan   [root] [--manifest path]        Catalog all media files
    process [root] [--out dir] [--approved] Convert images to WebP + thumbnails
    dedup  [--manifest path] [--apply]     Find and archive duplicates
    watch  [root] [--auto-process]         Daemon: watch for new drops
    stats  [--manifest path]               Print catalog statistics
    costs                                   Print processing cost breakdown
    export [--manifest path] [--out file]  Export approved media list

  Examples:
    arcanea-media scan "G:/My Drive/Arcanea" --manifest ./manifest.json
    arcanea-media process "G:/My Drive/Arcanea" --out ./processed --approved
    arcanea-media dedup --apply
    arcanea-media watch "G:/My Drive/Arcanea" --auto-process
`);
    }
  }
}

main().catch(e => { console.error(e); exit(1); });
