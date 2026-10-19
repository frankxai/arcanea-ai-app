import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  DocumentMediaError,
  authorizeDocumentMediaUpload,
  finalizeDocumentMedia,
  parseDocumentMediaClaim,
  documentMediaUrl,
} from "@/lib/docs/media";
import {
  documentMediaContext,
  documentMediaToken,
  readDocumentMediaBody,
  documentMediaRepository,
  documentMediaStore,
  decodeDocumentMedia,
} from "@/lib/docs/media-server";

export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const { id, docId } = await params;
    // No body-supplied owner or callback can bypass current document access.
    const { scope } = await documentMediaContext(id, docId);
    const token = documentMediaToken(true);
    const input = await readDocumentMediaBody(request);
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new DocumentMediaError(400, "Invalid image metadata.");
    const body = input as Record<string, unknown>;
    const repository = documentMediaRepository();
    if (body.action === "complete") {
      const claim = await parseDocumentMediaClaim(body.claim, scope);
      const asset = await finalizeDocumentMedia(
        claim,
        repository,
        documentMediaStore(token),
        decodeDocumentMedia,
      );
      return NextResponse.json(
        { asset, url: documentMediaUrl(scope, asset.assetId) },
        { headers },
      );
    }
    if (
      body.type !== "blob.generate-client-token" ||
      !body.payload ||
      typeof body.payload !== "object" ||
      Array.isArray(body.payload)
    )
      throw new DocumentMediaError(
        400,
        "Use an authenticated image upload. Completion callbacks do not publish images.",
      );
    const payload = body.payload as Record<string, unknown>;
    if (
      typeof payload.pathname !== "string" ||
      typeof payload.clientPayload !== "string" ||
      payload.multipart !== false
    )
      throw new DocumentMediaError(400, "Invalid image upload metadata.");
    let claimInput: unknown;
    try {
      claimInput = JSON.parse(payload.clientPayload);
    } catch {
      throw new DocumentMediaError(400, "Invalid image upload metadata.");
    }
    const claim = await parseDocumentMediaClaim(claimInput, scope);
    const grant = await authorizeDocumentMediaUpload(
      claim,
      payload.pathname,
      repository,
    );
    const result = await handleUpload({
      request,
      body: input as HandleUploadBody,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (pathname !== payload.pathname)
          throw new DocumentMediaError(400, "Invalid upload destination.");
        return grant;
      },
    });
    return NextResponse.json(result, { headers });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof DocumentMediaError
            ? error.message
            : "Image saving was not confirmed. Keep the original file and retry the same image.",
      },
      {
        status: error instanceof DocumentMediaError ? error.status : 503,
        headers,
      },
    );
  }
}
