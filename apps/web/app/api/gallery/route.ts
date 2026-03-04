/**
 * Gallery API Route
 *
 * GET /api/gallery - Merges official Guardian images from Supabase Storage
 *                    with user-created content from the creations table.
 *
 * Sources (in display order):
 *   1. arcanea-gallery bucket → guardians/ (hero + gallery tiers)
 *   2. creations table → published + public (community tier)
 */

import { NextRequest, NextResponse } from "next/server";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const BUCKET = "arcanea-gallery";

const GUARDIAN_META: Record<string, { element: string; accent: string; gate: string }> = {
  aiyami:     { element: "Void",   accent: "text-amber-300",   gate: "Crown" },
  alera:      { element: "Fire",   accent: "text-sky-300",     gate: "Voice" },
  draconia:   { element: "Fire",   accent: "text-orange-400",  gate: "Fire" },
  elara:      { element: "Wind",   accent: "text-emerald-300", gate: "Shift" },
  ino:        { element: "Earth",  accent: "text-fuchsia-300", gate: "Unity" },
  leyla:      { element: "Water",  accent: "text-cyan-300",    gate: "Flow" },
  lyria:      { element: "Void",   accent: "text-violet-300",  gate: "Sight" },
  lyssandria: { element: "Earth",  accent: "text-amber-400",   gate: "Foundation" },
  maylinn:    { element: "Wind",   accent: "text-pink-300",    gate: "Heart" },
  shinkami:   { element: "Spirit", accent: "text-yellow-200",  gate: "Source" },
};

type GalleryImage = {
  src: string;
  guardian: string;
  slug: string;
  label: string;
  tier: "hero" | "gallery" | "community";
  accent: string;
  element: string;
  gate: string;
  uploadedBy?: string;
  likeCount?: number;
  viewCount?: number;
  type?: string;
};

function titleCase(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function guardianFromFilename(f: string): string | null {
  const lower = f.toLowerCase();
  for (const g of Object.keys(GUARDIAN_META)) {
    if (lower.startsWith(g)) return g;
  }
  return null;
}

function labelFromFilename(f: string): string {
  return f.replace(/\.(webp|jpg|jpeg|png|mp4)$/i, "")
    .split(/[-_]/)
    .map((p) => (isNaN(Number(p)) ? titleCase(p) : p))
    .join(" ");
}

/* ── Source 1: Supabase Storage (arcanea-gallery bucket) ──────────────── */
async function fetchStorageImages(): Promise<GalleryImage[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return [];

  const images: GalleryImage[] = [];
  const headers = {
    Authorization: `Bearer ${SUPABASE_ANON}`,
    apikey: SUPABASE_ANON,
    "Content-Type": "application/json",
  };
  const listUrl = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`;

  // Hero images (guardians/*.webp)
  try {
    const res = await fetch(listUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: "guardians/", limit: 100, offset: 0 }),
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const files: Array<{ name: string; metadata?: { mimetype?: string; size?: number } }> = await res.json();
      for (const file of files) {
        if (!file.name || !file.metadata?.mimetype?.startsWith("image/")) continue;
        const slug = guardianFromFilename(file.name);
        if (!slug) continue;
        const meta = GUARDIAN_META[slug];
        images.push({
          src: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/guardians/${file.name}`,
          guardian: titleCase(slug),
          slug,
          label: `${titleCase(slug)} — ${meta.gate} Guardian`,
          tier: "hero",
          accent: meta.accent,
          element: meta.element,
          gate: meta.gate,
        });
      }
    }
  } catch { /* storage unavailable */ }

  // Gallery images (guardians/gallery/*.webp)
  try {
    const res = await fetch(listUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: "guardians/gallery/", limit: 500, offset: 0 }),
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const files: Array<{ name: string; metadata?: { mimetype?: string } }> = await res.json();
      for (const file of files) {
        if (!file.name || !file.metadata?.mimetype?.startsWith("image/")) continue;
        const slug = guardianFromFilename(file.name);
        if (!slug) continue;
        const meta = GUARDIAN_META[slug];
        images.push({
          src: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/guardians/gallery/${file.name}`,
          guardian: titleCase(slug),
          slug,
          label: labelFromFilename(file.name),
          tier: "gallery",
          accent: meta.accent,
          element: meta.element,
          gate: meta.gate,
        });
      }
    }
  } catch { /* storage unavailable */ }

  // Community uploads (community/[userId]/*.webp)
  try {
    const res = await fetch(listUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: "community/", limit: 500, offset: 0 }),
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const files: Array<{ name: string; metadata?: { mimetype?: string } }> = await res.json();
      for (const file of files) {
        if (!file.name || !file.metadata?.mimetype?.startsWith("image/")) continue;
        const slug = guardianFromFilename(file.name);
        if (!slug) continue;
        const meta = GUARDIAN_META[slug];
        images.push({
          src: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/community/${file.name}`,
          guardian: titleCase(slug),
          slug,
          label: labelFromFilename(file.name),
          tier: "community",
          accent: meta.accent,
          element: meta.element,
          gate: meta.gate,
          uploadedBy: file.name.split("/")[0] ?? undefined,
        });
      }
    }
  } catch { /* storage unavailable */ }

  return images;
}

/* ── Source 2: creations table (user-generated published content) ──────── */
async function fetchCreationsImages(): Promise<GalleryImage[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return [];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/creations?status=eq.published&visibility=eq.public&order=created_at.desc&limit=200&select=id,title,thumbnail_url,type,guardian,element,like_count,view_count,user_id`, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: Array<Record<string, unknown>> = await res.json();
    return data
      .filter((c) => c.thumbnail_url)
      .map((c) => {
        const guardianName = (c.guardian as string) ?? "";
        const slug = guardianName.toLowerCase();
        const meta = GUARDIAN_META[slug];
        return {
          src: c.thumbnail_url as string,
          guardian: guardianName || "Unknown",
          slug: slug || "unknown",
          label: (c.title as string) || "Untitled",
          tier: "community" as const,
          accent: meta?.accent ?? "text-white",
          element: meta?.element ?? (c.element as string) ?? "Unknown",
          gate: meta?.gate ?? "",
          uploadedBy: c.user_id as string,
          likeCount: (c.like_count as number) ?? 0,
          viewCount: (c.view_count as number) ?? 0,
          type: c.type as string,
        };
      });
  } catch { return []; }
}

/* ── Fallback: filesystem (dev when Supabase not configured) ──────────── */
function fetchFromFilesystem(): GalleryImage[] {
  const guardianDir = join(process.cwd(), "public", "guardians");
  if (!existsSync(guardianDir)) return [];

  const images: GalleryImage[] = [];

  for (const file of readdirSync(guardianDir).filter((f) => /\.(webp|jpg|png)$/i.test(f))) {
    const slug = guardianFromFilename(file);
    if (!slug) continue;
    const meta = GUARDIAN_META[slug];
    images.push({
      src: `https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/${file}`,
      guardian: titleCase(slug), slug,
      label: `${titleCase(slug)} — ${meta.gate} Guardian`,
      tier: "hero", accent: meta.accent, element: meta.element, gate: meta.gate,
    });
  }

  const galleryDir = join(guardianDir, "gallery");
  if (existsSync(galleryDir)) {
    for (const file of readdirSync(galleryDir).filter((f) => /\.(webp|jpg|png)$/i.test(f))) {
      const slug = guardianFromFilename(file);
      if (!slug) continue;
      const meta = GUARDIAN_META[slug];
      images.push({
        src: `https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/gallery/${file}`,
        guardian: titleCase(slug), slug,
        label: labelFromFilename(file),
        tier: "gallery", accent: meta.accent, element: meta.element, gate: meta.gate,
      });
    }
  }

  return images;
}

/* ── Route handler ────────────────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  try {
    const guardianFilter = new URL(request.url).searchParams.get("guardian");

    // Fetch from both sources in parallel
    const [storageImages, creationsImages] = await Promise.all([
      fetchStorageImages(),
      fetchCreationsImages(),
    ]);

    // Merge: storage first, then creations (dedupe by src)
    let images: GalleryImage[];
    if (storageImages.length > 0 || creationsImages.length > 0) {
      const seen = new Set<string>();
      images = [];
      for (const img of [...storageImages, ...creationsImages]) {
        if (!seen.has(img.src)) {
          seen.add(img.src);
          images.push(img);
        }
      }
    } else {
      // Fallback to filesystem (dev only)
      images = fetchFromFilesystem();
    }

    // Filter by guardian
    if (guardianFilter) {
      images = images.filter((img) => img.guardian === guardianFilter);
    }

    // Sort: heroes → gallery → community
    const tierOrder = { hero: 0, gallery: 1, community: 2 };
    images.sort((a, b) => {
      const t = tierOrder[a.tier] - tierOrder[b.tier];
      return t !== 0 ? t : a.guardian.localeCompare(b.guardian);
    });

    return NextResponse.json(
      { images, total: images.length },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err) {
    console.error("[gallery API] error:", err);
    return NextResponse.json({ images: [], total: 0 });
  }
}
