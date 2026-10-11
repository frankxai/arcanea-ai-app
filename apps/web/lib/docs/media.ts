/** Direct uploads reserve their exact maximum size before receiving authority. */
export const MAX_DOCUMENT_MEDIA_BYTES = 10 * 1024 * 1024;
export const DOCUMENT_MEDIA_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;
export type DocumentMediaMime = keyof typeof DOCUMENT_MEDIA_TYPES;
export interface DocumentMediaScope {
  ownerId: string;
  projectId: string;
  docId: string;
}
export interface DocumentMediaClaim extends DocumentMediaScope {
  assetId: string;
  byteSize: number;
  mimeType: DocumentMediaMime;
  sha256: string;
  filename: string;
  alt: string;
  fingerprint: string;
}
export interface DocumentMediaRecord extends DocumentMediaClaim {
  status: "reserved" | "ready";
  sourceStatus: "creator_supplied_unverified";
  rightsStatus: "unverified";
}
export class DocumentMediaError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export function documentMediaId(value: unknown): string {
  if (typeof value !== "string" || !uuid.test(value))
    throw new DocumentMediaError(
      400,
      "A valid document or image identifier is required.",
    );
  return value;
}
export async function mediaDigest(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    Uint8Array.from(bytes).buffer,
  );
  return Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}
export async function parseDocumentMediaClaim(
  input: unknown,
  scope: DocumentMediaScope,
): Promise<DocumentMediaClaim> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new DocumentMediaError(400, "Invalid document image request.");
  const body = input as Record<string, unknown>;
  for (const key of ["ownerId", "projectId", "docId"] as const) {
    documentMediaId(scope[key]);
    if (body[key] !== scope[key])
      throw new DocumentMediaError(
        409,
        "The account or document changed. Keep your original file and reopen its document.",
      );
  }
  const assetId = documentMediaId(body.assetId);
  if (
    !Number.isSafeInteger(body.byteSize) ||
    (body.byteSize as number) < 1 ||
    (body.byteSize as number) > MAX_DOCUMENT_MEDIA_BYTES
  )
    throw new DocumentMediaError(
      413,
      "Use an image of at most 10 MiB. Your original file is unchanged.",
    );
  if (
    typeof body.mimeType !== "string" ||
    !Object.hasOwn(DOCUMENT_MEDIA_TYPES, body.mimeType)
  )
    throw new DocumentMediaError(400, "Use a PNG, JPEG or WEBP image.");
  if (typeof body.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(body.sha256))
    throw new DocumentMediaError(400, "The original image digest is required.");
  if (
    typeof body.filename !== "string" ||
    !body.filename.trim() ||
    body.filename.length > 255 ||
    /[\u0000-\u001f\u007f]/.test(body.filename)
  )
    throw new DocumentMediaError(
      400,
      "Use an image filename of at most 255 characters.",
    );
  if (
    typeof body.alt !== "string" ||
    !body.alt.trim() ||
    body.alt.length > 2000
  )
    throw new DocumentMediaError(
      400,
      "Describe the image in at most 2000 characters.",
    );
  const claim = {
    ...scope,
    assetId,
    byteSize: body.byteSize as number,
    mimeType: body.mimeType as DocumentMediaMime,
    sha256: body.sha256,
    filename: body.filename,
    alt: body.alt,
  };
  return {
    ...claim,
    fingerprint: await mediaDigest(
      new TextEncoder().encode(
        JSON.stringify([
          claim.ownerId,
          claim.projectId,
          claim.docId,
          claim.assetId,
          claim.byteSize,
          claim.mimeType,
          claim.sha256,
          claim.filename,
          claim.alt,
        ]),
      ),
    ),
  };
}
export function documentMediaPath(claim: DocumentMediaClaim): string {
  return `document-private/${claim.ownerId}/${claim.projectId}/${claim.docId}/${claim.assetId}.${DOCUMENT_MEDIA_TYPES[claim.mimeType]}`;
}
export function documentMediaUrl(
  scope: DocumentMediaScope,
  assetId: string,
): string {
  return `/api/projects/${documentMediaId(scope.projectId)}/docs/${documentMediaId(scope.docId)}/media/${documentMediaId(assetId)}`;
}
export interface DocumentMediaRepository {
  reserve(claim: DocumentMediaClaim): Promise<DocumentMediaRecord>;
  complete(claim: DocumentMediaClaim): Promise<DocumentMediaRecord>;
}
export interface DocumentMediaStore {
  read(
    pathname: string,
    maximumBytes: number,
  ): Promise<{ bytes: Uint8Array; mimeType: string } | null>;
}
function matchRecord(record: DocumentMediaRecord, claim: DocumentMediaClaim) {
  for (const key of [
    "ownerId",
    "projectId",
    "docId",
    "assetId",
    "byteSize",
    "mimeType",
    "sha256",
    "filename",
    "alt",
    "fingerprint",
  ] as const)
    if (record[key] !== claim[key])
      throw new DocumentMediaError(
        409,
        "This image identifier belongs to different content. Its reservation is preserved.",
      );
  if (
    !["reserved", "ready"].includes(record.status) ||
    record.sourceStatus !== "creator_supplied_unverified" ||
    record.rightsStatus !== "unverified"
  )
    throw new DocumentMediaError(
      503,
      "The saved image record could not be verified.",
    );
}
export async function authorizeDocumentMediaUpload(
  claim: DocumentMediaClaim,
  pathname: string,
  repository: DocumentMediaRepository,
  now = Date.now(),
) {
  if (pathname !== documentMediaPath(claim))
    throw new DocumentMediaError(
      400,
      "The upload destination does not match this document image.",
    );
  const record = await repository.reserve(claim);
  matchRecord(record, claim);
  if (record.status === "ready")
    throw new DocumentMediaError(
      409,
      "This image is already saved. Reopen it instead of uploading again.",
    );
  return {
    maximumSizeInBytes: claim.byteSize,
    allowedContentTypes: [claim.mimeType],
    validUntil: now + 10 * 60 * 1000,
    addRandomSuffix: false,
    allowOverwrite: false,
  };
}
export async function verifiedDocumentMediaBytes(
  claim: DocumentMediaClaim,
  store: DocumentMediaStore,
) {
  const object = await store.read(documentMediaPath(claim), claim.byteSize);
  if (!object)
    throw new DocumentMediaError(
      425,
      "The upload is not yet confirmed. Keep the original file and retry this image.",
    );
  if (
    object.mimeType !== claim.mimeType ||
    object.bytes.length !== claim.byteSize ||
    (await mediaDigest(object.bytes)) !== claim.sha256
  )
    throw new DocumentMediaError(
      409,
      "The uploaded image could not be verified. Its reservation and your original file are preserved.",
    );
  return object.bytes;
}
/** Call only after full digest verification; pull preserves backpressure. */
export function documentMediaByteStream(
  bytes: Uint8Array,
): ReadableStream<Uint8Array> {
  let offset = 0;
  return new ReadableStream({
    pull(controller) {
      if (offset >= bytes.length) {
        controller.close();
        return;
      }
      const end = Math.min(offset + 65536, bytes.length);
      controller.enqueue(bytes.subarray(offset, end));
      offset = end;
    },
    cancel() {
      offset = bytes.length;
    },
  });
}
/** Missing/uncertain acknowledgements never release quota or overwrite bytes. */
export async function finalizeDocumentMedia(
  claim: DocumentMediaClaim,
  repository: DocumentMediaRepository,
  store: DocumentMediaStore,
  decode: (bytes: Uint8Array, mime: DocumentMediaMime) => Promise<void>,
): Promise<DocumentMediaRecord> {
  const reserved = await repository.reserve(claim);
  matchRecord(reserved, claim);
  const bytes = await verifiedDocumentMediaBytes(claim, store);
  await decode(bytes, claim.mimeType);
  if (reserved.status === "ready") return reserved;
  const completed = await repository.complete(claim);
  matchRecord(completed, claim);
  if (completed.status !== "ready")
    throw new DocumentMediaError(
      503,
      "Image completion was not confirmed. Retry the same image.",
    );
  return completed;
}
