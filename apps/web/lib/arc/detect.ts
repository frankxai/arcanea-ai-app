/**
 * Arc Protocol — Creation Detection
 *
 * Analyzes a chat message + response pair to detect if a meaningful
 * creation was produced (character, world, image prompt, story, etc.).
 *
 * Runs client-side after each AI response. Lightweight keyword matching
 * and structure detection — no AI call needed.
 */

import type { ArcType, Palette } from '../../../../packages/arc-protocol/src/types';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DetectedCreation {
  type: ArcType;
  spark: string;
  palette: Palette;
  sharpen: string[];
  tags: string[];
  /** Hash of the spark for deduplication */
  sparkHash: string;
  /** Confidence score 0-1 */
  confidence: number;
}

// ── Palette detection ────────────────────────────────────────────────────────

const PALETTE_SIGNALS: Record<Palette, string[]> = {
  forge: [
    'fire', 'flame', 'forge', 'smelt', 'ember', 'blaze', 'heat', 'burn',
    'molten', 'volcanic', 'inferno', 'spark', 'ignite', 'scorch',
  ],
  tide: [
    'water', 'ocean', 'sea', 'wave', 'flow', 'stream', 'river', 'rain',
    'crystal', 'ice', 'mist', 'tide', 'current', 'deep', 'aqua',
  ],
  root: [
    'earth', 'stone', 'tree', 'forest', 'mountain', 'ground', 'soil',
    'root', 'grow', 'garden', 'ancient', 'moss', 'clay', 'cavern',
  ],
  drift: [
    'wind', 'air', 'sky', 'cloud', 'breeze', 'storm', 'flight', 'soar',
    'whisper', 'drift', 'float', 'wing', 'feather', 'gale',
  ],
  void: [
    'void', 'shadow', 'dark', 'cosmos', 'star', 'space', 'night',
    'abyss', 'infinity', 'ethereal', 'spirit', 'transcend', 'astral',
  ],
};

// ── Type detection rules ─────────────────────────────────────────────────────

interface TypeRule {
  type: ArcType;
  /** Keywords in the user prompt that suggest this type */
  promptSignals: string[];
  /** Keywords in the AI response that confirm this type */
  responseSignals: string[];
  /** Structural patterns in the response (regex) */
  structurePatterns: RegExp[];
  /** Minimum confidence boost when structure matches */
  structureBoost: number;
}

const TYPE_RULES: TypeRule[] = [
  {
    type: 'character',
    promptSignals: [
      'character', 'protagonist', 'antagonist', 'hero', 'villain',
      'npc', 'companion', 'luminor', 'guardian', 'person', 'figure',
      'create a character', 'design a character', 'build a character',
    ],
    responseSignals: [
      'personality', 'backstory', 'motivation', 'appearance', 'trait',
      'strength', 'weakness', 'flaw', 'goal', 'fear', 'ability',
      'class:', 'race:', 'age:', 'alignment:',
    ],
    structurePatterns: [
      /\*\*name\*\*\s*[:—-]/i,
      /\*\*personality\*\*/i,
      /\*\*backstory\*\*/i,
      /\*\*appearance\*\*/i,
      /(?:^|\n)#{1,3}\s*(?:character|profile|bio)/im,
      /SPARK:\s*.+/i,
    ],
    structureBoost: 0.3,
  },
  {
    type: 'world',
    promptSignals: [
      'world', 'universe', 'realm', 'kingdom', 'empire', 'civilization',
      'build a world', 'create a world', 'worldbuild', 'setting',
      'magic system', 'political system', 'economy', 'society',
    ],
    responseSignals: [
      'geography', 'culture', 'history', 'religion', 'government',
      'faction', 'continent', 'climate', 'resource', 'trade',
      'magic system', 'law', 'custom', 'tradition',
    ],
    structurePatterns: [
      /\*\*(?:geography|history|culture|politics|magic)\*\*/i,
      /(?:^|\n)#{1,3}\s*(?:world|setting|realm)/im,
      /\*\*(?:name of|the) (?:world|realm|kingdom)\*\*/i,
    ],
    structureBoost: 0.3,
  },
  {
    type: 'location',
    promptSignals: [
      'location', 'place', 'city', 'town', 'village', 'dungeon',
      'temple', 'castle', 'tavern', 'forest', 'cave', 'ruin',
      'design a location', 'create a place',
    ],
    responseSignals: [
      'inhabitants', 'notable features', 'atmosphere', 'layout',
      'entrance', 'surrounding', 'district', 'landmark',
    ],
    structurePatterns: [
      /\*\*(?:location|atmosphere|inhabitants|features)\*\*/i,
      /(?:^|\n)#{1,3}\s*(?:location|place|map)/im,
    ],
    structureBoost: 0.25,
  },
  {
    type: 'creature',
    promptSignals: [
      'creature', 'monster', 'beast', 'animal', 'godbeast', 'dragon',
      'create a creature', 'design a monster', 'companion creature',
    ],
    responseSignals: [
      'habitat', 'diet', 'behavior', 'abilities', 'appearance',
      'threat level', 'weakness', 'lore', 'ecology',
    ],
    structurePatterns: [
      /\*\*(?:habitat|behavior|abilities|ecology)\*\*/i,
      /(?:^|\n)#{1,3}\s*(?:creature|beast|monster)/im,
    ],
    structureBoost: 0.25,
  },
  {
    type: 'image',
    promptSignals: [
      'image', 'picture', 'illustration', 'visual', 'artwork',
      'draw', 'paint', 'render', 'portrait', 'scene art',
      'image prompt', 'midjourney', 'dall-e', 'stable diffusion',
      'generate an image', 'create art', 'concept art',
    ],
    responseSignals: [
      'prompt:', 'style:', 'lighting:', 'composition:', 'color palette:',
      'aspect ratio', 'negative prompt', '--ar', '--v', '--style',
    ],
    structurePatterns: [
      /(?:prompt|style|lighting|composition)\s*:/i,
      /--(?:ar|v|style|quality)\s/,
      /\*\*(?:prompt|style|lighting)\*\*/i,
    ],
    structureBoost: 0.35,
  },
  {
    type: 'music',
    promptSignals: [
      'song', 'music', 'lyrics', 'melody', 'composition', 'album',
      'write lyrics', 'compose', 'beat', 'track', 'anthem', 'hymn',
    ],
    responseSignals: [
      'verse', 'chorus', 'bridge', 'tempo', 'key:', 'bpm',
      'pre-chorus', 'outro', 'intro', 'hook',
    ],
    structurePatterns: [
      /\[(?:verse|chorus|bridge|intro|outro|pre-chorus)\s*\d?\]/i,
      /(?:^|\n)#{1,3}\s*(?:verse|chorus|lyrics)/im,
    ],
    structureBoost: 0.4,
  },
  {
    type: 'scene',
    promptSignals: [
      'scene', 'chapter', 'passage', 'write a scene', 'narrative',
      'dialogue', 'write me a scene', 'opening scene',
    ],
    responseSignals: [
      'said', 'whispered', 'shouted', 'walked', 'looked',
      'darkness', 'silence', 'suddenly',
    ],
    structurePatterns: [
      /^"[^"]+"\s/m,  // Dialogue opening
      /(?:^|\n)#{1,3}\s*(?:scene|chapter)\s*\d/im,
    ],
    structureBoost: 0.2,
  },
  {
    type: 'story',
    promptSignals: [
      'story', 'tale', 'narrative', 'write a story', 'short story',
      'fairy tale', 'myth', 'legend', 'fable', 'parable',
      'once upon', 'tell me a story',
    ],
    responseSignals: [
      'once upon', 'long ago', 'in the beginning', 'the end',
      'chapter', 'epilogue', 'prologue',
    ],
    structurePatterns: [
      /(?:^|\n)#{1,3}\s*(?:chapter|prologue|epilogue)/im,
      /once upon a time/i,
      /the end\.?\s*$/im,
    ],
    structureBoost: 0.2,
  },
  {
    type: 'code',
    promptSignals: [
      'code', 'function', 'api', 'component', 'class', 'module',
      'build me', 'implement', 'write code', 'typescript', 'python',
      'react component', 'endpoint', 'algorithm',
    ],
    responseSignals: [
      'function', 'const', 'import', 'export', 'return', 'class',
      'interface', 'async', 'await', 'try', 'catch',
    ],
    structurePatterns: [
      /```(?:typescript|javascript|python|rust|go|java|tsx?|jsx?)/,
      /(?:export|import)\s+(?:default\s+)?(?:function|class|const|interface)/,
    ],
    structureBoost: 0.3,
  },
  {
    type: 'system',
    promptSignals: [
      'magic system', 'combat system', 'rule system', 'game mechanic',
      'progression system', 'skill tree', 'crafting system',
      'design a system', 'create rules',
    ],
    responseSignals: [
      'tier', 'level', 'rank', 'requirement', 'unlock', 'cost',
      'cooldown', 'effect', 'modifier', 'prerequisite',
    ],
    structurePatterns: [
      /\|.*\|.*\|/m,  // Table format
      /(?:^|\n)#{1,3}\s*(?:rules|mechanics|system|tiers)/im,
    ],
    structureBoost: 0.25,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simple string hash for deduplication */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/** Count keyword matches in text (case-insensitive, word boundary) */
function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of keywords) {
    // For multi-word keywords, check as substring
    if (kw.includes(' ')) {
      if (lower.includes(kw)) count++;
    } else {
      // Single word: check with rough word boundary
      const idx = lower.indexOf(kw);
      if (idx !== -1) count++;
    }
  }
  return count;
}

/** Extract the first meaningful proper noun or title from the response */
function extractSpark(response: string, type: ArcType): string {
  // Try explicit SPARK: marker first
  const sparkMatch = response.match(/SPARK:\s*(.+)/i);
  if (sparkMatch) return sparkMatch[1].trim().slice(0, 200);

  // Try bold name patterns: **Name**: or **Name** -
  const nameMatch = response.match(/\*\*(?:name|title|character)\*\*\s*[:—-]\s*(.+)/i);
  if (nameMatch) return nameMatch[1].trim().replace(/\*\*/g, '').slice(0, 200);

  // Try first heading
  const headingMatch = response.match(/^#{1,3}\s+(.+)/m);
  if (headingMatch) {
    const heading = headingMatch[1].trim().replace(/\*\*/g, '');
    if (heading.length > 3 && heading.length < 100) return heading;
  }

  // Try first bold text
  const boldMatch = response.match(/\*\*([^*]{3,80})\*\*/);
  if (boldMatch) return boldMatch[1].trim();

  // Fallback: first sentence of the response (truncated)
  const firstSentence = response.split(/[.!?\n]/).find((s) => s.trim().length > 10);
  if (firstSentence) return firstSentence.trim().slice(0, 120);

  return `Untitled ${type}`;
}

/** Detect the dominant palette from the response text */
function detectPalette(text: string): Palette {
  const lower = text.toLowerCase();
  const scores: Record<Palette, number> = {
    forge: 0, tide: 0, root: 0, drift: 0, void: 0,
  };

  for (const [palette, signals] of Object.entries(PALETTE_SIGNALS)) {
    scores[palette as Palette] = countMatches(lower, signals);
  }

  // Find the highest-scoring palette
  let best: Palette = 'void';
  let bestScore = 0;
  for (const [palette, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = palette as Palette;
    }
  }

  return best;
}

/** Extract sharpen constraints (things the creation should NOT be) */
function extractSharpen(response: string): string[] {
  const sharpen: string[] = [];

  // Look for explicit SHARPEN: markers
  const sharpenMatch = response.match(/SHARPEN:\s*(.+)/i);
  if (sharpenMatch) {
    sharpen.push(
      ...sharpenMatch[1]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  // Look for "avoid", "not", "unlike" patterns
  const avoidMatches = response.match(/(?:avoid|not|unlike|never|don't)\s+([^.!?\n]{5,60})/gi);
  if (avoidMatches) {
    for (const match of avoidMatches.slice(0, 3)) {
      const cleaned = match.replace(/^(?:avoid|not|unlike|never|don't)\s+/i, '').trim();
      if (cleaned.length > 3) sharpen.push(cleaned);
    }
  }

  return sharpen.slice(0, 5);
}

/** Extract relevant tags from the content */
function extractTags(prompt: string, response: string, type: ArcType): string[] {
  const tags = new Set<string>([type]);
  const combined = `${prompt} ${response}`.toLowerCase();

  // Element tags
  const elements = ['fire', 'water', 'earth', 'wind', 'void', 'spirit'];
  for (const el of elements) {
    if (combined.includes(el)) tags.add(el);
  }

  // Genre tags
  const genres = ['fantasy', 'sci-fi', 'horror', 'romance', 'mystery', 'thriller', 'comedy'];
  for (const g of genres) {
    if (combined.includes(g)) tags.add(g);
  }

  return Array.from(tags).slice(0, 8);
}

// ── Main detection function ──────────────────────────────────────────────────

/** Minimum response length to consider for creation detection */
const MIN_RESPONSE_LENGTH = 150;

/** Minimum confidence threshold to trigger a save */
const CONFIDENCE_THRESHOLD = 0.4;

/**
 * Detect if a chat exchange produced a meaningful creation.
 *
 * @param userPrompt  - The user's message
 * @param aiResponse  - The AI's response text
 * @returns DetectedCreation if something was made, null otherwise
 */
export function detectCreation(
  userPrompt: string,
  aiResponse: string,
): DetectedCreation | null {
  // Skip short responses — probably just conversation
  if (aiResponse.length < MIN_RESPONSE_LENGTH) return null;

  // Skip purely conversational exchanges
  const conversational = [
    'how are you', 'what is', 'who is', 'explain', 'why does',
    'thank you', 'thanks', 'hello', 'hi', 'hey', 'yes', 'no',
    'help me understand', 'can you tell me',
  ];
  const lowerPrompt = userPrompt.toLowerCase().trim();
  if (conversational.some((c) => lowerPrompt === c || lowerPrompt.startsWith(c + ' '))) {
    // Still allow if the response has strong structural signals
    const hasStructure = TYPE_RULES.some((rule) =>
      rule.structurePatterns.some((p) => p.test(aiResponse))
    );
    if (!hasStructure) return null;
  }

  // Score each type
  let bestType: ArcType = 'story';
  let bestScore = 0;

  for (const rule of TYPE_RULES) {
    let score = 0;

    // Prompt signals (weighted higher — user intent matters most)
    const promptHits = countMatches(userPrompt, rule.promptSignals);
    score += promptHits * 0.15;

    // Response signals
    const responseHits = countMatches(aiResponse, rule.responseSignals);
    score += Math.min(responseHits * 0.05, 0.3);

    // Structural patterns (strongest signal)
    const structureHits = rule.structurePatterns.filter((p) => p.test(aiResponse)).length;
    if (structureHits > 0) {
      score += rule.structureBoost + (structureHits - 1) * 0.1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestType = rule.type;
    }
  }

  // Below confidence threshold — this is just conversation
  if (bestScore < CONFIDENCE_THRESHOLD) return null;

  // Cap confidence at 1.0
  const confidence = Math.min(bestScore, 1.0);

  const spark = extractSpark(aiResponse, bestType);
  const palette = detectPalette(aiResponse);
  const sharpen = extractSharpen(aiResponse);
  const tags = extractTags(userPrompt, aiResponse, bestType);
  const sparkHash = hashString(spark + bestType);

  return {
    type: bestType,
    spark,
    palette,
    sharpen,
    tags,
    sparkHash,
    confidence,
  };
}
