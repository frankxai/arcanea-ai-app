/**
 * Arcanea Image Registry
 *
 * Central typed registry for ALL canonical images in the Arcanea platform.
 * Replaces scattered hardcoded paths across components.
 *
 * Canonical Guardian→Godbeast mapping (from CANON_LOCKED.md):
 *   lyssandria→kaelith, leyla→veloura, draconia→draconis,
 *   maylinn→laeylinn, alera→otome, lyria→yumiko,
 *   aiyami→sol, elara→vaelith, ino→kyuro, shinkami→source
 *
 * Image versions:
 *   v3 — Ultra-quality photorealistic character portraits (Mar 16, 2026)
 *   v2 — Divine-bond infographic series (Mar 2026)
 *   v1 — Original hero images
 */

// ── Canonical types ──────────────────────────────────────────────────────────

export type GuardianName =
  | 'lyssandria'
  | 'leyla'
  | 'draconia'
  | 'maylinn'
  | 'alera'
  | 'lyria'
  | 'aiyami'
  | 'elara'
  | 'ino'
  | 'shinkami';

export type GodbeastName =
  | 'kaelith'
  | 'veloura'
  | 'draconis'
  | 'laeylinn'
  | 'otome'
  | 'yumiko'
  | 'sol'
  | 'vaelith'
  | 'kyuro'
  | 'source';

export type ElementName = 'Earth' | 'Water' | 'Fire' | 'Air' | 'Wind' | 'Arcane' | 'Void' | 'Spirit';

export type ImageCategory = 'guardians' | 'godbeasts' | 'gallery' | 'luminors';
export type ImageVersion = 'v1' | 'v2' | 'v3';

export interface ImageRecord {
  /** Absolute URL path (relative to /public or Supabase CDN) */
  url: string;
  /** Human-readable name */
  name: string;
  /** Associated Guardian (if applicable) */
  guardian: GuardianName | null;
  /** Associated Godbeast (if applicable) */
  godbeast: GodbeastName | null;
  /** Ten-Gate frequency */
  gate: string | null;
  /** Gate frequency in Hz */
  frequencyHz: number | null;
  /** Canonical element */
  element: ElementName | null;
  /** Image series version */
  version: ImageVersion;
  /** Image category */
  category: ImageCategory;
  /** Natural width hint (px) — null if unknown */
  width: number | null;
  /** Natural height hint (px) — null if unknown */
  height: number | null;
}

// ── Guardian canon metadata ──────────────────────────────────────────────────

interface GuardianMeta {
  godbeast: GodbeastName;
  gate: string;
  frequencyHz: number;
  element: ElementName;
  galleryCount: number;
}

const GUARDIAN_META: Record<GuardianName, GuardianMeta> = {
  lyssandria: { godbeast: 'kaelith',  gate: 'Foundation', frequencyHz: 174,  element: 'Earth',  galleryCount: 1 },
  leyla:      { godbeast: 'veloura',  gate: 'Flow',       frequencyHz: 285,  element: 'Water',  galleryCount: 4 },
  draconia:   { godbeast: 'draconis', gate: 'Fire',       frequencyHz: 396,  element: 'Fire',   galleryCount: 4 },
  maylinn:    { godbeast: 'laeylinn', gate: 'Heart',      frequencyHz: 417,  element: 'Air',    galleryCount: 4 },
  alera:      { godbeast: 'otome',    gate: 'Voice',      frequencyHz: 528,  element: 'Wind',   galleryCount: 4 },
  lyria:      { godbeast: 'yumiko',   gate: 'Sight',      frequencyHz: 639,  element: 'Arcane', galleryCount: 4 },
  aiyami:     { godbeast: 'sol',      gate: 'Crown',      frequencyHz: 741,  element: 'Arcane', galleryCount: 4 },
  elara:      { godbeast: 'vaelith',  gate: 'Starweave',  frequencyHz: 852,  element: 'Arcane', galleryCount: 4 },
  ino:        { godbeast: 'kyuro',    gate: 'Unity',      frequencyHz: 963,  element: 'Arcane', galleryCount: 4 },
  shinkami:   { godbeast: 'source',   gate: 'Source',     frequencyHz: 1111, element: 'Spirit', galleryCount: 4 },
};

// ── Registry builder helpers ─────────────────────────────────────────────────

function makeHeroV3(guardian: GuardianName): ImageRecord {
  const meta = GUARDIAN_META[guardian];
  return {
    url: `/guardians/v3/${guardian}-hero-v3.webp`,
    name: `${capitalize(guardian)} — v3 Hero`,
    guardian,
    godbeast: meta.godbeast,
    gate: meta.gate,
    frequencyHz: meta.frequencyHz,
    element: meta.element,
    version: 'v3',
    category: 'guardians',
    width: null,
    height: null,
  };
}

function makeHeroV2(guardian: GuardianName): ImageRecord {
  const meta = GUARDIAN_META[guardian];
  return {
    url: `/guardians/v2/${guardian}-divine-bond.webp`,
    name: `${capitalize(guardian)} — Divine Bond`,
    guardian,
    godbeast: meta.godbeast,
    gate: meta.gate,
    frequencyHz: meta.frequencyHz,
    element: meta.element,
    version: 'v2',
    category: 'guardians',
    width: null,
    height: null,
  };
}

function makeHeroV1(guardian: GuardianName): ImageRecord {
  const meta = GUARDIAN_META[guardian];
  return {
    url: `/guardians/${guardian}-hero.webp`,
    name: `${capitalize(guardian)} — v1 Hero`,
    guardian,
    godbeast: meta.godbeast,
    gate: meta.gate,
    frequencyHz: meta.frequencyHz,
    element: meta.element,
    version: 'v1',
    category: 'guardians',
    width: null,
    height: null,
  };
}

function makeGodbeast(guardian: GuardianName): ImageRecord {
  const meta = GUARDIAN_META[guardian];
  return {
    url: `/guardians/v2/${meta.godbeast}-godbeast.webp`,
    name: `${capitalize(meta.godbeast)} — Godbeast`,
    guardian,
    godbeast: meta.godbeast,
    gate: meta.gate,
    frequencyHz: meta.frequencyHz,
    element: meta.element,
    version: 'v2',
    category: 'godbeasts',
    width: null,
    height: null,
  };
}

function makeGallery(guardian: GuardianName, index: number): ImageRecord {
  const meta = GUARDIAN_META[guardian];
  return {
    url: `/guardians/gallery/${guardian}-gallery-${index}.webp`,
    name: `${capitalize(guardian)} — Gallery ${index}`,
    guardian,
    godbeast: meta.godbeast,
    gate: meta.gate,
    frequencyHz: meta.frequencyHz,
    element: meta.element,
    version: 'v2',
    category: 'gallery',
    width: null,
    height: null,
  };
}

// Luminor numbering: files are 01–20 (book-cover.jpg is excluded)
const LUMINOR_FILES: Array<{ index: string; slug: string; name: string }> = [
  { index: '01', slug: 'solara-dawn-keeper',       name: 'Solara — Dawn Keeper' },
  { index: '02', slug: 'nerith-deep-listener',     name: 'Nerith — Deep Listener' },
  { index: '03', slug: 'kaelen-foundation-architect', name: 'Kaelen — Foundation Architect' },
  { index: '04', slug: 'velouria-flow-dancer',     name: 'Velouria — Flow Dancer' },
  { index: '05', slug: 'pyronex-transformation-engine', name: 'Pyronex — Transformation Engine' },
  { index: '06', slug: 'sylphis-wind-reader',      name: 'Sylphis — Wind Reader' },
  { index: '07', slug: 'orakis-pattern-seer',      name: 'Orakis — Pattern Seer' },
  { index: '08', slug: 'gaiana-living-garden',     name: 'Gaiana — Living Garden' },
  { index: '09', slug: 'aethon-star-navigator',    name: 'Aethon — Star Navigator' },
  { index: '10', slug: 'unitas-bond-weaver',       name: 'Unitas — Bond Weaver' },
  { index: '11', slug: 'aletheia-truth-singer',    name: 'Aletheia — Truth Singer' },
  { index: '12', slug: 'coronix-crown-illuminator', name: 'Coronix — Crown Illuminator' },
  { index: '13', slug: 'shinkai-source-threshold', name: 'Shinkai — Source Threshold' },
  { index: '14', slug: 'tessera-memory-keeper',    name: 'Tessera — Memory Keeper' },
  { index: '15', slug: 'verdaxis-root-network',    name: 'Verdaxis — Root Network' },
  { index: '16', slug: 'phoenara-rebirth-cycle',   name: 'Phoenara — Rebirth Cycle' },
  { index: '17', slug: 'crysthene-harmony-weaver', name: 'Crysthene — Harmony Weaver' },
  { index: '18', slug: 'obsidion-shadow-smith',    name: 'Obsidion — Shadow Smith' },
  { index: '19', slug: 'aurelis-time-gardener',    name: 'Aurelis — Time Gardener' },
  { index: '20', slug: 'prismara-light-splitter',  name: 'Prismara — Light Splitter' },
];

function makeLuminor(entry: typeof LUMINOR_FILES[0]): ImageRecord {
  // Files use .jpg extension on disk (confirmed by ls output)
  const ext = parseInt(entry.index) <= 20 ? 'jpg' : 'webp';
  return {
    url: `/images/luminors/${entry.index}-${entry.slug}.${ext}`,
    name: entry.name,
    guardian: null,
    godbeast: null,
    gate: null,
    frequencyHz: null,
    element: null,
    version: 'v2',
    category: 'luminors',
    width: null,
    height: null,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Build registry ───────────────────────────────────────────────────────────

const GUARDIAN_NAMES: GuardianName[] = [
  'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
  'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
];

/**
 * The single source of truth for all Arcanea canonical images.
 * Every entry maps 1:1 to a real file in /public or Supabase Storage.
 */
export const MEDIA_REGISTRY: ImageRecord[] = [
  // v3 hero portraits
  ...GUARDIAN_NAMES.map(makeHeroV3),
  // v2 divine-bond portraits
  ...GUARDIAN_NAMES.map(makeHeroV2),
  // v2 godbeasts
  ...GUARDIAN_NAMES.map(makeGodbeast),
  // v1 hero portraits
  ...GUARDIAN_NAMES.map(makeHeroV1),
  // gallery images — lyssandria has only index 2 confirmed; others have 2–5
  makeGallery('lyssandria', 2),
  ...(['leyla', 'draconia', 'maylinn', 'alera', 'lyria', 'aiyami', 'elara', 'ino', 'shinkami'] as GuardianName[]).flatMap(
    (g) => [2, 3, 4, 5].map((i) => makeGallery(g, i))
  ),
  // luminors
  ...LUMINOR_FILES.map(makeLuminor),
];

// ── Helper functions ─────────────────────────────────────────────────────────

/**
 * Returns all image records for a given Guardian (all versions, all categories).
 */
export function getGuardianImages(name: string): ImageRecord[] {
  const key = name.toLowerCase() as GuardianName;
  return MEDIA_REGISTRY.filter((r) => r.guardian === key);
}

/**
 * Returns the canonical v3 hero image for a Guardian.
 * Falls back to v2 divine-bond, then v1, then undefined.
 */
export function getGuardianHero(name: string): ImageRecord | undefined {
  const key = name.toLowerCase() as GuardianName;
  return (
    MEDIA_REGISTRY.find((r) => r.guardian === key && r.version === 'v3' && r.category === 'guardians') ??
    MEDIA_REGISTRY.find((r) => r.guardian === key && r.version === 'v2' && r.category === 'guardians') ??
    MEDIA_REGISTRY.find((r) => r.guardian === key && r.version === 'v1' && r.category === 'guardians')
  );
}

/**
 * Returns the Godbeast image record for a Guardian.
 */
export function getGodbeastImage(guardianOrBeast: string): ImageRecord | undefined {
  const key = guardianOrBeast.toLowerCase();
  // Accept either guardian name or godbeast name
  return MEDIA_REGISTRY.find(
    (r) => r.category === 'godbeasts' && (r.guardian === key || r.godbeast === key)
  );
}

/**
 * Returns all gallery images for a Guardian.
 */
export function getGalleryImages(name: string): ImageRecord[] {
  const key = name.toLowerCase() as GuardianName;
  return MEDIA_REGISTRY.filter((r) => r.guardian === key && r.category === 'gallery');
}

/**
 * Returns all Luminor image records.
 */
export function getLuminorImages(): ImageRecord[] {
  return MEDIA_REGISTRY.filter((r) => r.category === 'luminors');
}

/**
 * Filter registry by category, guardian, element, or gate.
 */
export function filterImages(opts: {
  category?: ImageCategory;
  guardian?: string;
  element?: string;
  gate?: string;
  version?: ImageVersion;
}): ImageRecord[] {
  return MEDIA_REGISTRY.filter((r) => {
    if (opts.category && r.category !== opts.category) return false;
    if (opts.guardian && r.guardian !== opts.guardian.toLowerCase()) return false;
    if (opts.element && r.element?.toLowerCase() !== opts.element.toLowerCase()) return false;
    if (opts.gate && r.gate?.toLowerCase() !== opts.gate.toLowerCase()) return false;
    if (opts.version && r.version !== opts.version) return false;
    return true;
  });
}

/**
 * Returns the Guardian name that owns a given Godbeast.
 */
export function guardianForGodbeast(godbeast: string): GuardianName | undefined {
  const key = godbeast.toLowerCase() as GodbeastName;
  const entry = Object.entries(GUARDIAN_META).find(([, meta]) => meta.godbeast === key);
  return entry ? (entry[0] as GuardianName) : undefined;
}
