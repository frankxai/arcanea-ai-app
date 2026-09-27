import { createClient } from "@/lib/supabase/client";
import { ownedCreationStoragePath } from "@/lib/media/creation-url";
import type { MediaStageCreation } from "@/components/media/creation-media-stage";

export interface MediaCache<T extends MediaStageCreation> {
  userId: string;
  source: T[];
  signed: T[];
  signedAt: number;
}

export async function signStageMedia<T extends MediaStageCreation>(
  creations: T[],
  userId: string,
): Promise<T[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return creations;
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
  if (!paths.size) return creations;
  const pathList = [...paths];
  const { data, error } = await createClient()
    .storage.from("creations")
    .createSignedUrls(pathList, 60 * 30);
  if (error || !data) throw error ?? new Error("Media signing failed");
  const signed = new Map<string, string | null>(
    data.map(
      (
        entry: { signedUrl?: string | null },
        index: number,
      ): [string, string | null] => [
        pathList[index],
        entry.signedUrl ? new URL(entry.signedUrl, supabaseUrl).href : null,
      ],
    ),
  );
  function url(value: string | null | undefined): string | null {
    const path = ownedCreationStoragePath(value, userId, supabaseUrl!);
    return path ? (signed.get(path) ?? null) : (value ?? null);
  }
  return creations.map((creation) => ({
    ...creation,
    fileUrl: url(creation.fileUrl),
    thumbnailUrl: url(creation.thumbnailUrl),
    captionsUrl: url(creation.captionsUrl),
    transcriptUrl: url(creation.transcriptUrl),
  }));
}
