import { createHash } from "node:crypto";

// Base64 JSON remains below Vercel's 4.5 MB incoming request bound. Larger
// originals remain downloadable; a governed direct-upload path is separate work.
export const MAX_RETAINED_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_IMAGE_JSON_BYTES = 4 * 1024 * 1024 + 65536;
export const IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;
export type ImageMime = keyof typeof IMAGE_TYPES;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export class PrivateAssetError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
export function privateAssetId(value: unknown): string {
  if (typeof value !== "string" || !UUID.test(value))
    throw new PrivateAssetError(400, "A stable image identifier is required.");
  return value.toLowerCase();
}
export function privateAssetHandle(
  value: string,
): { id: string; extension: string } | null {
  const match =
    /^\/api\/imagine\/assets\/([a-f0-9-]{36})\.(png|jpg|webp)$/i.exec(value);
  if (!match || !UUID.test(match[1])) return null;
  return { id: match[1].toLowerCase(), extension: match[2].toLowerCase() };
}
export function privateAssetPath(
  ownerId: string,
  id: string,
  mime: ImageMime,
): string {
  return `imagine-private/${privateAssetId(ownerId)}/${privateAssetId(id)}.${IMAGE_TYPES[mime]}`;
}
export function privateAssetUrl(id: string, mime: ImageMime): string {
  return `/api/imagine/assets/${privateAssetId(id)}.${IMAGE_TYPES[mime]}`;
}
export async function boundedJson(
  request: Request,
  limit = MAX_IMAGE_JSON_BYTES,
): Promise<unknown> {
  const tooLarge =
    limit === MAX_IMAGE_JSON_BYTES
      ? "Saved images must be at most 3 MiB."
      : "The favorite change request is too large.";
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit))
    throw new PrivateAssetError(413, tooLarge);
  if (!request.body)
    throw new PrivateAssetError(400, "Image data is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > limit) throw new PrivateAssetError(413, tooLarge);
      chunks.push(next.value);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new PrivateAssetError(400, "Invalid image request.");
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
export interface ImageClaim {
  id: string;
  ownerId: string;
  bytes: Buffer;
  mime: ImageMime;
  checksum: string;
  fingerprint: string;
  prompt: string;
  alt: string;
  sourceId: string;
  provider: string | null;
}
export function parseImageClaim(input: unknown, actor: string): ImageClaim {
  const ownerId = privateAssetId(actor);
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new PrivateAssetError(400, "Invalid image request.");
  const body = input as Record<string, unknown>;
  if (body.ownerId !== ownerId)
    throw new PrivateAssetError(
      409,
      "Your account changed. Retry from the current account.",
    );
  const id = privateAssetId(body.assetId);
  const mime = body.mimeType;
  if (typeof mime !== "string" || !Object.hasOwn(IMAGE_TYPES, mime))
    throw new PrivateAssetError(400, "Use a PNG, JPEG or WEBP image.");
  const data = body.imageData;
  if (
    typeof data !== "string" ||
    !data.length ||
    data.length > 4 * 1024 * 1024 ||
    data.length % 4 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(data)
  )
    throw new PrivateAssetError(400, "Invalid image encoding.");
  const bytes = Buffer.from(data, "base64");
  if (!bytes.length || bytes.length > MAX_RETAINED_IMAGE_BYTES)
    throw new PrivateAssetError(413, "Saved images must be at most 3 MiB.");
  if (bytes.toString("base64") !== data)
    throw new PrivateAssetError(400, "Invalid image encoding.");
  const text = (key: string, limit: number): string => {
    if (typeof body[key] !== "string" || (body[key] as string).length > limit)
      throw new PrivateAssetError(400, `Invalid ${key}.`);
    return body[key] as string;
  };
  const prompt = text("prompt", 2000),
    alt = text("alt", 2000),
    sourceId = text("sourceId", 160);
  if (!alt.trim() || !sourceId.trim())
    throw new PrivateAssetError(
      400,
      "An image description and source are required.",
    );
  const provider = body.provider == null ? null : text("provider", 100);
  const checksum = createHash("sha256").update(bytes).digest("hex");
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify([
        ownerId,
        id,
        checksum,
        mime,
        prompt,
        alt,
        sourceId,
        provider,
      ]),
    )
    .digest("hex");
  return {
    id,
    ownerId,
    bytes,
    mime: mime as ImageMime,
    checksum,
    fingerprint,
    prompt,
    alt,
    sourceId,
    provider,
  };
}
export interface RetainedImage {
  id: string;
  user_id: string;
  mime_type: ImageMime;
  byte_size: number;
  sha256: string;
  fingerprint: string;
  prompt: string;
  alt_text: string;
  source_id: string;
  provider: string | null;
  status: "reserved" | "ready";
  created_at: string;
  favorited: boolean;
  favorite_revision: number;
  favorite_changed_at: string;
  last_favorite_operation: string | null;
}
export interface PrivateAssetRepository {
  reserve(claim: ImageClaim): Promise<RetainedImage>;
  complete(claim: ImageClaim): Promise<RetainedImage>;
}
export async function validateImageBytes(claim: ImageClaim): Promise<void> {
  try {
    const { default: sharp } = await import("sharp");
    const image = sharp(claim.bytes, {
      limitInputPixels: 16_000_000,
      failOn: "warning",
    });
    const metadata = await image.metadata();
    const format = claim.mime === "image/jpeg" ? "jpeg" : claim.mime.slice(6);
    if (
      metadata.format !== format ||
      !metadata.width ||
      !metadata.height ||
      (metadata.pages ?? 1) > 1
    )
      throw Error("Unsupported image");
    // Decode pixels too; recognizing a header does not validate an image.
    await image.stats();
  } catch {
    throw new PrivateAssetError(
      400,
      "The image bytes are invalid or exceed the supported dimensions.",
    );
  }
}
export interface PrivateImageStore {
  read(pathname: string): Promise<{ bytes: Buffer; mime: string } | null>;
  put(pathname: string, bytes: Buffer, mime: ImageMime): Promise<void>;
}
function matches(row: RetainedImage, claim: ImageClaim) {
  if (
    row.id !== claim.id ||
    row.user_id !== claim.ownerId ||
    row.sha256 !== claim.checksum ||
    row.mime_type !== claim.mime ||
    row.byte_size !== claim.bytes.length ||
    row.fingerprint !== claim.fingerprint
  )
    throw new PrivateAssetError(
      409,
      "This saved image identifier belongs to different content.",
    );
}
function verifiedBytes(
  object: { bytes: Buffer; mime: string },
  claim: ImageClaim,
) {
  if (
    object.mime !== claim.mime ||
    object.bytes.length !== claim.bytes.length ||
    createHash("sha256").update(object.bytes).digest("hex") !== claim.checksum
  )
    throw new PrivateAssetError(
      409,
      "The retained image could not be verified. Its reservation is preserved.",
    );
}
/** Unknown store outcomes retain the reservation and identity. No release/delete. */
export async function retainPrivateImage(
  claim: ImageClaim,
  repository: PrivateAssetRepository,
  store: PrivateImageStore,
): Promise<RetainedImage> {
  const reserved = await repository.reserve(claim);
  matches(reserved, claim);
  const pathname = privateAssetPath(claim.ownerId, claim.id, claim.mime);
  let object = await store.read(pathname);
  if (reserved.status === "ready") {
    if (!object)
      throw new PrivateAssetError(
        503,
        "The saved image is unavailable. Its record is preserved.",
      );
    verifiedBytes(object, claim);
    return reserved;
  }
  if (!object) {
    try {
      await store.put(pathname, claim.bytes, claim.mime);
    } catch {
      // An acknowledgement failure can still mean the immutable put completed.
      object = await store.read(pathname);
      if (!object)
        throw new PrivateAssetError(
          503,
          "Save is unresolved. Retry this image to recover the same reservation.",
        );
    }
    object ??= await store.read(pathname);
  }
  if (!object)
    throw new PrivateAssetError(
      503,
      "Save is unresolved. Retry this image to recover the same reservation.",
    );
  verifiedBytes(object, claim);
  const completed = await repository.complete(claim);
  matches(completed, claim);
  if (completed.status !== "ready")
    throw new PrivateAssetError(
      503,
      "Image completion is unresolved. Retry this image.",
    );
  return completed;
}
