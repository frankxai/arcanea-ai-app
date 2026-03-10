/**
 * Media Analyzer — Intelligent filename-based analysis for gallery assets
 * Guardian: Lyria (Sight Gate, 639 Hz) — Intuition, vision
 *
 * Phase 1: Filename intelligence ($0 cost)
 *   - Guardian detection from prefixes and keywords
 *   - Source detection (Midjourney UUID, Grok patterns)
 *   - Scene description extraction
 *   - Auto-tagging (element, gate, content type)
 *   - Preliminary quality tier from heuristics
 *
 * Phase 2: AI vision (opt-in, ~$0.0003/image via Haiku)
 *   - TASTE evaluation: Canon(25%), Design(25%), Emotion(20%), Technical(15%), Uniqueness(15%)
 *   - Quality tier refinement
 */

// ── Guardian Canon ──────────────────────────────────────────────────────────

const GUARDIANS: Record<string, { gate: string; frequency: number; element: string; godbeast: string }> = {
  lyssandria: { gate: 'Foundation', frequency: 174,  element: 'Earth',  godbeast: 'Kaelith' },
  leyla:      { gate: 'Flow',       frequency: 285,  element: 'Water',  godbeast: 'Veloura' },
  draconia:   { gate: 'Fire',       frequency: 396,  element: 'Fire',   godbeast: 'Draconis' },
  maylinn:    { gate: 'Heart',      frequency: 417,  element: 'Water',  godbeast: 'Laeylinn' },
  alera:      { gate: 'Voice',      frequency: 528,  element: 'Wind',   godbeast: 'Otome' },
  lyria:      { gate: 'Sight',      frequency: 639,  element: 'Arcane', godbeast: 'Yumiko' },
  aiyami:     { gate: 'Crown',      frequency: 741,  element: 'Arcane', godbeast: 'Sol' },
  elara:      { gate: 'Starweave',      frequency: 852,  element: 'Arcane', godbeast: 'Vaelith' },
  ino:        { gate: 'Unity',      frequency: 963,  element: 'Arcane', godbeast: 'Kyuro' },
  shinkami:   { gate: 'Source',     frequency: 1111, element: 'Arcane', godbeast: 'Source' },
};

const GUARDIAN_NAMES = Object.keys(GUARDIANS);

const GODBEAST_MAP: Record<string, string> = {
  kaelith: 'lyssandria', veloura: 'leyla', draconis: 'draconia',
  laeylinn: 'maylinn', otome: 'alera', yumiko: 'lyria',
  sol: 'aiyami', vaelith: 'elara', kyuro: 'ino', amaterasu: 'shinkami',
};

const ELEMENT_MAP: Record<string, string> = {
  tree_goddess: 'lyssandria', earth: 'lyssandria', forest: 'lyssandria',
  dragon: 'draconia', fire: 'draconia', flame: 'draconia', devora: 'draconia',
  water: 'leyla', ocean: 'leyla', sea: 'leyla', mirillia: 'leyla',
  wind: 'alera', air: 'alera', sky: 'alera',
  heart: 'maylinn', heal: 'maylinn', love: 'maylinn',
  void: 'lyria', crystal: 'lyria', vision: 'lyria',
  crown: 'aiyami', light: 'aiyami', gold: 'aiyami',
  shift: 'elara', transform: 'elara', change: 'elara',
  unity: 'ino', partner: 'ino', together: 'ino',
  source: 'shinkami', meta: 'shinkami', cosmic: 'shinkami',
};

// ── Source Detection ────────────────────────────────────────────────────────

type MediaSource = 'midjourney' | 'grok-image' | 'grok-video' | 'manual' | 'community';

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const GROK_IMG = /grok_image_\d+/i;
const GROK_VID = /grok_video_\d+|^lv_\d+/i;
const MJ_USER = /frankx\d+_/i;

// ── Analysis Output ─────────────────────────────────────────────────────────

export interface TasteScore {
  canon: number;
  design: number;
  emotion: number;
  technical: number;
  uniqueness: number;
  total: number;
}

export interface MediaAnalysis {
  storage_path: string;
  filename: string;
  guardian: string | null;
  gate: string | null;
  element: string | null;
  frequency_hz: number | null;
  godbeast: string | null;
  source: MediaSource;
  scene: string;
  tags: string[];
  media_type: 'image' | 'video';
  quality_tier: number;
  taste_score: TasteScore;
  public_url: string;
}

// ── Core Analysis Functions ─────────────────────────────────────────────────

export function detectGuardian(text: string): string | null {
  const t = text.toLowerCase();
  for (const name of GUARDIAN_NAMES) {
    if (t.includes(name)) return name;
  }
  for (const [beast, guardian] of Object.entries(GODBEAST_MAP)) {
    if (t.includes(beast)) return guardian;
  }
  for (const [keyword, guardian] of Object.entries(ELEMENT_MAP)) {
    if (t.includes(keyword)) return guardian;
  }
  return null;
}

export function detectSource(filename: string): MediaSource {
  if (UUID_RE.test(filename) && MJ_USER.test(filename)) return 'midjourney';
  if (GROK_IMG.test(filename)) return 'grok-image';
  if (GROK_VID.test(filename)) return 'grok-video';
  if (filename.includes('community/')) return 'community';
  return 'manual';
}

export function extractScene(filename: string): string {
  let stem = filename
    .replace(/\.(webp|jpg|jpeg|png|gif|mp4|mov|webm)$/i, '')
    .replace(/^[^/]*\//, '');

  for (const g of GUARDIAN_NAMES) {
    if (stem.toLowerCase().startsWith(g + '-') || stem.toLowerCase().startsWith(g + '_')) {
      stem = stem.slice(g.length + 1);
      break;
    }
  }

  if (UUID_RE.test(stem)) {
    stem = stem.replace(UUID_RE, '').replace(MJ_USER, '');
  }

  return stem
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) || 'untitled';
}

export function generateTags(
  guardian: string | null,
  source: MediaSource,
  scene: string,
  mediaType: string,
  storagePath: string
): string[] {
  const tags = new Set<string>();

  if (guardian) {
    const info = GUARDIANS[guardian];
    if (info) {
      tags.add(`guardian:${guardian}`);
      tags.add(`gate:${info.gate.toLowerCase()}`);
      tags.add(`element:${info.element.toLowerCase()}`);
      tags.add(`hz:${info.frequency}`);
      tags.add(`godbeast:${info.godbeast.toLowerCase()}`);
    }
  }

  tags.add(`source:${source}`);
  tags.add(`type:${mediaType}`);

  if (storagePath.startsWith('guardians/gallery/')) tags.add('collection:gallery');
  if (storagePath.startsWith('guardians/') && !storagePath.includes('gallery/')) tags.add('collection:hero');
  if (storagePath.startsWith('community/')) tags.add('collection:community');

  const ctx = scene.toLowerCase();
  if (/portrait|face|close/.test(ctx)) tags.add('style:portrait');
  if (/dragon|godbeast|beast|creature/.test(ctx)) tags.add('content:godbeast');
  if (/battle|armor|warrior|fight|sword/.test(ctx)) tags.add('content:action');
  if (/embrace|love|tender|lovingly/.test(ctx)) tags.add('content:emotional');
  if (/community|group|together|crowd/.test(ctx)) tags.add('content:world-building');
  if (/tree|forest|earth|wooden|nature/.test(ctx)) tags.add('content:nature');
  if (/logo/.test(ctx)) tags.add('category:logo');
  if (/band|music|song/.test(ctx)) tags.add('category:music');
  if (/academy|school|learn/.test(ctx)) tags.add('content:academy');

  return [...tags].sort();
}

export function estimateQualityTier(
  guardian: string | null,
  source: MediaSource,
  storagePath: string
): { tier: number; score: TasteScore } {
  let canon = 50, design = 50, emotion = 50, technical = 50, uniqueness = 50;

  if (guardian) canon += 25;
  if (source === 'midjourney') { design += 15; technical += 10; uniqueness += 10; }
  if (source === 'grok-image') { design += 10; technical += 10; }

  if (storagePath.startsWith('guardians/') && !storagePath.includes('gallery/')) {
    canon += 10; design += 10; emotion += 10;
  }
  if (storagePath.includes('gallery/')) { design += 5; emotion += 5; }
  if (storagePath.startsWith('community/')) { canon -= 10; design -= 5; }

  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const s: TasteScore = {
    canon: clamp(canon),
    design: clamp(design),
    emotion: clamp(emotion),
    technical: clamp(technical),
    uniqueness: clamp(uniqueness),
    total: 0,
  };

  s.total = Math.round(
    s.canon * 0.25 + s.design * 0.25 + s.emotion * 0.20 +
    s.technical * 0.15 + s.uniqueness * 0.15
  );

  const tier = s.total >= 80 ? 1 : s.total >= 60 ? 2 : s.total >= 40 ? 3 : 4;
  return { tier, score: s };
}

// ── Full Analysis Pipeline ──────────────────────────────────────────────────

const IMAGE_EXTS = /\.(webp|jpg|jpeg|png|gif|avif)$/i;
const VIDEO_EXTS = /\.(mp4|mov|webm|avi)$/i;

export function analyzeFile(
  storagePath: string,
  supabaseUrl: string,
  bucket: string = 'arcanea-gallery'
): MediaAnalysis {
  const filename = storagePath.split('/').pop() || storagePath;
  const mediaType = VIDEO_EXTS.test(filename) ? 'video' : 'image';
  const guardian = detectGuardian(storagePath);
  const info = guardian ? GUARDIANS[guardian] : null;
  const source = detectSource(storagePath);
  const scene = extractScene(filename);
  const tags = generateTags(guardian, source, scene, mediaType, storagePath);
  const { tier, score } = estimateQualityTier(guardian, source, storagePath);
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;

  return {
    storage_path: storagePath,
    filename,
    guardian,
    gate: info?.gate ?? null,
    element: info?.element ?? null,
    frequency_hz: info?.frequency ?? null,
    godbeast: info?.godbeast ?? null,
    source,
    scene,
    tags,
    media_type: mediaType,
    quality_tier: tier,
    taste_score: score,
    public_url: publicUrl,
  };
}

export async function analyzeStorageBucket(
  supabaseUrl: string,
  anonKey: string,
  bucket: string = 'arcanea-gallery',
  prefixes: string[] = ['guardians/', 'guardians/gallery/', 'community/']
): Promise<MediaAnalysis[]> {
  const headers = {
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
    'Content-Type': 'application/json',
  };
  const listUrl = `${supabaseUrl}/storage/v1/object/list/${bucket}`;
  const results: MediaAnalysis[] = [];

  for (const prefix of prefixes) {
    let offset = 0;
    const limit = 500;

    while (true) {
      const res = await fetch(listUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prefix, limit, offset }),
      });
      if (!res.ok) break;

      const files: Array<{ name: string; metadata?: { mimetype?: string; size?: number } }> = await res.json();
      if (files.length === 0) break;

      for (const file of files) {
        if (!file.name || !file.metadata?.mimetype) continue;
        if (!IMAGE_EXTS.test(file.name) && !VIDEO_EXTS.test(file.name)) continue;

        const fullPath = `${prefix}${file.name}`;
        const analysis = analyzeFile(fullPath, supabaseUrl, bucket);
        results.push(analysis);
      }

      if (files.length < limit) break;
      offset += limit;
    }
  }

  return results;
}
