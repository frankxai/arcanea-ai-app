import type { ExportedConversation } from '../shared/types';

/**
 * Full structured JSON export of a conversation.
 * Excludes Blob data (images with localBlob).
 */
export function formatAsJson(conv: ExportedConversation): string {
  const serializable = {
    ...conv,
    images: conv.images.map(({ localBlob: _blob, ...rest }) => rest),
  };

  return JSON.stringify(serializable, null, 2);
}

/**
 * Parse a JSON export back into an ExportedConversation.
 */
export function parseJsonExport(json: string): ExportedConversation {
  const parsed = JSON.parse(json);

  // Basic validation
  if (!parsed.id || !parsed.platform || !parsed.messages) {
    throw new Error('Invalid Arcanea Vault JSON export: missing required fields');
  }

  return parsed as ExportedConversation;
}
