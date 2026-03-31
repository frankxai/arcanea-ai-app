/**
 * Gallery API Route
 *
 * GET /api/gallery - Merges canonical Guardian media from the local registry
 *                    with published public community creations.
 *
 * Sources (in display order):
 *   1. Typed image registry → official Guardian / Godbeast / gallery media
 *   2. creations table → published + public community content
 */

import { NextRequest, NextResponse } from "next/server";
import { MEDIA_REGISTRY } from "@/lib/media/image-registry";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const GUARDIAN_META: Record<string, { element: string; accent: string; gate: string }> = {
  aiyami:     { element: "Void",   accent: "text-amber-300",   gate: "Crown" },
  alera:      { element: "Fire",   accent: "text-sky-300",     gate: "Voice" },
  draconia:   { element: "Fire",   accent: "text-orange-400",  gate: "Fire" },
  elara:      { element: "Wind",   accent: "text-emerald-300", gate: "Starweave" },
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

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fetchOfficialImages(): GalleryImage[] {
  return MEDIA_REGISTRY
    .filter((record) =>
      record.guardian &&
      (record.category === "guardians" || record.category === "godbeasts" || record.category === "gallery")
    )
    .map((record) => {
      const slug = record.guardian!;
      const meta = GUARDIAN_META[slug];
      return {
        src: record.url,
        guardian: titleCase(slug),
        slug,
        label: record.name,
        tier: record.category === "gallery" ? "gallery" : "hero",
        accent: meta.accent,
        element: meta.element,
        gate: meta.gate,
      };
    });
}

async function fetchCreationsImages(): Promise<GalleryImage[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/creations?status=eq.published&visibility=eq.public&order=created_at.desc&limit=200&select=id,title,thumbnail_url,type,guardian,element,like_count,view_count,user_id`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        next: { revalidate: 300 },
      }
    );
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
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const guardianFilter = new URL(request.url).searchParams.get("guardian");
    const [officialImages, creationsImages] = await Promise.all([
      Promise.resolve(fetchOfficialImages()),
      fetchCreationsImages(),
    ]);

    const seen = new Set<string>();
    let images: GalleryImage[] = [];
    for (const image of [...officialImages, ...creationsImages]) {
      if (!seen.has(image.src)) {
        seen.add(image.src);
        images.push(image);
      }
    }

    if (guardianFilter) {
      images = images.filter((img) => img.guardian === guardianFilter);
    }

    const tierOrder = { hero: 0, gallery: 1, community: 2 };
    images.sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      return tierDiff !== 0 ? tierDiff : a.guardian.localeCompare(b.guardian);
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
