import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  IMAGE_TYPES,
  privateAssetHandle,
  PrivateAssetError,
} from "@/lib/imagine/private-assets";
import { readOwnedPrivateImage } from "@/lib/imagine/private-assets-server";

export const runtime = "nodejs";
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const client = await createClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    const handle = privateAssetHandle(
      `/api/imagine/assets/${(await params).id}`,
    );
    if (!handle) throw new PrivateAssetError(404, "Image not found.");
    const { asset, bytes } = await readOwnedPrivateImage(
      client,
      user.id,
      handle.id,
    );
    if (IMAGE_TYPES[asset.mime_type] !== handle.extension)
      throw new PrivateAssetError(404, "Image not found.");
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.mime_type,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `inline; filename="${handle.id}.${handle.extension}"`,
        "Cache-Control": "private, no-store",
        Vary: "Cookie, Authorization",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      },
    });
  } catch (error) {
    const known = error instanceof PrivateAssetError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "Private image is unavailable. Its record is preserved.",
      },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
