"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ReadingProgress {
  user_id: string;
  text_slug: string;
  collection_slug: string;
  completed_at: string | null;
  progress_percent: number;
}

interface QueryResult {
  data: unknown;
  error: unknown;
}

// The table is not in the generated Database type yet. Validate its rows.
interface ProgressQuery extends PromiseLike<QueryResult> {
  select(columns: string): ProgressQuery;
  eq(column: string, value: string): ProgressQuery;
  single(): ProgressQuery;
  abortSignal(signal: AbortSignal): ProgressQuery;
}
interface ProgressClient {
  from(table: "reading_progress"): {
    select(columns: string): ProgressQuery;
    upsert(
      row: ReadingProgress,
      options: { onConflict: string },
    ): ProgressQuery;
  };
}
interface Snapshot {
  owner: string | null;
  revision: number;
  phase: "loading" | "ready" | "error";
  progress: Record<string, ReadingProgress>;
  pending: string[];
  loadError: string | null;
  saveError: string | null;
}
type SaveResult = "saved" | "unavailable" | "cancelled" | "unconfirmed";
interface Session {
  owner: string;
  revision: number;
  active: boolean;
  ready: boolean;
  controllers: Set<AbortController>;
  saves: Map<string, { collection: string; promise: Promise<SaveResult> }>;
}

const COLUMNS =
  "user_id, text_slug, collection_slug, completed_at, progress_percent";
const EMPTY_PROGRESS: Record<string, ReadingProgress> = Object.freeze({});
const LOAD_ERROR = "We couldn’t load your reading progress. Try again.";
const SAVE_ERROR = "We couldn’t confirm that save. Try again.";
const REQUEST_TIMEOUT_MS = 10_000;

function emptySnapshot(owner: string | null, revision: number): Snapshot {
  return {
    owner,
    revision,
    phase: owner ? "loading" : "ready",
    progress: EMPTY_PROGRESS,
    pending: [],
    loadError: null,
    saveError: null,
  };
}

function validRow(value: unknown, owner: string): value is ReadingProgress {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    row.user_id === owner &&
    typeof row.text_slug === "string" &&
    row.text_slug.trim().length > 0 &&
    typeof row.collection_slug === "string" &&
    row.collection_slug.trim().length > 0 &&
    typeof row.progress_percent === "number" &&
    Number.isFinite(row.progress_percent) &&
    row.progress_percent >= 0 &&
    row.progress_percent <= 100 &&
    (row.completed_at === null ||
      (typeof row.completed_at === "string" &&
        Number.isFinite(Date.parse(row.completed_at)) &&
        row.progress_percent === 100))
  );
}

// Release the UI at the deadline even when a transport ignores AbortSignal.
async function request(
  operation: (signal: AbortSignal) => PromiseLike<QueryResult>,
  controller: AbortController,
): Promise<QueryResult> {
  const { signal } = controller;
  if (signal.aborted) throw new Error("Request cancelled");
  let onAbort = () => {};
  const cancellation = new Promise<never>((_, reject) => {
    onAbort = () => reject(new Error("Request cancelled or timed out"));
    signal.addEventListener("abort", onAbort, { once: true });
  });
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await Promise.race([
      Promise.resolve().then(() => {
        if (signal.aborted) throw new Error("Request cancelled");
        return operation(signal);
      }),
      cancellation,
    ]);
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

export function useReadingProgress(userId: string | null) {
  const [snapshot, setSnapshot] = useState<Snapshot>(() =>
    emptySnapshot(userId, 0),
  );
  const [loadRevision, setLoadRevision] = useState(0);
  const sessionRef = useRef<Session | null>(null);

  // Reset this component's state when its account/load input changes, before
  // React commits children. The effect owns requests, not input-derived state.
  if (snapshot.owner !== userId || snapshot.revision !== loadRevision) {
    setSnapshot(emptySnapshot(userId, loadRevision));
  }

  useEffect(() => {
    if (!userId) return;
    const session: Session = {
      owner: userId,
      revision: loadRevision,
      active: true,
      ready: false,
      controllers: new Set(),
      saves: new Map(),
    };
    sessionRef.current = session;
    const controller = new AbortController();
    session.controllers.add(controller);
    const current = () => session.active && sessionRef.current === session;

    void (async () => {
      try {
        const result = await request(
          (signal) =>
            (createClient() as unknown as ProgressClient)
              .from("reading_progress")
              .select(COLUMNS)
              .eq("user_id", userId)
              .abortSignal(signal),
          controller,
        );
        if (!current()) return;
        if (result.error || !Array.isArray(result.data))
          throw new Error("Unconfirmed load");
        const progress: Record<string, ReadingProgress> = Object.create(null);
        for (const row of result.data) {
          if (
            !validRow(row, userId) ||
            Object.hasOwn(progress, row.text_slug)
          ) {
            throw new Error("Invalid reading progress");
          }
          progress[row.text_slug] = row;
        }
        session.ready = true;
        setSnapshot({
          owner: userId,
          revision: loadRevision,
          phase: "ready",
          progress,
          pending: [],
          loadError: null,
          saveError: null,
        });
      } catch {
        if (current())
          setSnapshot({
            owner: userId,
            revision: loadRevision,
            phase: "error",
            progress: EMPTY_PROGRESS,
            pending: [],
            loadError: LOAD_ERROR,
            saveError: null,
          });
      } finally {
        session.controllers.delete(controller);
      }
    })();

    return () => {
      session.active = false;
      for (const pending of session.controllers) pending.abort();
      if (sessionRef.current === session) sessionRef.current = null;
    };
  }, [userId, loadRevision]);

  // A new account renders before effect cleanup. Hide the old snapshot now.
  const owned =
    userId !== null &&
    snapshot.owner === userId &&
    snapshot.revision === loadRevision;
  const progress = owned ? snapshot.progress : EMPTY_PROGRESS;
  const isLoading = userId !== null && (!owned || snapshot.phase === "loading");
  const loadError = owned ? snapshot.loadError : null;
  const saveError = owned ? snapshot.saveError : null;
  const isSaving = owned && snapshot.pending.length > 0;

  const markComplete = useCallback(
    (textSlug: string, collectionSlug: string): Promise<SaveResult> => {
      const session = sessionRef.current;
      if (
        !userId ||
        !session ||
        !session.active ||
        !session.ready ||
        session.owner !== userId ||
        session.revision !== loadRevision ||
        snapshot.owner !== userId ||
        snapshot.revision !== loadRevision ||
        snapshot.phase !== "ready" ||
        !textSlug.trim() ||
        !collectionSlug.trim()
      ) {
        return Promise.resolve("unavailable");
      }
      // Match the database's existing unique key (user_id, text_slug).
      const existing = session.saves.get(textSlug);
      if (existing)
        return existing.collection === collectionSlug
          ? existing.promise
          : Promise.resolve("unavailable");
      const controller = new AbortController();
      session.controllers.add(controller);
      const current = () => session.active && sessionRef.current === session;
      const completedAt = new Date().toISOString();
      const row: ReadingProgress = {
        user_id: userId,
        text_slug: textSlug,
        collection_slug: collectionSlug,
        completed_at: completedAt,
        progress_percent: 100,
      };
      setSnapshot((previous) => ({
        ...previous,
        pending: [...previous.pending, textSlug],
        saveError: null,
      }));

      const save = (async (): Promise<SaveResult> => {
        try {
          const result = await request(
            (signal) =>
              (createClient() as unknown as ProgressClient)
                .from("reading_progress")
                .upsert(row, { onConflict: "user_id,text_slug" })
                .select(COLUMNS)
                .single()
                .abortSignal(signal),
            controller,
          );
          if (!current()) return "cancelled";
          const acknowledged = result.data;
          if (
            result.error ||
            !validRow(acknowledged, userId) ||
            acknowledged.text_slug !== textSlug ||
            acknowledged.collection_slug !== collectionSlug ||
            acknowledged.progress_percent !== 100 ||
            acknowledged.completed_at === null ||
            Date.parse(acknowledged.completed_at) !== Date.parse(completedAt)
          ) {
            throw new Error("Unconfirmed save");
          }
          setSnapshot((previous) => ({
            ...previous,
            progress: { ...previous.progress, [textSlug]: acknowledged },
            saveError: null,
          }));
          return "saved";
        } catch {
          if (!current()) return "cancelled";
          setSnapshot((previous) => ({ ...previous, saveError: SAVE_ERROR }));
          return "unconfirmed";
        } finally {
          session.controllers.delete(controller);
          session.saves.delete(textSlug);
          if (current())
            setSnapshot((previous) => ({
              ...previous,
              pending: previous.pending.filter((slug) => slug !== textSlug),
            }));
        }
      })();
      session.saves.set(textSlug, {
        collection: collectionSlug,
        promise: save,
      });
      return save;
    },
    [userId, loadRevision, snapshot.owner, snapshot.phase, snapshot.revision],
  );

  const isComplete = useCallback(
    (textSlug: string) =>
      Object.hasOwn(progress, textSlug) &&
      progress[textSlug].completed_at !== null &&
      progress[textSlug].progress_percent === 100,
    [progress],
  );

  const getCollectionProgress = useCallback(
    (collectionSlug: string, totalTexts: number) => {
      const total = Number.isFinite(totalTexts)
        ? Math.max(0, Math.floor(totalTexts))
        : 0;
      const count = Object.values(progress).filter(
        (row) =>
          row.collection_slug === collectionSlug &&
          row.completed_at !== null &&
          row.progress_percent === 100,
      ).length;
      const completed = Math.min(count, total);
      return {
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [progress],
  );

  const retry = useCallback(
    () => setLoadRevision((revision) => revision + 1),
    [],
  );
  return {
    progress,
    isLoading,
    isSaving,
    loadError,
    saveError,
    retry,
    markComplete,
    isComplete,
    getCollectionProgress,
  };
}
