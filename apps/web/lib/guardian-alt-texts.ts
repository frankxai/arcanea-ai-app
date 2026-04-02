/**
 * Systematic alt text mapping for all Guardian gallery images.
 *
 * Each alt text follows the pattern:
 *   [Name], [Role] — [visual description grounded in canonical attributes]
 *
 * Descriptions are 10-20 words, written for screen readers, and derived from
 * canonical lore in CANON_LOCKED.md and the guardians-grid.tsx character data.
 */

export const GUARDIAN_ALT_TEXTS: Record<string, Record<string, string>> = {
  // ── Root (v1 hero portraits) ──────────────────────────────────────────────
  root: {
    'lyssandria-hero.webp':
      'Lyssandria, Guardian of Foundation Gate, obsidian-skinned warrior with silver-white hair rooted in ancient earth',
    'leyla-hero.webp':
      'Leyla, Guardian of Flow Gate, dual-natured deity of water and fire wreathed in rising steam',
    'draconia-hero.webp':
      'Draconia, Guardian of Fire Gate, golden-armored warrior with a mane of living flame',
    'maylinn-hero.webp':
      'Maylinn, Guardian of Heart Gate, bark-skinned healer crowned with forest antlers and blooming flowers',
    'alera-hero.webp':
      'Alera, Guardian of Voice Gate, translucent sonic deity with visible sound waves rippling through her form',
    'lyria-hero.webp':
      'Lyria, Guardian of Sight Gate, silver-skinned seer marked with shifting constellations and a third eye',
    'aiyami-hero.webp':
      'Aiyami, Guardian of Crown Gate, radiant eleven-foot deity of crystallized light and divine serenity',
    'elara-hero.webp':
      'Elara, Guardian of Starweave Gate, kaleidoscopic figure existing in multiple overlapping prismatic forms',
    'ino-hero.webp':
      'Ino, Guardian of Unity Gate, fierce feminine figure with white tiger patterns radiating calm intensity',
    'shinkami-hero.webp':
      'Shinkami, The Unified at Source Gate, shifting starlit presence merging wolf and humanoid forms',
  },

  // ── v2: Divine Bond + Godbeast portraits ──────────────────────────────────
  v2: {
    'lyssandria-divine-bond.webp':
      'Lyssandria in divine bond with Kaelith, obsidian guardian and colossal stone serpent-dragon united',
    'leyla-divine-bond.webp':
      'Leyla in divine bond with Veloura, water-fire deity beside an elegant phoenix-serpent',
    'draconia-divine-bond.webp':
      'Draconia in divine bond with Draconis, golden warrior alongside a solar-fire lion-dragon',
    'maylinn-divine-bond.webp':
      'Maylinn in divine bond with Laeylinn, forest guardian beside the verdant Worldtree Deer',
    'alera-divine-bond.webp':
      'Alera in divine bond with Otome, sonic deity beside a colossal whale of deep song',
    'lyria-divine-bond.webp':
      'Lyria in divine bond with Yumiko, constellation-marked seer beside a nine-tailed owl-serpent',
    'aiyami-divine-bond.webp':
      'Aiyami in divine bond with Sol, light deity beside a radiant dragon of crystallized light',
    'elara-divine-bond.webp':
      'Elara in divine bond with Vaelith, fractal guardian beside a fox with eight prismatic tails',
    'ino-divine-bond.webp':
      'Ino in divine bond with Kyuro, tiger-patterned warrior beside a nine-tailed plasma tiger-dragon',
    'shinkami-divine-bond.webp':
      'Shinkami in divine bond with Source, unified starlit being merged with a cosmic wolf',
    'kaelith-godbeast.webp':
      'Kaelith, Godbeast of Foundation Gate, colossal stone serpent-dragon rising from ancient bedrock',
    'veloura-godbeast.webp':
      'Veloura, Godbeast of Flow Gate, elegant phoenix-serpent trailing steam and prismatic vapor',
    'draconis-godbeast.webp':
      'Draconis, Godbeast of Fire Gate, lion-dragon wreathed in blazing solar fire',
    'laeylinn-godbeast.webp':
      'Laeylinn, Godbeast of Heart Gate, majestic Worldtree Deer with antlers of living forest',
    'otome-godbeast.webp':
      'Otome, Godbeast of Voice Gate, colossal whale resonating with deep harmonic song',
    'yumiko-godbeast.webp':
      'Yumiko, Godbeast of Sight Gate, nine-tailed owl-serpent coiled beneath shifting moonlight',
    'sol-godbeast.webp':
      'Sol, Godbeast of Crown Gate, radiant dragon formed from crystallized divine light',
    'vaelith-godbeast.webp':
      'Vaelith, Godbeast of Starweave Gate, fox with eight prismatic tails weaving fractal patterns',
    'kyuro-godbeast.webp':
      'Kyuro, Godbeast of Unity Gate, tiger-dragon with nine plasma tails crackling with energy',
    'source-godbeast.webp':
      'Source, Godbeast of Source Gate, cosmic wolf of starlight embodying meta-consciousness',
  },

  // ── v3: Ultra-quality photorealistic hero portraits ───────────────────────
  v3: {
    'lyssandria-hero-v3.webp':
      'Lyssandria, Foundation Guardian, towering obsidian warrior with silver hair and stone crown in deep earth',
    'leyla-hero-v3.webp':
      'Leyla, Flow Guardian, dual-element deity with one blue and one amber eye amid rising steam',
    'draconia-hero-v3.webp':
      'Draconia, Fire Guardian, ten-foot golden warrior with cascading flame-mane and sun-bright armor',
    'maylinn-hero-v3.webp':
      'Maylinn, Heart Guardian, bark-skinned healer with antler crown and flowers blooming at her feet',
    'alera-hero-v3.webp':
      'Alera, Voice Guardian, translucent figure with visible harmonics rippling through crystalline form',
    'lyria-hero-v3.webp':
      'Lyria, Sight Guardian, silver seer with constellation-marked skin and luminous third eye',
    'aiyami-hero-v3.webp':
      'Aiyami, Crown Guardian, radiant form of pure light too vast for mortal eyes to hold',
    'elara-hero-v3.webp':
      'Elara, Starweave Guardian, kaleidoscopic being shifting through infinite overlapping identities',
    'ino-hero-v3.webp':
      'Ino, Unity Guardian, tiger-patterned warrior radiating quiet power and unshakeable presence',
    'shinkami-hero-v3.webp':
      'Shinkami, Source Guardian, starlit wolf-humanoid merged with cosmic light at 1111 Hz',
  },

  // ── v4: Cinematic landscape hero banners ──────────────────────────────────
  v4: {
    'lyssandria-hero-v4.webp':
      'Lyssandria, Foundation Guardian, cinematic landscape banner with obsidian peaks and deep earth caverns',
    'leyla-hero-v4.webp':
      'Leyla, Flow Guardian, cinematic landscape banner with converging waterfalls and steam-lit shores',
    'draconia-hero-v4.webp':
      'Draconia, Fire Guardian, cinematic landscape banner with volcanic forge and rivers of molten gold',
    'maylinn-hero-v4.webp':
      'Maylinn, Heart Guardian, cinematic landscape banner with ancient forest canopy and healing glades',
    'alera-hero-v4.webp':
      'Alera, Voice Guardian, cinematic landscape banner with crystalline resonance chambers and sonic waves',
    'lyria-hero-v4.webp':
      'Lyria, Sight Guardian, cinematic landscape banner with moonlit observatory and starfield visions',
    'aiyami-hero-v4.webp':
      'Aiyami, Crown Guardian, cinematic landscape banner with divine light cascading from celestial spires',
    'elara-hero-v4.webp':
      'Elara, Starweave Guardian, cinematic landscape banner with fractal dimensions and prismatic portals',
    'ino-hero-v4.webp':
      'Ino, Unity Guardian, cinematic landscape banner with balanced dualities and plasma aurora skies',
    'shinkami-hero-v4.webp':
      'Shinkami, Source Guardian, cinematic landscape banner with cosmic convergence and starlit infinity',
  },

  // ── Gallery: Additional artwork per guardian ──────────────────────────────
  gallery: {
    'leyla-gallery-2.webp':
      'Leyla, Flow Guardian, water-fire artwork depicting swirling currents and ember sparks',
    'leyla-gallery-3.webp':
      'Leyla, Flow Guardian, water-fire artwork with steam-wreathed ceremonial scene',
    'leyla-gallery-4.webp':
      'Leyla, Flow Guardian, water-fire artwork depicting emotional duality in fluid motion',
    'leyla-gallery-5.webp':
      'Leyla, Flow Guardian, water-fire artwork with phoenix-serpent motifs and rising vapor',
    'draconia-gallery-2.webp':
      'Draconia, Fire Guardian, fire-element artwork with molten gold and blazing dragon imagery',
    'draconia-gallery-3.webp':
      'Draconia, Fire Guardian, fire-element artwork depicting solar forge and flame warriors',
    'draconia-gallery-4.webp':
      'Draconia, Fire Guardian, fire-element artwork with radiant armor and living fire',
    'draconia-gallery-5.webp':
      'Draconia, Fire Guardian, fire-element artwork depicting volcanic power and courage themes',
    'maylinn-gallery-2.webp':
      'Maylinn, Heart Guardian, nature artwork with verdant growth and healing light',
    'maylinn-gallery-3.webp':
      'Maylinn, Heart Guardian, nature artwork depicting ancient forest and Worldtree roots',
    'maylinn-gallery-4.webp':
      'Maylinn, Heart Guardian, nature artwork with blooming flowers and gentle antler silhouettes',
    'maylinn-gallery-5.webp':
      'Maylinn, Heart Guardian, nature artwork depicting maternal protection and green canopy',
    'alera-gallery-2.webp':
      'Alera, Voice Guardian, sonic artwork with crystalline sound waves and harmonic patterns',
    'alera-gallery-3.webp':
      'Alera, Voice Guardian, sonic artwork depicting truth spoken in visible resonance',
    'alera-gallery-4.webp':
      'Alera, Voice Guardian, sonic artwork with deep-song motifs and translucent form',
    'alera-gallery-5.webp':
      'Alera, Voice Guardian, sonic artwork depicting expression and the power of words',
    'lyria-gallery-2.webp':
      'Lyria, Sight Guardian, moonlight artwork with constellation patterns and third-eye vision',
    'lyria-gallery-3.webp':
      'Lyria, Sight Guardian, moonlight artwork depicting prophetic sight and silver starfields',
    'lyria-gallery-4.webp':
      'Lyria, Sight Guardian, moonlight artwork with owl-serpent shadows and shifting memory',
    'lyria-gallery-5.webp':
      'Lyria, Sight Guardian, moonlight artwork depicting intuition and veiled cosmic truths',
    'aiyami-gallery-2.webp':
      'Aiyami, Crown Guardian, divine light artwork with celestial radiance and ethereal glow',
    'aiyami-gallery-3.webp':
      'Aiyami, Crown Guardian, divine light artwork depicting enlightenment through luminous removal',
    'aiyami-gallery-4.webp':
      'Aiyami, Crown Guardian, divine light artwork with Sol dragon and crystallized brilliance',
    'aiyami-gallery-5.webp':
      'Aiyami, Crown Guardian, divine light artwork depicting serene transcendence and stillness',
    'elara-gallery-2.webp':
      'Elara, Starweave Guardian, fractal artwork with kaleidoscopic dimensions and shifting forms',
    'elara-gallery-3.webp':
      'Elara, Starweave Guardian, fractal artwork depicting possibility and prismatic light',
    'elara-gallery-4.webp':
      'Elara, Starweave Guardian, fractal artwork with overlapping realities and fox-tail motifs',
    'elara-gallery-5.webp':
      'Elara, Starweave Guardian, fractal artwork depicting playful perspective shifts and wonder',
    'ino-gallery-2.webp':
      'Ino, Unity Guardian, plasma artwork with tiger patterns and balanced dualities',
    'ino-gallery-3.webp':
      'Ino, Unity Guardian, plasma artwork depicting sacred partnership and fusion energy',
    'ino-gallery-4.webp':
      'Ino, Unity Guardian, plasma artwork with nine-tailed dragon imagery and quiet strength',
    'ino-gallery-5.webp':
      'Ino, Unity Guardian, plasma artwork depicting authentic connection beyond pretense',
    'shinkami-gallery-2.webp':
      'Shinkami, Source Guardian, cosmic artwork with starlit wolf form and infinite convergence',
    'shinkami-gallery-3.webp':
      'Shinkami, Source Guardian, cosmic artwork depicting meta-consciousness and remembrance',
    'shinkami-gallery-4.webp':
      'Shinkami, Source Guardian, cosmic artwork with merged wolf-humanoid presence at 1111 Hz',
    'shinkami-gallery-5.webp':
      'Shinkami, Source Guardian, cosmic artwork depicting the Source Gate and primordial creation',
  },
};

/**
 * Resolve a descriptive alt text for a Guardian image path.
 *
 * Accepts paths like:
 *   `/guardians/v3/shinkami-hero-v3.webp`
 *   `/guardians/gallery/leyla-gallery-3.webp`
 *   `/guardians/lyssandria-hero.webp`         (root / v1)
 *
 * Returns the mapped alt text, or a generated fallback based on the filename.
 */
export function getGuardianAlt(path: string): string {
  // Normalise forward slashes, strip leading slash
  const normalised = path.replace(/\\/g, '/').replace(/^\//, '');

  // Remove the "guardians/" prefix
  const withoutBase = normalised.startsWith('guardians/')
    ? normalised.slice('guardians/'.length)
    : normalised;

  // Determine version directory and filename
  let version: string;
  let filename: string;

  const slashIdx = withoutBase.lastIndexOf('/');
  if (slashIdx === -1) {
    // Root-level file (v1 hero)
    version = 'root';
    filename = withoutBase;
  } else {
    version = withoutBase.slice(0, slashIdx);
    filename = withoutBase.slice(slashIdx + 1);
  }

  // Look up in the mapping
  const versionMap = GUARDIAN_ALT_TEXTS[version];
  if (versionMap && versionMap[filename]) {
    return versionMap[filename];
  }

  // Fallback: derive a readable label from the filename
  const base = filename.replace(/\.\w+$/, '');
  const label = base
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return `Guardian artwork: ${label}`;
}
