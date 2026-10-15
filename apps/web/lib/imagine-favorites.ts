import {
  generatedImageBlob,
  type GenerationAuthority,
} from "./imagine/request";

export interface FavoriteImage {
  id: string;
  assetId?: string;
  favoriteRevision?: number;
  alt?: string;
  cacheWarning?: string;
  blobUrl: string;
  originalUrl: string;
  prompt: string;
  aspectRatio?: string;
  provider?: string;
  savedAt: string;
}
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function privateFavoriteUrl(url: unknown, id: unknown): boolean {
  return (
    typeof id === "string" &&
    UUID.test(id) &&
    typeof url === "string" &&
    new RegExp(`^/api/imagine/assets/${id}\\.(png|jpg|webp)$`).test(url)
  );
}

function currentAccount(authority: GenerationAuthority): boolean {
  return Boolean(
    authority?.token?.actor?.startsWith("user:") &&
    authority.scope.isCurrent(authority.token),
  );
}

function requireAccount(authority: GenerationAuthority): string {
  if (!currentAccount(authority))
    throw new Error("Sign in to the current account to save favorites.");
  return `arcanea-imagine-favorites:v2:${encodeURIComponent(authority.token.actor!)}`;
}

function savedImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (
    /^\/api\/imagine\/assets\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(?:png|jpg|webp)$/i.test(
      value,
    )
  )
    return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function readManifest(authority: GenerationAuthority): FavoriteImage[] {
  if (!currentAccount(authority) || typeof window === "undefined") return [];
  const slot = requireAccount(authority);
  try {
    const raw = localStorage.getItem(slot);
    if (!raw) return [];
    if (raw.length > 512 * 1024)
      throw Error("Manifest exceeds the local cache bound");
    const value: unknown = JSON.parse(raw);
    if (
      !Array.isArray(value) ||
      !value.every(
        (item): item is FavoriteImage =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          item.id.length <= 160 &&
          (item.assetId === undefined ||
            privateFavoriteUrl(item.blobUrl, item.assetId)) &&
          (item.favoriteRevision === undefined ||
            (Number.isSafeInteger(item.favoriteRevision) &&
              item.favoriteRevision >= 0)) &&
          savedImageUrl(item.blobUrl) &&
          typeof item.originalUrl === "string" &&
          item.originalUrl.length <= 2048 &&
          typeof item.prompt === "string" &&
          item.prompt.length <= 2000 &&
          typeof item.savedAt === "string" &&
          Number.isFinite(Date.parse(item.savedAt)) &&
          (item.aspectRatio === undefined ||
            typeof item.aspectRatio === "string") &&
          (item.provider === undefined || typeof item.provider === "string"),
      )
    )
      throw Error("Invalid favorite manifest");
    return value;
  } catch {
    throw new Error(
      "Favorites could not be read. Your saved browser data has been preserved.",
    );
  }
}

function writeManifest(
  favorites: FavoriteImage[],
  authority: GenerationAuthority,
) {
  const slot = requireAccount(authority);
  const serialized = JSON.stringify(favorites);
  if (serialized.length > 512 * 1024)
    throw new Error(
      "The local favorites cache is full. Download your image and retry after making space.",
    );
  let previous: string | null;
  try {
    previous = localStorage.getItem(slot);
  } catch {
    throw new Error(
      "Browser storage is unavailable. Your favorites have not changed.",
    );
  }
  try {
    requireAccount(authority);
    localStorage.setItem(slot, serialized);
    if (localStorage.getItem(slot) !== serialized)
      throw Error("Favorite write was not retained");
  } catch {
    try {
      if (previous === null) localStorage.removeItem(slot);
      else localStorage.setItem(slot, previous);
    } catch {
      /* Preserve the original failure; do not report a successful save. */
    }
    throw new Error(
      "Favorites could not be saved locally. Download your image and retry when browser storage is available.",
    );
  }
}

/** Legacy unscoped manifests have no owner proof. Preserve them without importing them. */
export function getFavorites(authority: GenerationAuthority): FavoriteImage[] {
  return readManifest(authority).sort(
    (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
  );
}
export function isFavorited(
  imageId: string,
  authority: GenerationAuthority,
): boolean {
  return readManifest(authority).some((favorite) => favorite.id === imageId);
}
export function getFavoriteCount(authority: GenerationAuthority): number {
  return readManifest(authority).length;
}
export async function removeFavorite(
  image: string | FavoriteImage,
  authority: GenerationAuthority,
) {
  requireAccount(authority);
  const target =
    typeof image === "string"
      ? readManifest(authority).find((row) => row.id === image)
      : image;
  if (target?.assetId) await changeCloudFavorite(target, false, authority);
  requireAccount(authority);
  try {
    writeManifest(
      readManifest(authority).filter((row) =>
        target?.assetId
          ? row.assetId !== target.assetId
          : row.id !== (typeof image === "string" ? image : image.id),
      ),
      authority,
    );
    return { cacheWarning: null };
  } catch (error) {
    if (!target?.assetId) throw error;
    return {
      cacheWarning:
        "Your cloud favorite was removed. Browser bookmarks could not be updated; their data is preserved.",
    };
  }
}

export async function addFavorite(
  image: {
    id: string;
    url: string;
    prompt: string;
    data?: string;
    mimeType?: string;
    aspectRatio?: string;
    provider?: string;
  },
  authority: GenerationAuthority,
): Promise<FavoriteImage> {
  requireAccount(authority);
  if (!image.id || image.id.length > 160 || typeof image.prompt !== "string")
    throw new Error("This image cannot be saved.");
  let cacheWarning: string | undefined;
  let existing: FavoriteImage | undefined;
  try {
    existing = readManifest(authority).find(
      (favorite) => favorite.id === image.id,
    );
  } catch {
    cacheWarning =
      "Saved to your account. Browser bookmarks could not be read; their data is preserved.";
  }
  if (existing?.assetId) {
    const updated = await changeCloudFavorite(existing, true, authority);
    return cacheConfirmedFavorite(updated, authority);
  }
  if (existing) return existing;
  const source = image.data
    ? `data:${image.mimeType || "image/png"};base64,${image.data}`
    : image.url;
  const blob = await generatedImageBlob(source, authority);
  requireAccount(authority);
  if (blob.size > 3 * 1024 * 1024)
    throw new Error(
      "Saved images must be at most 3 MiB. Download this original to keep it.",
    );
  const bytes = new Uint8Array(await blob.arrayBuffer());
  requireAccount(authority);
  const ownerId = authority.token.actor!.slice(5);
  const prompt = image.prompt.slice(0, 2000);
  const alt = prompt.trim() || "Saved creator image";
  const provider = image.provider?.slice(0, 100) ?? null;
  const sha = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  const digest = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(
          JSON.stringify([
            ownerId,
            image.id,
            sha,
            blob.type,
            prompt,
            alt,
            provider,
          ]),
        ),
      ),
    ),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  // Version 8 content-bound UUID preserves identity even if a browser cache or
  // upload acknowledgement is lost. Different metadata cannot reuse the ID.
  const assetId = `${digest.slice(0, 8)}-${digest.slice(8, 12)}-8${digest.slice(13, 16)}-${((parseInt(digest[16], 16) & 3) | 8).toString(16)}${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
  requireAccount(authority);
  const chunks: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 16384)
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + 16384)));
  const response = await fetch("/api/imagine/save", {
    method: "POST",
    credentials: "same-origin",
    redirect: "error",
    signal: AbortSignal.timeout(60000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageData: btoa(chunks.join("")),
      mimeType: blob.type,
      ownerId,
      assetId,
      prompt,
      alt,
      sourceId: image.id,
      provider,
    }),
  });
  requireAccount(authority);
  const receipt: unknown = await response.json().catch(() => null);
  requireAccount(authority);
  if (
    !response.ok ||
    !receipt ||
    typeof receipt !== "object" ||
    !("url" in receipt) ||
    !savedImageUrl(receipt.url) ||
    !("ownerId" in receipt) ||
    receipt.ownerId !== ownerId ||
    !("assetId" in receipt) ||
    receipt.assetId !== assetId ||
    receipt.url !==
      `/api/imagine/assets/${assetId}.${blob.type === "image/jpeg" ? "jpg" : blob.type.slice(6)}`
  )
    throw new Error(
      "The image was not saved. Download it now and retry saving when storage is available.",
    );
  if (
    !("favorited" in receipt) ||
    typeof receipt.favorited !== "boolean" ||
    !("favoriteRevision" in receipt) ||
    !Number.isSafeInteger(receipt.favoriteRevision) ||
    (receipt.favoriteRevision as number) < 0
  )
    throw new Error(
      "The saved favorite could not be confirmed. Retry this image to recover it.",
    );
  let favorite: FavoriteImage = {
    id: image.id,
    assetId,
    favoriteRevision: receipt.favoriteRevision as number,
    alt,
    blobUrl: receipt.url,
    originalUrl:
      !image.url.startsWith("data:") && savedImageUrl(image.url)
        ? image.url
        : "",
    prompt: image.prompt.slice(0, 2000),
    aspectRatio: image.aspectRatio,
    provider: image.provider,
    savedAt: new Date().toISOString(),
  };
  if (!receipt.favorited)
    favorite = await changeCloudFavorite(favorite, true, authority);
  requireAccount(authority);
  if (cacheWarning) return { ...favorite, cacheWarning };
  return cacheConfirmedFavorite(favorite, authority);
}

function cacheConfirmedFavorite(
  favorite: FavoriteImage,
  authority: GenerationAuthority,
): FavoriteImage {
  requireAccount(authority);
  try {
    const latest = readManifest(authority).filter(
      (row) => row.assetId !== favorite.assetId,
    );
    writeManifest([favorite, ...latest], authority);
    return favorite;
  } catch {
    return {
      ...favorite,
      cacheWarning:
        "Saved to your account. Browser bookmarks could not be updated; their data is preserved.",
    };
  }
}
export interface FavoriteCursor {
  before: string;
  id: string;
}
function validCursor(value: unknown): value is FavoriteCursor {
  return Boolean(
    value &&
    typeof value === "object" &&
    "before" in value &&
    typeof value.before === "string" &&
    value.before.length <= 50 &&
    Number.isFinite(Date.parse(value.before)) &&
    "id" in value &&
    typeof value.id === "string" &&
    UUID.test(value.id),
  );
}
function cloudImage(
  value: unknown,
  ownerId: string,
): { favorite: FavoriteImage; favorited: boolean; operationId: unknown } {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid cloud favorite acknowledgement.");
  const row = value as Record<string, unknown>;
  if (
    row.ownerId !== ownerId ||
    typeof row.assetId !== "string" ||
    !UUID.test(row.assetId) ||
    typeof row.url !== "string" ||
    !new RegExp(`^/api/imagine/assets/${row.assetId}\\.(png|jpg|webp)$`).test(
      row.url,
    ) ||
    typeof row.id !== "string" ||
    row.id.length > 160 ||
    typeof row.prompt !== "string" ||
    row.prompt.length > 2000 ||
    typeof row.alt !== "string" ||
    row.alt.length > 2000 ||
    typeof row.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(row.updatedAt)) ||
    typeof row.favorited !== "boolean" ||
    !Number.isSafeInteger(row.favoriteRevision) ||
    (row.favoriteRevision as number) < 0 ||
    (row.provider !== null &&
      row.provider !== undefined &&
      (typeof row.provider !== "string" || row.provider.length > 100))
  )
    throw Error("Invalid cloud favorite acknowledgement.");
  return {
    favorite: {
      id: row.id,
      assetId: row.assetId,
      blobUrl: row.url,
      originalUrl: "",
      prompt: row.prompt,
      alt: row.alt,
      provider: typeof row.provider === "string" ? row.provider : undefined,
      savedAt: row.updatedAt,
      favoriteRevision: row.favoriteRevision as number,
    },
    favorited: row.favorited,
    operationId: row.operationId,
  };
}
export async function loadFavoritePage(
  authority: GenerationAuthority,
  cursor: FavoriteCursor | null = null,
  signal?: AbortSignal,
): Promise<{ images: FavoriteImage[]; next: FavoriteCursor | null }> {
  requireAccount(authority);
  if (cursor !== null && !validCursor(cursor))
    throw Error("Invalid favorite page cursor.");
  const query = new URLSearchParams({ favorites: "true" });
  if (cursor) {
    query.set("before", cursor.before);
    query.set("id", cursor.id);
  }
  const response = await fetch(`/api/imagine/gallery?${query}`, {
    credentials: "same-origin",
    redirect: "error",
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(20000)])
      : AbortSignal.timeout(20000),
    cache: "no-store",
  });
  requireAccount(authority);
  const data: unknown = await response.json().catch(() => null);
  requireAccount(authority);
  if (
    !response.ok ||
    !data ||
    typeof data !== "object" ||
    !("images" in data) ||
    !Array.isArray(data.images) ||
    data.images.length > 50 ||
    !("ownerId" in data) ||
    data.ownerId !== authority.token.actor!.slice(5) ||
    !("next" in data) ||
    (data.next !== null && !validCursor(data.next))
  )
    throw Error(
      "Your account favorites could not be loaded. Retry to sync them.",
    );
  const images = data.images.map((value) =>
    cloudImage(value, authority.token.actor!.slice(5)),
  );
  if (
    images.some((row) => !row.favorited) ||
    new Set(images.map((row) => row.favorite.assetId)).size !== images.length
  )
    throw Error("Invalid cloud favorites page.");
  if (
    cursor &&
    data.next &&
    cursor.before === data.next.before &&
    cursor.id === data.next.id
  )
    throw Error("Favorites pagination did not advance.");
  return { images: images.map((row) => row.favorite), next: data.next };
}
export async function readCloudFavorite(
  image: FavoriteImage,
  authority: GenerationAuthority,
  signal?: AbortSignal,
): Promise<{
  favorite: FavoriteImage;
  favorited: boolean;
  operationId: unknown;
}> {
  requireAccount(authority);
  if (!privateFavoriteUrl(image.blobUrl, image.assetId))
    throw Error("Invalid private favorite.");
  const response = await fetch(`${image.blobUrl}?metadata=1`, {
    credentials: "same-origin",
    redirect: "error",
    cache: "no-store",
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(20000)])
      : AbortSignal.timeout(20000),
  });
  requireAccount(authority);
  const value: unknown = await response.json().catch(() => null);
  requireAccount(authority);
  if (!response.ok)
    throw Error(
      "This favorite could not be checked. Refresh your account favorites.",
    );
  const result = cloudImage(value, authority.token.actor!.slice(5));
  if (result.favorite.assetId !== image.assetId)
    throw Error("Invalid favorite acknowledgement.");
  return result;
}
export async function changeCloudFavorite(
  image: FavoriteImage,
  favorited: boolean,
  authority: GenerationAuthority,
): Promise<FavoriteImage> {
  requireAccount(authority);
  const current =
    image.favoriteRevision === undefined
      ? (await readCloudFavorite(image, authority)).favorite
      : image;
  requireAccount(authority);
  if (
    !privateFavoriteUrl(current.blobUrl, current.assetId) ||
    !Number.isSafeInteger(current.favoriteRevision) ||
    current.favoriteRevision! < 0
  )
    throw Error("Refresh your account favorites before changing this image.");
  const ownerId = authority.token.actor!.slice(5);
  const slot = `arcanea:favorite-change:v1:${encodeURIComponent(ownerId)}:${current.assetId}:${favorited}:${current.favoriteRevision}`;
  let operationId: string;
  try {
    const pending = sessionStorage.getItem(slot);
    if (pending !== null && !UUID.test(pending))
      throw Error("Invalid pending favorite identity");
    operationId = pending ?? crypto.randomUUID();
    if (!pending) {
      sessionStorage.setItem(slot, operationId);
      if (sessionStorage.getItem(slot) !== operationId)
        throw Error("Favorite identity not retained");
    }
  } catch {
    throw Error(
      "Enable browser session storage to preserve favorite-change retries.",
    );
  }
  requireAccount(authority);
  const response = await fetch(current.blobUrl, {
    method: "PATCH",
    credentials: "same-origin",
    redirect: "error",
    signal: AbortSignal.timeout(20000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerId,
      favorited,
      revision: current.favoriteRevision,
      operationId,
    }),
  });
  requireAccount(authority);
  const value: unknown = await response.json().catch(() => null);
  requireAccount(authority);
  if (!response.ok) {
    if (response.status === 409 || response.status === 404) {
      try {
        sessionStorage.removeItem(slot);
      } catch {
        /* Preserve browser failure without claiming success. */
      }
    }
    throw Error(
      response.status === 409
        ? "This image changed elsewhere. Refresh your favorites before retrying."
        : "Favorite change could not be confirmed. Retry to recover the same operation.",
    );
  }
  const result = cloudImage(value, ownerId);
  if (
    result.favorite.assetId !== current.assetId ||
    result.favorited !== favorited ||
    result.operationId !== operationId ||
    result.favorite.favoriteRevision !== current.favoriteRevision! + 1
  )
    throw Error(
      "Favorite change could not be confirmed. Retry to recover the same operation.",
    );
  requireAccount(authority);
  try {
    sessionStorage.removeItem(slot);
  } catch {
    /* A matching replay remains idempotent. */
  }
  return result.favorite;
}
