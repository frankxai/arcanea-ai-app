"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  DocEditor,
  type DocEditorSavePayload,
} from "@/components/docs/doc-editor";
import type { JSONContent } from "novel";

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
}

interface SaveRequest {
  payload: DocEditorSavePayload;
  revision: number;
}

export function AuthorEditor({
  bookSlug,
  chapterSlug,
  initialHtml,
}: AuthorEditorProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latest = useRef<SaveRequest | null>(null);
  const signature = useRef<string | null>(null);
  const confirmedRevision = useRef(0);
  const pending = useRef<SaveRequest | null>(null);
  const activeRevision = useRef<number | null>(null);

  const handleChange = useCallback((payload: DocEditorSavePayload) => {
    const nextSignature = JSON.stringify([
      payload.content_json,
      payload.content_text,
    ]);
    if (signature.current !== nextSignature) {
      signature.current = nextSignature;
      latest.current = {
        payload,
        revision: (latest.current?.revision ?? 0) + 1,
      };
      setDirty(true);
    }
    setWordCount(payload.word_count);
  }, []);

  const handleSave = useCallback(
    async (payload: DocEditorSavePayload) => {
      handleChange(payload);
      const request = latest.current;
      if (
        !request ||
        request.revision <= confirmedRevision.current ||
        request.revision === activeRevision.current
      )
        return;

      pending.current = request;
      if (activeRevision.current !== null) return;

      setSaving(true);
      setSaveError(null);
      try {
        // One write at a time; keep only the latest queued snapshot.
        while (pending.current) {
          const next = pending.current;
          pending.current = null;
          activeRevision.current = next.revision;
          try {
            const response = await fetch(
              `/api/author/${encodeURIComponent(bookSlug)}/chapters/${encodeURIComponent(chapterSlug)}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: next.payload.content_text,
                  contentJson: next.payload.content_json,
                }),
              },
            );
            if (!response.ok) {
              if (response.status === 401) {
                throw new Error(
                  "Sign in to save. Keep this page open or download your text before signing in.",
                );
              }
              if (response.status === 403) {
                throw new Error(
                  "This account cannot save this chapter. Download your text to keep a copy.",
                );
              }
              throw new Error(
                "Could not save your draft. Retry or download your text to keep a copy.",
              );
            }
            const result: unknown = await response.json();
            if (
              !result ||
              typeof result !== "object" ||
              !("success" in result) ||
              result.success !== true ||
              !("source" in result) ||
              result.source !== "draft"
            ) {
              throw new Error(
                "Could not confirm your draft was saved. Retry or download your text.",
              );
            }

            confirmedRevision.current = next.revision;
            setLastSaved(new Date());
            setDirty((latest.current?.revision ?? 0) > next.revision);
            setSaveError(null);
          } catch (error) {
            // Preserve edits after any failure; retry explicitly from the latest snapshot.
            pending.current = null;
            setDirty(true);
            setSaveError(
              error instanceof Error
                ? error.message
                : "Could not save your draft. Retry or download your text to keep a copy.",
            );
            break;
          }
        }
      } finally {
        activeRevision.current = null;
        setSaving(false);
      }
    },
    [bookSlug, chapterSlug, handleChange],
  );

  const saveLatest = useCallback(() => {
    if (latest.current) void handleSave(latest.current.payload);
  }, [handleSave]);

  useEffect(() => {
    const saveShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveLatest();
      }
    };
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if ((latest.current?.revision ?? 0) > confirmedRevision.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("keydown", saveShortcut);
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => {
      window.removeEventListener("keydown", saveShortcut);
      window.removeEventListener("beforeunload", warnBeforeLeaving);
    };
  }, [saveLatest]);

  const downloadText = useCallback(() => {
    if (!latest.current) return;
    const blob = new Blob([latest.current.payload.content_text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bookSlug}-${chapterSlug}-draft.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [bookSlug, chapterSlug]);

  return (
    <div className="relative">
      {saveError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm leading-relaxed text-amber-200"
        >
          <strong>Unsaved changes.</strong> {saveError}
        </div>
      )}

      <DocEditor
        initialContent={initialHtml as unknown as JSONContent}
        onChange={handleChange}
        onSave={handleSave}
        saveDelay={2000}
        placeholder="Start writing your chapter..."
      />

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[var(--arc-cosmic-void)]/95 px-2 py-3 text-xs text-white/65 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{Math.max(1, Math.ceil(wordCount / 250))} min read</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span role="status" aria-live="polite">
            {saving
              ? "Saving…"
              : dirty
                ? "Unsaved changes"
                : lastSaved
                  ? `Draft saved ${lastSaved.toLocaleTimeString()}`
                  : "Ready to write"}
          </span>
          {dirty && (
            <>
              <button
                type="button"
                onClick={saveLatest}
                disabled={saving}
                className="min-h-11 rounded-lg border border-white/20 px-3 text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
              >
                {saveError ? "Retry save" : "Save now"}
              </button>
              <button
                type="button"
                onClick={downloadText}
                className="min-h-11 rounded-lg px-3 text-white/90 underline underline-offset-4 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Download text
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
