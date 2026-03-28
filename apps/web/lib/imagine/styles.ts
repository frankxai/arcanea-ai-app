/**
 * Arcanean Style Engine — Canonical image generation styles
 *
 * Each style is a prompt engineering template that wraps user prompts
 * with Arcanean aesthetics, composition rules, and quality directives.
 *
 * Used by: /imagine, /studio, /chat image tool, /api/imagine/generate
 *
 * Architecture:
 *   User prompt → Style wrapper → APL enhance (optional) → Provider
 *
 * Monetization: Free users get 3 styles. Premium unlocks all + custom.
 */

// ---------------------------------------------------------------------------
// Style definition
// ---------------------------------------------------------------------------

export interface ArcaneanStyle {
  id: string;
  name: string;
  /** Short label for pills/chips */
  label: string;
  /** One-line description */
  description: string;
  /** Which guardian or element this draws from */
  guardian?: string;
  element?: string;
  /** The prompt prefix/suffix that defines this style */
  systemDirective: string;
  /** Negative prompt / things to avoid */
  avoid?: string;
  /** Tier: free styles available to all, premium behind paywall */
  tier: 'free' | 'premium';
  /** Tags for filtering */
  tags: string[];
}

// ---------------------------------------------------------------------------
// The Arcanean Style Catalog
// ---------------------------------------------------------------------------

export const ARCANEAN_STYLES: ArcaneanStyle[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // FREE TIER — Available to all users
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'none',
    name: 'No Style',
    label: 'None',
    description: 'Your prompt, unmodified.',
    systemDirective: '',
    tier: 'free',
    tags: [],
  },
  {
    id: 'arcanean-fantasy',
    name: 'Arcanean Fantasy',
    label: 'Fantasy',
    description: 'The signature Arcanea look. Cosmic depth, mythic scale, crystalline detail.',
    guardian: 'Shinkami',
    element: 'Void',
    systemDirective: 'Arcanean fantasy art style. Cosmic depth with crystalline detail. Rich jewel-tone palette with atlantean teal (#7fffd4) and deep cosmic blue accents. Volumetric lighting from an unseen arcane source. Intricate magical geometry. Mythic scale — the subject feels ancient and powerful. Ultra-detailed textures on fabric, metal, and crystal surfaces. Atmospheric particles of golden mana dust.',
    avoid: 'generic fantasy, oversaturated neon, cartoon proportions, flat lighting',
    tier: 'free',
    tags: ['fantasy', 'cosmic', 'mythic'],
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    label: 'Photo',
    description: 'Photography-grade realism. Natural light, film grain, shallow depth of field.',
    systemDirective: 'Photorealistic, ultra-high resolution. Shot on a Hasselblad X2D with a 90mm f/2.5 lens. Natural lighting with subtle fill. Fine film grain (Portra 400 emulsion). Shallow depth of field with creamy bokeh. True-to-life skin textures and material surfaces. No HDR artifacts.',
    avoid: 'CGI look, over-sharpened, plastic skin, oversaturated',
    tier: 'free',
    tags: ['photo', 'realistic', 'cinematic'],
  },
  {
    id: 'anime',
    name: 'Anime',
    label: 'Anime',
    description: 'Studio-quality anime. Clean lines, expressive eyes, dynamic composition.',
    systemDirective: 'High-quality anime illustration style. Clean cel-shaded lines with subtle gradients. Expressive character design with dynamic poses. Rich background detail. Studio Ghibli meets modern seasonal anime production quality. Dramatic camera angles. Vibrant but harmonious color palette.',
    avoid: 'chibi, low-effort, generic anime face, blurry, over-complex background noise',
    tier: 'free',
    tags: ['anime', 'illustration', 'manga'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PREMIUM TIER — Unlock with Forge subscription or credits
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guardian-portrait',
    name: 'Guardian Portrait',
    label: 'Guardian',
    description: 'Divine portrait in the style of the Ten Guardians. Gold accents, cosmic aura.',
    guardian: 'Aiyami',
    element: 'Spirit',
    systemDirective: 'Divine portrait, Arcanean Guardian aesthetic. Regal pose with cosmic authority. Rich gold (#ffd700) accents on armor or jewelry. Glowing elemental aura radiating from the subject. Intricate divine armor or robes with sacred geometry patterns. Dramatic chiaroscuro lighting — a single divine light source from above. Background of swirling nebula or sacred architecture. Porcelain-like skin with inner luminescence. Eyes that hold ancient wisdom.',
    avoid: 'generic angel wings, Christian iconography, cartoonish proportions, flat background',
    tier: 'premium',
    tags: ['portrait', 'guardian', 'divine', 'character'],
  },
  {
    id: 'concept-art',
    name: 'Concept Art',
    label: 'Concept',
    description: 'Industry-grade concept art. Bold shapes, clear silhouettes, painterly finish.',
    systemDirective: 'Professional concept art for AAA game/film production. Bold shapes and clear silhouettes. Painterly brushwork with confident edges. Strategic use of detail — focal point is hyper-detailed, periphery is loose and suggestive. Cinematic composition with strong foreground/midground/background separation. Muted base palette with one vivid accent color. Environmental storytelling in every element.',
    avoid: 'over-rendered, symmetrical, too clean, stock photo lighting',
    tier: 'premium',
    tags: ['concept', 'production', 'game', 'film'],
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    label: 'Cosmic',
    description: 'Deep space aesthetics. Nebulae, starfields, infinite scale.',
    guardian: 'Shinkami',
    element: 'Void',
    systemDirective: 'Cosmic void aesthetic. Deep space scene with rich nebula clouds in violet, teal, and gold. Vast sense of infinite scale. Stars as tiny pinpoints of light, not decorative. Volumetric god-rays piercing through cosmic dust. Silhouetted subjects against the vastness of space. Color temperature shifts from warm gold in light areas to deep indigo in shadows. The overwhelming beauty and terror of the infinite.',
    avoid: 'clip art stars, cartoony planets, flat black background, lens flare abuse',
    tier: 'premium',
    tags: ['space', 'cosmic', 'void', 'nebula'],
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    label: 'Cinema',
    description: 'Film still aesthetic. Anamorphic, color-graded, story in a frame.',
    systemDirective: 'Cinematic film still. Anamorphic widescreen framing (2.39:1 feel). Professional color grading with a dominant color cast. Dramatic lighting setup — motivated practical lights plus atmospheric haze. Shallow depth of field with bokeh orbs. A single decisive moment frozen in time. The composition tells a complete story. Lens characteristics: subtle barrel distortion, warm flares, chromatic aberration on edges.',
    avoid: 'centered subject, flat lighting, over-sharpened, stock photo composition',
    tier: 'premium',
    tags: ['cinematic', 'film', 'dramatic'],
  },
  {
    id: 'forge-fire',
    name: 'Forge & Fire',
    label: 'Forge',
    description: 'Molten metal, ember glow, volcanic power. Draconia\'s domain.',
    guardian: 'Draconia',
    element: 'Fire',
    systemDirective: 'Forge and fire aesthetic. Molten metal rivers and ember-lit scenes. Dominant warm palette: deep crimson, burnt orange, molten gold, ember red. Subjects lit by the glow of fire — warm highlights with deep amber shadows. Volcanic rock textures, cracked obsidian, flowing lava. Sparks and ash particles in the air. The heat is visible — air shimmers and distorts. Raw power made visible.',
    avoid: 'cute fire, cartoon flames, orange monochrome, flat lighting',
    tier: 'premium',
    tags: ['fire', 'forge', 'volcanic', 'elemental'],
  },
  {
    id: 'tide-crystal',
    name: 'Tide & Crystal',
    label: 'Tide',
    description: 'Underwater luminescence, crystal caves, flowing water. Leyla\'s domain.',
    guardian: 'Leyla',
    element: 'Water',
    systemDirective: 'Underwater and crystal aesthetic. Bioluminescent light sources in deep blues, silvers, and crystal whites. Caustic light patterns dancing on surfaces. Translucent and refractive materials — crystal, ice, glass, water. Subjects partially submerged or emerging from liquid. Cool color temperature with occasional warm bioluminescent accents. Fluid motion frozen in time. The weight and grace of water.',
    avoid: 'generic ocean scene, cartoon fish, surface-level beach, flat aqua monochrome',
    tier: 'premium',
    tags: ['water', 'crystal', 'underwater', 'elemental'],
  },
  {
    id: 'root-earth',
    name: 'Root & Earth',
    label: 'Root',
    description: 'Ancient forests, stone temples, living earth. Lyssandria\'s domain.',
    guardian: 'Lyssandria',
    element: 'Earth',
    systemDirective: 'Ancient earth aesthetic. Overgrown stone ruins reclaimed by nature. Deep forest greens, moss textures, weathered stone, exposed root systems. Dappled sunlight filtering through a dense canopy. Subjects grounded and solid, connected to the earth. Rich organic textures — bark, lichen, soil, leaf litter. Fog at ground level. The patience and permanence of stone meeting the persistence of growth.',
    avoid: 'generic forest, bright green cartoon trees, clean stone, flat ground',
    tier: 'premium',
    tags: ['earth', 'forest', 'ancient', 'elemental'],
  },
  {
    id: 'drift-wind',
    name: 'Drift & Wind',
    label: 'Drift',
    description: 'Vast skies, cloud kingdoms, the freedom of air. Alera\'s domain.',
    guardian: 'Alera',
    element: 'Wind',
    systemDirective: 'Wind and sky aesthetic. Vast open skies with dramatic cloud formations. Subjects in motion — hair, fabric, particles caught in wind. Pale silver, white, and sky blue palette with warm golden hour accents. High altitude perspective — looking down on cloud layers or across infinite horizons. Light diffused through atmosphere. The feeling of weightlessness and freedom. Wispy, ethereal, always in motion.',
    avoid: 'static composition, heavy grounded scene, dark enclosed spaces, still air',
    tier: 'premium',
    tags: ['wind', 'sky', 'clouds', 'elemental'],
  },
  {
    id: 'ink-wash',
    name: 'Ink Wash',
    label: 'Ink',
    description: 'East Asian ink painting meets digital art. Minimal, powerful, meditative.',
    systemDirective: 'Digital sumi-e ink wash style. Predominantly black ink on white/cream with selective color accents. Bold calligraphic brushstrokes with wet-on-wet bleeding effects. Generous negative space that breathes. Subjects rendered with minimal strokes that capture essence over detail. Mountain, mist, and water motifs. The power of restraint — every mark intentional.',
    avoid: 'over-detailed, full color, western watercolor, cluttered composition',
    tier: 'premium',
    tags: ['ink', 'minimal', 'asian', 'meditative'],
  },
];

// ---------------------------------------------------------------------------
// Style application
// ---------------------------------------------------------------------------

/**
 * Apply an Arcanean style to a user prompt.
 * Returns the enhanced prompt with style directives prepended/appended.
 */
export function applyStyle(
  userPrompt: string,
  styleId: string,
): { prompt: string; style: ArcaneanStyle | null } {
  if (styleId === 'none' || !styleId) {
    return { prompt: userPrompt, style: null };
  }

  const style = ARCANEAN_STYLES.find((s) => s.id === styleId);
  if (!style || !style.systemDirective) {
    return { prompt: userPrompt, style: null };
  }

  let enhanced = `${userPrompt}. ${style.systemDirective}`;
  if (style.avoid) {
    enhanced += ` Avoid: ${style.avoid}.`;
  }

  return { prompt: enhanced, style };
}

/**
 * Get styles available for a given tier.
 */
export function getAvailableStyles(isPremium: boolean): ArcaneanStyle[] {
  if (isPremium) return ARCANEAN_STYLES;
  return ARCANEAN_STYLES.filter((s) => s.tier === 'free');
}

/**
 * Get styles grouped by element for the UI.
 */
export function getStylesByElement(): Record<string, ArcaneanStyle[]> {
  const groups: Record<string, ArcaneanStyle[]> = {};
  for (const style of ARCANEAN_STYLES) {
    const key = style.element || 'General';
    if (!groups[key]) groups[key] = [];
    groups[key].push(style);
  }
  return groups;
}
