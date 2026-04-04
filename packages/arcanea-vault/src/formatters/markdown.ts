import type { ExportedConversation, ExportedMessage, Citation } from '../shared/types';
import { generateFrontmatter } from './frontmatter';

/**
 * Convert a full ExportedConversation to clean Markdown with YAML frontmatter.
 */
export function formatAsMarkdown(conv: ExportedConversation): string {
  const parts: string[] = [];

  // YAML frontmatter
  parts.push(generateFrontmatter(conv));
  parts.push('');

  // Title
  parts.push(`# ${conv.title}`);
  parts.push('');
  parts.push(`> Exported from **${platformLabel(conv.platform)}** on ${formatDate(conv.exportedAt)}`);
  if (conv.metadata.model) {
    parts.push(`> Model: ${conv.metadata.model}`);
  }
  parts.push('');
  parts.push('---');
  parts.push('');

  // Messages
  for (const msg of conv.messages) {
    parts.push(formatMessage(msg));
    parts.push('');
  }

  // Artifacts section (if any separate artifacts exist)
  if (conv.artifacts.length > 0) {
    parts.push('---');
    parts.push('');
    parts.push('## Artifacts');
    parts.push('');

    for (const artifact of conv.artifacts) {
      parts.push(`### ${artifact.title}`);
      parts.push('');
      const lang = artifact.language || inferLanguage(artifact.type);
      parts.push(`\`\`\`${lang}`);
      parts.push(artifact.content);
      parts.push('```');
      parts.push('');
    }
  }

  // Images section
  if (conv.images.length > 0) {
    parts.push('---');
    parts.push('');
    parts.push('## Images');
    parts.push('');

    for (const image of conv.images) {
      const description = image.prompt || 'Generated image';
      parts.push(`![${description}](${image.url})`);
      if (image.prompt) {
        parts.push(`> Prompt: ${image.prompt}`);
      }
      parts.push('');
    }
  }

  // Citations as footnotes
  const citations = conv.metadata.citations;
  if (citations && citations.length > 0) {
    parts.push('---');
    parts.push('');
    parts.push('## Sources');
    parts.push('');
    formatCitations(citations, parts);
  }

  return parts.join('\n');
}

function formatMessage(msg: ExportedMessage): string {
  const roleLabel = msg.role === 'user' ? '**User**' : '**Assistant**';
  const modelSuffix = msg.model ? ` _(${msg.model})_` : '';
  const header = `### ${roleLabel}${modelSuffix}`;

  return `${header}\n\n${msg.content}`;
}

function formatCitations(citations: Citation[], parts: string[]): void {
  for (let i = 0; i < citations.length; i++) {
    const c = citations[i];
    parts.push(`[^${i + 1}]: [${c.title}](${c.url})`);
    if (c.snippet) {
      parts.push(`    > ${c.snippet}`);
    }
  }
  parts.push('');
}

function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    perplexity: 'Perplexity',
    grok: 'Grok',
    gemini: 'Gemini',
  };
  return labels[platform] || platform;
}

function inferLanguage(type: string): string {
  const map: Record<string, string> = {
    code: 'text',
    document: 'markdown',
    svg: 'xml',
    html: 'html',
    react: 'tsx',
    mermaid: 'mermaid',
  };
  return map[type] || 'text';
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
