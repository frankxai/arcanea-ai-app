import type { createCredentialScope } from "../ai/provider-preferences";

export type GenerationAuthority = {
  scope: ReturnType<typeof createCredentialScope>;
  token: ReturnType<ReturnType<typeof createCredentialScope>["get"]>;
};

function assertGenerationAuthority(authority: GenerationAuthority) {
  if (
    !authority?.token?.actor?.startsWith("user:") ||
    !authority.scope.isCurrent(authority.token)
  )
    throw new Error(
      "Your account changed. Sign in and retry from the current account.",
    );
}

/** A retry retains its request key across reloads without storing prompts or images. */
export async function requestImages(
  input: Record<string, unknown>,
  authority: GenerationAuthority,
): Promise<Response> {
  return requestGeneration("image", "/api/imagine/generate", input, authority);
}

export async function requestAnimation(
  input: Record<string, unknown>,
  authority: GenerationAuthority,
): Promise<Response> {
  return requestGeneration("video", "/api/imagine/animate", input, authority);
}

async function requestGeneration(
  kind: "image" | "video",
  endpoint: string,
  input: Record<string, unknown>,
  authority: GenerationAuthority,
): Promise<Response> {
  assertGenerationAuthority(authority);
  const body = JSON.stringify(input);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  assertGenerationAuthority(authority);
  const legacySlot = `arcanea:${kind}-request:${fingerprint}`;
  const slot = `arcanea:${kind}-request:v2:${encodeURIComponent(authority.token.actor!)}:${fingerprint}`;
  const adoptionSlot = `arcanea:${kind}-request:legacy-adopted:${encodeURIComponent(authority.token.actor!)}:${fingerprint}`;
  let adoptedLegacy = false;
  let key: string | null = null;
  try {
    key = sessionStorage.getItem(slot);
    // Existing server operations are user-bound. Copy a legacy retry key without
    // deleting it; changing the key could duplicate an uncertain paid request.
    if (!key && sessionStorage.getItem(adoptionSlot) !== "1") {
      key = sessionStorage.getItem(legacySlot);
      adoptedLegacy = key !== null;
    }
  } catch {
    throw new Error(
      "Enable browser session storage to preserve generation retries.",
    );
  }
  key ??= crypto.randomUUID();
  try {
    sessionStorage.setItem(slot, key);
    if (sessionStorage.getItem(slot) !== key)
      throw new Error("Request key was not saved");
    if (adoptedLegacy) {
      sessionStorage.setItem(adoptionSlot, "1");
      if (sessionStorage.getItem(adoptionSlot) !== "1")
        throw new Error("Legacy adoption was not saved");
    }
  } catch {
    throw new Error(
      "Enable browser session storage to preserve generation retries.",
    );
  }
  assertGenerationAuthority(authority);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Preserve the pre-existing fingerprint/key slots; bind the transport to the
    // captured account without minting a second identity for an uncertain job.
    body: JSON.stringify({
      ...input,
      requestKey: key,
      ...(kind === "video" ? { ownerId: authority.token.actor!.slice(5) } : {}),
    }),
  });
  const receipt = await response
    .clone()
    .json()
    .catch(() => null);
  assertGenerationAuthority(authority);
  const confirmed =
    response.ok &&
    (kind === "video"
      ? receipt?.requestKey === key &&
        typeof receipt.videoUrl === "string" &&
        receipt.videoUrl.startsWith("https://") &&
        Number.isInteger(receipt.charged) &&
        receipt.charged >= 0
      : receipt?.generationId === `gen_${key}` &&
        Array.isArray(receipt.images) &&
        receipt.images.length > 0 &&
        receipt.images.every(
          (image: unknown) => generatedImageSource(image) !== null,
        ));
  if (confirmed || receipt?.reason === "generation_failed") {
    try {
      if (sessionStorage.getItem(slot) === key) sessionStorage.removeItem(slot);
    } catch {
      /* Storage may be disabled. */
    }
  }
  return response;
}

/** Decode only a real image artifact from the canonical generation receipt. */
export function generatedImageSource(image: unknown): string | null {
  if (!image || typeof image !== "object") return null;
  const value = image as Record<string, unknown>;
  if (typeof value.url === "string") {
    try {
      const parsed = new URL(value.url);
      if (parsed.protocol === "https:" && !parsed.username && !parsed.password)
        return value.url;
    } catch {
      /* Invalid provider URL. */
    }
  }
  if (
    typeof value.data === "string" &&
    value.data.length > 0 &&
    value.data.length % 4 === 0 &&
    /^[A-Za-z0-9+/]*={0,2}$/.test(value.data) &&
    ["image/png", "image/jpeg", "image/webp"].includes(String(value.mimeType))
  )
    return `data:${value.mimeType};base64,${value.data}`;
  return null;
}

/** Inline receipts need no network permission; CDN exports may require manual save. */
export async function generatedImageBlob(
  source: string,
  authority?: GenerationAuthority,
): Promise<Blob> {
  const maxBytes = 8 * 1024 * 1024;
  const supported = ["image/png", "image/jpeg", "image/webp"];
  const inline =
    /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
      source,
    );
  if (inline) {
    if (inline[2].length % 4 || inline[2].length > Math.ceil(maxBytes / 3) * 4)
      throw new Error("Invalid or oversized inline image");
    const decoded = atob(inline[2]);
    if (decoded.length > maxBytes)
      throw new Error("Image is too large to download");
    const bytes = Uint8Array.from(decoded, (character) =>
      character.charCodeAt(0),
    );
    return new Blob([bytes], { type: inline[1] });
  }
  const privateSource =
    /^\/api\/imagine\/assets\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(?:png|jpg|webp)$/i.test(
      source,
    );
  if (privateSource) {
    if (!authority) throw new Error("Sign in to download this private image.");
    assertGenerationAuthority(authority);
  } else {
    const parsed = new URL(source);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password)
      throw new Error("Invalid image download source");
  }
  const response = await fetch(source, {
    credentials: privateSource ? "same-origin" : "omit",
    redirect: "error",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(20000),
  });
  if (privateSource) {
    try {
      assertGenerationAuthority(authority!);
    } catch (error) {
      await response.body?.cancel();
      throw error;
    }
  }
  const type = response.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (!response.ok || !type || !supported.includes(type) || !response.body) {
    await response.body?.cancel();
    throw new Error("Image download unavailable");
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error("Image is too large to download");
      chunks.push(new Uint8Array(value));
    }
    if (!size) throw new Error("Image download is empty");
    if (privateSource) assertGenerationAuthority(authority!);
    return new Blob(chunks, { type });
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
