import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  resolveVaultPath,
  readRegistry,
  readVaultConfig,
  ensureDir,
  INBOX_FOLDERS,
  CLASSIFIED_FOLDERS,
} from '../utils/files.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

interface DigestOptions {
  vaultPath?: string;
  date?: string;
}

export function digestCommand(options: DigestOptions): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const registry = readRegistry(vaultPath);
  const config = readVaultConfig(vaultPath);
  const targetDate = options.date || new Date().toISOString().slice(0, 10);

  // Gather today's imports from registry
  const todayItems = registry.items.filter(item => {
    return item.importedAt?.startsWith(targetDate);
  });

  // Count by platform and type
  const byPlatform: Record<string, { total: number; byType: Record<string, number> }> = {};
  for (const item of todayItems) {
    if (!byPlatform[item.source]) {
      byPlatform[item.source] = { total: 0, byType: {} };
    }
    byPlatform[item.source].total++;
    const t = item.type || 'unclassified';
    byPlatform[item.source].byType[t] = (byPlatform[item.source].byType[t] || 0) + 1;
  }

  // Find grade A items
  const highlights = todayItems
    .filter(i => i.grade === 'A')
    .sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));

  // Count items ready for processing in classified/
  const readyForProcessing: Record<string, { count: number; skill: string }> = {};
  for (const folder of CLASSIFIED_FOLDERS) {
    const folderPath = join(vaultPath, 'classified', folder);
    try {
      const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));
      if (files.length > 0) {
        const skill = (config.pipeline[folder] as string) || 'archive';
        readyForProcessing[folder] = { count: files.length, skill };
      }
    } catch {
      continue;
    }
  }

  // Count pending inbox items
  let pendingClassification = 0;
  for (const folder of INBOX_FOLDERS) {
    const folderPath = join(vaultPath, 'inbox', folder);
    try {
      pendingClassification += readdirSync(folderPath).filter(f => f.endsWith('.md')).length;
    } catch {
      continue;
    }
  }

  // Generate digest
  const lines: string[] = [
    `# Vault Digest -- ${targetDate}`,
    '',
  ];

  // Today's imports
  lines.push(`## Today's Imports: ${todayItems.length} items`);
  for (const [platform, data] of Object.entries(byPlatform)) {
    const typeBreakdown = Object.entries(data.byType)
      .map(([t, c]) => `${c} ${t}`)
      .join(', ');
    lines.push(`- ${data.total} from ${platform} (${typeBreakdown})`);
  }
  if (todayItems.length === 0) {
    lines.push('- No imports today');
  }
  lines.push('');

  // Highlights
  lines.push(`## Highlights (Grade A)`);
  if (highlights.length > 0) {
    for (let i = 0; i < highlights.length; i++) {
      const h = highlights[i];
      lines.push(`${i + 1}. "${h.title}" -- ${h.type || 'unclassified'}, ${h.wordCount || '?'} words`);
    }
  } else {
    lines.push('- No A-grade items today');
  }
  lines.push('');

  // Ready for processing
  lines.push(`## Ready for Processing`);
  if (Object.keys(readyForProcessing).length > 0) {
    for (const [type, data] of Object.entries(readyForProcessing)) {
      lines.push(`- ${data.count} ${type} -> ${data.skill}`);
    }
  } else {
    lines.push('- Nothing pending');
  }
  lines.push('');

  // Action items
  lines.push(`## Action Items`);
  if (pendingClassification > 0) {
    lines.push(`- Review ${pendingClassification} inbox items pending classification`);
  }
  const aGradeArticles = todayItems.filter(i => i.grade === 'A' && (i.type === 'article' || i.type === 'research'));
  if (aGradeArticles.length > 0) {
    lines.push(`- Process ${aGradeArticles.length} A-grade articles for blog`);
  }
  if (pendingClassification === 0 && aGradeArticles.length === 0) {
    lines.push('- All caught up!');
  }

  const digest = lines.join('\n');

  // Output to console
  console.log(digest);

  // Also save to vault
  const digestDir = join(vaultPath, 'processed', 'blog-ready');
  ensureDir(digestDir);
  const digestPath = join(digestDir, `digest-${targetDate}.md`);
  writeFileSync(digestPath, digest, 'utf-8');
  console.log(`\nSaved to ${digestPath}`);
}
