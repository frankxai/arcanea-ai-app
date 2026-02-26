import { NextResponse } from "next/server";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

// Guardian metadata for labeling
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

function titleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function guardianFromFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  for (const g of Object.keys(GUARDIAN_META)) {
    if (lower.startsWith(g)) return g;
  }
  return null;
}

function labelFromFilename(filename: string): string {
  // e.g. "aiyami-gallery-3.webp" → "Aiyami Gallery 3"
  const base = filename.replace(/\.(webp|jpg|jpeg|png)$/i, "");
  return base
    .split(/[-_]/)
    .map((part) => (isNaN(Number(part)) ? titleCase(part) : part))
    .join(" ");
}

export async function GET() {
  try {
    const publicDir = join(process.cwd(), "public");
    const guardianDir = join(publicDir, "guardians");

    if (!existsSync(guardianDir)) {
      return NextResponse.json({ images: [] });
    }

    const images: Array<{
      src: string;
      guardian: string;
      slug: string;
      label: string;
      tier: "hero" | "gallery";
      accent: string;
      element: string;
      gate: string;
    }> = [];

    // Hero images in /public/guardians/*.webp
    const heroFiles = readdirSync(guardianDir).filter(
      (f) => /\.(webp|jpg|jpeg|png)$/i.test(f) && !f.startsWith(".")
    );

    for (const file of heroFiles) {
      const slug = guardianFromFilename(file);
      if (!slug) continue;
      const meta = GUARDIAN_META[slug] || { element: "Unknown", accent: "text-white", gate: "?" };
      images.push({
        src: `/guardians/${file}`,
        guardian: titleCase(slug),
        slug,
        label: `${titleCase(slug)} — ${meta.gate} Guardian`,
        tier: "hero",
        accent: meta.accent,
        element: meta.element,
        gate: meta.gate,
      });
    }

    // Gallery images in subdirectories
    const subdirs = readdirSync(guardianDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const subdir of subdirs) {
      const subdirPath = join(guardianDir, subdir);
      const files = readdirSync(subdirPath).filter(
        (f) => /\.(webp|jpg|jpeg|png)$/i.test(f) && !f.startsWith(".")
      );

      for (const file of files) {
        const slug = guardianFromFilename(file) ?? guardianFromFilename(subdir) ?? null;
        if (!slug) continue;
        const meta = GUARDIAN_META[slug] || { element: "Unknown", accent: "text-white", gate: "?" };
        images.push({
          src: `/guardians/${subdir}/${file}`,
          guardian: titleCase(slug),
          slug,
          label: labelFromFilename(file),
          tier: "gallery",
          accent: meta.accent,
          element: meta.element,
          gate: meta.gate,
        });
      }
    }

    // Sort: heroes first, then gallery alphabetically by guardian
    images.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "hero" ? -1 : 1;
      return a.guardian.localeCompare(b.guardian);
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
