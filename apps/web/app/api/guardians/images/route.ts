import { NextResponse } from "next/server";
import { GUARDIAN_IMAGES } from "@/lib/config/guardian-images";
import { GUARDIAN_MEDIA } from "@/lib/config/media";

/**
 * GET /api/guardians/images
 *
 * Returns the complete Guardian image manifest.
 * Used by the Arcanea overlay system and external integrations.
 *
 * Query params:
 *   ?name=draconia  — filter to a single Guardian
 *   ?series=divineBond — filter to a specific image series
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nameFilter = searchParams.get("name")?.toLowerCase();
  const seriesFilter = searchParams.get("series");

  const guardians = Object.entries(GUARDIAN_IMAGES).reduce(
    (acc, [name, images]) => {
      if (nameFilter && name !== nameFilter) return acc;

      const media =
        GUARDIAN_MEDIA[name as keyof typeof GUARDIAN_MEDIA] ?? null;

      acc[name] = {
        images: {
          hero: images.hero,
          divineBond: images.divineBond,
          gallery: [...images.gallery],
        },
        media: media
          ? {
              supabaseHero: media.heroImage,
              gradient: media.gradient,
              glowColor: media.glowColor,
              available: media.available,
            }
          : null,
      };

      if (seriesFilter) {
        const key = seriesFilter as keyof typeof acc[typeof name]["images"];
        if (key in acc[name].images) {
          acc[name].images = {
            hero: "",
            divineBond: "",
            gallery: [],
            [key]: acc[name].images[key],
          };
        }
      }

      return acc;
    },
    {} as Record<string, { images: { hero: string; divineBond: string; gallery: string[] }; media: { supabaseHero: string; gradient: string; glowColor: string; available: number } | null }>,
  );

  return NextResponse.json(
    {
      version: "2.0",
      series: ["hero", "divineBond", "gallery"],
      guardians,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
