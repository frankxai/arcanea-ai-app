import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  resolveVaultPath,
  readRegistry,
  INBOX_FOLDERS,
  CLASSIFIED_FOLDERS,
  PROCESSED_FOLDERS,
  PUBLISHED_FOLDERS,
} from '../utils/files.js';

function countFilesInDir(dir: string): number {
  try {
    return readdirSync(dir).filter(f => f.endsWith('.md') && !f.endsWith('.instruction.md')).length;
  } catch {
    return 0;
  }
}

function countStage(basePath: string, folders: readonly string[]): number {
  let total = 0;
  for (const folder of folders) {
    total += countFilesInDir(join(basePath, folder));
  }
  return total;
}

export function statsCommand(options: { vaultPath?: string }): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const registry = readRegistry(vaultPath);

  const inboxCount = countStage(join(vaultPath, 'inbox'), INBOX_FOLDERS);
  const classifiedCount = countStage(join(vaultPath, 'classified'), CLASSIFIED_FOLDERS);
  const processedCount = countStage(join(vaultPath, 'processed'), PROCESSED_FOLDERS);
  const publishedCount = countStage(join(vaultPath, 'published'), PUBLISHED_FOLDERS);
  const totalItems = inboxCount + classifiedCount + processedCount + publishedCount;

  console.log(`
Arcanea Vault Statistics
========================
Total Items: ${totalItems}
  Inbox:      ${inboxCount}
  Classified: ${classifiedCount}
  Processed:  ${processedCount}
  Published:  ${publishedCount}
`);

  // Platform breakdown
  const platforms = registry.stats.byPlatform;
  if (Object.keys(platforms).length > 0) {
    console.log('By Platform:');
    const totalPlatform = Object.values(platforms).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(platforms).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sorted) {
      const pct = totalPlatform > 0 ? Math.round((count / totalPlatform) * 100) : 0;
      console.log(`  ${name.padEnd(14)} ${String(count).padStart(4)} (${pct}%)`);
    }
    console.log();
  }

  // Type breakdown
  const types = registry.stats.byType;
  if (Object.keys(types).length > 0) {
    console.log('By Type:');
    const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sorted) {
      console.log(`  ${name.padEnd(14)} ${count}`);
    }
    console.log();
  }

  // Grade breakdown
  const grades = registry.stats.byGrade;
  if (Object.keys(grades).length > 0) {
    console.log('By Grade:');
    const totalGrade = Object.values(grades).reduce((a, b) => a + b, 0);
    for (const grade of ['A', 'B', 'C', 'D']) {
      const count = grades[grade] || 0;
      const pct = totalGrade > 0 ? Math.round((count / totalGrade) * 100) : 0;
      console.log(`  ${grade}:  ${String(count).padStart(4)} (${pct}%)`);
    }
    console.log();
  }

  // Registry totals
  console.log('Registry Totals:');
  console.log(`  Imported:   ${registry.stats.totalImported}`);
  console.log(`  Classified: ${registry.stats.totalClassified}`);
  console.log(`  Processed:  ${registry.stats.totalProcessed}`);
  console.log(`  Published:  ${registry.stats.totalPublished}`);
}
