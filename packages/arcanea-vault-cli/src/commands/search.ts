import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { resolveVaultPath } from '../utils/files.js';
import { parseFrontmatter } from '../utils/frontmatter.js';
import type { SearchResult, QualityGrade, ClassificationType } from '../types/index.js';

interface SearchOptions {
  vaultPath?: string;
  source?: string;
  grade?: string;
  type?: string;
  limit?: string;
}

function walkMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(current: string): void {
    let entries: string[];
    try {
      entries = readdirSync(current);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(current, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (entry.endsWith('.md') && !entry.endsWith('.instruction.md')) {
          files.push(fullPath);
        }
      } catch {
        continue;
      }
    }
  }

  walk(dir);
  return files;
}

function scoreMatch(query: string, content: string, title: string): number {
  const queryLower = query.toLowerCase();
  const terms = queryLower.split(/\s+/);
  let score = 0;

  // Title matches are worth more
  const titleLower = title.toLowerCase();
  for (const term of terms) {
    if (titleLower.includes(term)) score += 10;
  }

  // Content matches
  const contentLower = content.toLowerCase();
  for (const term of terms) {
    const matches = contentLower.split(term).length - 1;
    score += Math.min(matches, 10); // Cap at 10 per term
  }

  return score;
}

function extractSnippet(content: string, query: string, contextChars: number = 150): string {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  const idx = contentLower.indexOf(queryLower);

  if (idx === -1) {
    // Return first N chars
    return content.slice(0, contextChars * 2).replace(/\n/g, ' ').trim() + '...';
  }

  const start = Math.max(0, idx - contextChars);
  const end = Math.min(content.length, idx + query.length + contextChars);
  const snippet = content.slice(start, end).replace(/\n/g, ' ').trim();

  return (start > 0 ? '...' : '') + snippet + (end < content.length ? '...' : '');
}

export function searchCommand(query: string, options: SearchOptions): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const allFiles = walkMarkdownFiles(vaultPath);
  const limit = parseInt(options.limit || '20', 10);

  const results: SearchResult[] = [];

  for (const filePath of allFiles) {
    const raw = readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(raw);

    // Apply filters
    if (options.source && data.source !== options.source) continue;
    if (options.grade && data.grade !== options.grade) continue;
    if (options.type && data.type !== options.type) continue;

    const title = (data.title as string) || 'Untitled';
    const score = scoreMatch(query, body, title);

    if (score > 0) {
      results.push({
        path: filePath,
        title,
        source: (data.source as string) || 'unknown',
        grade: data.grade as QualityGrade | undefined,
        type: data.type as ClassificationType | undefined,
        snippet: extractSnippet(body, query),
        score,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, limit);

  console.log(`\nSearch: "${query}" — ${results.length} results\n`);

  if (top.length === 0) {
    console.log('  No matches found.');
    return;
  }

  for (const r of top) {
    const gradeLabel = r.grade ? `[${r.grade}]` : '   ';
    const typeLabel = r.type ? r.type.padEnd(10) : '          ';
    console.log(`  ${gradeLabel} ${typeLabel} ${r.source.padEnd(12)} ${r.title}`);
    console.log(`       ${r.snippet}`);
    console.log(`       ${r.path}`);
    console.log();
  }
}
