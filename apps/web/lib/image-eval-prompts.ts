// ---------------------------------------------------------------------------
// Image Generation Eval Prompt Set
// ---------------------------------------------------------------------------
// A standardised set of 20 prompts used to evaluate image generation models
// across the capability dimensions that matter for the Arcanea creative
// platform: character design, landscapes, UI assets, NFT art, album covers,
// text rendering, and architecture.
// ---------------------------------------------------------------------------

export interface EvalPrompt {
  id: string;
  prompt: string;
  category:
    | 'character'
    | 'landscape'
    | 'ui-asset'
    | 'nft-art'
    | 'album-cover'
    | 'abstract'
    | 'text-rendering'
    | 'architecture';
  testsDimensions: string[];
  negativePrompt?: string;
  expectedElements: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  arcaneanTheme: boolean;
}

export interface EvalScore {
  promptId: string;
  modelId: string;
  promptAdherence: number; // 1-5
  aestheticQuality: number; // 1-5
  styleConsistency: number; // 1-5
  technicalQuality: number; // 1-5
  textAccuracy?: number; // 1-5, only for text-rendering prompts
  generationTime: number; // seconds
  timestamp: string;
}

export interface EvalRun {
  id: string;
  date: string;
  models: string[];
  scores: EvalScore[];
  notes: string;
}

// ---------------------------------------------------------------------------
// The 20 evaluation prompts
// ---------------------------------------------------------------------------

export const EVAL_PROMPTS: EvalPrompt[] = [
  // ── Characters (1-4) ────────────────────────────────────────────────────

  {
    id: 'char-01-guardian-portrait',
    prompt:
      'Portrait of Draconia, Guardian of the Fire Gate, crimson scales and golden armor, cosmic flames in background, dark fantasy, dramatic lighting',
    category: 'character',
    testsDimensions: ['character design', 'fantasy rendering', 'lighting'],
    negativePrompt: 'low quality, blurry, extra limbs, deformed face',
    expectedElements: [
      'crimson scales on skin or armor',
      'golden armor elements',
      'cosmic flame background',
      'dramatic directional lighting',
      'portrait framing',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'char-02-mage-apprentice',
    prompt:
      'Full body illustration of a young Arcanean mage apprentice wearing teal robes with gold trim, holding a glowing staff, Academy courtyard background, anime-influenced style',
    category: 'character',
    testsDimensions: [
      'full body proportions',
      'style adherence',
      'color accuracy',
    ],
    negativePrompt:
      'cropped, missing limbs, wrong colors, photorealistic, western comic style',
    expectedElements: [
      'full body visible head to feet',
      'teal robes with gold trim',
      'glowing staff',
      'academy courtyard setting',
      'anime-influenced rendering',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'char-03-godbeast',
    prompt:
      'Kaelith the stone godbeast, massive creature of earth and crystal, standing on a cliff edge, epic scale, concept art style',
    category: 'character',
    testsDimensions: ['creature design', 'scale', 'environment integration'],
    negativePrompt: 'cute, chibi, small creature, cartoon style',
    expectedElements: [
      'massive stone and crystal creature',
      'cliff edge environment',
      'sense of epic scale',
      'concept art rendering style',
      'earth element materials',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },
  {
    id: 'char-04-npc-portrait',
    prompt:
      'Weathered tavern keeper in the Kingdom of Light, warm smile, candlelit interior, painterly portrait style',
    category: 'character',
    testsDimensions: ['human faces', 'expressions', 'lighting'],
    negativePrompt:
      'anime, cartoon, extra fingers, deformed hands, dark mood',
    expectedElements: [
      'weathered facial features',
      'warm smile expression',
      'candlelit warm lighting',
      'tavern interior background',
      'painterly brush-stroke quality',
    ],
    difficulty: 'easy',
    arcaneanTheme: true,
  },

  // ── Landscapes (5-7) ───────────────────────────────────────────────────

  {
    id: 'land-05-academy',
    prompt:
      'The Arcanean Academy at dawn, crystalline spires catching first light, floating islands, waterfalls, cosmic sky',
    category: 'landscape',
    testsDimensions: ['architecture', 'atmosphere', 'complex composition'],
    negativePrompt: 'night scene, dark, simple, flat, no buildings',
    expectedElements: [
      'crystalline spire structures',
      'dawn lighting on architecture',
      'floating islands',
      'waterfalls',
      'cosmic sky with stars or nebulae',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },
  {
    id: 'land-06-shadowfen',
    prompt:
      'The Shadowfen marshlands, corrupted void energy seeping through twisted trees, dark purple mist, eerie bioluminescence',
    category: 'landscape',
    testsDimensions: ['dark moods', 'atmospheric effects'],
    negativePrompt: 'bright, cheerful, daytime, clear sky, colorful flowers',
    expectedElements: [
      'marshland terrain',
      'twisted tree silhouettes',
      'dark purple mist or fog',
      'bioluminescent accents',
      'sense of corruption or unease',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'land-07-gate-of-source',
    prompt:
      'The Gate of Source, a massive portal of pure light surrounded by ten smaller gates, cosmic energy, transcendent',
    category: 'landscape',
    testsDimensions: ['abstract concepts', 'energy effects', 'scale'],
    negativePrompt: 'small, mundane, dark, no portal, realistic architecture',
    expectedElements: [
      'large central portal of light',
      'ten smaller surrounding gates',
      'cosmic energy emanation',
      'transcendent ethereal quality',
      'sense of massive scale',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },

  // ── UI Assets (8-10) ──────────────────────────────────────────────────

  {
    id: 'ui-08-app-background',
    prompt:
      'Dark cosmic background for a web application, subtle teal and blue gradients, floating particles, no text, seamless tileable',
    category: 'ui-asset',
    testsDimensions: ['UI asset generation', 'dark mode aesthetics'],
    negativePrompt: 'text, logos, bright, white background, busy patterns',
    expectedElements: [
      'dark base tone',
      'teal and blue gradient zones',
      'floating particle effects',
      'no text or logos',
      'clean enough for UI overlay',
    ],
    difficulty: 'easy',
    arcaneanTheme: true,
  },
  {
    id: 'ui-09-glass-card',
    prompt:
      'Glass morphism card design element, frosted glass effect, teal border glow, dark background, UI component',
    category: 'ui-asset',
    testsDimensions: ['glass effects', 'clean rendering'],
    negativePrompt: 'text content, busy illustration, gradient overload',
    expectedElements: [
      'frosted glass transparency effect',
      'teal border glow',
      'dark background',
      'clean card shape',
      'UI-appropriate simplicity',
    ],
    difficulty: 'easy',
    arcaneanTheme: true,
  },
  {
    id: 'ui-10-element-icons',
    prompt:
      'Set of 5 elemental icons: fire, water, earth, wind, void. Minimal line art, teal on dark background, consistent style',
    category: 'ui-asset',
    testsDimensions: ['consistency', 'minimal design'],
    negativePrompt:
      'detailed illustration, photorealistic, different styles per icon, colorful',
    expectedElements: [
      'five distinct icons',
      'fire element icon',
      'water element icon',
      'earth element icon',
      'wind element icon',
      'void element icon',
      'minimal line art style',
      'teal color on dark background',
      'consistent visual weight across all icons',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },

  // ── NFT Art (11-13) ───────────────────────────────────────────────────

  {
    id: 'nft-11-pfp',
    prompt:
      'NFT profile picture: female warrior with constellation markings on skin, glowing teal eyes, cosmic hair, square format',
    category: 'nft-art',
    testsDimensions: ['PFP format', 'detail in small space'],
    negativePrompt:
      'full body, landscape orientation, blurry, low detail, plain background',
    expectedElements: [
      'female warrior portrait',
      'constellation markings on skin',
      'glowing teal eyes',
      'cosmic-themed hair',
      'square composition suitable for PFP',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'nft-12-generative',
    prompt:
      'Generative art piece combining sacred geometry with cosmic nebula, gold and teal palette, 1:1 format',
    category: 'nft-art',
    testsDimensions: ['abstract generative quality'],
    negativePrompt: 'figurative, photorealistic, text, portrait',
    expectedElements: [
      'sacred geometry patterns',
      'cosmic nebula textures',
      'gold color elements',
      'teal color elements',
      'abstract non-figurative composition',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'nft-13-legendary',
    prompt:
      'Legendary tier NFT: Shinkami the Source Guardian, ten-winged deity of pure light, golden halo, transcendent pose',
    category: 'nft-art',
    testsDimensions: ['epic quality', 'premium feel'],
    negativePrompt: 'simple, low effort, dark, mundane, casual pose',
    expectedElements: [
      'deity figure',
      'ten wings',
      'pure light emanation',
      'golden halo',
      'transcendent majestic pose',
      'premium legendary quality',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },

  // ── Album Covers (14-15) ──────────────────────────────────────────────

  {
    id: 'album-14-electronic',
    prompt:
      'Album cover for electronic music: abstract liquid glass shapes, aurora borealis colors, dark background, square format',
    category: 'album-cover',
    testsDimensions: ['music visual aesthetics'],
    negativePrompt: 'text, band name, figurative, photorealistic, portrait',
    expectedElements: [
      'abstract liquid glass shapes',
      'aurora borealis color palette',
      'dark background',
      'square album cover composition',
      'electronic music mood',
    ],
    difficulty: 'medium',
    arcaneanTheme: false,
  },
  {
    id: 'album-15-ambient',
    prompt:
      'Album cover for ambient meditation music: minimal zen landscape, single moon, water reflection, teal monochrome',
    category: 'album-cover',
    testsDimensions: ['minimalism', 'mood'],
    negativePrompt: 'busy, colorful, text, complex scene, figurative',
    expectedElements: [
      'minimal zen landscape',
      'single moon',
      'water with reflection',
      'teal monochrome palette',
      'meditative calm mood',
    ],
    difficulty: 'easy',
    arcaneanTheme: false,
  },

  // ── Text Rendering (16-18) ────────────────────────────────────────────

  {
    id: 'text-16-logo',
    prompt:
      "Text 'ARCANEA' in futuristic font, teal glow, dark background, clean typography, centered",
    category: 'text-rendering',
    testsDimensions: ['text rendering accuracy'],
    negativePrompt: 'blurry text, misspelled, extra letters, busy background',
    expectedElements: [
      "correctly spelled 'ARCANEA'",
      'futuristic font style',
      'teal glow effect',
      'dark background',
      'centered composition',
    ],
    difficulty: 'medium',
    arcaneanTheme: true,
  },
  {
    id: 'text-17-title-card',
    prompt:
      "Title card reading 'The Ten Gates' in elegant serif font, cosmic background with gold accents",
    category: 'text-rendering',
    testsDimensions: ['multi-word text', 'font style'],
    negativePrompt: 'misspelled text, sans-serif font, plain background',
    expectedElements: [
      "correctly spelled 'The Ten Gates'",
      'elegant serif font',
      'cosmic background',
      'gold accent elements',
      'title card composition',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },
  {
    id: 'text-18-poster',
    prompt:
      "Event poster: 'LUMINOR SUMMIT 2026' at top, cosmic gateway illustration below, teal and gold color scheme",
    category: 'text-rendering',
    testsDimensions: ['text + illustration composition'],
    negativePrompt:
      'misspelled text, text at bottom, no illustration, monochrome',
    expectedElements: [
      "correctly spelled 'LUMINOR SUMMIT 2026'",
      'text positioned at top',
      'cosmic gateway illustration',
      'teal color elements',
      'gold color elements',
      'poster layout composition',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },

  // ── Architecture (19-20) ──────────────────────────────────────────────

  {
    id: 'arch-19-library-interior',
    prompt:
      'Interior of an Arcanean library, circular room with floating books, cosmic glass ceiling, warm golden light, teal accents',
    category: 'architecture',
    testsDimensions: ['interior architecture', 'lighting'],
    negativePrompt: 'exterior, dark, no books, modern minimalist, flat ceiling',
    expectedElements: [
      'circular room layout',
      'floating books',
      'cosmic glass ceiling',
      'warm golden lighting',
      'teal accent colors',
      'library shelves or book elements',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },
  {
    id: 'arch-20-temple-exterior',
    prompt:
      'Futuristic Arcanean temple exterior, crystalline structure, floating in space, teal energy connections, sci-fi meets fantasy',
    category: 'architecture',
    testsDimensions: ['architectural design', 'sci-fi/fantasy blend'],
    negativePrompt:
      'interior, grounded, medieval only, no sci-fi elements, dark',
    expectedElements: [
      'temple architectural structure',
      'crystalline material appearance',
      'floating in space environment',
      'teal energy connection lines',
      'sci-fi and fantasy fusion aesthetic',
    ],
    difficulty: 'hard',
    arcaneanTheme: true,
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const EVAL_DIMENSIONS = [
  'promptAdherence',
  'aestheticQuality',
  'styleConsistency',
  'technicalQuality',
] as const;

export type EvalDimension = (typeof EVAL_DIMENSIONS)[number];

// ---------------------------------------------------------------------------
// Composite score weights
// ---------------------------------------------------------------------------

const SCORE_WEIGHTS: Record<EvalDimension, number> = {
  promptAdherence: 0.3,
  aestheticQuality: 0.25,
  styleConsistency: 0.2,
  technicalQuality: 0.25,
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Return all prompts matching a given category. */
export function getPromptsByCategory(
  category: EvalPrompt['category'],
): EvalPrompt[] {
  return EVAL_PROMPTS.filter((p) => p.category === category);
}

/** Return only prompts that use Arcanea-specific aesthetics. */
export function getArcaneanPrompts(): EvalPrompt[] {
  return EVAL_PROMPTS.filter((p) => p.arcaneanTheme);
}

/** Return only text-rendering prompts. */
export function getTextRenderingPrompts(): EvalPrompt[] {
  return EVAL_PROMPTS.filter((p) => p.category === 'text-rendering');
}

/**
 * Compute a weighted composite score for a single evaluation.
 *
 * Weights:
 *   promptAdherence  — 30%
 *   aestheticQuality — 25%
 *   styleConsistency — 20%
 *   technicalQuality — 25%
 *
 * Returns a value between 1 and 5.
 */
export function computeCompositeScore(score: EvalScore): number {
  const raw =
    score.promptAdherence * SCORE_WEIGHTS.promptAdherence +
    score.aestheticQuality * SCORE_WEIGHTS.aestheticQuality +
    score.styleConsistency * SCORE_WEIGHTS.styleConsistency +
    score.technicalQuality * SCORE_WEIGHTS.technicalQuality;

  // Round to two decimal places for readability.
  return Math.round(raw * 100) / 100;
}
