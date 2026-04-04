import matter from 'gray-matter';
import type { FrontmatterData } from '../types/index.js';

export function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const result = matter(content);
  return { data: result.data as Record<string, unknown>, body: result.content };
}

export function generateFrontmatter(data: FrontmatterData): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${item}`);
      }
    } else if (typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${String(value)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

export function updateFrontmatter(content: string, updates: Record<string, unknown>): string {
  const { data, body } = parseFrontmatter(content);
  const merged = { ...data, ...updates } as FrontmatterData;
  return generateFrontmatter(merged) + '\n' + body;
}
