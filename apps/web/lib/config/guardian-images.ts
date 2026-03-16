/**
 * Guardian Hero Images Configuration
 *
 * v1: Original hero images (Supabase + Vercel Blob) — DEPRECATED
 * v2: Divine Bond infographic series (Mar 2026) — DEPRECATED
 * v3: Ultra-quality photorealistic character portraits (Mar 16, 2026)
 *     Generated with Gemini 3 Pro via Arcanea Infogenius
 *
 * Upload script: scripts/upload-to-vercel-blob.mjs
 */

export const GUARDIAN_IMAGES = {
  lyssandria: {
    hero: "/guardians/v3/lyssandria-hero-v3.webp",
    divineBond: "/guardians/v2/lyssandria-divine-bond.webp",
    gallery: [],
  },
  leyla: {
    hero: "/guardians/v3/leyla-hero-v3.webp",
    divineBond: "/guardians/v2/leyla-divine-bond.webp",
    gallery: [],
  },
  draconia: {
    hero: "/guardians/v3/draconia-hero-v3.webp",
    divineBond: "/guardians/v2/draconia-divine-bond.webp",
    gallery: [],
  },
  maylinn: {
    hero: "/guardians/v3/maylinn-hero-v3.webp",
    divineBond: "/guardians/v2/maylinn-divine-bond.webp",
    gallery: [],
  },
  alera: {
    hero: "/guardians/v3/alera-hero-v3.webp",
    divineBond: "/guardians/v2/alera-divine-bond.webp",
    gallery: [],
  },
  lyria: {
    hero: "/guardians/v3/lyria-hero-v3.webp",
    divineBond: "/guardians/v2/lyria-divine-bond.webp",
    gallery: [],
  },
  aiyami: {
    hero: "/guardians/v3/aiyami-hero-v3.webp",
    divineBond: "/guardians/v2/aiyami-divine-bond.webp",
    gallery: [],
  },
  elara: {
    hero: "/guardians/v3/elara-hero-v3.webp",
    divineBond: "/guardians/v2/elara-divine-bond.webp",
    gallery: [],
  },
  ino: {
    hero: "/guardians/v3/ino-hero-v3.webp",
    divineBond: "/guardians/v2/ino-divine-bond.webp",
    gallery: [],
  },
  shinkami: {
    hero: "/guardians/v3/shinkami-hero-v3.webp",
    divineBond: "/guardians/v2/shinkami-divine-bond.webp",
    gallery: [],
  },
} as const;

export type GuardianName = keyof typeof GUARDIAN_IMAGES;
