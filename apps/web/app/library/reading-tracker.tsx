"use client";

import { useEffect } from "react";
import { CheckCircle } from "@/lib/phosphor-icons";
import { useAuth } from "@/lib/auth/context";
import { useReadingProgress } from "@/hooks/use-reading-progress";

interface ReadingTrackerProps {
  textSlug: string;
  collectionSlug: string;
}

/** End-of-article visibility requests completion; only an acknowledged save
 * displays Read. Reaching the end does not establish reading comprehension. */
export function ReadingTracker({
  textSlug,
  collectionSlug,
}: ReadingTrackerProps) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const {
    markComplete,
    isComplete,
    isLoading,
    isSaving,
    loadError,
    saveError,
    retry,
  } = useReadingProgress(userId);
  const done = isComplete(textSlug);

  useEffect(() => {
    if (!userId || isLoading || loadError || saveError || done) return;
    const article = document.getElementById("main-content");
    if (!article) return;
    let active = true;
    let pending = false;
    let marked = false;
    const sentinel = document.createElement("div");
    sentinel.className = "h-px w-full";
    sentinel.setAttribute("aria-hidden", "true");
    article.appendChild(sentinel);
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !active ||
          pending ||
          marked ||
          !entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.9,
          )
        )
          return;
        pending = true;
        void markComplete(textSlug, collectionSlug).then((result) => {
          if (active) {
            marked = result === "saved";
            pending = false;
          }
        });
      },
      { threshold: 0.9 },
    );
    observer.observe(sentinel);
    return () => {
      active = false;
      observer.disconnect();
      sentinel.remove();
    };
  }, [
    userId,
    textSlug,
    collectionSlug,
    markComplete,
    isLoading,
    loadError,
    saveError,
    done,
  ]);

  if (!user) return null;
  const buttonClass =
    "flex min-h-11 w-full items-center gap-2 rounded-lg border border-cosmic-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-atlantean-teal/50 hover:text-atlantean-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal disabled:cursor-wait motion-reduce:transition-none";

  return (
    <div
      className="rounded-xl border border-cosmic-border bg-cosmic-surface p-4"
      aria-busy={isLoading || isSaving}
    >
      {done ? (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-atlantean-teal"
        >
          <CheckCircle
            weight="fill"
            className="h-4 w-4 flex-none"
            aria-hidden="true"
          />
          <span>Read</span>
        </div>
      ) : loadError ? (
        <>
          <p role="alert" className="mb-3 text-sm text-text-secondary">
            {loadError}
          </p>
          <button type="button" onClick={retry} className={buttonClass}>
            Retry
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              void markComplete(textSlug, collectionSlug);
            }}
            disabled={isLoading || isSaving}
            className={buttonClass}
          >
            <CheckCircle className="h-4 w-4 flex-none" aria-hidden="true" />
            <span>
              {isLoading
                ? "Loading progress…"
                : isSaving
                  ? "Saving…"
                  : saveError
                    ? "Try saving again"
                    : "Mark as read"}
            </span>
          </button>
          {saveError && (
            <p role="alert" className="mt-3 text-sm text-text-secondary">
              {saveError}
            </p>
          )}
          {(isLoading || isSaving) && (
            <span role="status" className="sr-only">
              {isLoading
                ? "Loading reading progress"
                : "Saving reading progress"}
            </span>
          )}
        </>
      )}
    </div>
  );
}

interface ReadBadgeProps {
  textSlug: string;
  isComplete: boolean;
}

export function ReadBadge({ isComplete }: ReadBadgeProps) {
  if (!isComplete) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-atlantean-teal/40 bg-atlantean-teal/10 px-2 py-0.5 text-xs text-atlantean-teal"
      aria-label="Read"
    >
      <CheckCircle weight="fill" className="h-3 w-3" aria-hidden="true" />
      Read
    </span>
  );
}
