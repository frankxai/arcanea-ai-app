import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { ParsedConversation } from '../types/index.js';
import { sanitizeFilename, ensureDir, countWords } from '../utils/files.js';
import { generateFrontmatter, parseFrontmatter } from '../utils/frontmatter.js';

interface ExtractedArtifact {
  type: string;
  filename: string;
  content: string;
}

function extractArtifacts(content: string): { cleaned: string; artifacts: ExtractedArtifact[] } {
  const artifacts: ExtractedArtifact[] = [];
  let index = 0;

  // Match artifact blocks: ```artifact type="..." title="..." ... ```
  const artifactRegex = /```artifact\s+type="([^"]*)"(?:\s+title="([^"]*)")?\s*\n([\s\S]*?)```/g;
  const cleaned = content.replace(artifactRegex, (_match, type: string, title: string, body: string) => {
    index++;
    const ext = type === 'code' ? '.ts' : type === 'html' ? '.html' : '.txt';
    const filename = title
      ? sanitizeFilename(title) + ext
      : `artifact-${index}${ext}`;

    artifacts.push({ type, filename, content: body.trim() });
    return `[Artifact: ${filename}]`;
  });

  return { cleaned, artifacts };
}

function splitByRoles(content: string): Array<{ role: string; content: string }> {
  const messages: Array<{ role: string; content: string }> = [];

  // Split on Human: / Assistant: markers at line start
  const parts = content.split(/^(Human:|Assistant:)\s*/m);

  let currentRole = '';
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === 'Human:') {
      currentRole = 'user';
    } else if (trimmed === 'Assistant:') {
      currentRole = 'assistant';
    } else if (currentRole && trimmed) {
      messages.push({ role: currentRole, content: trimmed });
    }
  }

  // If no role markers found, treat as single assistant message
  if (messages.length === 0 && content.trim()) {
    messages.push({ role: 'assistant', content: content.trim() });
  }

  return messages;
}

export function parseClaudeExport(filePath: string): ParsedConversation {
  const raw = readFileSync(filePath, 'utf-8');
  const { data: existingFrontmatter, body } = parseFrontmatter(raw);

  const { cleaned, artifacts } = extractArtifacts(body);
  const messages = splitByRoles(cleaned);

  const title = (existingFrontmatter.title as string) || basename(filePath, '.md');

  return {
    title,
    source: 'claude',
    date: (existingFrontmatter.date as string) || new Date().toISOString(),
    messages,
    metadata: {
      messageCount: messages.length,
      artifactCount: artifacts.length,
    },
    artifacts,
  };
}

export function importClaudeFile(filePath: string, inboxPath: string): string[] {
  const parsed = parseClaudeExport(filePath);
  const destDir = join(inboxPath, 'claude');
  ensureDir(destDir);

  const imported: string[] = [];
  const filename = sanitizeFilename(parsed.title);
  const allContent = parsed.messages.map(m => m.content).join('\n');

  const frontmatter = generateFrontmatter({
    title: parsed.title,
    source: 'claude',
    date: parsed.date,
    tags: parsed.artifacts && parsed.artifacts.length > 0 ? ['artifacts'] : [],
    wordCount: countWords(allContent),
  });

  let body = '';
  for (const msg of parsed.messages) {
    const roleLabel = msg.role === 'user' ? '## Human' : '## Assistant';
    body += `\n${roleLabel}\n\n${msg.content}\n`;
  }

  const content = frontmatter + '\n' + body;
  const destPath = join(destDir, `${filename}.md`);
  writeFileSync(destPath, content, 'utf-8');
  imported.push(destPath);

  // Save artifacts as separate files
  if (parsed.artifacts) {
    const artifactDir = join(destDir, `${filename}-artifacts`);
    ensureDir(artifactDir);
    for (const artifact of parsed.artifacts) {
      const artifactPath = join(artifactDir, artifact.filename);
      writeFileSync(artifactPath, artifact.content, 'utf-8');
      imported.push(artifactPath);
    }
  }

  return imported;
}
