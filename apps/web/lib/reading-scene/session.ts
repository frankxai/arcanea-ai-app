import type { ImagineGenerationResponse } from "../imagine/contracts";
import type { SceneSource } from "./brief";
import { imageSource } from "./brief";

export interface SceneSession {
  schema: "arcanea.reading-scene.v1";
  owner: string;
  source: SceneSource;
  brief: string;
  model: string;
  requestKey: string | null;
  result: Pick<
    ImagineGenerationResponse,
    "generationId" | "status" | "provider" | "model" | "images"
  > | null;
  creationId: string | null;
}

/** A TypeScript Pick does not remove runtime billing or provider metadata. */
export function projectSceneResult(
  result: NonNullable<SceneSession["result"]>,
): NonNullable<SceneSession["result"]> {
  return {
    generationId: result.generationId,
    status: result.status,
    provider: result.provider,
    model: result.model,
    images: result.images.map((image) => ({
      ...(typeof image.url === "string" ? { url: image.url } : {}),
      ...(typeof image.data === "string" ? { data: image.data } : {}),
      ...(typeof image.mimeType === "string"
        ? { mimeType: image.mimeType }
        : {}),
      ...(typeof image.prompt === "string" ? { prompt: image.prompt } : {}),
      ...(typeof image.revisedPrompt === "string"
        ? { revisedPrompt: image.revisedPrompt }
        : {}),
    })),
  };
}

/** Portable source and image provenance excludes account and database state. */
export function exportScene(session: SceneSession) {
  const { source } = session;
  return {
    schema: "arcanea.reading-scene-export.v1" as const,
    source: {
      bookId: source.bookId,
      bookTitle: source.bookTitle,
      chapterTitle: source.chapterTitle,
      path: source.path,
      chapterHash: source.chapterHash,
      passage: source.passage,
    },
    brief: session.brief,
    model: session.model,
    result: session.result ? projectSceneResult(session.result) : null,
  };
}

export function sceneSlot(owner: string, path: string): string {
  return `arcanea:reading-scene:v1:${encodeURIComponent(owner)}:${encodeURIComponent(path)}`;
}

export function restoreScene(
  raw: string | null,
  owner: string,
  path: string,
): SceneSession | null {
  if (!raw || raw.length > 4_200_000) return null;
  try {
    const s = JSON.parse(raw) as SceneSession;
    if (
      s.schema !== "arcanea.reading-scene.v1" ||
      s.owner !== owner ||
      s.source?.path !== path ||
      !/^\/books\/[a-z0-9-]+\/[a-z0-9-]+$/.test(path) ||
      typeof s.brief !== "string" ||
      s.brief.length > 2000 ||
      typeof s.source.bookId !== "string" ||
      typeof s.source.bookTitle !== "string" ||
      typeof s.source.chapterTitle !== "string" ||
      typeof s.source.passage !== "string" ||
      s.source.passage.length < 12 ||
      s.source.passage.length > 1200 ||
      !/^[a-f0-9]{64}$/.test(s.source.chapterHash) ||
      typeof s.model !== "string" ||
      (s.requestKey !== null && !/^[a-f0-9-]{36}$/i.test(s.requestKey)) ||
      (s.creationId !== null && !/^[a-f0-9-]{36}$/i.test(s.creationId)) ||
      (s.result !== null &&
        (s.result.status !== "completed" ||
          typeof s.result.model !== "string" ||
          !["grok", "openrouter", "gemini"].includes(s.result.provider) ||
          s.result.generationId !== `gen_${s.requestKey}` ||
          !Array.isArray(s.result.images) ||
          s.result.images.length !== 1 ||
          !imageSource(s.result.images[0])))
    )
      return null;
    return {
      schema: s.schema,
      owner: s.owner,
      source: exportScene(s).source,
      brief: s.brief,
      model: s.model,
      requestKey: s.requestKey,
      result: s.result ? projectSceneResult(s.result) : null,
      creationId: s.creationId,
    };
  } catch {
    return null;
  }
}

/** Must succeed before a provider request, so retries preserve their identity. */
export function persistScene(
  storage: Pick<Storage, "setItem" | "getItem">,
  session: SceneSession,
): void {
  const slot = sceneSlot(session.owner, session.source.path);
  const raw = JSON.stringify({
    ...session,
    result: session.result ? projectSceneResult(session.result) : null,
  });
  storage.setItem(slot, raw);
  if (storage.getItem(slot) !== raw)
    throw new Error(
      "Your browser could not retain this scene. Download a copy before leaving.",
    );
}
