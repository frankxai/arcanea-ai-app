import { createClient } from "@/lib/supabase/client";
import { ownedCreationStoragePath } from "@/lib/media/creation-url";
import type { MediaStageCreation } from "@/components/media/creation-media-stage";

export interface MediaCache<T extends MediaStageCreation> {
  userId: string;
  source: T[];
  signed: T[];
  signedAt: number;
  partialFailure: boolean;
}

interface SignedStageMedia<T extends MediaStageCreation> {
  creations: T[];
  partialFailure: boolean;
}

export function resolveSignedCreationPaths(
  paths: string[],
  data: Array<{ signedUrl?: string | null }>,
  supabaseUrl: string,
) {
  const signed = new Map<string, string | null>(
    paths.map((path, index): [string, string | null] => {
      const signedUrl = data[index]?.signedUrl;
      return [path, signedUrl ? new URL(signedUrl, supabaseUrl).href : null];
    }),
  );
  return {
    signed,
    partialFailure: paths.some((path) => !signed.get(path)),
  };
}

export function maskUnsignedPrivateStageMedia<T extends MediaStageCreation>(
  creations: T[],
  userId: string,
  supabaseUrl: string,
): T[] {
  const publicUrl = (value: string | null | undefined) =>
    ownedCreationStoragePath(value, userId, supabaseUrl)
      ? null
      : (value ?? null);
  return creations.map((creation) => ({
    ...creation,
    fileUrl: publicUrl(creation.fileUrl),
    thumbnailUrl: publicUrl(creation.thumbnailUrl),
    captionsUrl: publicUrl(creation.captionsUrl),
    transcriptUrl: publicUrl(creation.transcriptUrl),
  }));
}

export async function signStageMedia<T extends MediaStageCreation>(
  creations: T[],
  userId: string,
): Promise<SignedStageMedia<T>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return { creations, partialFailure: false };
  const paths = new Set<string>();
  for (const creation of creations) {
    for (const value of [
      creation.fileUrl,
      creation.thumbnailUrl,
      creation.captionsUrl,
      creation.transcriptUrl,
    ]) {
      const path = ownedCreationStoragePath(value, userId, supabaseUrl);
      if (path) paths.add(path);
    }
  }
  if (!paths.size) return { creations, partialFailure: false };
  const pathList = [...paths];
  const { data, error } = await createClient()
    .storage.from("creations")
    .createSignedUrls(pathList, 60 * 60 * 6);
  if (error || !data) throw error ?? new Error("Media signing failed");
  const { signed, partialFailure } = resolveSignedCreationPaths(
    pathList,
    data,
    supabaseUrl,
  );
  function url(value: string | null | undefined): string | null {
    const path = ownedCreationStoragePath(value, userId, supabaseUrl!);
    return path ? (signed.get(path) ?? null) : (value ?? null);
  }
  return {
    creations: creations.map((creation) => ({
      ...creation,
      fileUrl: url(creation.fileUrl),
      thumbnailUrl: url(creation.thumbnailUrl),
      captionsUrl: url(creation.captionsUrl),
      transcriptUrl: url(creation.transcriptUrl),
    })),
    partialFailure,
  };
}
