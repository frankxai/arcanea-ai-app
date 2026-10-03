/**
 * Public story publication boundary.
 *
 * Arcanea canon and development manuscripts are All Rights Reserved. A story
 * becomes publicly readable only after its release gate is approved and its
 * identifier is added to an explicit allowlist here.
 *
 * Default state: release metadata may be public; manuscript and internal
 * reference content are not. Adding an id here is a publication decision, not
 * a way to fix a failing page, test, or build.
 */

export const PUBLIC_RELEASE_REGISTRY = {
  schemaVersion: 1,
  policy: 'default-deny',
  releases: [
    {
      id: 'ARC-REL-001',
      saga: 'The Godbeast Covenant',
      workingTitle: 'The Unchosen Bond',
      creativeLane: 'Dragonborne',
      state: 'development',
      storyLock: 'pending',
      publicManuscript: false,
    },
  ],
  publicBookIds: [] as string[],
  publicDocumentSlugs: [] as string[],
} as const;

/**
 * Exact-match membership against an array, never an object map. Anything that
 * is not a non-empty string present in the allowlist is denied, so an empty
 * allowlist denies every identifier, a traversal-shaped id can never match a
 * released id, and inherited object keys such as `constructor` cannot resolve
 * to a truthy hit.
 */
export function isAllowlisted(allowlist: readonly string[], id: unknown): boolean {
  if (typeof id !== 'string' || id.length === 0) return false;
  return allowlist.includes(id);
}

export function isPublicBook(bookId: unknown): boolean {
  return isAllowlisted(PUBLIC_RELEASE_REGISTRY.publicBookIds, bookId);
}

export function isPublicDocument(slug: unknown): boolean {
  return isAllowlisted(PUBLIC_RELEASE_REGISTRY.publicDocumentSlugs, slug);
}

export function notPublicPayload(resource: 'book' | 'chapter' | 'document') {
  return {
    success: false,
    error: {
      code: 'NOT_PUBLIC',
      message: `No released Arcanea ${resource} is available at this route.`,
    },
    meta: {
      policy: PUBLIC_RELEASE_REGISTRY.policy,
      registryVersion: PUBLIC_RELEASE_REGISTRY.schemaVersion,
      timestamp: new Date().toISOString(),
    },
  };
}

export function internalErrorPayload() {
  return {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Request could not be completed.' },
    meta: { timestamp: new Date().toISOString() },
  };
}
