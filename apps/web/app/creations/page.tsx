"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FilmStrip,
  ImageSquare,
  MusicNote,
  Trash,
} from "@/lib/phosphor-icons";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import { creationMediaUrl } from "@/lib/media/creation-url";
import {
  CreationMediaStage,
  type MediaStageCreation,
} from "@/components/media/creation-media-stage";

type Filter = "all" | "image" | "video" | "music" | "audio";
type LibraryCreation = MediaStageCreation & { createdAt: string };
const PAGE_SIZE = 24;
const columns =
  "id, title, type, status, content, thumbnail_url, created_at, ai_model, ai_prompt";

interface LibrarySnapshot {
  userId: string;
  filter: Filter;
  items: LibraryCreation[];
  media: LibraryCreation[];
  nextOffset: number;
  hasMore: boolean;
  error: boolean;
}

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All work" },
  { id: "image", label: "Images" },
  { id: "video", label: "Film" },
  { id: "music", label: "Music" },
  { id: "audio", label: "Audio" },
];

function mapCreation(row: {
  id: string;
  title: string;
  type: string;
  status: string;
  content: unknown;
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
    aiGenerated:
      Boolean(row.ai_model || row.ai_prompt) ||
      content?.source === "chat" ||
      (content?.mode === "image" && typeof content.prompt === "string"),
  };
}

async function fetchPage(userId: string, filter: Filter, offset: number) {
  let query = createClient()
    .from("creations")
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (filter !== "all") query = query.eq("type", filter);
  return query.range(offset, offset + PAGE_SIZE);
}

function typeLabel(type: string): string {
  if (type === "image") return "Image";
  if (type === "video") return "Film";
  if (type === "music") return "Music";
  if (type === "audio") return "Audio";
  if (type === "text") return "Writing";
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

export default function CreationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<LibrarySnapshot | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [retry, setRetry] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState(false);
  const [loadingMoreKey, setLoadingMoreKey] = useState<string | null>(null);
  const [loadMoreErrorKey, setLoadMoreErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    let active = true;
    const client = createClient();
    async function load() {
      const [itemsResult, mediaResult] = await Promise.all([
        fetchPage(userId, filter, 0),
        client
          .from("creations")
          .select(columns)
          .eq("user_id", userId)
          .in("type", ["image", "video", "music", "audio"])
          .order("created_at", { ascending: false })
          .limit(18),
      ]);
      if (!active) return;
      if (itemsResult.error || mediaResult.error) {
        setSnapshot({
          userId,
          filter,
          items: [],
          media: [],
          nextOffset: 0,
          hasMore: false,
          error: true,
        });
        return;
      }
      const rows = itemsResult.data ?? [];
      setSnapshot({
        userId,
        filter,
        items: rows.slice(0, PAGE_SIZE).map(mapCreation),
        media: (mediaResult.data ?? []).map(mapCreation),
        nextOffset: Math.min(rows.length, PAGE_SIZE),
        hasMore: rows.length > PAGE_SIZE,
        error: false,
      });
    }

    void load().catch(() => {
      if (active)
        setSnapshot({
          userId,
          filter,
          items: [],
          media: [],
          nextOffset: 0,
          hasMore: false,
          error: true,
        });
    });
    return () => {
      active = false;
    };
  }, [user, filter, retry]);

  const loading =
    authLoading ||
    (user !== null &&
      (snapshot?.userId !== user.id || snapshot.filter !== filter));
  const items = snapshot?.items ?? [];
  const currentKey = user ? `${user.id}:${filter}` : null;

  async function loadMore() {
    if (!user || !snapshot || !snapshot.hasMore || loadingMoreKey) return;
    const { id: userId } = user;
    const { nextOffset } = snapshot;
    const requestedFilter = filter;
    const key = `${userId}:${requestedFilter}`;
    setLoadingMoreKey(key);
    setLoadMoreErrorKey(null);
    try {
      const result = await fetchPage(userId, requestedFilter, nextOffset);
      if (result.error) throw result.error;
      const rows = result.data ?? [];
      setSnapshot((current) =>
        current?.userId === userId &&
        current.filter === requestedFilter &&
        current.nextOffset === nextOffset
          ? {
              ...current,
              items: [
                ...current.items,
                ...rows.slice(0, PAGE_SIZE).map(mapCreation),
              ],
              nextOffset: nextOffset + Math.min(rows.length, PAGE_SIZE),
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

  async function deleteCreation(creation: LibraryCreation) {
    if (
      !user ||
      !window.confirm(`Delete ${creation.title}? This cannot be undone.`)
    )
      return;
    setDeletingId(creation.id);
    setDeleteError(false);
    try {
      const { data, error } = await createClient()
        .from("creations")
        .delete()
        .eq("id", creation.id)
        .eq("user_id", user.id)
        .select("id")
        .single();
      if (error || !data) throw error ?? new Error("Creation not found");
      setSnapshot(null);
      setRetry((value) => value + 1);
    } catch {
      setDeleteError(true);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-cosmic-void px-4 pb-20 pt-9 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm text-white/60">Your workspace</p>
            <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Creations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              See your saved images, film, music, and other creations in one
              place.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
          >
            Open chat <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>

        {loading ? (
          <div
            className="h-[26rem] rounded-3xl border border-white/10 bg-white/[0.03]"
            role="status"
            aria-label="Loading creations"
          />
        ) : !user ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <h2 className="font-display text-3xl">
              Your work belongs with you
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
              Sign in to see your private media and saved creations.
            </p>
            <Link
              href="/auth/login?next=/creations"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-2 text-sm font-semibold text-[var(--arc-cosmic-void)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign in
            </Link>
          </section>
        ) : snapshot?.error ? (
          <section
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12"
            role="alert"
          >
            <h2 className="font-display text-3xl">
              Your creations could not load
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => {
                setSnapshot(null);
                setRetry((value) => value + 1);
              }}
              className="mt-6 min-h-11 rounded-xl border border-white/20 px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
            >
              Try again
            </button>
          </section>
        ) : (
          <>
            <CreationMediaStage creations={snapshot?.media ?? []} />

            <p className="mt-5 text-xs leading-5 text-white/50">
              Arcanea AI creations are labeled AI-generated when their source is
              recorded. Uploaded work may have a different origin.
            </p>

            <section className="mt-12" aria-labelledby="recent-creations-title">
              {deleteError && (
                <p
                  role="alert"
                  className="mb-5 rounded-xl border border-white/20 p-4 text-sm text-white/80"
                >
                  This creation could not be deleted. Try again.
                </p>
              )}
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id="recent-creations-title"
                    className="font-display text-2xl sm:text-3xl"
                  >
                    Recent creations
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
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
                      className="min-h-11 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 aria-pressed:border-[var(--arc-brand-atlantean-teal)] aria-pressed:bg-white/[0.08] aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {items.length === 0 ? (
                <p className="rounded-2xl border border-white/10 p-6 text-sm text-white/60">
                  {filter === "all"
                    ? "No saved creations yet."
                    : `No ${filters.find((item) => item.id === filter)?.label.toLowerCase()} saved yet.`}
                </p>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                  {items.map((creation) => (
                    <li
                      key={creation.id}
                      className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
                        <TypeIcon type={creation.type} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {creation.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/55">
                          {typeLabel(creation.type)} ·{" "}
                          <time dateTime={creation.createdAt}>
                            {new Date(creation.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
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
                      <button
                        type="button"
                        onClick={() => void deleteCreation(creation)}
                        disabled={deletingId !== null}
                        aria-label={`Delete ${creation.title}`}
                        className="ml-auto flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-white/55 hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-40"
                      >
                        <Trash size={18} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {loadMoreErrorKey === currentKey && (
                <p role="alert" className="mt-4 text-sm text-white/70">
                  More creations could not load. Try again.
                </p>
              )}
              {snapshot?.hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadingMoreKey !== null}
                    className="min-h-11 rounded-full border border-white/20 px-6 py-2 text-sm font-medium hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
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
