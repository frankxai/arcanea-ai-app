import type { MediaStageCreation } from "@/components/media/creation-media-stage";
import { creationMediaUrl, safeCreationUrl } from "@/lib/media/creation-url";
import { createClient } from "@/lib/supabase/client";
import type { CreationFilter } from "@/lib/media/creation-library-filters";

export type Cursor = { createdAt: string; id: string };
export const PAGE_SIZE = 24;

const listColumns =
  "id, title, type, status, thumbnail_url, created_at, ai_model, ai_prompt, content_source:content->>source, content_mode:content->>mode, content_prompt:content->>prompt";

export async function fetchCreationPage(
  userId: string,
  filter: CreationFilter,
  cursor: Cursor | null,
) {
  let query = createClient()
    .from("creations")
    .select(listColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (filter === "audio") query = query.in("type", ["audio", "music"]);
  else if (filter !== "all") query = query.eq("type", filter);
  if (cursor) {
    const timestamp = `"${cursor.createdAt}"`;
    query = query.or(
      `created_at.lt.${timestamp},and(created_at.eq.${timestamp},id.lt.${cursor.id})`,
    );
  }
  return query.limit(PAGE_SIZE + 1);
}

export type LibraryCreation = MediaStageCreation & {
  createdAt: string;
  content: unknown;
};

export function mapCreation(row: {
  id: string;
  title: string;
  type: string;
  status: string;
  content?: unknown;
  content_source?: string | null;
  content_mode?: string | null;
  content_prompt?: string | null;
  thumbnail_url: string | null;
  created_at: string;
  ai_model: string | null;
  ai_prompt: string | null;
}): LibraryCreation {
  const content =
    row.content &&
    typeof row.content === "object" &&
    !Array.isArray(row.content)
      ? (row.content as Record<string, unknown>)
      : null;
  const fileUrl = creationMediaUrl(row.content, row.type);
  const captionsUrl =
    typeof content?.captionsUrl === "string" ? content.captionsUrl : null;
  const transcriptUrl =
    typeof content?.transcriptUrl === "string" ? content.transcriptUrl : null;
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    fileUrl,
    thumbnailUrl: row.thumbnail_url,
    originalAvailable: Boolean(
      safeCreationUrl(fileUrl) ||
      (row.type === "image" && safeCreationUrl(row.thumbnail_url)),
    ),
    captionsAvailable: Boolean(safeCreationUrl(captionsUrl)),
    transcriptFileAvailable: Boolean(safeCreationUrl(transcriptUrl)),
    createdAt: row.created_at,
    content: row.content,
    captionsUrl,
    captionsLanguage:
      typeof content?.captionsLanguage === "string"
        ? content.captionsLanguage
        : null,
    transcript:
      typeof content?.transcript === "string" ? content.transcript : null,
    transcriptUrl,
    aiGenerated:
      Boolean(row.ai_model || row.ai_prompt) ||
      content?.source === "chat" ||
      row.content_source === "chat" ||
      (content?.mode === "image" && typeof content.prompt === "string") ||
      (row.content_mode === "image" && typeof row.content_prompt === "string"),
  };
}
