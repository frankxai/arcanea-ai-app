/**
 * Guardian Hero Images Configuration
 *
 * v1: Original hero images (Supabase + Vercel Blob)
 * v2: Divine Bond series — Guardian + Godbeast + Domain (Mar 2026)
 *
 * Upload script: scripts/upload-to-vercel-blob.mjs
 */

export const GUARDIAN_IMAGES = {
  lyssandria: {
    hero: "https://images.arcanea.ai/guardians/lyssandria-tree-goddess-001.webp",
    divineBond: "/guardians/v2/lyssandria-divine-bond.webp",
    gallery: [],
  },
  leyla: {
    hero: "https://images.arcanea.ai/guardians/leyla-phoenix-001.webp",
    divineBond: "/guardians/v2/leyla-divine-bond.webp",
    gallery: [],
  },
  draconia: {
    hero: "https://images.arcanea.ai/guardians/draconia-goddess-dragon-002.webp",
    divineBond: "/guardians/v2/draconia-divine-bond.webp",
    gallery: [
      "https://images.arcanea.ai/guardians/draconia-golden-037.webp",
      "https://images.arcanea.ai/guardians/draconia-sky-island-360.webp",
    ],
  },
  maylinn: {
    hero: "https://images.arcanea.ai/guardians/maylinn-deer-001.webp",
    divineBond: "/guardians/v2/maylinn-divine-bond.webp",
    gallery: [],
  },
  alera: {
    hero: "https://images.arcanea.ai/guardians/alera-spirit-animal-001.webp",
    divineBond: "/guardians/v2/alera-divine-bond.webp",
    gallery: [
      "https://images.arcanea.ai/guardians/alera-spirit-animal-005.webp",
    ],
  },
  lyria: {
    hero: "https://images.arcanea.ai/guardians/lyria-vision-001.webp",
    divineBond: "/guardians/v2/lyria-divine-bond.webp",
    gallery: [],
  },
  aiyami: {
    hero: "https://images.arcanea.ai/guardians/aiyami-sun-001.webp",
    divineBond: "/guardians/v2/aiyami-divine-bond.webp",
    gallery: [],
  },
  elara: {
    hero: "https://images.arcanea.ai/guardians/elara-unicorn-001.webp",
    divineBond: "/guardians/v2/elara-divine-bond.webp",
    gallery: ["https://images.arcanea.ai/guardians/elara-unicorn-010.webp"],
  },
  ino: {
    hero: "https://images.arcanea.ai/guardians/ino-unity-001.webp",
    divineBond: "/guardians/v2/ino-divine-bond.webp",
    gallery: [],
  },
  shinkami: {
    hero: "https://images.arcanea.ai/guardians/shinkami-source-001.webp",
    divineBond: "/guardians/v2/shinkami-divine-bond.webp",
    gallery: [],
  },
} as const;

export type GuardianName = keyof typeof GUARDIAN_IMAGES;
