/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Media configuration for Arcanea
 *
 * Maps each Guardian to their Vercel Blob hero image URL (once uploaded),
 * a gradient fallback shown while no Blob URL is set, and metadata about
 * how many processed source files are available for that Guardian.
 *
 * Upload workflow:
 *   1. Run:  node scripts/prepare-vercel-upload.js
 *      → Produces scripts/arcanea-manifest-summary.json with hero candidates
 *   2. Run:  node scripts/upload-to-vercel-blob.mjs (requires VERCEL_BLOB_TOKEN)
 *      → Uploads files and prints their Blob URLs
 *   3. Paste the returned URLs into the heroImage fields below.
 *
 * Processed source files live at:
 *   C:\Users\frank\arcanea-processed\{Guardian}\*.webp
 *   C:\Users\frank\arcanea-processed\_thumbnails\{Guardian}\*-thumb.webp
 */

export const GUARDIAN_MEDIA = {
  draconia: {
    // Source: C:\Users\frank\arcanea-processed\Draconia\ (128 files)
    heroImage: "/guardians/v3/draconia-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-red-600 via-orange-500 to-amber-400",
    glowColor: "var(--arc-fire)",
    available: 128,
  },
  alera: {
    // Source: C:\Users\frank\arcanea-processed\Alera\ (68 files)
    heroImage: "/guardians/v3/alera-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    glowColor: "var(--arc-brand-atlantean-teal)",
    available: 68,
  },
  elara: {
    // Source: C:\Users\frank\arcanea-processed\Elara\ (37 files)
    heroImage: "/guardians/v3/elara-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    glowColor: "var(--arc-wind)",
    available: 37,
  },
  ino: {
    // Source: C:\Users\frank\arcanea-processed\Ino\ (8 files)
    heroImage: "/guardians/v3/ino-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-pink-400 via-fuchsia-500 to-teal-400",
    glowColor: "var(--arc-void)",
    available: 8,
  },
  aiyami: {
    // Source: C:\Users\frank\arcanea-processed\Aiyami\ (3 files)
    heroImage: "/guardians/v3/aiyami-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-yellow-200 via-amber-300 to-white",
    glowColor: "var(--arc-text-primary)",
    available: 3,
  },
  lyssandria: {
    // Source: C:\Users\frank\arcanea-processed\Lyssandria\ (2 files)
    heroImage: "/guardians/v3/lyssandria-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-amber-700 via-yellow-600 to-stone-400",
    glowColor: "var(--arc-earth)",
    available: 2,
  },
  leyla: {
    heroImage: "/guardians/v3/leyla-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-blue-300 via-cyan-400 to-slate-300",
    glowColor: "var(--arc-text-primary)",
    available: 0,
  },
  maylinn: {
    heroImage: "/guardians/v3/maylinn-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-rose-300 via-pink-400 to-green-300",
    glowColor: "var(--arc-text-primary)",
    available: 0,
  },
  lyria: {
    heroImage: "/guardians/v3/lyria-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    glowColor: "var(--arc-void)",
    available: 0,
  },
  shinkami: {
    heroImage: "/guardians/v3/shinkami-hero-v3.webp",
    thumbnails: [] as string[],
    gradient: "from-neutral-900 via-yellow-400 to-white",
    glowColor: "var(--arc-brand-arcanean-gold)",
    available: 0,
  },
} as const;

export type GuardianMediaKey = keyof typeof GUARDIAN_MEDIA;

/**
 * Returns the media config for a Guardian by name (case-insensitive).
 * Falls back to a generic violet gradient if the Guardian is unknown.
 */
export function getGuardianMedia(name: string) {
  const key = name.toLowerCase() as GuardianMediaKey;
  return (
    GUARDIAN_MEDIA[key] ?? {
      heroImage: "",
      thumbnails: [] as string[],
      gradient: "from-cyan-500 to-blue-600",
      glowColor: "var(--arc-brand-atlantean-teal)",
      available: 0,
    }
  );
}
