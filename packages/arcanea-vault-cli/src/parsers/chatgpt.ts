import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChatGPTExport, ParsedConversation } from '../types/index.js';
import { sanitizeFilename, ensureDir, generateId, countWords } from '../utils/files.js';
import { generateFrontmatter } from '../utils/frontmatter.js';
import { writeFileSync } from 'node:fs';

export function parseChatGPTExport(filePath: string): ChatGPTExport[] {
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [data];
}

function walkMessageTree(mapping: ChatGPTExport['mapping']): Array<{ role: string; content: string }> {
  const messages: Array<{ role: string; content: string }> = [];

  // Find root node (parent is null)
  let rootId: string | null = null;
  for (const [id, node] of Object.entries(mapping)) {
    if (node.parent === null) {
      rootId = id;
      break;
    }
  }

  if (!rootId) return messages;

  // BFS through the tree following first child
  const queue: string[] = [rootId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = mapping[currentId];
    if (!node) continue;

    if (node.message && node.message.content?.parts?.length) {
      const text = node.message.content.parts
        .filter((p): p is string => typeof p === 'string')
        .join('\n');

      if (text.trim()) {
        messages.push({
          role: node.message.author.role,
          content: text,
        });
      }
    }

    // Follow children (take first child for main thread)
    if (node.children.length > 0) {
      queue.push(node.children[node.children.length - 1]);
    }
  }

  return messages;
}

function detectContentTypes(messages: Array<{ role: string; content: string }>): string[] {
  const types: string[] = [];
  const allContent = messages.map(m => m.content).join('\n');

  if (/```[\s\S]*?```/.test(allContent)) types.push('code');
  if (/!\[.*\]\(.*\)/.test(allContent) || /dall-e|image|generate.*picture/i.test(allContent)) types.push('image');
  if (/https?:\/\/[^\s]+/g.test(allContent)) types.push('links');

  return types;
}

export function convertToMarkdown(conversation: ChatGPTExport): ParsedConversation {
  const messages = walkMessageTree(conversation.mapping);
  const contentTypes = detectContentTypes(messages);
  const date = conversation.create_time
    ? new Date(conversation.create_time * 1000).toISOString()
    : new Date().toISOString();

  return {
    title: conversation.title || 'Untitled ChatGPT Conversation',
    source: 'chatgpt',
    date,
    messages,
    metadata: {
      contentTypes,
      messageCount: messages.length,
    },
  };
}

export function importChatGPTFile(filePath: string, inboxPath: string): string[] {
  const conversations = parseChatGPTExport(filePath);
  const destDir = join(inboxPath, 'chatgpt');
  ensureDir(destDir);

  const imported: string[] = [];

  for (const conv of conversations) {
    const parsed = convertToMarkdown(conv);
    const filename = sanitizeFilename(parsed.title);
    const id = generateId('chatgpt');
    const allContent = parsed.messages.map(m => m.content).join('\n');

    const frontmatter = generateFrontmatter({
      title: parsed.title,
      source: 'chatgpt',
      date: parsed.date,
      tags: (parsed.metadata.contentTypes as string[]) || [],
      wordCount: countWords(allContent),
    });

    let body = '';
    for (const msg of parsed.messages) {
      const roleLabel = msg.role === 'user' ? '## User' : msg.role === 'assistant' ? '## Assistant' : '## System';
      body += `\n${roleLabel}\n\n${msg.content}\n`;
    }

    const content = frontmatter + '\n' + body;
    const destPath = join(destDir, `${filename}.md`);
    writeFileSync(destPath, content, 'utf-8');
    imported.push(destPath);
  }

  return imported;
}
