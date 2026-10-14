import { NextRequest, NextResponse } from "next/server";
import {
  DocumentMediaError,
  documentMediaId,
  documentMediaUrl,
  verifiedDocumentMediaBytes,
  documentMediaByteStream,
} from "@/lib/docs/media";
import {
  documentMediaContext,
  documentMediaRecord,
  documentMediaStore,
  documentMediaToken,
} from "@/lib/docs/media-server";

export const runtime = "nodejs";
export const maxDuration = 60;
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; docId: string; assetId: string }> },
) {
  try {
    const { id, docId, assetId } = await params;
    const { db, scope } = await documentMediaContext(id, docId);
    documentMediaId(assetId);
    const { data, error } = await db
      .from("project_doc_media")
      .select("*")
      .eq("id", assetId)
      .eq("user_id", scope.ownerId)
      .eq("project_id", id)
      .eq("doc_id", docId)
      .eq("status", "ready")
      .maybeSingle();
    if (error)
      throw new DocumentMediaError(
        503,
        "Private image metadata is unavailable. Its record is preserved.",
      );
    if (!data)
      throw new DocumentMediaError(404, "Image not found in this document.");
    const asset = await documentMediaRecord(data, scope);
    if (asset.assetId !== assetId || asset.status !== "ready")
      throw new DocumentMediaError(404, "Image not found.");
    if (request.nextUrl.searchParams.get("metadata") === "1")
      return NextResponse.json(
        { asset, url: documentMediaUrl(scope, asset.assetId) },
        { headers },
      );
    const bytes = await verifiedDocumentMediaBytes(
      asset,
      documentMediaStore(documentMediaToken()),
    );
    // Streaming avoids the function's buffered-response payload limit, after
    // verification of the complete private original and before any disclosure.
    return new NextResponse(documentMediaByteStream(bytes), {
      headers: {
        ...headers,
        "Content-Type": asset.mimeType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof DocumentMediaError
            ? error.message
            : "Private image access is unavailable. Your record is preserved.",
      },
      {
        status: error instanceof DocumentMediaError ? error.status : 503,
        headers,
      },
    );
  }
}
