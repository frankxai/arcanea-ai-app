/**
 * Research Hub — Content Loader
 *
 * Reads markdown files from docs/research/ subdirectories,
 * parses YAML frontmatter via gray-matter, and returns typed ResearchItems.
 */

import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import grayMatter from 'gray-matter';
import type { ResearchItem, ResearchCategory } from './types';
import { CATEGORY_META } from './types';

const RESEARCH_DIR = join(process.cwd(), '..', '..', 'docs', 'research');

/** Subdirectories that contain research content (not templates) */
const CONTENT_DIRS = ['papers', 'github', 'benchmarks', 'synthesis', 'books'];

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return [val];
  return [];
}

function parseItem(source: string, category: string, filename: string): ResearchItem | null {
  const { data, content } = grayMatter(source);
  if (!data.title) return null;

  const slug = filename.replace(/\.md$/, '');

  return {
    slug,
    category,
    title: data.title ?? slug,
    date: data.date ? String(data.date) : '',
    type: data.type ?? 'paper',
    domain: toArray(data.domain),
    gateConnections: toArray(data.gate_connections),
    guardianConnections: toArray(data.guardian_connections),
    relevanceScore: Number(data.relevance_score) || 0,
    confidence: data.confidence ?? 'medium',
    sourceUrl: data.source_url ?? '',
    author: data.author ?? '',
    content,
  };
}

async function dirExists(dirPath: string): Promise<boolean> {
  try {
    await access(dirPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all research items, optionally filtered by category.
 * Excludes README.md files.
 */
export async function getResearchItems(category?: string): Promise<ResearchItem[]> {
  const dirs = category ? [category] : CONTENT_DIRS;
  const items: ResearchItem[] = [];

  for (const dir of dirs) {
    const dirPath = join(RESEARCH_DIR, dir);
    if (!(await dirExists(dirPath))) continue;

    const files = await readdir(dirPath);
    const mdFiles = files.filter(
      (f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md'
    );

    for (const file of mdFiles) {
      const raw = await readFile(join(dirPath, file), 'utf-8');
      const item = parseItem(raw, dir, file);
      if (item) items.push(item);
    }
  }

  // Sort by date descending, then relevance score
  return items.sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    if (dateDiff !== 0) return dateDiff;
    return b.relevanceScore - a.relevanceScore;
  });
}

/**
 * Get a single research item by category and slug.
 */
export async function getResearchItem(
  category: string,
  slug: string
): Promise<ResearchItem | null> {
  const filePath = join(RESEARCH_DIR, category, `${slug}.md`);
  try {
    const raw = await readFile(filePath, 'utf-8');
    return parseItem(raw, category, `${slug}.md`);
  } catch {
    return null;
  }
}

/**
 * Get category list with item counts.
 */
export async function getResearchCategories(): Promise<ResearchCategory[]> {
  const categories: ResearchCategory[] = [];

  for (const dir of CONTENT_DIRS) {
    const dirPath = join(RESEARCH_DIR, dir);
    if (!(await dirExists(dirPath))) {
      categories.push({
        name: CATEGORY_META[dir]?.label ?? dir,
        slug: dir,
        count: 0,
        description: CATEGORY_META[dir]?.description ?? '',
      });
      continue;
    }

    const files = await readdir(dirPath);
    const count = files.filter(
      (f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md'
    ).length;

    categories.push({
      name: CATEGORY_META[dir]?.label ?? dir,
      slug: dir,
      count,
      description: CATEGORY_META[dir]?.description ?? '',
    });
  }

  return categories;
}
