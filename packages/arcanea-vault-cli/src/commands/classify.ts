import { readdirSync, readFileSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { join, basename } from 'node:path';
import {
  resolveVaultPath,
  readRegistry,
  writeRegistry,
  ensureDir,
  countWords,
  INBOX_FOLDERS,
} from '../utils/files.js';
import { parseFrontmatter, updateFrontmatter } from '../utils/frontmatter.js';
import { writeFileSync } from 'node:fs';
import type { ClassificationResult, ClassificationType, QualityGrade } from '../types/index.js';

const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
const CITATION_REGEX = /\[\d+\]|\[source\]|https?:\/\/[^\s)]+/gi;
const IMAGE_REGEX = /!\[.*?\]\(.*?\)|dall-e|image.*prompt|generate.*image/gi;
const PROMPT_PATTERNS = /system\s*prompt|you\s+are\s+a|act\s+as|instructions?:|role:|persona:/gi;
const NARRATIVE_MARKERS = /chapter|scene|character|dialogue|story|narrative|once upon|in the beginning/gi;

function classifyContent(content: string, frontmatter: Record<string, unknown>): ClassificationResult {
  const body = content;
  const wordCount = countWords(body);
  const codeBlocks = body.match(CODE_BLOCK_REGEX) || [];
  const citations = body.match(CITATION_REGEX) || [];
  const imageRefs = body.match(IMAGE_REGEX) || [];
  const promptPatterns = body.match(PROMPT_PATTERNS) || [];
  const narrativeMarkers = body.match(NARRATIVE_MARKERS) || [];

  let type: ClassificationType = 'research';
  let confidence = 0.5;
  let theme = 'general';
  const tags: string[] = [];

  // Rule-based classification
  if (codeBlocks.length >= 3) {
    type = 'code';
    confidence = 0.85;
    theme = 'programming';
    tags.push('code');
  } else if (citations.length >= 3) {
    type = 'research';
    confidence = 0.8;
    theme = 'research';
    tags.push('sourced');
  } else if (imageRefs.length >= 2) {
    type = 'image';
    confidence = 0.8;
    theme = 'visual';
    tags.push('images');
  } else if (promptPatterns.length >= 2) {
    type = 'prompt';
    confidence = 0.75;
    theme = 'prompt-engineering';
    tags.push('prompts');
  } else if (wordCount > 2000 && narrativeMarkers.length >= 3) {
    type = 'creative';
    confidence = 0.7;
    theme = 'creative-writing';
    tags.push('narrative');
  } else if (wordCount > 2000) {
    type = 'article';
    confidence = 0.65;
    theme = 'long-form';
    tags.push('article');
  } else if (wordCount < 500) {
    type = 'idea';
    confidence = 0.6;
    theme = 'seed';
    tags.push('brief');
  }

  // Quality grading
  let qualityGrade: QualityGrade;
  const hasSections = /^#{1,3}\s/m.test(body);
  const sectionCount = (body.match(/^#{1,3}\s/gm) || []).length;

  if (wordCount >= 2000 && hasSections && sectionCount >= 3) {
    qualityGrade = 'A';
  } else if (wordCount >= 1000 && (hasSections || sectionCount >= 1)) {
    qualityGrade = 'B';
  } else if (wordCount >= 500) {
    qualityGrade = 'C';
  } else {
    qualityGrade = 'D';
  }

  // Determine pipeline skill
  const PIPELINE_MAP: Record<string, string | null> = {
    article: '/polish-content',
    research: '/arcanea-research',
    code: null,
    creative: '/excellence-book-writing',
    image: '/arcanea-claw',
    video: '/arcanea-claw',
    prompt: '/harvest',
    idea: null,
  };

  const nextSkill = PIPELINE_MAP[type] ?? null;

  // Destination mapping
  const DEST_MAP: Record<string, string> = {
    article: 'blog-ready',
    research: 'blog-ready',
    code: 'blog-ready',
    creative: 'book-chapters',
    image: 'nft-candidates',
    video: 'showcase-ready',
    prompt: 'blog-ready',
    idea: 'blog-ready',
  };

  // Extract theme from existing tags or title
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    tags.push(...(frontmatter.tags as string[]));
  }

  const suggestedTitle = (frontmatter.title as string) || 'Untitled';

  return {
    type,
    theme,
    qualityGrade,
    tags: [...new Set(tags)],
    suggestedTitle,
    nextSkill,
    destination: DEST_MAP[type] || null,
    confidence,
  };
}

export function classifyCommand(options: { vaultPath?: string }): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const inboxBase = join(vaultPath, 'inbox');
  const classifiedBase = join(vaultPath, 'classified');

  let totalClassified = 0;
  const results: Array<{ file: string; type: ClassificationType; grade: QualityGrade }> = [];

  for (const folder of INBOX_FOLDERS) {
    const folderPath = join(inboxBase, folder);
    let entries: string[];
    try {
      entries = readdirSync(folderPath);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const filePath = join(folderPath, entry);
      const stat = statSync(filePath);
      if (!stat.isFile()) continue;

      const raw = readFileSync(filePath, 'utf-8');
      const { data, body } = parseFrontmatter(raw);

      const classification = classifyContent(body, data);

      // Update frontmatter
      const updated = updateFrontmatter(raw, {
        type: classification.type,
        grade: classification.qualityGrade,
        tags: classification.tags,
        theme: classification.theme,
        nextSkill: classification.nextSkill,
        confidence: classification.confidence,
        classifiedAt: new Date().toISOString(),
      });

      // Move to classified folder
      const TYPE_TO_FOLDER: Record<string, string> = {
        article: 'articles', research: 'research', code: 'code',
        creative: 'creative', image: 'images', video: 'videos',
        prompt: 'prompts', idea: 'ideas',
      };
      const destFolder = join(classifiedBase, TYPE_TO_FOLDER[classification.type] || classification.type);
      ensureDir(destFolder);

      const destPath = join(destFolder, entry);
      writeFileSync(destPath, updated, 'utf-8');

      // Remove original from inbox
      try {
        unlinkSync(filePath);
      } catch {
        // Original stays if delete fails — not critical
      }

      results.push({
        file: entry,
        type: classification.type,
        grade: classification.qualityGrade,
      });
      totalClassified++;
    }
  }

  // Update registry
  const registry = readRegistry(vaultPath);
  for (const r of results) {
    const item = registry.items.find(i => basename(i.path) === r.file);
    if (item) {
      item.type = r.type;
      item.grade = r.grade;
      item.classifiedAt = new Date().toISOString();
    }
    registry.stats.byType[r.type] = (registry.stats.byType[r.type] || 0) + 1;
    registry.stats.byGrade[r.grade] = (registry.stats.byGrade[r.grade] || 0) + 1;
  }
  registry.stats.totalClassified += totalClassified;
  writeRegistry(vaultPath, registry);

  console.log(`\nClassified ${totalClassified} items:\n`);
  for (const r of results) {
    console.log(`  [${r.grade}] ${r.type.padEnd(10)} ${r.file}`);
  }

  if (totalClassified === 0) {
    console.log('  No items in inbox to classify.');
  }
}
