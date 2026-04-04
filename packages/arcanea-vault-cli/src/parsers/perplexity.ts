import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { ParsedConversation } from '../types/index.js';
import { sanitizeFilename, ensureDir, countWords } from '../utils/files.js';
import { generateFrontmatter, parseFrontmatter } from '../utils/frontmatter.js';

interface Citation {
  url: string;
  title?: string;
  snippet?: string;
}

function extractCitations(content: string): Citation[] {
  const citations: Citation[] = [];
  // Match markdown links and numbered references
  const linkRegex = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content)) !== null) {
    citations.push({
      title: match[1] || undefined,
      url: match[2],
    });
  }

  // Match numbered source references [1], [2], etc.
  const refRegex = /\[(\d+)\]\s*(https?:\/\/[^\s]+)\s*(?:-\s*(.*))?/gm;
  while ((match = refRegex.exec(content)) !== null) {
    citations.push({
      url: match[2],
      snippet: match[3]?.trim(),
    });
  }

  return citations;
}

function extractQueries(content: string): string[] {
  const queries: string[] = [];
  // Look for lines starting with Q: or query patterns
  const queryRegex = /^(?:Q:|Query:|Search:|\?)\s*(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = queryRegex.exec(content)) !== null) {
    queries.push(match[1].trim());
  }

  return queries;
}

export function parsePerplexityExport(filePath: string): ParsedConversation {
  const raw = readFileSync(filePath, 'utf-8');
  const ext = filePath.endsWith('.json') ? 'json' : 'md';

  if (ext === 'json') {
    return parsePerplexityJson(raw, filePath);
  }

  return parsePerplexityMarkdown(raw, filePath);
}

function parsePerplexityJson(raw: string, filePath: string): ParsedConversation {
  const data = JSON.parse(raw);
  const messages: Array<{ role: string; content: string }> = [];

  if (Array.isArray(data.messages)) {
    for (const msg of data.messages) {
      messages.push({
        role: msg.role || 'assistant',
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
      });
    }
  }

  return {
    title: data.title || data.query || basename(filePath, '.json'),
    source: 'perplexity',
    date: data.created_at || new Date().toISOString(),
    messages,
    metadata: {
      citations: data.citations || [],
      queries: data.queries || [],
    },
  };
}

function parsePerplexityMarkdown(raw: string, filePath: string): ParsedConversation {
  const { data: existing, body } = parseFrontmatter(raw);
  const citations = extractCitations(body);
  const queries = extractQueries(body);

  // Split by answer sections
  const messages: Array<{ role: string; content: string }> = [];
  const sections = body.split(/^##\s+/m);

  for (const section of sections) {
    if (!section.trim()) continue;
    messages.push({ role: 'assistant', content: section.trim() });
  }

  if (messages.length === 0) {
    messages.push({ role: 'assistant', content: body.trim() });
  }

  return {
    title: (existing.title as string) || basename(filePath, '.md'),
    source: 'perplexity',
    date: (existing.date as string) || new Date().toISOString(),
    messages,
    metadata: {
      citations,
      queries,
      citationCount: citations.length,
    },
  };
}

export function importPerplexityFile(filePath: string, inboxPath: string): string[] {
  const parsed = parsePerplexityExport(filePath);
  const destDir = join(inboxPath, 'perplexity');
  ensureDir(destDir);

  const filename = sanitizeFilename(parsed.title);
  const allContent = parsed.messages.map(m => m.content).join('\n');
  const citations = (parsed.metadata.citations as Citation[]) || [];

  const frontmatter = generateFrontmatter({
    title: parsed.title,
    source: 'perplexity',
    date: parsed.date,
    tags: ['research', ...(citations.length > 3 ? ['well-sourced'] : [])],
    wordCount: countWords(allContent),
  });

  let body = '';
  for (const msg of parsed.messages) {
    body += `\n${msg.content}\n`;
  }

  if (citations.length > 0) {
    body += '\n## Sources\n\n';
    for (let i = 0; i < citations.length; i++) {
      const c = citations[i];
      body += `${i + 1}. [${c.title || c.url}](${c.url})${c.snippet ? ` - ${c.snippet}` : ''}\n`;
    }
  }

  const content = frontmatter + '\n' + body;
  const destPath = join(destDir, `${filename}.md`);
  writeFileSync(destPath, content, 'utf-8');

  return [destPath];
}
