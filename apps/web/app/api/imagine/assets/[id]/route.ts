import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  IMAGE_TYPES,
  boundedJson,
  privateAssetId,
  privateAssetHandle,
  PrivateAssetError,
} from "@/lib/imagine/private-assets";
import {
  assetRpc,
  retainedImage,
  privateAssetMetadata,
  readOwnedPrivateMetadata,
  readOwnedPrivateImage,
} from "@/lib/imagine/private-assets-server";

export const runtime = "nodejs";
export async function GET(
  request: NextRequest,
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
    if (request.nextUrl.searchParams.get("metadata") === "1") {
      const asset = await readOwnedPrivateMetadata(client, user.id, handle.id);
      if (IMAGE_TYPES[asset.mime_type] !== handle.extension)
        throw new PrivateAssetError(404, "Image not found.");
      return NextResponse.json(privateAssetMetadata(asset), {
        headers: { "Cache-Control": "private, no-store" },
      });
    }
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

export async function PATCH(
  request: NextRequest,
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
    const value = await boundedJson(request, 1024);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new PrivateAssetError(400, "Invalid favorite change.");
    const body = value as Record<string, unknown>;
    if (body.ownerId !== user.id)
      throw new PrivateAssetError(
        409,
        "Your account changed. Retry from the current account.",
      );
    if (
      typeof body.favorited !== "boolean" ||
      !Number.isSafeInteger(body.revision) ||
      (body.revision as number) < 0
    )
      throw new PrivateAssetError(400, "Invalid favorite change.");
    // Reject wrong extensions before allowing any mutation, and leave bytes intact.
    const before = await readOwnedPrivateMetadata(client, user.id, handle.id);
    if (IMAGE_TYPES[before.mime_type] !== handle.extension)
      throw new PrivateAssetError(404, "Image not found.");
    const saved = retainedImage(
      await assetRpc(client, "imagine_set_private_favorite", {
        p_id: handle.id,
        p_favorited: body.favorited,
        p_revision: body.revision,
        p_operation: privateAssetId(body.operationId),
      }),
    );
    if (
      saved.id !== handle.id ||
      saved.user_id !== user.id ||
      saved.status !== "ready"
    )
      throw new PrivateAssetError(
        503,
        "Favorite acknowledgement is unavailable.",
      );
    return NextResponse.json(privateAssetMetadata(saved), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    const known = error instanceof PrivateAssetError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "Favorite change is unresolved. Retry to recover the same operation.",
      },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
