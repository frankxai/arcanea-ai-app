import {
  DocumentMediaError,
  MAX_DOCUMENT_MEDIA_BYTES,
  DOCUMENT_MEDIA_TYPES,
  documentMediaPath,
  documentMediaUrl,
  mediaDigest,
  parseDocumentMediaClaim,
  type DocumentMediaScope,
  type DocumentMediaClaim,
  type DocumentMediaRecord,
} from "./media";

type UploadOptions = {
  access: "private";
  contentType: string;
  multipart: false;
  handleUploadUrl: string;
  clientPayload: string;
  abortSignal: AbortSignal;
};
interface MediaClientOptions {
  current: () => boolean;
  signal?: AbortSignal;
  fetch?: typeof fetch;
  upload?: (
    pathname: string,
    file: File,
    options: UploadOptions,
  ) => Promise<unknown>;
}
function requireCurrent(current: () => boolean) {
  if (!current())
    throw new DocumentMediaError(
      409,
      "The account or document changed. Keep the original file and reopen its document.",
    );
}
async function boundedResponse(
  response: Response,
  limit: number,
): Promise<Uint8Array> {
  const declared = response.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit))
    throw new DocumentMediaError(
      503,
      "The saved image response could not be verified.",
    );
  if (!response.body)
    throw new DocumentMediaError(503, "The saved image response is empty.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > limit)
        throw new DocumentMediaError(
          503,
          "The saved image response exceeds its bound.",
        );
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return bytes;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
async function readEnvelope(
  response: Response,
): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = JSON.parse(
      new TextDecoder().decode(await boundedResponse(response, 20 * 1024)),
    );
  } catch {
    throw new DocumentMediaError(
      503,
      "Image saving was not confirmed. Keep the original file and retry the same image.",
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new DocumentMediaError(
      503,
      "The image receipt could not be verified.",
    );
  return body as Record<string, unknown>;
}
async function verifyReceipt(
  body: Record<string, unknown>,
  claim: DocumentMediaClaim,
) {
  const asset = body.asset;
  if (!asset || typeof asset !== "object" || Array.isArray(asset))
    throw new DocumentMediaError(
      503,
      "The image receipt could not be verified.",
    );
  const record = asset as DocumentMediaRecord;
  const verified = await parseDocumentMediaClaim(record, claim);
  if (
    record.assetId !== claim.assetId ||
    verified.fingerprint !== claim.fingerprint ||
    record.fingerprint !== claim.fingerprint ||
    record.status !== "ready" ||
    record.sourceStatus !== "creator_supplied_unverified" ||
    record.rightsStatus !== "unverified" ||
    body.url !== documentMediaUrl(claim, claim.assetId)
  )
    throw new DocumentMediaError(
      409,
      "The image receipt does not match this document and original file.",
    );
  return body.url as string;
}
/** Retry identity is derived from the original and its owner/document, not time. */
export async function uploadDocumentImage(
  file: File,
  scope: DocumentMediaScope,
  options: MediaClientOptions,
): Promise<string> {
  requireCurrent(options.current);
  if (file.size < 1 || file.size > MAX_DOCUMENT_MEDIA_BYTES)
    throw new DocumentMediaError(
      413,
      "Use an image of at most 10 MiB. Keep your original file.",
    );
  if (!Object.hasOwn(DOCUMENT_MEDIA_TYPES, file.type))
    throw new DocumentMediaError(400, "Use a PNG, JPEG or WEBP image.");
  const sha256 = await mediaDigest(new Uint8Array(await file.arrayBuffer()));
  requireCurrent(options.current);
  const identity = await mediaDigest(
    new TextEncoder().encode(
      JSON.stringify([
        scope.ownerId,
        scope.projectId,
        scope.docId,
        sha256,
        file.type,
        file.name,
      ]),
    ),
  );
  const assetId = `${identity.slice(0, 8)}-${identity.slice(8, 12)}-8${identity.slice(13, 16)}-8${identity.slice(17, 20)}-${identity.slice(20, 32)}`;
  const claim = await parseDocumentMediaClaim(
    {
      ...scope,
      assetId,
      mimeType: file.type,
      byteSize: file.size,
      sha256,
      filename: file.name,
      alt: file.name,
    },
    scope,
  );
  requireCurrent(options.current);
  const fetcher = options.fetch ?? fetch;
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(60000)])
    : AbortSignal.timeout(60000);
  const endpoint = `/api/projects/${scope.projectId}/docs/${scope.docId}/media`;
  async function complete(): Promise<string | null> {
    requireCurrent(options.current);
    let response: Response;
    try {
      response = await fetcher(endpoint, {
        method: "POST",
        cache: "no-store",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", claim }),
      });
    } catch {
      requireCurrent(options.current);
      throw new DocumentMediaError(
        503,
        "Image saving was not confirmed. Keep the original file and retry the same image.",
      );
    }
    requireCurrent(options.current);
    const body = await readEnvelope(response);
    requireCurrent(options.current);
    if (response.status === 425) return null;
    if (!response.ok)
      throw new DocumentMediaError(
        response.status,
        typeof body.error === "string"
          ? body.error
          : "Image saving was not confirmed. Keep the original file.",
      );
    const url = await verifyReceipt(body, claim);
    requireCurrent(options.current);
    return url;
  }
  // An uncertain previous put/completion may already have succeeded. Reconcile
  // the same ID first, rather than trying another put or consuming more quota.
  const previous = await complete();
  if (previous) return previous;
  requireCurrent(options.current);
  const upload =
    options.upload ??
    (async (pathname, original, settings) => {
      const { upload: put } = await import("@vercel/blob/client");
      return put(pathname, original, settings);
    });
  try {
    await upload(documentMediaPath(claim), file, {
      access: "private",
      contentType: claim.mimeType,
      multipart: false,
      handleUploadUrl: endpoint,
      clientPayload: JSON.stringify(claim),
      abortSignal: signal,
    });
  } catch {
    // A failed upload acknowledgement is not evidence that the put failed.
    requireCurrent(options.current);
    const recovered = await complete();
    if (recovered) return recovered;
    throw new DocumentMediaError(
      503,
      "Image saving was not confirmed. Keep or download the original file and retry the same image.",
    );
  }
  requireCurrent(options.current);
  const confirmed = await complete();
  if (!confirmed)
    throw new DocumentMediaError(
      425,
      "The uploaded image is not yet confirmed. Keep the original file and retry the same image.",
    );
  return confirmed;
}
export async function readPortableDocumentMedia(
  scope: DocumentMediaScope,
  assetId: string,
  options: Omit<MediaClientOptions, "upload">,
) {
  requireCurrent(options.current);
  const fetcher = options.fetch ?? fetch;
  const url = documentMediaUrl(scope, assetId);
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(30000)])
    : AbortSignal.timeout(30000);
  const metadata = await fetcher(`${url}?metadata=1`, {
    cache: "no-store",
    signal,
  });
  requireCurrent(options.current);
  const body = await readEnvelope(metadata);
  if (!metadata.ok)
    throw new DocumentMediaError(
      metadata.status,
      "An image could not be reopened. Export was stopped; your draft is unchanged.",
    );
  const asset = body.asset as DocumentMediaRecord;
  const claim = await parseDocumentMediaClaim(asset, scope);
  if (claim.assetId !== assetId)
    throw new DocumentMediaError(
      409,
      "The image receipt does not match the requested original.",
    );
  await verifyReceipt(body, claim);
  const response = await fetcher(url, { cache: "no-store", signal });
  requireCurrent(options.current);
  if (!response.ok || response.headers.get("content-type") !== claim.mimeType)
    throw new DocumentMediaError(
      503,
      "Private image bytes could not be reopened.",
    );
  const bytes = await boundedResponse(response, claim.byteSize);
  requireCurrent(options.current);
  if (
    bytes.length !== claim.byteSize ||
    (await mediaDigest(bytes)) !== claim.sha256
  )
    throw new DocumentMediaError(
      409,
      "Private image bytes could not be verified. Your draft is unchanged.",
    );
  requireCurrent(options.current);
  return { asset, bytes };
}
