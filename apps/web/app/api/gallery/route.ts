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

const SUPABASE_BUCKET = "arcanea-gallery";

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
  const base = filename.replace(/\.(webp|jpg|jpeg|png|mp4|mov)$/i, "");
  return base
    .split(/[-_]/)
    .map((part) => (isNaN(Number(part)) ? titleCase(part) : part))
    .join(" ");
}

/* ─── Supabase Storage scanner ────────────────────────────────────────────── */
async function fetchFromSupabase(): Promise<GalleryImage[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const images: GalleryImage[] = [];

  // List files in guardians/ prefix
  const res = await fetch(`${url}/storage/v1/object/list/${SUPABASE_BUCKET}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "guardians/", limit: 1000, offset: 0 }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const files: Array<{ name: string; metadata?: { mimetype?: string } }> = await res.json();

  for (const file of files) {
    if (!file.name || !/\.(webp|jpg|jpeg|png)$/i.test(file.name)) continue;

    const parts = file.name.split("/"); // e.g. ["guardians", "aiyami-hero.webp"] or ["guardians", "gallery", "file.webp"]
    const filename = parts[parts.length - 1];
    const isSubdir = parts.length > 2;

    const slug = guardianFromFilename(filename) ?? (isSubdir ? guardianFromFilename(parts[1]) : null);
    if (!slug) continue;

    const meta = GUARDIAN_META[slug] ?? { element: "Unknown", accent: "text-white", gate: "?" };
    const publicUrl = `${url}/storage/v1/object/public/${SUPABASE_BUCKET}/guardians/${file.name.replace(/^guardians\//, "")}`;

    images.push({
      src: publicUrl,
      guardian: titleCase(slug),
      slug,
      label: isSubdir ? labelFromFilename(filename) : `${titleCase(slug)} — ${meta.gate} Guardian`,
      tier: isSubdir ? "gallery" : "hero",
      accent: meta.accent,
      element: meta.element,
      gate: meta.gate,
    });
  }

  // Also list community uploads
  const communityRes = await fetch(`${url}/storage/v1/object/list/${SUPABASE_BUCKET}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "community/", limit: 500, offset: 0 }),
    next: { revalidate: 300 },
  });

  if (communityRes.ok) {
    const communityFiles: Array<{ name: string }> = await communityRes.json();
    for (const file of communityFiles) {
      if (!file.name || !/\.(webp|jpg|jpeg|png)$/i.test(file.name)) continue;
      const parts = file.name.split("/"); // community/[userId]/[filename]
      const filename = parts[parts.length - 1];
      const slug = guardianFromFilename(filename);
      if (!slug) continue;
      const meta = GUARDIAN_META[slug] ?? { element: "Unknown", accent: "text-white", gate: "?" };
      images.push({
        src: `${url}/storage/v1/object/public/${SUPABASE_BUCKET}/${file.name}`,
        guardian: titleCase(slug),
        slug,
        label: labelFromFilename(filename),
        tier: "community",
        accent: meta.accent,
        element: meta.element,
        gate: meta.gate,
        uploadedBy: parts[1] ?? undefined,
      });
    }
  }

  return images;
}

/* ─── Filesystem scanner (dev + local) ──────────────────────────────────── */
function fetchFromFilesystem(): GalleryImage[] {
  const publicDir = join(process.cwd(), "public");
  const guardianDir = join(publicDir, "guardians");

  if (!existsSync(guardianDir)) return [];

  const images: GalleryImage[] = [];

  const heroFiles = readdirSync(guardianDir).filter(
    (f) => /\.(webp|jpg|jpeg|png)$/i.test(f) && !f.startsWith(".")
  );

  for (const file of heroFiles) {
    const slug = guardianFromFilename(file);
    if (!slug) continue;
    const meta = GUARDIAN_META[slug] ?? { element: "Unknown", accent: "text-white", gate: "?" };
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
      const meta = GUARDIAN_META[slug] ?? { element: "Unknown", accent: "text-white", gate: "?" };
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

  return images;
}

/* ─── Route handler ──────────────────────────────────────────────────────── */
export async function GET() {
  try {
    // Try Supabase Storage first (production path)
    let images: GalleryImage[] = await fetchFromSupabase();

    // Fall back to filesystem (dev / when Supabase not configured)
    if (images.length === 0) {
      images = fetchFromFilesystem();
    }

    // Sort: heroes first, then gallery alphabetically by guardian, then community
    const tierOrder = { hero: 0, gallery: 1, community: 2 };
    images.sort((a, b) => {
      const t = tierOrder[a.tier] - tierOrder[b.tier];
      if (t !== 0) return t;
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
