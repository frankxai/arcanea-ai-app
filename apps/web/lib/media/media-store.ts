/**
 * MediaStore adapter for Cloudflare R2 (Starlight Media Platform) with public-only Vercel Blob fallback.
 * Private uploads fail closed and never fall back to public Vercel Blob storage.
 */
import { put as vercelBlobPut } from "@vercel/blob";

export interface PutMediaOptions {
  key: string;
  contentType: string;
  visibility?: "private" | "public";
  category?: string;
  sha256?: string;
}

export interface StoredMediaRef {
  bucket: string;
  key: string;
  url: string;
  provider: "r2" | "vercel-blob";
}

const R2_PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || "portfolio-media-private";
const R2_PUBLIC_BUCKET = process.env.R2_PUBLIC_BUCKET || "portfolio-media-public";
const MEDIA_API_BASE = process.env.MEDIA_API_BASE_URL || "https://media-api.starlightintelligence.org";

export class MediaStore {
  private mediaApiKey: string | undefined;

  constructor(apiKey?: string) {
    this.mediaApiKey = apiKey !== undefined ? apiKey : process.env.STARLIGHT_MEDIA_API_KEY;
  }

  async put(
    data: Buffer | Uint8Array | Blob | ReadableStream,
    options: PutMediaOptions,
  ): Promise<StoredMediaRef> {
    const visibility = options.visibility || "private";
    const bucket = visibility === "public" ? R2_PUBLIC_BUCKET : R2_PRIVATE_BUCKET;

    if (this.mediaApiKey) {
      const ext = options.key.includes(".") ? options.key.split(".").pop() : "bin";
      const objectKey =
        visibility === "public" && options.sha256 && options.category
          ? `v1/arcanea/${options.category}/${options.sha256}.${ext}`
          : options.key;

      const endpoint = `${MEDIA_API_BASE}/v1/upload?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(objectKey)}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.mediaApiKey}`,
          "Content-Type": options.contentType,
        },
        body: data as BodyInit,
      });

      if (res.ok) {
        const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        return {
          bucket,
          key: objectKey,
          url:
            typeof payload.url === "string"
              ? payload.url
              : `${MEDIA_API_BASE}/v1/media/${bucket}/${objectKey}`,
          provider: "r2",
        };
      }
    }

    if (visibility !== "public") {
      throw new Error(
        "Private media upload failed: R2 private storage credential and acknowledgement are required",
      );
    }

    const blob = await vercelBlobPut(options.key, data as Blob | Buffer, {
      access: "public",
      contentType: options.contentType,
    });

    return {
      bucket: "vercel-blob",
      key: blob.url,
      url: blob.url,
      provider: "vercel-blob",
    };
  }

  async signedUrl(bucket: string, key: string, expiresInSeconds = 3600): Promise<string> {
    if (bucket === "vercel-blob") {
      if (key.startsWith("https://") || key.startsWith("http://")) {
        return key;
      }
      throw new Error("Vercel Blob retrieval requires the stored Blob URL");
    }
    if (bucket === R2_PUBLIC_BUCKET) return `${MEDIA_API_BASE}/public/${key}`;

    if (!this.mediaApiKey) {
      throw new Error("Private media signed URL requires STARLIGHT_MEDIA_API_KEY");
    }

    const res = await fetch(
      `${MEDIA_API_BASE}/v1/signed-url?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}&expires=${expiresInSeconds}`,
      { headers: { Authorization: `Bearer ${this.mediaApiKey}` } },
    );
    if (res.ok) {
      const json = (await res.json()) as { url?: string };
      if (json.url) return json.url;
    }
    throw new Error("Failed to obtain signed URL for private media object");
  }

  async promote(
    sourceBucket: string,
    sourceKey: string,
    targetCategory: string,
    sha256: string,
  ): Promise<StoredMediaRef> {
    if (!this.mediaApiKey) {
      throw new Error("Media promotion failed: STARLIGHT_MEDIA_API_KEY is required");
    }

    const ext = sourceKey.includes(".") ? sourceKey.split(".").pop() : "bin";
    const targetKey = `v1/arcanea/${targetCategory}/${sha256}.${ext}`;

    const res = await fetch(`${MEDIA_API_BASE}/v1/promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.mediaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceBucket,
        sourceKey,
        targetBucket: R2_PUBLIC_BUCKET,
        targetKey,
      }),
    });

    if (!res.ok) {
      throw new Error(`Media promotion failed with status ${res.status}`);
    }

    const json = (await res.json().catch(() => ({}))) as { url?: string };
    return {
      bucket: R2_PUBLIC_BUCKET,
      key: targetKey,
      url: json.url || `${MEDIA_API_BASE}/public/${targetKey}`,
      provider: "r2",
    };
  }
}

export function createMediaStore(apiKey?: string): MediaStore {
  return new MediaStore(apiKey);
}
