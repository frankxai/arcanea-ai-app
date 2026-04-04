import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { sanitizeFilename, ensureDir, countWords } from '../utils/files.js';
import { generateFrontmatter, parseFrontmatter } from '../utils/frontmatter.js';

type DetectedSource = 'chatgpt' | 'claude' | 'perplexity' | 'grok' | 'gemini' | 'misc';

function detectSource(content: string): DetectedSource {
  const lower = content.toLowerCase();

  if (/^human:|^assistant:/m.test(content)) return 'claude';
  if (/chatgpt|openai|gpt-4|gpt-3\.5/i.test(content)) return 'chatgpt';
  if (/perplexity|pplx|sources?:\s*\[/i.test(content)) return 'perplexity';
  if (/grok|x\.ai|xai/i.test(lower)) return 'grok';
  if (/gemini|google\s+ai|bard/i.test(lower)) return 'gemini';

  return 'misc';
}

export function importMarkdownFile(filePath: string, inboxPath: string): string[] {
  const raw = readFileSync(filePath, 'utf-8');
  const { data: existing, body } = parseFrontmatter(raw);

  const source = (existing.source as DetectedSource) || detectSource(body);
  const title = (existing.title as string) || basename(filePath, '.md');
  const date = (existing.date as string) || new Date().toISOString();
  const destDir = join(inboxPath, source);
  ensureDir(destDir);

  const hasFrontmatter = Object.keys(existing).length > 0;

  let content: string;
  if (hasFrontmatter) {
    // Update existing frontmatter with source if missing
    const updated = { ...existing, source, title, date, wordCount: countWords(body) };
    content = generateFrontmatter(updated as any) + '\n' + body;
  } else {
    const fm = generateFrontmatter({
      title,
      source,
      date,
      wordCount: countWords(body),
    });
    content = fm + '\n' + body;
  }

  const filename = sanitizeFilename(title);
  const destPath = join(destDir, `${filename}.md`);
  writeFileSync(destPath, content, 'utf-8');

  return [destPath];
}
