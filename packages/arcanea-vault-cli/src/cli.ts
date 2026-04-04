#!/usr/bin/env node

import { Command } from 'commander';
import { initVault } from './commands/init.js';
import { importCommand } from './commands/import.js';
import { classifyCommand } from './commands/classify.js';
import { processCommand } from './commands/process.js';
import { searchCommand } from './commands/search.js';
import { statsCommand } from './commands/stats.js';
import { watchCommand } from './commands/watch.js';
import { digestCommand } from './commands/digest.js';
import { exportCommand } from './commands/export.js';

const program = new Command();

program
  .name('arcanea-vault')
  .description('Local system of record for processing exported AI conversations')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize vault directory structure')
  .option('-p, --path <path>', 'Custom vault path (default: ~/arcanea-vault)')
  .action((opts) => {
    initVault(opts.path);
  });

program
  .command('import <file>')
  .description('Import exported conversations into the vault')
  .option('-s, --source <source>', 'Force source type (chatgpt, claude, perplexity, grok, gemini)')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .action((file, opts) => {
    importCommand(file, { source: opts.source, vaultPath: opts.vaultPath });
  });

program
  .command('classify')
  .description('Run classifier on all inbox items')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .action((opts) => {
    classifyCommand({ vaultPath: opts.vaultPath });
  });

program
  .command('process')
  .description('Process classified items through the pipeline')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .option('-t, --type <type>', 'Only process specific type')
  .option('-g, --grade-min <grade>', 'Minimum grade to process (A, B, C, D)')
  .action((opts) => {
    processCommand({
      vaultPath: opts.vaultPath,
      type: opts.type,
      gradeMin: opts.gradeMin,
    });
  });

program
  .command('search <query>')
  .description('Full-text search across vault')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .option('-s, --source <source>', 'Filter by source platform')
  .option('-g, --grade <grade>', 'Filter by grade (A, B, C, D)')
  .option('-t, --type <type>', 'Filter by content type')
  .option('-l, --limit <limit>', 'Max results (default: 20)')
  .action((query, opts) => {
    searchCommand(query, {
      vaultPath: opts.vaultPath,
      source: opts.source,
      grade: opts.grade,
      type: opts.type,
      limit: opts.limit,
    });
  });

program
  .command('stats')
  .description('Show vault statistics')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .action((opts) => {
    statsCommand({ vaultPath: opts.vaultPath });
  });

program
  .command('watch')
  .description('Watch inbox for new files and auto-process')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .action(async (opts) => {
    await watchCommand({ vaultPath: opts.vaultPath });
  });

program
  .command('digest')
  .description('Generate daily digest of imported content')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .option('-d, --date <date>', 'Target date (YYYY-MM-DD, default: today)')
  .action((opts) => {
    digestCommand({ vaultPath: opts.vaultPath, date: opts.date });
  });

program
  .command('export <id> <format>')
  .description('Export a vault item in specified format (markdown, json, html, text)')
  .option('-p, --vault-path <path>', 'Custom vault path')
  .option('-o, --output <path>', 'Output file path')
  .action((id, format, opts) => {
    exportCommand(id, format, { vaultPath: opts.vaultPath, output: opts.output });
  });

program.parse();
