const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const POST_UUID_PATTERN =
  /(?:generated|post|status|imagine\/post)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/** Extract post UUID from a Grok URL (post page, asset URL, etc.) */
export function extractPostId(url: string): string | null {
  const match = url.match(POST_UUID_PATTERN);
  if (match) return match[1];

  // Fallback: last UUID in URL (handles /users/{userId}/generated/{postId}/...)
  const allUuids = url.match(new RegExp(UUID_PATTERN.source, 'gi'));
  return allUuids ? allUuids[allUuids.length - 1] : null;
}

/** Check if a string is a valid UUID */
export function isUuid(str: string): boolean {
  return UUID_PATTERN.test(str);
}

/** Generate a simple unique ID for queue items */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
