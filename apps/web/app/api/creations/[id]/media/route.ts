import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  creationMediaUrl,
  ownedCreationStoragePath,
  safeCreationUrl,
} from "@/lib/media/creation-url";

const fields = ["original", "thumbnail", "captions", "transcript"] as const;
type Field = (typeof fields)[number];

export const creationMediaRouteDeps = { createClient };

function mediaValue(
  creation: { type: string; content: unknown; thumbnail_url: string | null },
  field: Field,
): string | null {
  if (field === "thumbnail") return creation.thumbnail_url;
  if (field === "original")
    return (
      creationMediaUrl(creation.content, creation.type) ??
      (creation.type === "image" ? creation.thumbnail_url : null)
    );
  if (!creation.content || typeof creation.content !== "object") return null;
  const content = creation.content as Record<string, unknown>;
  const value =
    field === "captions" ? content.captionsUrl : content.transcriptUrl;
  return typeof value === "string" ? value : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const field = new URL(request.url).searchParams.get("field") ?? "original";
  if (!fields.includes(field as Field))
    return NextResponse.json({ error: "Invalid media field" }, { status: 400 });

  const client = await creationMediaRouteDeps.createClient();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { data: creation, error } = await client
    .from("creations")
    .select("type, content, thumbnail_url")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Media temporarily unavailable" },
      { status: 503 },
    );
  if (!creation)
    return NextResponse.json({ error: "Media not found" }, { status: 404 });

  const value = safeCreationUrl(mediaValue(creation, field as Field));
  if (!value)
    return NextResponse.json({ error: "Media not found" }, { status: 404 });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const path = supabaseUrl
    ? ownedCreationStoragePath(value, auth.user.id, supabaseUrl)
    : null;
  let target = value;
  if (path) {
    const { data, error: signError } = await client.storage
      .from("creations")
      .createSignedUrl(path, 60 * 60 * 6);
    if (signError || !data?.signedUrl)
      return NextResponse.json({ error: "Media unavailable" }, { status: 503 });
    target = new URL(data.signedUrl, supabaseUrl).href;
  } else if (supabaseUrl) {
    const url = new URL(value, request.url);
    const sameSupabaseOrigin = url.origin === new URL(supabaseUrl).origin;
    const knownPublicBucket =
      /^\/storage\/v1\/object\/public\/(arcanea-gallery|avatars|thumbnails)\//.test(
        url.pathname,
      );
    if (sameSupabaseOrigin && !knownPublicBucket)
      return NextResponse.json({ error: "Media unavailable" }, { status: 503 });
  }

  const response = NextResponse.redirect(new URL(target, request.url), 307);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
