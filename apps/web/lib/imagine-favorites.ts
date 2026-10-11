import {
  generatedImageBlob,
  type GenerationAuthority,
} from "./imagine/request";

export interface FavoriteImage {
  id: string;
  blobUrl: string;
  originalUrl: string;
  prompt: string;
  aspectRatio?: string;
  provider?: string;
  savedAt: string;
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
  if (/^\/api\/imagine\/assets\/[a-f0-9-]{36}\.(?:png|jpg|webp)$/i.test(value))
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
export function removeFavorite(
  imageId: string,
  authority: GenerationAuthority,
) {
  requireAccount(authority);
  writeManifest(
    readManifest(authority).filter((favorite) => favorite.id !== imageId),
    authority,
  );
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
  const existing = readManifest(authority).find(
    (favorite) => favorite.id === image.id,
  );
  if (existing) return existing;
  const source = image.data
    ? `data:${image.mimeType || "image/png"};base64,${image.data}`
    : image.url;
  const blob = await generatedImageBlob(source);
  requireAccount(authority);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  requireAccount(authority);
  const chunks: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 16384)
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + 16384)));
  const response = await fetch("/api/imagine/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageData: btoa(chunks.join("")),
      mimeType: blob.type,
      prompt: image.prompt.slice(0, 2000),
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
    !savedImageUrl(receipt.url)
  )
    throw new Error(
      "The image was not saved. Download it now and retry saving when storage is available.",
    );
  const favorite: FavoriteImage = {
    id: image.id,
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
  // Re-read after the asynchronous upload so other completed favorites stay retained.
  const latest = readManifest(authority);
  const concurrent = latest.find((item) => item.id === image.id);
  if (concurrent) return concurrent;
  writeManifest([favorite, ...latest], authority);
  return favorite;
}
