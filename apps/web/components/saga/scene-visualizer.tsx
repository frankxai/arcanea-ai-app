"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useAuth } from "@/lib/auth/context";
import { OPENROUTER_IMAGE_MODELS } from "@/lib/imagine/generate";
import {
  chapterHash,
  imageSource,
  normalizePassage,
  sceneBrief,
} from "@/lib/reading-scene/brief";
import {
  exportScene,
  persistScene,
  projectSceneResult,
  restoreScene,
  sceneSlot,
  type SceneSession,
} from "@/lib/reading-scene/session";
import { SceneWorkspaceView } from "./scene-workspace-view";

interface Props {
  bookId: string;
  bookTitle: string;
  chapterTitle: string;
  sourceText: string;
  readingRef: RefObject<HTMLDivElement | null>;
}

function chapterSelection(container: HTMLDivElement | null): string | null {
  const selected = window.getSelection();
  if (
    !selected ||
    !container ||
    selected.isCollapsed ||
    !container.contains(selected.anchorNode) ||
    !container.contains(selected.focusNode)
  )
    return null;
  return normalizePassage(selected.toString());
}

export function SceneVisualizer(props: Props) {
  const { user } = useAuth();
  return (
    <SceneWorkspace
      key={`${user?.id ?? "anonymous"}:${props.bookId}:${props.chapterTitle}`}
      {...props}
    />
  );
}

function SceneWorkspace({
  bookId,
  bookTitle,
  chapterTitle,
  sourceText,
  readingRef,
}: Props) {
  const { user, isLoading } = useAuth();
  const owner = user?.id ?? "anonymous";
  const [scene, setScene] = useState<SceneSession | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selection, setSelection] = useState("");
  const [replacement, setReplacement] = useState<SceneSession | null>(null);
  const [providerState, setProviderState] = useState<
    "checking" | "configured" | "unavailable" | "unknown"
  >("checking");
  const controller = useRef<AbortController | null>(null);
  const actor = useRef(owner);
  const briefRef = useRef<HTMLTextAreaElement | null>(null);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const replacementActionRef = useRef<HTMLButtonElement | null>(null);
  const revision = useRef(0);
  const focusAfterSelection = useRef(false);

  useLayoutEffect(() => {
    if (!focusAfterSelection.current || !open || !scene || replacement) return;
    workspaceRef.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
    if (briefRef.current?.disabled)
      workspaceRef.current?.focus({ preventScroll: true });
    else briefRef.current?.focus({ preventScroll: true });
    focusAfterSelection.current = false;
  }, [open, scene, replacement]);

  useLayoutEffect(() => {
    if (!open || !replacement) return;
    workspaceRef.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
    replacementActionRef.current?.focus({ preventScroll: true });
  }, [open, replacement]);

  useEffect(() => {
    const loadRevision = ++revision.current;
    const loadAbort = new AbortController();
    actor.current = owner;
    void (async () => {
      await Promise.resolve();
      if (loadAbort.signal.aborted) return;
      let hasLocalScene = false;
      try {
        const saved = restoreScene(
          sessionStorage.getItem(sceneSlot(owner, location.pathname)),
          owner,
          location.pathname,
        );
        const anonymous =
          !saved && owner !== "anonymous"
            ? restoreScene(
                sessionStorage.getItem(
                  sceneSlot("anonymous", location.pathname),
                ),
                "anonymous",
                location.pathname,
              )
            : null;
        const draft =
          anonymous && !anonymous.requestKey && !anonymous.result
            ? { ...anonymous, owner }
            : null;
        if (draft) {
          persistScene(sessionStorage, draft);
          sessionStorage.removeItem(sceneSlot("anonymous", location.pathname));
        }
        setScene(saved ?? draft);
        hasLocalScene = Boolean(saved ?? draft);
      } catch {
        setScene(null);
      }
      // Check provider configuration even when a browser draft is present.
      // A late server scene may never overwrite a newer local edit.
      if (owner !== "anonymous") {
        void fetch(
          `/api/reading-scenes?path=${encodeURIComponent(location.pathname)}`,
          {
            cache: "no-store",
            signal: AbortSignal.any([
              loadAbort.signal,
              AbortSignal.timeout(15_000),
            ]),
          },
        )
          .then(async (response) => {
            const body = await response.json();
            if (loadAbort.signal.aborted || actor.current !== owner) return;
            const configured = body.imageGeneration?.providerConfigured;
            setProviderState(
              configured === true
                ? "configured"
                : configured === false
                  ? "unavailable"
                  : "unknown",
            );
            if (!response.ok || hasLocalScene) return;
            const restored = restoreScene(
              JSON.stringify(body.scene),
              owner,
              location.pathname,
            );
            if (
              restored &&
              revision.current === loadRevision &&
              actor.current === owner
            ) {
              setScene(restored);
              try {
                persistScene(sessionStorage, restored);
              } catch {
                /* The server copy is retained. */
              }
            }
          })
          .catch(() => {
            if (!loadAbort.signal.aborted && actor.current === owner)
              setProviderState("unknown");
          });
      }
    })();
    return () => {
      actor.current = "unmounted";
      loadAbort.abort();
      controller.current?.abort();
    };
  }, [owner, bookId, chapterTitle]);

  useEffect(() => {
    function captureSelection() {
      const selected = chapterSelection(readingRef.current);
      if (selected !== null) setSelection(selected);
    }
    document.addEventListener("selectionchange", captureSelection);
    return () =>
      document.removeEventListener("selectionchange", captureSelection);
  }, [readingRef]);

  function retain(next: SceneSession) {
    revision.current++;
    setScene(next);
    try {
      persistScene(sessionStorage, next);
      return true;
    } catch {
      setMessage(
        "Browser recovery is unavailable. Download this scene before leaving.",
      );
      return false;
    }
  }

  async function selectPassage() {
    if (busy || (scene?.requestKey && !scene.result)) {
      setOpen(true);
      setMessage("Recover the pending request before starting another scene.");
      return;
    }
    try {
      // selectionchange can still be queued when a reader activates the action.
      // Snapshot the chapter selection before hashing or moving focus.
      const passage = chapterSelection(readingRef.current) ?? selection;
      const brief = sceneBrief(passage);
      const startOwner = owner;
      const hash = await chapterHash(sourceText);
      if (actor.current !== startOwner) return;
      const next: SceneSession = {
        schema: "arcanea.reading-scene.v1",
        owner,
        source: {
          bookId,
          bookTitle,
          chapterTitle,
          path: location.pathname,
          chapterHash: hash,
          passage,
        },
        brief,
        model:
          OPENROUTER_IMAGE_MODELS.find((model) => model.tier === "fast")?.id ??
          OPENROUTER_IMAGE_MODELS[0].id,
        requestKey: null,
        result: null,
        creationId: null,
      };
      if (scene) {
        setReplacement(next);
        setOpen(true);
        setMessage("");
        return;
      }
      focusAfterSelection.current = true;
      retain(next);
      setOpen(true);
      setMessage("");
      setSelection("");
    } catch (error) {
      setOpen(true);
      setMessage(
        error instanceof Error ? error.message : "Select a passage first.",
      );
    }
  }

  async function generate() {
    if (!scene || busy || replacement || !user || isLoading) return;
    if (providerState !== "configured" && !scene.requestKey) return;
    const next = {
      ...scene,
      requestKey: scene.requestKey ?? crypto.randomUUID(),
      result: null,
      creationId: null,
    };
    if (!retain(next)) return;
    const startOwner = owner;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    setMessage(
      "Creating your scene. You can stop waiting and recover this request later.",
    );
    const deadline = setTimeout(() => abort.abort(), 65_000);
    try {
      const response = await fetch("/api/imagine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          prompt: next.brief,
          requestKey: next.requestKey,
          count: 1,
          aspectRatio: "16:9",
          provider: "openrouter",
          model: next.model,
          enhance: false,
        }),
      });
      const body = await response.json();
      if (actor.current !== startOwner) return;
      if (!response.ok) {
        // Only a definite provider failure releases the identity for a new attempt.
        if (body.reason === "generation_failed")
          retain({ ...next, requestKey: null });
        setMessage(
          response.status === 401
            ? "Sign in again to recover this request."
            : response.status === 402
              ? "You need more credits. Your passage and brief are retained."
              : body.reason === "operation_pending"
                ? "This request is still running. Recover it shortly; the same request will be used."
                : "Generation is unavailable. Recover this request or download your brief.",
        );
        return;
      }
      if (
        body.status !== "completed" ||
        body.generationId !== `gen_${next.requestKey}` ||
        !Array.isArray(body.images) ||
        !body.images.length ||
        !imageSource(body.images[0])
      )
        throw new Error("Invalid generation response");
      const result = projectSceneResult(body);
      if (retain({ ...next, result }))
        setMessage("Scene created. Save privately or download a copy.");
    } catch {
      if (actor.current === startOwner)
        setMessage(
          "The response was interrupted. Recover this request to retrieve its result without starting another charge.",
        );
    } finally {
      clearTimeout(deadline);
      if (actor.current === startOwner) setBusy(false);
    }
  }

  async function save() {
    if (!scene?.result || !user || busy || !scene.requestKey) return;
    const startOwner = owner;
    setBusy(true);
    setMessage("Saving privately…");
    try {
      const response = await fetch("/api/reading-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestKey: scene.requestKey,
          source: scene.source,
          brief: scene.brief,
          model: scene.result.model,
          provider: scene.result.provider,
          image: scene.result.images[0],
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const body = await response.json();
      if (actor.current !== startOwner) return;
      if (
        !response.ok ||
        typeof body.creationId !== "string" ||
        body.visibility !== "private"
      )
        throw new Error("Private save failed");
      retain({ ...scene, creationId: body.creationId });
      setMessage(
        "Saved to your private creations. The source passage and generation details are included.",
      );
    } catch {
      if (actor.current === startOwner)
        setMessage(
          "Private save could not be confirmed. Retry the same save or download a copy.",
        );
    } finally {
      if (actor.current === startOwner) setBusy(false);
    }
  }

  function download() {
    if (!scene) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(exportScene(scene), null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${bookId}-scene.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <SceneWorkspaceView
      scene={scene}
      open={open}
      busy={busy}
      message={message}
      selection={selection}
      authenticated={Boolean(user)}
      isLoading={isLoading}
      providerState={providerState}
      bookId={bookId}
      chapterTitle={chapterTitle}
      workspaceRef={workspaceRef}
      briefRef={briefRef}
      replacementActionRef={replacementActionRef}
      selectPassage={selectPassage}
      generate={generate}
      save={save}
      download={download}
      stopWaiting={() => controller.current?.abort()}
      setOpen={setOpen}
      retain={retain}
      replacement={replacement}
      keepScene={() => {
        focusAfterSelection.current = true;
        setReplacement(null);
      }}
      replaceScene={() => {
        if (!replacement || busy || (scene?.requestKey && !scene.result))
          return;
        focusAfterSelection.current = true;
        retain(replacement);
        setReplacement(null);
        setSelection("");
        setMessage("");
      }}
    />
  );
}
