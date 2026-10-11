import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { get, put } from "@vercel/blob";
import {
  MAX_RETAINED_IMAGE_BYTES,
  PrivateAssetError,
  privateAssetPath,
  privateAssetUrl,
  type ImageMime,
  type RetainedImage,
  type PrivateAssetRepository,
  type PrivateImageStore,
} from "./private-assets";

type RpcClient = {
  rpc(
    name: string,
    args: Record<string, unknown>,
  ): PromiseLike<{
    data: unknown;
    error: { message: string; code?: string } | null;
  }>;
};
export function privateStoreToken(forNewWrite = false): string {
  const token = process.env.PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN;
  if (
    !token ||
    (forNewWrite && process.env.PRIVATE_IMAGINE_STORAGE_ENABLED !== "true")
  )
    throw new PrivateAssetError(
      503,
      "Private saving is not configured. Download your image to keep it.",
    );
  return token;
}
export async function assetRpc(
  client: unknown,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const { data, error } = await (client as RpcClient).rpc(name, args);
  if (error) {
    const status =
      error.message === "private_storage_full"
        ? 507
        : error.message === "private_asset_missing"
          ? 404
          : ["private_asset_conflict", "private_favorite_conflict"].includes(
                error.message,
              )
            ? 409
            : 503;
    const message =
      status === 507
        ? "Your storage is full. Download this image; no saved work was removed."
        : status === 404
          ? "Image not found."
          : status === 409
            ? "This image changed elsewhere. Refresh your favorites before retrying."
            : "Private saving is unavailable. Your existing images and reservations are preserved.";
    throw new PrivateAssetError(status, message);
  }
  return data;
}
export function retainedImage(value: unknown): RetainedImage {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new PrivateAssetError(503, "Private image metadata is unavailable.");
  const row = value as RetainedImage;
  if (
    !/^[a-f0-9-]{36}$/i.test(row.id) ||
    !/^[a-f0-9-]{36}$/i.test(row.user_id) ||
    !/^[a-f0-9]{64}$/.test(row.sha256) ||
    !/^[a-f0-9]{64}$/.test(row.fingerprint) ||
    !["image/png", "image/jpeg", "image/webp"].includes(row.mime_type) ||
    !Number.isInteger(row.byte_size) ||
    row.byte_size < 1 ||
    row.byte_size > MAX_RETAINED_IMAGE_BYTES ||
    !["reserved", "ready"].includes(row.status) ||
    typeof row.prompt !== "string" ||
    typeof row.alt_text !== "string" ||
    typeof row.source_id !== "string" ||
    typeof row.favorited !== "boolean" ||
    !Number.isSafeInteger(row.favorite_revision) ||
    row.favorite_revision < 0 ||
    !Number.isFinite(Date.parse(row.favorite_changed_at)) ||
    !Number.isFinite(Date.parse(row.created_at))
  )
    throw new PrivateAssetError(503, "Private image metadata is unavailable.");
  return row;
}
export function privateRepository(): PrivateAssetRepository {
  let client: unknown;
  try {
    client = createAdminClient();
  } catch {
    throw new PrivateAssetError(
      503,
      "Private saving is not configured. Download your image to keep it.",
    );
  }
  return {
    reserve: async (claim) =>
      retainedImage(
        await assetRpc(client, "imagine_reserve_private_asset", {
          p_user: claim.ownerId,
          p_id: claim.id,
          p_size: claim.bytes.length,
          p_mime: claim.mime,
          p_sha: claim.checksum,
          p_fingerprint: claim.fingerprint,
          p_prompt: claim.prompt,
          p_alt: claim.alt,
          p_source: claim.sourceId,
          p_provider: claim.provider,
        }),
      ),
    complete: async (claim) =>
      retainedImage(
        await assetRpc(client, "imagine_complete_private_asset", {
          p_user: claim.ownerId,
          p_id: claim.id,
          p_fingerprint: claim.fingerprint,
        }),
      ),
  };
}
export function privateImageStore(token: string): PrivateImageStore {
  return {
    read: async (pathname) => {
      const object = await get(pathname, {
        access: "private",
        token,
        useCache: false,
        abortSignal: AbortSignal.timeout(20000),
      });
      if (!object) return null;
      if (
        object.statusCode !== 200 ||
        object.blob.size > MAX_RETAINED_IMAGE_BYTES
      ) {
        await object.stream?.cancel();
        throw new PrivateAssetError(
          503,
          "Private image bytes are unavailable.",
        );
      }
      const reader = object.stream.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        for (;;) {
          const next = await reader.read();
          if (next.done) break;
          size += next.value.byteLength;
          if (size > MAX_RETAINED_IMAGE_BYTES)
            throw new PrivateAssetError(
              503,
              "Private image bytes are unavailable.",
            );
          chunks.push(next.value);
        }
        return { bytes: Buffer.concat(chunks), mime: object.blob.contentType };
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
    },
    put: async (pathname, bytes, mime: ImageMime) => {
      await put(pathname, bytes, {
        access: "private",
        token,
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: mime,
        abortSignal: AbortSignal.timeout(20000),
      });
    },
  };
}
export function privateAssetMetadata(asset: RetainedImage) {
  return {
    id: asset.source_id,
    assetId: asset.id,
    ownerId: asset.user_id,
    url: privateAssetUrl(asset.id, asset.mime_type),
    prompt: asset.prompt,
    alt: asset.alt_text,
    provider: asset.provider,
    uploadedAt: asset.created_at,
    updatedAt: asset.favorite_changed_at,
    size: asset.byte_size,
    favorited: asset.favorited,
    favoriteRevision: asset.favorite_revision,
    operationId: asset.last_favorite_operation,
  };
}
export async function readOwnedPrivateMetadata(
  client: unknown,
  ownerId: string,
  id: string,
) {
  const value = await assetRpc(client, "imagine_read_private_asset", {
    p_id: id,
  });
  if (!value) throw new PrivateAssetError(404, "Image not found.");
  const asset = retainedImage(value);
  if (asset.user_id !== ownerId || asset.id !== id || asset.status !== "ready")
    throw new PrivateAssetError(404, "Image not found.");
  return asset;
}
export async function readOwnedPrivateImage(
  client: unknown,
  ownerId: string,
  id: string,
) {
  const asset = await readOwnedPrivateMetadata(client, ownerId, id);
  const object = await privateImageStore(privateStoreToken()).read(
    privateAssetPath(ownerId, id, asset.mime_type),
  );
  if (
    !object ||
    object.mime !== asset.mime_type ||
    object.bytes.length !== asset.byte_size ||
    createHash("sha256").update(object.bytes).digest("hex") !== asset.sha256
  )
    throw new PrivateAssetError(
      503,
      "The saved image could not be verified. Its record is preserved.",
    );
  return { asset, bytes: object.bytes };
}
