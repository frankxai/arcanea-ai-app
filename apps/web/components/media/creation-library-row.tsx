"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  FileText,
  FilmStrip,
  ImageSquare,
  MusicNote,
} from "@/lib/phosphor-icons";
import { createClient } from "@/lib/supabase/client";
import {
  creationDocumentUrl,
  creationMediaUrl,
  safeCreationUrl,
} from "@/lib/media/creation-url";

export interface CreationListItem {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  aiGenerated?: boolean;
  thumbnailUrl?: string | null;
}

function readableContent(content: unknown): string | null {
  if (typeof content === "string") return content;
  if (!content || typeof content !== "object" || Array.isArray(content))
    return null;
  const record = content as Record<string, unknown>;
  for (const key of ["text", "code", "body", "content"]) {
    if (typeof record[key] === "string") return record[key];
  }
  return JSON.stringify(content, null, 2) ?? null;
}

function typeLabel(type: string): string {
  if (type === "image") return "Image";
  if (type === "video") return "Film";
  if (type === "music") return "Music";
  if (type === "audio") return "Audio";
  if (type === "text") return "Writing";
  if (type === "code") return "Code";
  return "Creation";
}

function TypeIcon({ type }: { type: string }) {
  const Icon =
    type === "image"
      ? ImageSquare
      : type === "video"
        ? FilmStrip
        : type === "music" || type === "audio"
          ? MusicNote
          : FileText;
  return <Icon size={23} aria-hidden="true" />;
}

export function CreationLibraryRow({
  creation,
  userId,
}: {
  creation: CreationListItem;
  userId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<unknown>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const isMedia = ["image", "video", "music", "audio"].includes(creation.type);
  const mediaOriginal =
    isMedia && detail !== undefined
      ? safeCreationUrl(
          creationMediaUrl(detail, creation.type) ??
            (creation.type === "image" ? creation.thumbnailUrl : null),
        )
      : null;
  const originalUrl = mediaOriginal
    ? `/api/creations/${creation.id}/media`
    : null;
  const textContent = !isMedia && expanded ? readableContent(detail) : null;
  const documentUrl =
    creation.type === "text" && creationDocumentUrl(detail)
      ? `/api/creations/${creation.id}/media`
      : null;
  const detailId = `creation-detail-${creation.id}`;

  async function toggleDetail() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (detail !== undefined) return;
    setDetailLoading(true);
    setDetailError(false);
    try {
      const { data, error } = await createClient()
        .from("creations")
        .select("content")
        .eq("id", creation.id)
        .eq("user_id", userId)
        .single();
      if (error || !data) setDetailError(true);
      else setDetail(data.content);
    } catch {
      setDetailError(true);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <li className="min-w-0 rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-[var(--arc-media-space-100)]">
      <div className="flex min-w-0 items-center gap-[var(--arc-media-space-100)]">
        <span className="flex h-[var(--arc-size-media-row-icon)] w-[var(--arc-size-media-row-icon)] shrink-0 items-center justify-center rounded-[var(--arc-radius-xl)] bg-[var(--arc-cosmic-raised)] text-[var(--arc-text-secondary)]">
          <TypeIcon type={creation.type} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[length:var(--arc-type-media-body)] font-semibold">
            {creation.title}
          </h3>
          <p className="mt-[var(--arc-media-space-025)] text-[length:var(--arc-type-media-note)] text-[var(--arc-text-muted)]">
            {typeLabel(creation.type)} ·{" "}
            <time dateTime={creation.createdAt}>
              {new Date(creation.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
          {creation.aiGenerated && (
            <p
              data-ai-generated="true"
              className="mt-[var(--arc-media-space-025)] text-[length:var(--arc-type-media-note)] font-medium text-[var(--arc-brand-atlantean-teal)]"
            >
              AI-generated
            </p>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-[var(--arc-media-space-025)]">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={() => void toggleDetail()}
            className="min-h-[var(--arc-size-interactive-min)] rounded-[var(--arc-radius-xl)] px-[var(--arc-media-space-075)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
          >
            {expanded ? "Close" : isMedia ? "View" : "Read"}
          </button>
        </div>
      </div>
      <div
        id={detailId}
        hidden={!expanded}
        className="mt-[var(--arc-media-space-100)] border-t border-[var(--arc-cosmic-border)] pt-[var(--arc-media-space-100)]"
      >
        <p role="status" className="sr-only">
          {expanded
            ? detailLoading
              ? "Loading saved content"
              : detailError
                ? "Saved content could not load"
                : isMedia
                  ? originalUrl
                    ? "Original ready"
                    : "Original unavailable"
                  : "Saved content ready"
            : ""}
        </p>
        {isMedia ? (
          detailLoading ? (
            <p>Loading original…</p>
          ) : detailError ? (
            <p>Original could not load. Close and try again.</p>
          ) : originalUrl ? (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[var(--arc-size-interactive-min)] items-center gap-[var(--arc-media-space-025)] rounded-[var(--arc-radius-xl)] text-[length:var(--arc-type-media-body)] font-medium text-[var(--arc-brand-atlantean-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
            >
              Open original <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : (
            <p>No original file is available for this creation.</p>
          )
        ) : (
          <>
            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-[var(--arc-media-space-075)] inline-flex min-h-[var(--arc-size-interactive-min)] items-center gap-[var(--arc-media-space-025)] rounded-[var(--arc-radius-xl)] text-[length:var(--arc-type-media-body)] font-medium text-[var(--arc-brand-atlantean-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              >
                Open file <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            {!documentUrl && (
              <pre
                tabIndex={0}
                className="max-h-[var(--arc-size-media-content-max)] overflow-auto whitespace-pre-wrap break-words font-sans text-[length:var(--arc-type-media-body)] leading-[var(--arc-line-media-reading)] text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              >
                {detailLoading
                  ? "Loading saved content…"
                  : detailError
                    ? "Saved content could not load. Close and try again."
                    : (textContent ??
                      "No saved content is available for this record.")}
              </pre>
            )}
          </>
        )}
      </div>
    </li>
  );
}
