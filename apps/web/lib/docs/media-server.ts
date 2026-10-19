import { get } from "@vercel/blob";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  DocumentMediaError,
  documentMediaId,
  parseDocumentMediaClaim,
  type DocumentMediaClaim,
  type DocumentMediaRecord,
  type DocumentMediaRepository,
  type DocumentMediaScope,
  type DocumentMediaStore,
  type DocumentMediaMime,
} from "./media";

type Query = {
  select(columns: string): Query;
  eq(column: string, value: string): Query;
  maybeSingle(): Promise<{ data: unknown; error: unknown }>;
};
type MediaDb = {
  from(table: "project_docs" | "project_doc_media"): Query;
  rpc(
    name: string,
    args: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
};
export async function documentMediaContext(projectId: string, docId: string) {
  documentMediaId(projectId);
  documentMediaId(docId);
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error && !isAuthSessionMissingError(error))
    throw new DocumentMediaError(
      503,
      "Your session could not be verified. Keep the original file and retry.",
    );
  if (!user)
    throw new DocumentMediaError(401, "Sign in to your document's account.");
  const db = client as unknown as MediaDb;
  const { data, error: readError } = await db
    .from("project_docs")
    .select("id")
    .eq("id", docId)
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (readError)
    throw new DocumentMediaError(
      503,
      "Document access could not be verified. Keep your original file.",
    );
  if (!data) throw new DocumentMediaError(404, "Document not found.");
  return {
    db,
    scope: { ownerId: user.id, projectId, docId } satisfies DocumentMediaScope,
  };
}
export function documentMediaToken(write = false): string {
  const token = process.env.PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN;
  if (
    !token ||
    (write && process.env.PRIVATE_IMAGINE_STORAGE_ENABLED !== "true")
  )
    throw new DocumentMediaError(
      503,
      "Private image saving is unavailable. Keep your original file and draft.",
    );
  return token;
}
export async function readDocumentMediaBody(
  request: Request,
): Promise<unknown> {
  const limit = 20 * 1024;
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit))
    throw new DocumentMediaError(
      413,
      "The image metadata request is too large.",
    );
  if (!request.body)
    throw new DocumentMediaError(400, "Image metadata is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > limit)
        throw new DocumentMediaError(
          413,
          "The image metadata request is too large.",
        );
      chunks.push(next.value);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new DocumentMediaError(400, "Invalid image metadata.");
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
export async function documentMediaRecord(
  value: unknown,
  scope: DocumentMediaScope,
): Promise<DocumentMediaRecord> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new DocumentMediaError(503, "Image metadata is unavailable.");
  const row = value as Record<string, unknown>;
  const claim = await parseDocumentMediaClaim(
    {
      ownerId: row.user_id,
      projectId: row.project_id,
      docId: row.doc_id,
      assetId: row.id,
      byteSize: row.byte_size,
      mimeType: row.mime_type,
      sha256: row.sha256,
      filename: row.filename,
      alt: row.alt_text,
    },
    scope,
  );
  if (
    claim.fingerprint !== row.fingerprint ||
    !["reserved", "ready"].includes(String(row.status)) ||
    row.source_status !== "creator_supplied_unverified" ||
    row.rights_status !== "unverified"
  )
    throw new DocumentMediaError(
      503,
      "The saved image record could not be verified.",
    );
  return {
    ...claim,
    status: row.status as "reserved" | "ready",
    sourceStatus: "creator_supplied_unverified",
    rightsStatus: "unverified",
  };
}
export function documentMediaRepository(): DocumentMediaRepository {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new DocumentMediaError(
      503,
      "Private image saving is unavailable. Keep your original file and draft.",
    );
  const db = createAdminClient() as unknown as MediaDb;
  async function rpc(
    name: string,
    args: Record<string, unknown>,
    scope: DocumentMediaScope,
  ) {
    const { data, error } = await db.rpc(name, args);
    if (error) {
      if (error.message === "document_media_full")
        throw new DocumentMediaError(
          507,
          "Your storage is full. No saved work was removed; keep the original file.",
        );
      if (error.message === "document_media_missing")
        throw new DocumentMediaError(404, "Document not found.");
      if (error.message === "document_media_conflict")
        throw new DocumentMediaError(
          409,
          "This image identifier belongs to different content. Keep the original file.",
        );
      throw new DocumentMediaError(
        503,
        "Image saving was not confirmed. Retry the same image; its reservation is preserved.",
      );
    }
    return documentMediaRecord(data, scope);
  }
  const common = (claim: DocumentMediaClaim) => ({
    p_user: claim.ownerId,
    p_project: claim.projectId,
    p_doc: claim.docId,
    p_id: claim.assetId,
    p_fingerprint: claim.fingerprint,
  });
  return {
    reserve: (claim) =>
      rpc(
        "reserve_project_document_media",
        {
          ...common(claim),
          p_size: claim.byteSize,
          p_mime: claim.mimeType,
          p_sha: claim.sha256,
          p_filename: claim.filename,
          p_alt: claim.alt,
        },
        claim,
      ),
    complete: (claim) =>
      rpc("complete_project_document_media", common(claim), claim),
  };
}
export function documentMediaStore(token: string): DocumentMediaStore {
  return {
    read: async (pathname, maximumBytes) => {
      const object = await get(pathname, {
        access: "private",
        token,
        useCache: false,
        abortSignal: AbortSignal.timeout(20000),
      });
      if (!object) return null;
      if (
        object.statusCode !== 200 ||
        object.blob.size < 1 ||
        object.blob.size > maximumBytes
      ) {
        await object.stream?.cancel();
        throw new DocumentMediaError(
          503,
          "Private image bytes are unavailable. The record is preserved.",
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
          if (size > maximumBytes)
            throw new DocumentMediaError(
              503,
              "Private image bytes exceed their reservation.",
            );
          chunks.push(next.value);
        }
        return {
          bytes: Buffer.concat(chunks),
          mimeType: object.blob.contentType,
        };
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
    },
  };
}
export async function decodeDocumentMedia(
  bytes: Uint8Array,
  mime: DocumentMediaMime,
) {
  try {
    const { default: sharp } = await import("sharp");
    const image = sharp(Buffer.from(bytes), {
      limitInputPixels: 16_000_000,
      failOn: "warning",
    });
    const metadata = await image.metadata();
    if (
      metadata.format !== (mime === "image/jpeg" ? "jpeg" : mime.slice(6)) ||
      !metadata.width ||
      !metadata.height ||
      (metadata.pages ?? 1) > 1
    )
      throw Error("Invalid image");
    await image.stats();
  } catch {
    throw new DocumentMediaError(
      400,
      "The image could not be decoded or exceeds supported dimensions. Keep the original file.",
    );
  }
}
