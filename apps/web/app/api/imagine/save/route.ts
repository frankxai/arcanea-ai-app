import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  boundedJson,
  parseImageClaim,
  PrivateAssetError,
  privateAssetUrl,
  retainPrivateImage,
  validateImageBytes,
} from "@/lib/imagine/private-assets";
import {
  privateImageStore,
  privateRepository,
  privateStoreToken,
} from "@/lib/imagine/private-assets-server";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: NextRequest) {
  try {
    // Authenticate before parsing bytes or touching metadata/storage.
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
    const claim = parseImageClaim(await boundedJson(request), user.id);
    const token = privateStoreToken(true);
    await validateImageBytes(claim);
    const saved = await retainPrivateImage(
      claim,
      privateRepository(),
      privateImageStore(token),
    );
    return NextResponse.json(
      {
        assetId: saved.id,
        ownerId: saved.user_id,
        url: privateAssetUrl(saved.id, saved.mime_type),
        prompt: saved.prompt,
        savedAt: saved.created_at,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const known = error instanceof PrivateAssetError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "Private saving is unavailable. Retry this image to recover its reservation.",
      },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
