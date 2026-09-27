"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "@/lib/phosphor-icons";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import {
  fetchCreationPage,
  mapCreation,
  PAGE_SIZE,
  type Cursor,
  type LibraryCreation,
} from "@/lib/media/creation-library-data";
import {
  creationFilters as filters,
  type CreationFilter as Filter,
} from "@/lib/media/creation-library-filters";
import {
  maskUnsignedPrivateStageMedia,
  signStageMedia,
  type MediaCache,
} from "@/lib/media/sign-creation-media";
import { CreationMediaStage } from "@/components/media/creation-media-stage";
import { CreationLibraryRow } from "@/components/media/creation-library-row";
import { CreationsLoading } from "@/components/media/creations-loading";

type PageAnnouncement = { key: string; text: string; total: number };
const stageColumns =
  "id, title, type, status, content, thumbnail_url, created_at, ai_model, ai_prompt";

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

function CreationsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [snapshot, setSnapshot] = useState<LibrarySnapshot | null>(null);
  const filter: Filter =
    filters.find(({ id }) => id === searchParams?.get("view"))?.id ?? "all";
  const [retry, setRetry] = useState(0);
  const [mediaRetrying, setMediaRetrying] = useState(false);
  const [loadingMoreKey, setLoadingMoreKey] = useState<string | null>(null);
  const [loadMoreErrorKey, setLoadMoreErrorKey] = useState<string | null>(null);
  const [pageAnnouncement, setPageAnnouncement] =
    useState<PageAnnouncement | null>(null);
  const mediaCache = useRef<MediaCache<LibraryCreation> | null>(null);
  const mediaRetryInFlight = useRef(false);
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
        fetchCreationPage(userId, filter, null),
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
      let mediaError = cached
        ? cached.partialFailure
        : !mediaResult || Boolean(mediaResult.error);
      if (!cached && !mediaError) {
        const source = media;
        try {
          const signed = await signStageMedia(source, userId);
          media = signed.creations;
          mediaError = signed.partialFailure;
          if (!active) return;
          mediaCache.current = {
            userId,
            source,
            signed: media,
            signedAt: Date.now(),
            partialFailure: signed.partialFailure,
          };
        } catch {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          media = supabaseUrl
            ? maskUnsignedPrivateStageMedia(source, userId, supabaseUrl)
            : source;
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
      mediaRetryInFlight.current = false;
      setMediaRetrying(false);
    }

    void load().catch(() => {
      if (active) {
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
        mediaRetryInFlight.current = false;
        setMediaRetrying(false);
      }
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
    let lastFailedAttemptAt = 0;
    async function refreshMedia(reason: "interval" | "visibility") {
      const cached = mediaCache.current;
      const now = Date.now();
      if (
        !active ||
        refreshing ||
        !cached ||
        cached.userId !== userId ||
        (cached.partialFailure
          ? reason !== "visibility" || now - cached.signedAt < 15 * 60 * 1000
          : now - cached.signedAt < 5 * 60 * 60 * 1000) ||
        now - lastFailedAttemptAt < 15 * 60 * 1000
      )
        return;
      refreshing = true;
      try {
        const signed = await signStageMedia(cached.source, userId);
        if (!active || mediaCache.current !== cached) return;
        mediaCache.current = {
          ...cached,
          signed: signed.creations,
          signedAt: Date.now(),
          partialFailure: signed.partialFailure,
        };
        setSnapshot((current) =>
          current?.userId === userId
            ? {
                ...current,
                media: signed.creations,
                mediaError: signed.partialFailure,
              }
            : current,
        );
      } catch {
        // Keep the current preview and back off after a failed refresh.
        lastFailedAttemptAt = Date.now();
      } finally {
        refreshing = false;
      }
    }
    const timer = window.setInterval(
      () => void refreshMedia("interval"),
      60 * 1000,
    );
    const onVisible = () => {
      if (!document.hidden) void refreshMedia("visibility");
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
      const result = await fetchCreationPage(
        userId,
        requestedFilter,
        nextCursor,
      );
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
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] px-[var(--arc-space-media-page-gutter)] pb-[var(--arc-space-media-page-bottom)] pt-[var(--arc-space-media-page-top)] text-[var(--arc-text-primary)] sm:px-[var(--arc-space-media-page-gutter-wide)]">
      <div className="mx-auto max-w-[var(--arc-size-media-page-max)]">
        <header className="mb-[var(--arc-media-space-200)] flex flex-wrap items-end justify-between gap-[var(--arc-media-space-125)]">
          <div>
            <p className="mb-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]">
              Your workspace
            </p>
            <h1 className="font-display text-[length:var(--arc-type-media-page-title)] font-medium tracking-tight sm:text-[length:var(--arc-type-media-page-title-wide)]">
              Creations
            </h1>
            <p className="mt-[var(--arc-media-space-075)] max-w-[var(--arc-size-media-description-max)] text-[length:var(--arc-type-media-body)] leading-[var(--arc-line-media-body)] text-[var(--arc-text-secondary)]">
              See your saved images, film, music, and other creations in one
              place.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex min-h-[var(--arc-size-interactive-min)] items-center gap-[var(--arc-media-space-050)] rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-[var(--arc-media-space-100)] py-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] font-medium text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
          >
            Open chat <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>

        {loading ? (
          <div
            className="h-[var(--arc-size-media-loading)] rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)]"
            role="status"
            aria-label="Loading creations"
          />
        ) : !user ? (
          <section className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-[var(--arc-media-space-200)] sm:p-[var(--arc-media-space-300)]">
            <h2 className="font-display text-[length:var(--arc-type-media-section-title-wide)]">
              Your work belongs with you
            </h2>
            <p className="mt-[var(--arc-media-space-075)] max-w-[var(--arc-size-media-signin-copy-max)] text-[length:var(--arc-type-media-body)] leading-[var(--arc-line-media-reading)] text-[var(--arc-text-secondary)]">
              Sign in to see your private media and saved creations.
            </p>
            <Link
              href="/auth/login?next=/creations"
              className="mt-[var(--arc-media-space-150)] inline-flex min-h-[var(--arc-size-interactive-min)] items-center rounded-[var(--arc-radius-xl)] bg-[var(--arc-brand-atlantean-teal)] px-[var(--arc-media-space-125)] py-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] font-semibold text-[var(--arc-cosmic-void)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-text-primary)]"
            >
              Sign in
            </Link>
          </section>
        ) : (
          <>
            {snapshot?.mediaError && (
              <div
                role="alert"
                aria-busy={mediaRetrying}
                className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-[var(--arc-media-space-150)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]"
              >
                Some recent media previews could not load. Try again.
                <button
                  type="button"
                  onClick={() => {
                    if (mediaRetryInFlight.current) return;
                    mediaRetryInFlight.current = true;
                    setMediaRetrying(true);
                    mediaCache.current = null;
                    setRetry((value) => value + 1);
                  }}
                  disabled={mediaRetrying}
                  className="ml-[var(--arc-media-space-075)] min-h-[var(--arc-size-interactive-min)] rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-[var(--arc-media-space-100)] font-medium text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                >
                  {mediaRetrying ? "Retrying…" : "Try again"}
                </button>
              </div>
            )}
            {(!snapshot?.mediaError || (snapshot?.media.length ?? 0) > 0) && (
              <CreationMediaStage creations={snapshot?.media ?? []} />
            )}

            <p className="mt-[var(--arc-media-space-125)] text-[length:var(--arc-type-media-note)] leading-[var(--arc-line-media-note)] text-[var(--arc-text-muted)]">
              Arcanea AI creations are labeled AI-generated when their source is
              recorded. Uploaded work may have a different origin.
            </p>

            <section
              className="mt-[var(--arc-media-space-300)]"
              aria-labelledby="recent-creations-title"
            >
              <div className="mb-[var(--arc-media-space-125)] flex flex-wrap items-end justify-between gap-[var(--arc-media-space-100)]">
                <div>
                  <h2
                    id="recent-creations-title"
                    className="font-display text-[length:var(--arc-type-media-section-title)] sm:text-[length:var(--arc-type-media-section-title-wide)]"
                  >
                    Recent creations
                  </h2>
                  <p className="mt-[var(--arc-media-space-025)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-muted)]">
                    Browse your saved work, newest first.
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Filter creations"
                  className="flex flex-wrap gap-[var(--arc-media-space-050)]"
                >
                  {filters.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={filter === id}
                      onClick={() => {
                        setPageAnnouncement(null);
                        if (filter === id) return;
                        const nextUrl = new URL(window.location.href);
                        if (id === "all") nextUrl.searchParams.delete("view");
                        else nextUrl.searchParams.set("view", id);
                        window.history.pushState(null, "", nextUrl);
                      }}
                      className="min-h-[var(--arc-size-interactive-min)] rounded-[var(--arc-radius-full)] border border-[var(--arc-cosmic-border)] px-[var(--arc-media-space-100)] py-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)] aria-pressed:border-[var(--arc-brand-atlantean-teal)] aria-pressed:bg-[var(--arc-cosmic-raised)] aria-pressed:text-[var(--arc-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {filterLoading ? (
                <p
                  role="status"
                  className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-[var(--arc-media-space-150)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]"
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
                  className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-[var(--arc-media-space-150)]"
                >
                  <p className="text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]">
                    Your creations could not load.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPageAnnouncement(null);
                      setSnapshot(null);
                      setRetry((value) => value + 1);
                    }}
                    className="mt-[var(--arc-media-space-100)] min-h-[var(--arc-size-interactive-min)] rounded-[var(--arc-radius-xl)] border border-[var(--arc-cosmic-border-bright)] px-[var(--arc-media-space-125)] py-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                  >
                    Try again
                  </button>
                </div>
              ) : items.length === 0 ? (
                <p className="rounded-[var(--arc-radius-2xl)] border border-[var(--arc-cosmic-border)] p-[var(--arc-media-space-150)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]">
                  {filter === "all"
                    ? "No saved creations yet."
                    : `No ${filters.find((item) => item.id === filter)?.label.toLowerCase()} saved yet.`}
                </p>
              ) : (
                <ul className="grid gap-[var(--arc-media-space-075)] md:grid-cols-2">
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
                    className="mt-[var(--arc-media-space-100)] text-[length:var(--arc-type-media-body)] text-[var(--arc-text-secondary)]"
                  >
                    More creations could not load. Try again.
                  </p>
                )}
              {!filterLoading &&
                !snapshot?.error &&
                (snapshot?.hasMore || announcement) && (
                  <div className="mt-[var(--arc-media-space-150)] flex justify-center">
                    <button
                      type="button"
                      onClick={() => void loadMore()}
                      aria-disabled={
                        loadingMoreKey !== null || !snapshot?.hasMore
                      }
                      className="min-h-[var(--arc-size-interactive-min)] rounded-[var(--arc-radius-full)] border border-[var(--arc-cosmic-border-bright)] px-[var(--arc-media-space-150)] py-[var(--arc-media-space-050)] text-[length:var(--arc-type-media-body)] font-medium hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] aria-disabled:opacity-50"
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

export default function CreationsPage() {
  return (
    <Suspense fallback={<CreationsLoading />}>
      <CreationsContent />
    </Suspense>
  );
}
