/**
 * Public story publication boundary.
 *
 * Arcanea canon and development manuscripts are All Rights Reserved.
 * A story becomes publicly readable only after its release gate is approved
 * and its identifier is added to an explicit allowlist here.
 *
 * Default state: metadata may be public; manuscript and internal reference
 * content are not.
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
