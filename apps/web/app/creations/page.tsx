"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FilmStrip,
  ImageSquare,
  MusicNote,
} from "@/lib/phosphor-icons";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import {
  creationMediaUrl,
  ownedCreationStoragePath,
} from "@/lib/media/creation-url";
import {
  CreationMediaStage,
  type MediaStageCreation,
} from "@/components/media/creation-media-stage";

type Filter = "all" | "image" | "video" | "audio" | "text" | "code";
type LibraryCreation = MediaStageCreation & {
  createdAt: string;
  content: unknown;
};
type Cursor = { createdAt: string; id: string };
const PAGE_SIZE = 24;
const stageColumns =
  "id, title, type, status, content, thumbnail_url, created_at, ai_model, ai_prompt";
const listColumns =
  "id, title, type, status, thumbnail_url, created_at, ai_model, ai_prompt, content_source:content->>source, content_mode:content->>mode, content_prompt:content->>prompt";

interface LibrarySnapshot {
  userId: string;
  filter: Filter;
  items: LibraryCreation[];
  media: LibraryCreation[];
  nextCursor: Cursor | null;
  hasMore: boolean;
  error: boolean;
  mediaError: boolean;
}

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All work" },
  { id: "image", label: "Images" },
  { id: "video", label: "Film" },
  { id: "audio", label: "Music & audio" },
  { id: "text", label: "Writing" },
  { id: "code", label: "Code" },
];

function mapCreation(row: {
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
      (row.content_mode === "image" && Boolean(row.content_prompt)),
  };
}

async function signStageMedia(creations: LibraryCreation[], userId: string) {
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
  const signed = new Map(
    data.map((entry, index) => [pathList[index], entry.signedUrl ?? null]),
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

async function fetchPage(
  userId: string,
  filter: Filter,
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

function readableContent(content: unknown): string | null {
  if (typeof content === "string") return content;
  if (!content || typeof content !== "object" || Array.isArray(content))
    return null;
  const record = content as Record<string, unknown>;
  for (const key of ["text", "code", "body", "content"]) {
    if (typeof record[key] === "string") return record[key];
  }
  return JSON.stringify(content, null, 2);
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

function CreationRow({
  creation,
  userId,
}: {
  creation: LibraryCreation;
  userId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<unknown>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const isMedia = ["image", "video", "music", "audio"].includes(creation.type);
  const originalUrl = isMedia ? `/api/creations/${creation.id}/media` : null;
  const textContent = !isMedia && expanded ? readableContent(detail) : null;
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
    <li className="min-w-0 rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--arc-radius-xl)] bg-[var(--arc-cosmic-raised)] text-[var(--arc-text-secondary)]">
          <TypeIcon type={creation.type} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{creation.title}</h3>
          <p className="mt-1 text-xs text-[var(--arc-text-muted)]">
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
              className="mt-1 text-xs font-medium text-[var(--arc-brand-atlantean-teal)]"
            >
              AI-generated
            </p>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {originalUrl ? (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${creation.title} in a new tab`}
              className="inline-flex min-h-11 items-center gap-1 rounded-[var(--arc-radius-xl)] px-3 text-sm text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
            >
              Open <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : !isMedia ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={detailId}
              onClick={() => void toggleDetail()}
              className="min-h-11 rounded-[var(--arc-radius-xl)] px-3 text-sm text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
            >
              {expanded ? "Close" : "Read"}
            </button>
          ) : null}
        </div>
      </div>
      {!isMedia && (
        <div
          id={detailId}
          hidden={!expanded}
          className="mt-4 border-t border-[var(--arc-cosmic-border)] pt-4"
        >
          <pre
            tabIndex={0}
            className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
          >
            {detailLoading
              ? "Loading saved content…"
              : detailError
                ? "Saved content could not load. Close and try again."
                : (textContent ??
                  "No saved content is available for this record.")}
          </pre>
        </div>
      )}
    </li>
  );
}

export default function CreationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<LibrarySnapshot | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [retry, setRetry] = useState(0);
  const [loadingMoreKey, setLoadingMoreKey] = useState<string | null>(null);
  const [loadMoreErrorKey, setLoadMoreErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    let active = true;
    const client = createClient();
    async function load() {
      const [itemsSettled, mediaSettled] = await Promise.allSettled([
        fetchPage(userId, filter, null),
        client
          .from("creations")
          .select(stageColumns)
          .eq("user_id", userId)
          .in("type", ["image", "video", "music", "audio"])
          .order("created_at", { ascending: false })
          .limit(18),
      ]);
      if (!active) return;
      const itemsResult =
        itemsSettled.status === "fulfilled" ? itemsSettled.value : null;
      const mediaResult =
        mediaSettled.status === "fulfilled" ? mediaSettled.value : null;
      const rows =
        itemsResult && !itemsResult.error ? (itemsResult.data ?? []) : [];
      const mediaRows =
        mediaResult && !mediaResult.error ? (mediaResult.data ?? []) : [];
      const pageRows = rows.slice(0, PAGE_SIZE);
      const last = pageRows.at(-1);
      let media = mediaRows.map(mapCreation);
      let mediaError = !mediaResult || Boolean(mediaResult.error);
      if (!mediaError) {
        try {
          media = await signStageMedia(media, userId);
        } catch {
          media = [];
          mediaError = true;
        }
      }
      if (!active) return;
      setSnapshot({
        userId,
        filter,
        items: pageRows.map(mapCreation),
        media,
        nextCursor: last ? { createdAt: last.created_at, id: last.id } : null,
        hasMore: rows.length > PAGE_SIZE,
        error: !itemsResult || Boolean(itemsResult.error),
        mediaError,
      });
    }

    void load().catch(() => {
      if (active)
        setSnapshot({
          userId,
          filter,
          items: [],
          media: [],
          nextCursor: null,
          hasMore: false,
          error: true,
          mediaError: true,
        });
    });
    return () => {
      active = false;
    };
  }, [user, filter, retry]);

  const loading =
    authLoading || (user !== null && snapshot?.userId !== user.id);
  const filterLoading = user !== null && snapshot?.filter !== filter;
  const items = snapshot?.items ?? [];
  const currentKey = user ? `${user.id}:${filter}` : null;

  async function loadMore() {
    if (
      !user ||
      !snapshot ||
      snapshot.filter !== filter ||
      !snapshot.hasMore ||
      loadingMoreKey
    )
      return;
    const { id: userId } = user;
    const { nextCursor } = snapshot;
    const requestedFilter = filter;
    const key = `${userId}:${requestedFilter}`;
    setLoadingMoreKey(key);
    setLoadMoreErrorKey(null);
    try {
      const result = await fetchPage(userId, requestedFilter, nextCursor);
      if (result.error) throw result.error;
      const rows = result.data ?? [];
      const pageRows = rows.slice(0, PAGE_SIZE);
      const last = pageRows.at(-1);
      setSnapshot((current) =>
        current?.userId === userId &&
        current.filter === requestedFilter &&
        current.nextCursor?.id === nextCursor?.id
          ? {
              ...current,
              items: [...current.items, ...pageRows.map(mapCreation)],
              nextCursor: last
                ? { createdAt: last.created_at, id: last.id }
                : current.nextCursor,
              hasMore: rows.length > PAGE_SIZE,
            }
          : current,
      );
    } catch {
      setLoadMoreErrorKey(key);
    } finally {
      setLoadingMoreKey(null);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] px-4 pb-20 pt-9 text-[var(--arc-text-primary)] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm text-[var(--arc-text-secondary)]">
              Your workspace
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Creations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--arc-text-secondary)]">
              See your saved images, film, music, and other creations in one
              place.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-4 py-2 text-sm font-medium text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
          >
            Open chat <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>

        {loading ? (
          <div
            className="h-[26rem] rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)]"
            role="status"
            aria-label="Loading creations"
          />
        ) : !user ? (
          <section className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-8 sm:p-12">
            <h2 className="font-display text-3xl">
              Your work belongs with you
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--arc-text-secondary)]">
              Sign in to see your private media and saved creations.
            </p>
            <Link
              href="/auth/login?next=/creations"
              className="mt-6 inline-flex min-h-11 items-center rounded-[var(--arc-radius-xl)] bg-[var(--arc-brand-atlantean-teal)] px-5 py-2 text-sm font-semibold text-[var(--arc-cosmic-void)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-text-primary)]"
            >
              Sign in
            </Link>
          </section>
        ) : (
          <>
            {snapshot?.mediaError ? (
              <p
                role="alert"
                className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-6 text-sm text-[var(--arc-text-secondary)]"
              >
                Recent media previews could not load. Your saved work remains
                available below.
              </p>
            ) : (
              <CreationMediaStage creations={snapshot?.media ?? []} />
            )}

            <p className="mt-5 text-xs leading-5 text-[var(--arc-text-muted)]">
              Arcanea AI creations are labeled AI-generated when their source is
              recorded. Uploaded work may have a different origin.
            </p>

            <section className="mt-12" aria-labelledby="recent-creations-title">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id="recent-creations-title"
                    className="font-display text-2xl sm:text-3xl"
                  >
                    Recent creations
                  </h2>
                  <p className="mt-1 text-sm text-[var(--arc-text-muted)]">
                    Browse your saved work, newest first.
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Filter creations"
                  className="flex flex-wrap gap-2"
                >
                  {filters.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={filter === id}
                      onClick={() => setFilter(id)}
                      className="min-h-11 rounded-[var(--arc-radius-full)] border border-[var(--arc-cosmic-border)] px-4 py-2 text-sm text-[var(--arc-text-secondary)] aria-pressed:border-[var(--arc-brand-atlantean-teal)] aria-pressed:bg-[var(--arc-cosmic-raised)] aria-pressed:text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {filterLoading ? (
                <p
                  role="status"
                  className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-6 text-sm text-[var(--arc-text-secondary)]"
                >
                  Loading{" "}
                  {filters
                    .find((item) => item.id === filter)
                    ?.label.toLowerCase()}
                  …
                </p>
              ) : snapshot?.error ? (
                <div
                  role="alert"
                  className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-6"
                >
                  <p className="text-sm text-[var(--arc-text-secondary)]">
                    Your creations could not load.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSnapshot(null);
                      setRetry((value) => value + 1);
                    }}
                    className="mt-4 min-h-11 rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                  >
                    Try again
                  </button>
                </div>
              ) : items.length === 0 ? (
                <p className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-6 text-sm text-[var(--arc-text-secondary)]">
                  {filter === "all"
                    ? "No saved creations yet."
                    : `No ${filters.find((item) => item.id === filter)?.label.toLowerCase()} saved yet.`}
                </p>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                  {items.map((creation) => (
                    <CreationRow
                      key={creation.id}
                      creation={creation}
                      userId={user.id}
                    />
                  ))}
                </ul>
              )}
              {!filterLoading &&
                !snapshot?.error &&
                loadMoreErrorKey === currentKey && (
                  <p
                    role="alert"
                    className="mt-4 text-sm text-[var(--arc-text-secondary)]"
                  >
                    More creations could not load. Try again.
                  </p>
                )}
              {!filterLoading && !snapshot?.error && snapshot?.hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadingMoreKey !== null}
                    className="min-h-11 rounded-[var(--arc-radius-full)] border border-[var(--arc-cosmic-border-bright)] px-6 py-2 text-sm font-medium hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
                  >
                    {loadingMoreKey === currentKey ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
