"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/lib/phosphor-icons";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import {
  mapCreation,
  type LibraryCreation,
} from "@/lib/media/creation-library-data";
import {
  creationFilters as filters,
  type CreationFilter as Filter,
} from "@/lib/media/creation-library-filters";
import {
  signStageMedia,
  type MediaCache,
} from "@/lib/media/sign-creation-media";
import { CreationMediaStage } from "@/components/media/creation-media-stage";
import { CreationLibraryRow } from "@/components/media/creation-library-row";

type Cursor = { createdAt: string; id: string };
type PageAnnouncement = { key: string; text: string; total: number };
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

export default function CreationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<LibrarySnapshot | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [retry, setRetry] = useState(0);
  const [loadingMoreKey, setLoadingMoreKey] = useState<string | null>(null);
  const [loadMoreErrorKey, setLoadMoreErrorKey] = useState<string | null>(null);
  const [pageAnnouncement, setPageAnnouncement] =
    useState<PageAnnouncement | null>(null);
  const mediaCache = useRef<MediaCache<LibraryCreation> | null>(null);
  const activeUserId = user?.id;

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    let active = true;
    const client = createClient();
    async function load() {
      const cached =
        mediaCache.current?.userId === userId ? mediaCache.current : null;
      const [itemsSettled, mediaSettled] = await Promise.allSettled([
        fetchPage(userId, filter, null),
        cached
          ? Promise.resolve(null)
          : client
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
      let media = cached?.signed ?? mediaRows.map(mapCreation);
      let mediaError = !cached && (!mediaResult || Boolean(mediaResult.error));
      if (!cached && !mediaError) {
        const source = media;
        try {
          media = await signStageMedia(source, userId);
          if (!active) return;
          mediaCache.current = {
            userId,
            source,
            signed: media,
            signedAt: Date.now(),
          };
        } catch {
          media = [];
          mediaError = true;
        }
      }
      if (!active) return;
      if (itemsResult && !itemsResult.error) {
        setLoadMoreErrorKey((current) =>
          current === `${userId}:${filter}` ? null : current,
        );
        setPageAnnouncement(null);
      }
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

  useEffect(() => {
    if (!activeUserId) return;
    const userId = activeUserId;
    let active = true;
    let refreshing = false;
    async function refreshMedia() {
      const cached = mediaCache.current;
      if (
        !active ||
        refreshing ||
        !cached ||
        cached.userId !== userId ||
        Date.now() - cached.signedAt < 5 * 60 * 60 * 1000
      )
        return;
      refreshing = true;
      try {
        const media = await signStageMedia(cached.source, userId);
        if (!active || mediaCache.current !== cached) return;
        mediaCache.current = { ...cached, signed: media, signedAt: Date.now() };
        setSnapshot((current) =>
          current?.userId === userId
            ? { ...current, media, mediaError: false }
            : current,
        );
      } catch {
        // Keep the current preview and retry while the owner session is active.
      } finally {
        refreshing = false;
      }
    }
    const timer = window.setInterval(() => void refreshMedia(), 60 * 1000);
    const onVisible = () => {
      if (!document.hidden) void refreshMedia();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [activeUserId]);

  const loading =
    authLoading || (user !== null && snapshot?.userId !== user.id);
  const filterLoading = user !== null && snapshot?.filter !== filter;
  const items = snapshot?.items ?? [];
  const currentKey = user ? `${user.id}:${filter}` : null;
  const announcement =
    pageAnnouncement?.key === currentKey &&
    pageAnnouncement.total === snapshot?.items.length &&
    snapshot?.filter === filter
      ? pageAnnouncement.text
      : "";

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
      setPageAnnouncement({
        key,
        total: snapshot.items.length + pageRows.length,
        text: `${pageRows.length} more creations loaded; ${snapshot.items.length + pageRows.length} shown.${rows.length > PAGE_SIZE ? "" : " All creations loaded."}`,
      });
    } catch {
      setLoadMoreErrorKey(key);
    } finally {
      setLoadingMoreKey(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] px-4 pb-20 pt-9 text-[var(--arc-text-primary)] sm:px-6">
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
              <div
                role="alert"
                className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-6 text-sm text-[var(--arc-text-secondary)]"
              >
                Recent media previews could not load. Your saved work remains
                available below.
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                  className="ml-3 min-h-11 rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-4 font-medium text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                >
                  Try again
                </button>
              </div>
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
                      onClick={() => {
                        setPageAnnouncement(null);
                        setFilter(id);
                      }}
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
                      setPageAnnouncement(null);
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
                    <CreationLibraryRow
                      key={creation.id}
                      creation={creation}
                      userId={user.id}
                    />
                  ))}
                </ul>
              )}
              <p role="status" className="sr-only">
                {announcement}
              </p>
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
              {!filterLoading &&
                !snapshot?.error &&
                (snapshot?.hasMore || announcement) && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => void loadMore()}
                      aria-disabled={
                        loadingMoreKey !== null || !snapshot?.hasMore
                      }
                      className="min-h-11 rounded-[var(--arc-radius-full)] border border-[var(--arc-cosmic-border-bright)] px-6 py-2 text-sm font-medium hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] aria-disabled:opacity-50"
                    >
                      {loadingMoreKey === currentKey
                        ? "Loading…"
                        : snapshot?.hasMore
                          ? "Load more"
                          : "All creations loaded"}
                    </button>
                  </div>
                )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
