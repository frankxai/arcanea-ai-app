import type { MediaStageCreation } from "@/components/media/creation-media-stage";
import { creationMediaUrl } from "@/lib/media/creation-url";

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
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    fileUrl: creationMediaUrl(row.content, row.type),
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
    content: row.content,
    captionsUrl:
      typeof content?.captionsUrl === "string" ? content.captionsUrl : null,
    captionsLanguage:
      typeof content?.captionsLanguage === "string"
        ? content.captionsLanguage
        : null,
    transcript:
      typeof content?.transcript === "string" ? content.transcript : null,
    transcriptUrl:
      typeof content?.transcriptUrl === "string" ? content.transcriptUrl : null,
    aiGenerated:
      Boolean(row.ai_model || row.ai_prompt) ||
      content?.source === "chat" ||
      row.content_source === "chat" ||
      (content?.mode === "image" && typeof content.prompt === "string") ||
      (row.content_mode === "image" && typeof row.content_prompt === "string"),
  };
}
