/**
 * Imagine Favorites — localStorage manifest + Vercel Blob persistence
 *
 * Flow: User hearts an image → image fetched & uploaded to Blob (permanent URL)
 *       → metadata stored in localStorage for instant access.
 *
 * No auth required. Cross-device sync would need a database (future).
 */

const STORAGE_KEY = 'arcanea-imagine-favorites';

export interface FavoriteImage {
  id: string;
  blobUrl: string;        // Permanent Vercel Blob URL
  originalUrl: string;    // Original (possibly temporary) URL
  prompt: string;
  aspectRatio?: string;
  provider?: string;
  savedAt: string;        // ISO timestamp
}

function getManifest(): FavoriteImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setManifest(favorites: FavoriteImage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Storage full — silently fail
  }
}

export function getFavorites(): FavoriteImage[] {
  return getManifest().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}

export function isFavorited(imageId: string): boolean {
  return getManifest().some((f) => f.id === imageId);
}

/**
 * Save image to Blob and add to favorites manifest.
 * Returns the permanent Blob URL on success.
 */
export async function addFavorite(image: {
  id: string;
  url: string;
  prompt: string;
  data?: string;
  mimeType?: string;
  aspectRatio?: string;
  provider?: string;
}): Promise<FavoriteImage> {
  // Already favorited? Return existing
  const existing = getManifest().find((f) => f.id === image.id);
  if (existing) return existing;

  let blobUrl = image.url;

  // Try to persist to Vercel Blob
  try {
    let imageData: string;
    let mimeType: string;

    if (image.data) {
      // Already have base64 data (Gemini responses)
      imageData = image.data;
      mimeType = image.mimeType || 'image/png';
    } else {
      // Fetch the image and convert to base64 (Grok URL responses)
      const response = await fetch(image.url);
      const blob = await response.blob();
      mimeType = blob.type || 'image/png';
      const buffer = await blob.arrayBuffer();
      imageData = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
    }

    const saveRes = await fetch('/api/imagine/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData,
        mimeType,
        prompt: image.prompt,
      }),
    });

    if (saveRes.ok) {
      const saveData = await saveRes.json();
      if (saveData.url) {
        blobUrl = saveData.url;
      }
    }
  } catch {
    // Blob save failed — use original URL (may expire)
  }

  const favorite: FavoriteImage = {
    id: image.id,
    blobUrl,
    originalUrl: image.url,
    prompt: image.prompt,
    aspectRatio: image.aspectRatio,
    provider: image.provider,
    savedAt: new Date().toISOString(),
  };

  const manifest = getManifest();
  manifest.unshift(favorite);
  setManifest(manifest);

  return favorite;
}

export function removeFavorite(imageId: string) {
  const manifest = getManifest().filter((f) => f.id !== imageId);
  setManifest(manifest);
}

export function getFavoriteCount(): number {
  return getManifest().length;
}
