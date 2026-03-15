/**
 * Five Sensory Palettes — the SHAPE layer of APL
 */

export interface Palette {
  id: string;
  name: string;
  element: string;
  feelsLike: string[];
  soundsLike: string[];
  looksLike: string[];
  keywords: string[];
}

export const PALETTES: Record<string, Palette> = {
  forge: {
    id: 'forge',
    name: 'Forge',
    element: 'Fire',
    feelsLike: ['heat on skin', 'rough metal', 'heartbeat', 'sweat', 'urgency'],
    soundsLike: ['crackle', 'percussion', 'roar', 'hammer strike', 'breathing'],
    looksLike: ['ember', 'gold', 'molten glass', 'dawn', 'orange haze'],
    keywords: ['transformation', 'power', 'forge', 'burn', 'create', 'build', 'energy'],
  },
  tide: {
    id: 'tide',
    name: 'Tide',
    element: 'Water',
    feelsLike: ['cool stone', 'mist on face', 'deep breath', 'wet air', 'chill'],
    soundsLike: ['echo', 'sustained notes', 'rainfall', 'drip', 'distant waves'],
    looksLike: ['silver', 'deep blue', 'mirror surface', 'moonlight', 'glass'],
    keywords: ['memory', 'flow', 'reflection', 'depth', 'emotion', 'healing', 'past'],
  },
  root: {
    id: 'root',
    name: 'Root',
    element: 'Earth',
    feelsLike: ['packed earth', 'bark', 'weight in the chest', 'rough fiber', 'stillness'],
    soundsLike: ['low hum', 'grinding', 'drum', 'footstep', 'settling'],
    looksLike: ['moss green', 'amber', 'bone', 'fossil', 'dark wood'],
    keywords: ['stability', 'growth', 'patience', 'history', 'foundation', 'ancient', 'steady'],
  },
  drift: {
    id: 'drift',
    name: 'Drift',
    element: 'Wind',
    feelsLike: ['wind through hair', 'electric tingle', 'lightness', 'goosebumps'],
    soundsLike: ['whistle', 'chime', 'distant thunder', 'flutter', 'hush'],
    looksLike: ['cloud white', 'pale blue', 'ozone', 'light scatter', 'translucent'],
    keywords: ['freedom', 'change', 'speed', 'movement', 'release', 'flight', 'breath'],
  },
  void: {
    id: 'void',
    name: 'Void',
    element: 'Void/Spirit',
    feelsLike: ['weightlessness', 'silence', 'vertigo', 'presence', 'expansion'],
    soundsLike: ['sub-bass', 'overtone', 'nothing', 'ring', 'resonance'],
    looksLike: ['starfield', 'ink black', 'iridescent', 'aurora', 'ultraviolet'],
    keywords: ['potential', 'mystery', 'transcendence', 'unknown', 'consciousness', 'infinite'],
  },
};

/**
 * Get a palette by ID
 */
export function getPalette(id: string): Palette | undefined {
  return PALETTES[id.toLowerCase()];
}

/**
 * Blend two palettes — returns combined sensory descriptors
 */
export function blendPalettes(primary: string, secondary: string): {
  feelsLike: string[];
  soundsLike: string[];
  looksLike: string[];
  description: string;
} {
  const p = PALETTES[primary.toLowerCase()];
  const s = PALETTES[secondary.toLowerCase()];
  if (!p || !s) return { feelsLike: [], soundsLike: [], looksLike: [], description: '' };

  return {
    feelsLike: [...p.feelsLike.slice(0, 3), ...s.feelsLike.slice(0, 2)],
    soundsLike: [...p.soundsLike.slice(0, 3), ...s.soundsLike.slice(0, 2)],
    looksLike: [...p.looksLike.slice(0, 3), ...s.looksLike.slice(0, 2)],
    description: `${p.name} + ${s.name}: ${p.element} meets ${s.element}`,
  };
}

/**
 * Auto-detect palette from text based on keyword matching
 */
export function detectPalette(text: string): { palette: string; confidence: number }[] {
  const lower = text.toLowerCase();
  const scores = Object.entries(PALETTES).map(([id, palette]) => {
    const hits = palette.keywords.filter((kw) => lower.includes(kw)).length;
    return { palette: id, confidence: Math.min(hits / 3, 1) };
  });
  return scores.filter((s) => s.confidence > 0).sort((a, b) => b.confidence - a.confidence);
}
