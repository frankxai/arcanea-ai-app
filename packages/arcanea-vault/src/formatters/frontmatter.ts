import type { ExportedConversation } from '../shared/types';

/**
 * Generate YAML frontmatter for a conversation export.
 */
export function generateFrontmatter(conv: ExportedConversation): string {
  const lines = [
    '---',
    `id: ${conv.id}`,
    `source: ${conv.platform}`,
    `source_model: ${conv.metadata.model || 'unknown'}`,
    `title: "${escapeYaml(conv.title)}"`,
    `exported_at: ${new Date(conv.exportedAt).toISOString()}`,
    `message_count: ${conv.metadata.messageCount}`,
    `word_count: ${conv.metadata.wordCount}`,
    `has_code: ${conv.metadata.hasCode}`,
    `has_images: ${conv.metadata.hasImages}`,
    `has_artifacts: ${conv.metadata.hasArtifacts}`,
  ];

  if (conv.metadata.project) {
    lines.push(`project: "${escapeYaml(conv.metadata.project)}"`);
  }

  if (conv.metadata.createdAt) {
    lines.push(`created_at: ${new Date(conv.metadata.createdAt).toISOString()}`);
  }

  if (conv.metadata.citations && conv.metadata.citations.length > 0) {
    lines.push(`citation_count: ${conv.metadata.citations.length}`);
  }

  lines.push('tags: []');
  lines.push('quality_grade: pending');
  lines.push('processing_status: inbox');
  lines.push('---');

  return lines.join('\n');
}

/**
 * Escape special characters in YAML string values.
 */
function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}
