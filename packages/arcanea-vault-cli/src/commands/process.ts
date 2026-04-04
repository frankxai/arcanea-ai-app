import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import {
  resolveVaultPath,
  readRegistry,
  writeRegistry,
  readVaultConfig,
  ensureDir,
  CLASSIFIED_FOLDERS,
} from '../utils/files.js';
import { parseFrontmatter, updateFrontmatter } from '../utils/frontmatter.js';
import { renameSync } from 'node:fs';

const PIPELINE_MAP: Record<string, string> = {
  articles: '/polish-content',
  research: '/arcanea-research',
  code: 'archive',
  creative: '/excellence-book-writing',
  images: '/arcanea-claw',
  videos: '/arcanea-claw',
  prompts: '/harvest',
  ideas: 'archive',
};

const DEST_MAP: Record<string, string> = {
  articles: 'blog-ready',
  research: 'blog-ready',
  code: 'blog-ready',
  creative: 'book-chapters',
  images: 'nft-candidates',
  videos: 'showcase-ready',
  prompts: 'blog-ready',
  ideas: 'blog-ready',
};

export function processCommand(options: { vaultPath?: string; type?: string; gradeMin?: string }): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const classifiedBase = join(vaultPath, 'classified');
  const processedBase = join(vaultPath, 'processed');
  const config = readVaultConfig(vaultPath);

  let totalProcessed = 0;
  const processed: Array<{ file: string; type: string; dest: string; skill: string }> = [];

  const foldersToProcess = options.type
    ? [options.type]
    : [...CLASSIFIED_FOLDERS];

  for (const folder of foldersToProcess) {
    const folderPath = join(classifiedBase, folder);
    let entries: string[];
    try {
      entries = readdirSync(folderPath);
    } catch {
      continue;
    }

    const skill = (config.pipeline[folder] as string) || PIPELINE_MAP[folder] || 'archive';
    const dest = DEST_MAP[folder] || 'blog-ready';

    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const filePath = join(folderPath, entry);
      const stat = statSync(filePath);
      if (!stat.isFile()) continue;

      const raw = readFileSync(filePath, 'utf-8');
      const { data } = parseFrontmatter(raw);

      // Optional grade filter
      if (options.gradeMin) {
        const gradeOrder = { A: 4, B: 3, C: 2, D: 1 };
        const itemGrade = gradeOrder[(data.grade as string) as keyof typeof gradeOrder] || 0;
        const minGrade = gradeOrder[options.gradeMin as keyof typeof gradeOrder] || 0;
        if (itemGrade < minGrade) continue;
      }

      // Update frontmatter with processing info
      const updated = updateFrontmatter(raw, {
        processedAt: new Date().toISOString(),
        pipelineSkill: skill,
        pipelineDestination: dest,
      });

      // Generate processing instruction alongside the file
      const instructionContent = [
        `# Processing Instruction`,
        ``,
        `- **Source File**: ${entry}`,
        `- **Type**: ${folder}`,
        `- **Grade**: ${data.grade || 'ungraded'}`,
        `- **Skill**: ${skill}`,
        `- **Title**: ${data.title || 'Untitled'}`,
        `- **Word Count**: ${data.wordCount || 'unknown'}`,
        ``,
        `## Action`,
        skill === 'archive'
          ? `Archive this item. No further processing needed.`
          : `Run \`${skill}\` on this content to prepare for publishing.`,
        ``,
        `## Content Preview`,
        ``,
        (raw.split('\n').slice(0, 20).join('\n')),
      ].join('\n');

      // Write to processed folder
      const destDir = join(processedBase, dest);
      ensureDir(destDir);

      writeFileSync(join(destDir, entry), updated, 'utf-8');
      writeFileSync(join(destDir, entry.replace('.md', '.instruction.md')), instructionContent, 'utf-8');

      // Remove from classified
      try {
        const { unlinkSync } = require('node:fs');
        unlinkSync(filePath);
      } catch {
        // Non-critical
      }

      processed.push({ file: entry, type: folder, dest, skill });
      totalProcessed++;
    }
  }

  // Update registry
  const registry = readRegistry(vaultPath);
  for (const p of processed) {
    const item = registry.items.find(i => basename(i.path) === p.file);
    if (item) {
      item.processedAt = new Date().toISOString();
      item.nextSkill = p.skill;
    }
  }
  registry.stats.totalProcessed += totalProcessed;
  writeRegistry(vaultPath, registry);

  console.log(`\nProcessed ${totalProcessed} items:\n`);
  for (const p of processed) {
    const skillLabel = p.skill === 'archive' ? '(archive)' : p.skill;
    console.log(`  ${p.type.padEnd(10)} -> ${p.dest.padEnd(16)} ${skillLabel.padEnd(25)} ${p.file}`);
  }

  if (totalProcessed === 0) {
    console.log('  No classified items to process.');
  }
}
