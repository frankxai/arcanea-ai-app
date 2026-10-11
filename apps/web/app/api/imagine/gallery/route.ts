import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  privateAssetId,
  PrivateAssetError,
} from "@/lib/imagine/private-assets";
import {
  assetRpc,
  retainedImage,
  privateAssetMetadata,
} from "@/lib/imagine/private-assets-server";

export async function GET(request: NextRequest) {
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
    const before = request.nextUrl.searchParams.get("before");
    const beforeId = request.nextUrl.searchParams.get("id");
    const favorites = request.nextUrl.searchParams.get("favorites") === "true";
    // Preserve DB timestamp precision rather than rounding away microseconds.
    if (
      Boolean(before) !== Boolean(beforeId) ||
      (before && (before.length > 50 || !Number.isFinite(Date.parse(before))))
    )
      throw new PrivateAssetError(400, "Invalid gallery cursor.");
    const result = await assetRpc(client, "imagine_private_gallery", {
      p_before: before,
      p_id: beforeId ? privateAssetId(beforeId) : null,
      p_favorites: favorites,
    });
    if (!Array.isArray(result) || result.length > 51)
      throw new PrivateAssetError(503, "Private gallery is unavailable.");
    const assets = result.map(retainedImage);
    if (
      assets.some(
        (asset) => asset.user_id !== user.id || asset.status !== "ready",
      )
    )
      throw new PrivateAssetError(503, "Private gallery is unavailable.");
    const page = assets.slice(0, 50),
      last = page.at(-1);
    return NextResponse.json(
      {
        images: page.map(privateAssetMetadata),
        next:
          assets.length > 50 && last
            ? {
                before: favorites ? last.favorite_changed_at : last.created_at,
                id: last.id,
              }
            : null,
        hasStorage: true,
        ownerId: user.id,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const known = error instanceof PrivateAssetError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "Private gallery is unavailable. Your records are preserved.",
      },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
