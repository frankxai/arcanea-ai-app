/**
 * Gallery Upload API
 *
 * POST /api/gallery/upload - Authenticated users upload to community gallery
 *
 * Body: FormData with:
 *   - file: image/webp|png|jpg (max 10MB)
 *   - guardian: Guardian name
 *   - title: Optional caption
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const BUCKET = "arcanea-gallery";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const VALID_GUARDIANS = new Set([
  "Aiyami", "Alera", "Draconia", "Elara", "Ino",
  "Leyla", "Lyria", "Lyssandria", "Maylinn", "Shinkami",
]);

export async function POST(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  // Extract auth token from request
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const token = authHeader.slice(7);

  // Create authenticated Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  // Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Parse form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const guardian = formData.get("guardian") as string | null;
  const title = formData.get("title") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files accepted" }, { status: 400 });
  }

  if (guardian && !VALID_GUARDIANS.has(guardian)) {
    return NextResponse.json({ error: "Invalid guardian name" }, { status: 400 });
  }

  // Generate safe filename
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "webp";
  const slug = guardian?.toLowerCase() ?? "unknown";
  const timestamp = Date.now();
  const storagePath = `community/${user.id}/${slug}-${timestamp}.${ext}`;

  // Upload to Supabase Storage (RLS: community/[userId]/ scoped)
  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[gallery upload] storage error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  // Optionally create a creations record for the gallery
  const { error: dbError } = await supabase.from("creations").insert({
    user_id: user.id,
    title: title ?? `${guardian ?? "Unknown"} Creation`,
    type: "image",
    guardian: guardian ?? null,
    element: null,
    thumbnail_url: urlData.publicUrl,
    status: "published",
    visibility: "public",
    tags: guardian ? [guardian.toLowerCase(), "community-gallery"] : ["community-gallery"],
  });

  if (dbError) {
    console.error("[gallery upload] db error:", dbError);
    // Image uploaded but DB record failed — non-fatal
  }

  return NextResponse.json({
    url: urlData.publicUrl,
    storagePath,
    guardian: guardian ?? "Unknown",
    message: "Creation added to gallery",
  });
}
