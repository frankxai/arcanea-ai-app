"use client";

import {
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
  useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DocEditor,
  type DocEditorSavePayload,
} from "@/components/docs/doc-editor";
import {
  DOC_TYPE_LABELS,
  DOC_STATUS_LABELS,
  type DocType,
} from "@/lib/docs/types";
import { useAuth } from "@/lib/auth/context";
import {
  createDocumentDraft,
  readDocumentBackup,
  extractDocFromEnvelope,
  documentBackupKey,
  type DocApiRecord,
} from "@/lib/docs/client";
import { DocumentSaveError, type DocumentPatch } from "@/lib/docs/save";
import type { JSONContent } from "novel";

const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;
const control =
  "min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50";
type Draft = ReturnType<typeof createDocumentDraft>;
type Loaded = {
  doc: DocApiRecord;
  draft: Draft;
  initial: DocumentPatch;
  recovered: boolean;
  unreadableBackup: string | null;
  current: () => boolean;
  invalidate: () => void;
};

export default function DocEditorPage() {
  const { credentialScope } = useAuth();
  const params = useParams<{ id: string; docId: string }>();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientHydrated,
    serverHydrated,
  );
  const token = credentialScope.get();
  if (!hydrated || !token.actor)
    return (
      <p role="status" className="p-6 text-[var(--arc-text-secondary)]">
        Loading your document…
      </p>
    );
  if (token.actor === "guest")
    return (
      <div className="p-6 text-[var(--arc-text-primary)]">
        <p>Sign in to open your project document.</p>
        <Link href="/auth/login" className={control}>
          Sign in
        </Link>
      </div>
    );
  return (
    <DocumentWorkspace
      key={`${token.actor}:${token.revision}:${params.id}:${params.docId}`}
    />
  );
}

function DocumentWorkspace() {
  const { credentialScope } = useAuth();
  const params = useParams<{ id: string; docId: string }>();
  const router = useRouter();
  const [token] = useState(() => credentialScope.get());
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [epoch, setEpoch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const current = useCallback(
    () => credentialScope.isCurrent(token),
    [credentialScope, token],
  );
  const user = token.actor?.startsWith("user:") ? token.actor.slice(5) : "";
  const scope = useMemo(
    () => ({ user, project: params.id, doc: params.docId }),
    [user, params.id, params.docId],
  );
  const address = `/api/projects/${params.id}/docs/${params.docId}`;

  useEffect(() => {
    let mounted = true;
    const abort = new AbortController();
    async function open() {
      try {
        const res = await fetch(address, {
          cache: "no-store",
          signal: AbortSignal.any([abort.signal, AbortSignal.timeout(15000)]),
        });
        if (!res.ok)
          throw Error(
            res.status === 404
              ? "This document is unavailable in this project."
              : "Your document could not be opened. Retry without leaving this page.",
          );
        const doc = extractDocFromEnvelope(await res.json());
        if (
          !doc ||
          doc.id !== scope.doc ||
          doc.project_id !== scope.project ||
          doc.user_id !== scope.user ||
          !Number.isSafeInteger(doc.save_revision)
        )
          throw Error(
            "The document revision could not be verified. Editing is unavailable; retry opening it.",
          );
        if (!mounted || !current()) return;
        const initial: DocumentPatch = {
          title: doc.title,
          doc_type: doc.doc_type,
          status: doc.status,
          icon: doc.icon,
          content_json: doc.content?.content_json ?? {
            type: "doc",
            content: [],
          },
          content_text: doc.content?.content_text ?? "",
          word_count: doc.content?.word_count ?? 0,
        };
        let recovery = null;
        let storageWarning = false;
        let unreadableBackup: string | null = null;
        let preserveRawBackup = false;
        const storage = {
          getItem: (key: string) => window.localStorage.getItem(key),
          setItem: (key: string, value: string) => {
            if (preserveRawBackup)
              throw Error("Original recovery copy retained.");
            window.localStorage.setItem(key, value);
          },
          removeItem: (key: string) => {
            if (preserveRawBackup)
              throw Error("Original recovery copy retained.");
            window.localStorage.removeItem(key);
          },
        };
        try {
          recovery = readDocumentBackup(storage, scope);
          const raw = storage.getItem(documentBackupKey(scope));
          if (raw !== null && !recovery) {
            unreadableBackup = raw;
            preserveRawBackup = true;
            storageWarning = true;
          }
        } catch {
          storageWarning = true;
        }
        const draft = createDocumentDraft(
          scope,
          doc.save_revision!,
          initial,
          async (operation) => {
            if (!mounted || !current())
              throw new DocumentSaveError(
                "The account changed. Your draft is preserved for its owner.",
                409,
              );
            const response = await fetch(address, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...operation.patch,
                expected_actor: operation.expected_actor,
                expected_revision: operation.expected_revision,
                operation_id: operation.operation_id,
              }),
              signal: AbortSignal.any([
                abort.signal,
                AbortSignal.timeout(15000),
              ]),
            });
            if (!mounted || !current())
              throw new DocumentSaveError(
                "Saving was not confirmed for this account.",
                409,
              );
            const result = await response.json();
            if (!response.ok)
              throw new DocumentSaveError(
                response.status === 409
                  ? "The saved revision changed. Download your draft before reopening the saved version."
                  : "Saving was not confirmed. Retry or download your draft.",
                response.status,
              );
            return result.data?.receipt;
          },
          storage,
          () => mounted && current(),
          recovery,
        );
        setLoaded({
          doc,
          draft,
          initial: recovery?.value ?? initial,
          recovered: !!recovery,
          unreadableBackup,
          current: () => mounted && current(),
          invalidate: () => {
            mounted = false;
            abort.abort();
          },
        });
        setMessage(
          recovery
            ? "Recovered an unsaved draft from this browser. Retry saving or download it before reopening the saved version."
            : unreadableBackup !== null
              ? "An existing browser recovery copy could not be read. Download that original copy before replacing it. New edits remain in this page until saved or downloaded."
              : storageWarning
                ? "Browser backup is unavailable. Download your draft before leaving."
                : null,
        );
        setSaveError(false);
      } catch (error) {
        if (mounted && current())
          setLoadError(
            error instanceof Error
              ? error.message
              : "Your document could not be opened.",
          );
      } finally {
        if (mounted && current()) setLoading(false);
      }
    }
    void open();
    return () => {
      mounted = false;
      abort.abort();
    };
  }, [address, scope, epoch, current]);

  if (loading)
    return (
      <p role="status" className="p-6 text-[var(--arc-text-secondary)]">
        Opening your document…
      </p>
    );
  if (!loaded)
    return (
      <div className="mx-auto max-w-4xl p-6 text-[var(--arc-text-primary)]">
        <p role="alert" className="mb-4">
          {loadError}
        </p>
        <button
          className={control}
          onClick={() => {
            setLoading(true);
            setLoadError(null);
            setEpoch((x) => x + 1);
          }}
        >
          Retry opening
        </button>
        <Link
          className={`${control} ml-3 inline-flex items-center`}
          href={`/projects/${params.id}/docs`}
        >
          Back to documents
        </Link>
      </div>
    );
  return (
    <MountedEditor
      key={epoch}
      loaded={loaded}
      current={loaded.current}
      message={message}
      setMessage={setMessage}
      saveError={saveError}
      setSaveError={setSaveError}
      deleting={deleting}
      reopen={() => {
        if (!loaded.current()) return;
        if (
          (loaded.draft.snapshot().dirty || loaded.unreadableBackup !== null) &&
          !window.confirm(
            "Reopen the saved version? Download your draft first. This replaces the unsaved browser copy.",
          )
        )
          return;
        try {
          window.localStorage.removeItem(documentBackupKey(scope));
        } catch {
          setMessage(
            "The recovery copy could not be cleared. Download your draft and retry.",
          );
          return;
        }
        loaded.invalidate();
        setLoading(true);
        setLoaded(null);
        setEpoch((x) => x + 1);
      }}
      deleteDoc={async () => {
        if (
          !current() ||
          !window.confirm(
            "Delete this document and its history? This cannot be undone.",
          )
        )
          return;
        setDeleting(true);
        try {
          await loaded.draft.flush();
          if (!current()) return;
          const response = await fetch(address, {
            method: "DELETE",
            signal: AbortSignal.timeout(15000),
          });
          if (!response.ok)
            throw Error(
              "Deleting was not confirmed. Your document remains open.",
            );
          if (current()) router.push(`/projects/${params.id}/docs`);
        } catch (error) {
          if (current()) {
            setSaveError(true);
            setMessage(
              error instanceof Error
                ? error.message
                : "Deleting was not confirmed.",
            );
          }
        } finally {
          if (current()) setDeleting(false);
        }
      }}
      backHref={`/projects/${params.id}/docs`}
    />
  );
}

function MountedEditor({
  loaded,
  current,
  message,
  setMessage,
  saveError,
  setSaveError,
  deleting,
  reopen,
  deleteDoc,
  backHref,
}: {
  loaded: Loaded;
  current: () => boolean;
  message: string | null;
  setMessage: (value: string | null) => void;
  saveError: boolean;
  setSaveError: (value: boolean) => void;
  deleting: boolean;
  reopen: () => void;
  deleteDoc: () => Promise<void>;
  backHref: string;
}) {
  const { draft, doc } = loaded;
  const snapshot = useSyncExternalStore(
    draft.subscribe,
    draft.snapshot,
    draft.snapshot,
  );
  const value = snapshot.value ?? loaded.initial;
  const flush = useCallback(async () => {
    if (!current()) return;
    try {
      await draft.flush();
      if (current()) {
        setSaveError(false);
        setMessage(
          draft.backupAvailable()
            ? null
            : "Browser backup is unavailable. Download your draft before leaving.",
        );
      }
    } catch (error) {
      if (current()) {
        setSaveError(true);
        setMessage(
          error instanceof Error
            ? error.message
            : "Saving was not confirmed. Retry or download your draft.",
        );
      }
    }
  }, [draft, current, setMessage, setSaveError]);
  const edit = useCallback(
    (patch: DocumentPatch) => {
      if (!current()) return;
      draft.edit({ ...draft.snapshot().value, ...patch });
      if (!draft.backupAvailable())
        setMessage(
          "Browser backup is unavailable. Keep this page open or download your draft.",
        );
    },
    [draft, current, setMessage],
  );
  const contentChanged = useCallback(
    (payload: DocEditorSavePayload) =>
      edit({
        content_json: payload.content_json as Record<string, unknown>,
        content_text: payload.content_text,
        word_count: payload.word_count,
      }),
    [edit],
  );
  const onSave = useCallback(async () => {
    await flush();
  }, [flush]);
  useEffect(() => {
    const documentUrl = window.location.href;
    const originalHistory = { ...window.history.state };
    let guarded =
      window.history.state?.arcaneaDocumentDraftGuard === documentUrl;
    const guardBack = () => {
      if (!guarded && current() && draft.snapshot().dirty) {
        window.history.pushState(
          { ...originalHistory, arcaneaDocumentDraftGuard: documentUrl },
          "",
          documentUrl,
        );
        guarded = true;
      }
    };
    const unsubscribe = draft.subscribe(guardBack);
    guardBack();
    const back = (event: PopStateEvent) => {
      if (!guarded) return;
      // A clean Forward to another route belongs to the router, not our sentinel.
      if (!draft.snapshot().dirty && window.location.href !== documentUrl) {
        guarded = false;
        return;
      }
      event.stopImmediatePropagation();
      if (!draft.snapshot().dirty) {
        guarded = false;
        window.history.back();
        return;
      }
      window.history.pushState(
        { ...originalHistory, arcaneaDocumentDraftGuard: documentUrl },
        "",
        documentUrl,
      );
      void (async () => {
        await flush();
        if (!current() || draft.snapshot().dirty) return;
        guarded = false;
        window.history.go(-2);
      })();
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void flush();
      }
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (draft.snapshot().dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const navigation = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        link &&
        draft.snapshot().dirty &&
        !link.hasAttribute("download") &&
        !window.confirm(
          "Leave with an unsaved draft? Download it first if browser backup is unavailable.",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("popstate", back, true);
    window.addEventListener("keydown", shortcut);
    document.addEventListener("click", navigation, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      window.removeEventListener("popstate", back, true);
      window.removeEventListener("keydown", shortcut);
      unsubscribe();
      document.removeEventListener("click", navigation, true);
    };
  }, [draft, current, flush]);
  function download() {
    if (!current()) return;
    const latest = draft.snapshot().value ?? loaded.initial;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "arcanea-project-document-v1",
            doc_id: doc.id,
            title: latest.title,
            doc_type: latest.doc_type,
            status: latest.status,
            content_json: latest.content_json,
            content_text: latest.content_text,
            word_count: latest.word_count,
            confirmed_revision: draft.revision(),
            pending_operation: draft.pending(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arcanea-document-" + doc.id + ".json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadOriginalBackup() {
    if (!current() || loaded.unreadableBackup === null) return;
    const url = URL.createObjectURL(
      new Blob([loaded.unreadableBackup], { type: "application/octet-stream" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arcanea-original-recovery-" + doc.id + ".txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const status = snapshot.saving
    ? "Saving…"
    : snapshot.dirty
      ? "Unsaved changes"
      : "Saved";
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)]">
      <header
        role="region"
        aria-label="Document controls"
        className="sticky top-[var(--nav-h)] z-20 border-b border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-void)]"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link
            className={`${control} inline-flex items-center`}
            href={backHref}
          >
            Documents
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="document-type">
              Document type
            </label>
            <select
              id="document-type"
              className={control}
              value={value.doc_type ?? doc.doc_type}
              disabled={deleting}
              onChange={(event) => {
                edit({ doc_type: event.target.value });
                void flush();
              }}
            >
              {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-[var(--arc-cosmic-void)]"
                >
                  {DOC_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            <span role="status" aria-live="polite" className="text-sm">
              {status}
            </span>
            <button className={control} onClick={download}>
              Download draft
            </button>
            <button
              className={control}
              disabled={deleting || snapshot.saving}
              onClick={() => void deleteDoc()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        {(message || saveError || !draft.backupAvailable()) && (
          <section
            aria-label="Document recovery"
            className="mb-6 rounded-lg border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] p-4"
          >
            <p role={saveError ? "alert" : "status"} className="mb-3 text-sm">
              {message ??
                "Browser backup is unavailable. Download your draft before leaving."}
            </p>
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void flush();
              }}
            >
              <button
                type="submit"
                className={control}
                disabled={snapshot.saving || deleting}
              >
                Retry saving
              </button>
              <button type="button" className={control} onClick={download}>
                Download draft
              </button>
              {loaded.unreadableBackup !== null && (
                <button
                  type="button"
                  className={control}
                  onClick={downloadOriginalBackup}
                >
                  Download original recovery copy
                </button>
              )}
              <button
                type="button"
                className={control}
                disabled={snapshot.saving || deleting}
                onClick={reopen}
              >
                Reopen saved version
              </button>
            </form>
          </section>
        )}
        <label className="sr-only" htmlFor="document-title">
          Document title
        </label>
        <input
          id="document-title"
          maxLength={500}
          value={value.title ?? ""}
          disabled={deleting}
          onChange={(event) => edit({ title: event.target.value })}
          onBlur={() => void flush()}
          placeholder="Untitled"
          className="mb-8 w-full rounded bg-transparent text-3xl font-semibold placeholder:text-[var(--arc-text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
        />
        <DocEditor
          initialContent={
            loaded.initial.content_json &&
            Object.keys(loaded.initial.content_json).length
              ? (loaded.initial.content_json as JSONContent)
              : undefined
          }
          onChange={contentChanged}
          onSave={onSave}
          saveDelay={2000}
          readOnly={deleting}
        />
        <footer className="mt-8 flex gap-4 border-t border-[var(--arc-cosmic-border)] pt-5 text-sm text-[var(--arc-text-secondary)]">
          <span>{(value.word_count ?? 0).toLocaleString()} words</span>
          <span>{DOC_STATUS_LABELS[doc.status]}</span>
        </footer>
      </main>
    </div>
  );
}
