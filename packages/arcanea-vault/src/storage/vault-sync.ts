import type { ExportedConversation, ExportFormat } from '../shared/types';
import { formatAsMarkdown } from '../formatters/markdown';
import { formatAsJson } from '../formatters/json';
import { slugify } from '../shared/utils';

/**
 * Generate file content for a conversation in the specified format.
 */
export function generateExportContent(
  conv: ExportedConversation,
  format: ExportFormat
): string {
  switch (format) {
    case 'markdown':
      return formatAsMarkdown(conv);
    case 'json':
      return formatAsJson(conv);
    case 'zip':
      // ZIP handled separately via download
      return formatAsMarkdown(conv);
    default:
      return formatAsMarkdown(conv);
  }
}

/**
 * Generate the filename for an exported conversation.
 */
export function generateFilename(
  conv: ExportedConversation,
  format: ExportFormat
): string {
  const slug = slugify(conv.title);
  const date = new Date(conv.exportedAt).toISOString().slice(0, 10);
  const ext = format === 'json' ? 'json' : 'md';
  return `${conv.platform}/${date}-${slug}.${ext}`;
}

/**
 * Download a conversation as a file using the Chrome Downloads API.
 */
export async function downloadConversation(
  conv: ExportedConversation,
  format: ExportFormat
): Promise<void> {
  const content = generateExportContent(conv, format);
  const filename = generateFilename(conv, format);
  const mimeType = format === 'json' ? 'application/json' : 'text/markdown';

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  try {
    await chrome.downloads.download({
      url,
      filename: `arcanea-vault/${filename}`,
      saveAs: false,
    });
  } finally {
    // Clean up blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

/**
 * Export to vault directory using File System Access API (when available).
 * Falls back to Chrome Downloads API if not supported.
 */
export async function exportToVaultDirectory(
  conv: ExportedConversation,
  format: ExportFormat,
  vaultPath?: string
): Promise<{ success: boolean; path: string }> {
  const content = generateExportContent(conv, format);
  const filename = generateFilename(conv, format);
  const fullPath = vaultPath ? `${vaultPath}/${filename}` : `arcanea-vault/inbox/${filename}`;

  // Use Downloads API (universally available in extensions)
  try {
    await chrome.downloads.download({
      url: URL.createObjectURL(
        new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' })
      ),
      filename: fullPath,
      saveAs: false,
      conflictAction: 'overwrite',
    });
    return { success: true, path: fullPath };
  } catch (err) {
    console.error('[vault-sync] Export failed:', err);
    return { success: false, path: fullPath };
  }
}

/**
 * Batch export multiple conversations.
 */
export async function batchExport(
  conversations: ExportedConversation[],
  format: ExportFormat,
  onProgress?: (current: number, total: number) => void
): Promise<{ exported: number; failed: number }> {
  let exported = 0;
  let failed = 0;

  for (let i = 0; i < conversations.length; i++) {
    try {
      await downloadConversation(conversations[i], format);
      exported++;
    } catch {
      failed++;
    }
    onProgress?.(i + 1, conversations.length);

    // Small delay between downloads to avoid rate limiting
    if (i < conversations.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { exported, failed };
}
