"use client";

import {
  useCallback,
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DocEditor,
  type DocEditorSavePayload,
} from "@/components/docs/doc-editor";
import type { JSONContent } from "novel";
import { createDraftSession } from "@/lib/author/draft-session";

class DraftSaveError extends Error {}

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
  onDraftChange?: (text: string) => void;
}

export function AuthorEditor({
  bookSlug,
  chapterSlug,
  initialHtml,
  onDraftChange,
}: AuthorEditorProps) {
  const router = useRouter();
  const [session] = useState(() => createDraftSession<DocEditorSavePayload>());
  const state = useSyncExternalStore(
    session.subscribe,
    session.snapshot,
    session.snapshot,
  );
  const [content, setContent] = useState<JSONContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [recovered, setRecovered] = useState<DocEditorSavePayload | null>(null);
  const [backupError, setBackupError] = useState(false);
  const recovering = useRef(false);
  const mounted = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const loadAbortRef = useRef<AbortController | null>(null);
  const authorRef = useRef<string | null>(null);
  const backupKey = useCallback(
    (authorId: string) =>
      `arcanea-author-draft:${authorId}:${bookSlug}:${chapterSlug}`,
    [bookSlug, chapterSlug],
  );
  const writeDraft = useCallback(
    async (payload: DocEditorSavePayload) => {
      if (!mounted.current)
        throw new DraftSaveError(
          "Chapter closed. Download a copy before leaving.",
        );
      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort(), 20_000);
      try {
        const response = await fetch(
          `/api/author/${bookSlug}/chapters/${chapterSlug}`,
          {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              authorId: authorRef.current,
              content: payload.content_text,
              contentJson: payload.content_json,
            }),
          },
        );
        if (!response.ok)
          throw new DraftSaveError(
            response.status === 401
              ? "Sign in to save this private draft. Your current edits are still here."
              : response.status === 409
                ? "Your account changed. Download this draft, then reload before saving."
                : response.status === 403
                  ? "This account cannot save this book. Download your current draft."
                  : "Saving failed. Your current edits are still here; retry or download a copy.",
          );
        const data: unknown = await response.json();
        if (
          !data ||
          typeof data !== "object" ||
          !("success" in data) ||
          data.success !== true
        )
          throw new DraftSaveError(
            "Saving was not confirmed. Retry or download your current draft.",
          );
        if (mounted.current) {
          setSaveError("");
          setLastSaved(new Date());
          if (session.snapshot().value === payload && authorRef.current) {
            try {
              localStorage.removeItem(backupKey(authorRef.current));
            } catch {
              setBackupError(true);
            }
          }
        }
      } finally {
        clearTimeout(timer);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [bookSlug, chapterSlug, session, backupKey],
  );
  const loadDraft = useCallback(async () => {
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(
        `/api/author/${bookSlug}/chapters/${chapterSlug}`,
        { cache: "no-store", signal: controller.signal },
      );
      if (!response.ok) throw new Error();
      const data: unknown = await response.json();
      if (
        !data ||
        typeof data !== "object" ||
        !("content" in data) ||
        typeof data.content !== "string" ||
        !("authorId" in data) ||
        typeof data.authorId !== "string"
      )
        throw new Error();
      if (!mounted.current || controller.signal.aborted) return;
      authorRef.current = data.authorId;
      let backup: DocEditorSavePayload | null = null;
      try {
        const raw = localStorage.getItem(backupKey(data.authorId));
        if (raw) {
          const candidate: unknown = JSON.parse(raw);
          if (
            candidate &&
            typeof candidate === "object" &&
            "content_text" in candidate &&
            typeof candidate.content_text === "string" &&
            candidate.content_text.length <= 200_000 &&
            "content_json" in candidate &&
            candidate.content_json &&
            typeof candidate.content_json === "object" &&
            "type" in candidate.content_json &&
            candidate.content_json.type === "doc" &&
            "word_count" in candidate &&
            typeof candidate.word_count === "number"
          )
            backup = candidate as DocEditorSavePayload;
        }
      } catch {
        setBackupError(true);
      }
      if (backup) {
        setRecovered(backup);
        return;
      }
      const json =
        "contentJson" in data &&
        data.contentJson &&
        typeof data.contentJson === "object"
          ? (data.contentJson as JSONContent)
          : null;
      if ("source" in data && data.source === "draft" && !json) {
        // Older drafts stored plain text; preserve line breaks without treating it as HTML.
        setContent({
          type: "doc",
          content: data.content.split("\n").map((line) => ({
            type: "paragraph",
            ...(line ? { content: [{ type: "text", text: line }] } : {}),
          })),
        });
      } else setContent(json);
      onDraftChange?.(data.content);
      setLoaded(true);
    } catch {
      if (mounted.current && loadAbortRef.current === controller)
        setLoadError(
          "Your saved draft could not be loaded. Retry before editing so an older chapter cannot overwrite it.",
        );
    } finally {
      clearTimeout(timer);
    }
  }, [bookSlug, chapterSlug, onDraftChange, backupKey]);
  useEffect(() => {
    mounted.current = true;
    const start = window.setTimeout(() => void loadDraft(), 0);
    return () => {
      mounted.current = false;
      window.clearTimeout(start);
      abortRef.current?.abort();
      loadAbortRef.current?.abort();
    };
  }, [loadDraft]);
  const flush = useCallback(async () => {
    try {
      await session.flush(writeDraft);
    } catch (error) {
      if (mounted.current)
        setSaveError(
          error instanceof DraftSaveError
            ? error.message
            : "Saving was interrupted. Your edits are still here; retry or download a copy.",
        );
    }
  }, [session, writeDraft]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void flush();
      }
    };
    const leave = (event: BeforeUnloadEvent) => {
      if (session.snapshot().dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const navigate = (event: MouseEvent) => {
      if (
        !session.snapshot().dirty ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.hasAttribute("download") ||
        link.target === "_blank"
      )
        return;
      const target = new URL(link.href);
      if (
        target.origin !== window.location.origin ||
        (target.pathname === window.location.pathname &&
          target.search === window.location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      void (async () => {
        await flush();
        if (session.snapshot().dirty) return;
        router.push(`${target.pathname}${target.search}${target.hash}`);
      })();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("beforeunload", leave);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("click", navigate, true);
    };
  }, [flush, session, router]);
  const download = () => {
    const payload = session.snapshot().value;
    if (!payload) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              schema: "arcanea.chapter-draft.v1",
              bookSlug,
              chapterSlug,
              ...payload,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bookSlug}-${chapterSlug}-draft.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const control =
    "min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return (
    <section aria-label="Chapter editor" className="min-w-0">
      {loadError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-white/15 p-4 text-sm text-white/80"
        >
          <p>{loadError}</p>
          <button
            className={control}
            onClick={() => {
              setLoadError("");
              void loadDraft();
            }}
          >
            Retry loading draft
          </button>
        </div>
      )}
      {recovered && (
        <div
          role="alert"
          aria-label="Recover chapter draft"
          className="mb-4 rounded-xl border border-white/15 p-4 text-sm text-white/80"
        >
          <p>
            This account has unsaved edits from an earlier visit. Restore them
            before continuing, or discard them and load the saved draft.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={control}
              onClick={() => {
                recovering.current = true;
                setContent(recovered.content_json);
                onDraftChange?.(recovered.content_text);
                setRecovered(null);
                setLoaded(true);
              }}
            >
              Restore unsaved edits
            </button>
            <button
              className={control}
              onClick={() => {
                try {
                  if (authorRef.current)
                    localStorage.removeItem(backupKey(authorRef.current));
                } catch {
                  setBackupError(true);
                  return;
                }
                setRecovered(null);
                void loadDraft();
              }}
            >
              Discard recovered edits
            </button>
          </div>
        </div>
      )}
      {!loaded && !loadError && !recovered && (
        <p role="status" className="text-sm text-white/70">
          Loading your draft…
        </p>
      )}
      {loaded && (
        <DocEditor
          key={`${bookSlug}/${chapterSlug}`}
          initialContent={content ?? (initialHtml as unknown as JSONContent)}
          onReady={(payload) => {
            if (recovering.current) {
              session.edit(payload);
              recovering.current = false;
            } else session.load(payload);
            onDraftChange?.(payload.content_text);
          }}
          onChange={(payload) => {
            session.edit(payload);
            try {
              if (!authorRef.current) throw new Error();
              localStorage.setItem(
                backupKey(authorRef.current),
                JSON.stringify(payload),
              );
            } catch {
              setBackupError(true);
            }
            onDraftChange?.(payload.content_text);
          }}
          onSave={flush}
          saveDelay={2000}
          placeholder="Write your chapter…"
        />
      )}
      {backupError && (
        <p role="alert" className="my-3 text-sm text-white/80">
          Browser recovery is unavailable. Keep this tab open until saving
          succeeds, or download your draft.
        </p>
      )}
      {saveError && (
        <div
          role="alert"
          aria-label="Draft save recovery"
          className="my-4 rounded-xl border border-white/15 p-4 text-sm text-white/80"
        >
          <p>{saveError}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className={control} onClick={() => void flush()}>
              Retry saving
            </button>
            <Link
              className={`${control} inline-flex items-center`}
              href="/auth/login"
            >
              Sign in
            </Link>
            <button className={control} onClick={download}>
              Download draft
            </button>
          </div>
        </div>
      )}
      {loaded && (
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[var(--arc-cosmic-void)] py-3 text-sm text-white/70">
          <span>{(state.value?.word_count ?? 0).toLocaleString()} words</span>
          <span role="status" aria-live="polite">
            {state.saving
              ? "Saving…"
              : state.dirty
                ? "Unsaved changes"
                : lastSaved
                  ? "Private draft saved"
                  : "Draft loaded"}
          </span>
          <div className="flex gap-2">
            <button
              className={control}
              onClick={() => void flush()}
              disabled={!state.dirty || state.saving}
            >
              Save draft
            </button>
            <button className={control} onClick={download}>
              Download draft
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
