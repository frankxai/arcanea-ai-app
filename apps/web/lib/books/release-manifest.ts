import 'server-only';

import { createHash } from 'node:crypto';
import { get } from '@vercel/blob';
import { readVerifiedCinematicArtifact } from '@/lib/books/cinematic-artifact-integrity';
import { cinematicManifestPath } from '@/lib/books/downloads';
import {
  verifiedCinematicReleaseFiles,
  type CinematicReleaseFiles,
} from '@/lib/books/cinematic-release-manifest-contract';

const MAX_MANIFEST_BYTES = 1_000_000;

export async function loadCinematicReleaseFiles(): Promise<CinematicReleaseFiles | null> {
  const expectedManifestSha256 = process.env.CINEMATIC_BOOK_RELEASE_MANIFEST_SHA256?.trim() ?? '';
  const expectedSourceCommit = process.env.CINEMATIC_BOOK_RELEASE_SOURCE_COMMIT?.trim() ?? '';
  const deployedSourceCommit = process.env.VERCEL_GIT_COMMIT_SHA?.trim() ?? '';
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) return null;

  try {
    const result = await get(cinematicManifestPath(), {
      access: 'private',
      abortSignal: AbortSignal.timeout(10_000),
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    if (typeof result.blob.size !== 'number' || result.blob.size > MAX_MANIFEST_BYTES) {
      void result.stream.cancel().catch(() => undefined);
      return null;
    }
    const bytes = await readVerifiedCinematicArtifact(result.stream, {
      bytes: result.blob.size,
      sha256: expectedManifestSha256,
    }, { timeoutMs: 10_000 });
    if (!bytes || bytes.length === 0) return null;

    const actualManifestSha256 = createHash('sha256').update(bytes).digest('hex');
    const manifest = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return verifiedCinematicReleaseFiles(manifest, {
      actualManifestSha256,
      expectedManifestSha256,
      expectedSourceCommit,
      deployedSourceCommit,
    });
  } catch {
    return null;
  }
}

export async function verifyCinematicReleaseManifest(): Promise<boolean> {
  return (await loadCinematicReleaseFiles()) !== null;
}
