/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * World DNA — prefix system that makes every prompt inherit a world's identity
 */

export interface WorldDNA {
  /** The one thing true here that is false everywhere else */
  spark: string;
  /** Primary sensory palette */
  primaryPalette: string;
  /** Optional secondary palette for complexity */
  secondaryPalette?: string;
  /** Shape description — what the world feels/sounds/looks like */
  shapeDescription: string;
  /** The cliches this world refuses */
  sharpen: string[];
  /** Optional world name */
  name?: string;
}

/**
 * Build a world DNA prefix string
 */
export function buildWorldDNA(dna: WorldDNA): string {
  const palette = dna.secondaryPalette
    ? `${dna.primaryPalette.toUpperCase()} + ${dna.secondaryPalette.toUpperCase()}`
    : dna.primaryPalette.toUpperCase();

  const header = dna.name ? `[WORLD: ${dna.name}]` : '[WORLD DNA]';

  return [
    header,
    `SPARK: ${dna.spark}`,
    `SHAPE: ${palette} — ${dna.shapeDescription}`,
    `SHARPEN: ${dna.sharpen.map((s) => `NOT ${s}`).join('. ')}.`,
    '',
    '— Every prompt below inherits this world. —',
    '',
  ].join('\n');
}

/**
 * The Arcanea reference world DNA (the first world in the multiverse)
 */
export const ARCANEA_WORLD_DNA: WorldDNA = {
  name: 'Arcanea',
  spark: 'Creation itself is conscious here. Every act of making ripples through the Weave — and the Weave remembers.',
  primaryPalette: 'void',
  secondaryPalette: 'forge',
  shapeDescription: 'Starfield silence broken by forge-heat. The air tastes of ozone and old bronze. Light comes from within things, not above them.',
  sharpen: [
    'medieval Europe analog',
    'chosen one narrative',
    'magic without cost',
    'pure good vs pure evil',
    'technology as separate from magic',
  ],
};

export const TOLKIEN_WORLD_DNA: WorldDNA = {
  name: 'Middle-earth',
  spark: 'Magic is not cast; it is an inherent spiritual craft and song that shapes existence, fading over the ages.',
  primaryPalette: 'root',
  secondaryPalette: 'drift',
  shapeDescription: 'The smell of leaf-mold and ancient stone. Low choral harmonies echoing in deep forest glades. Light filtering through high green canopies, holding the memory of lost stars.',
  sharpen: [
    'magic points or mana meters',
    'combat-centric spellcasting',
    'industrial cities',
    'sarcastic modern dialogue',
    'easy resurrection',
  ],
};

export const WIZARDING_WORLD_DNA: WorldDNA = {
  name: 'Wizarding World',
  spark: 'Magic is a hidden academic inheritance, chaotic in the blood but focused into precision through wands and spoken Latinate formula.',
  primaryPalette: 'tide',
  secondaryPalette: 'forge',
  shapeDescription: 'The scent of aged parchment and brass oil lamps. The clicking of wooden wands on stone desks. Golden candlelight casting shadows on gothic stone arches.',
  sharpen: [
    'world-ending cosmic warfare',
    'magical energy beams without incantations',
    'scientific explanations for magic',
    'post-apocalyptic ruins',
    'advanced technology',
  ],
};

export const ELDER_SCROLLS_WORLD_DNA: WorldDNA = {
  name: 'Elder Scrolls',
  spark: 'Magic is the raw, volatile light of Aetherius bleeding through stars, tamed into practical verbs and bound by soul-gem batteries.',
  primaryPalette: 'forge',
  secondaryPalette: 'root',
  shapeDescription: 'Ozone, pine needles, and fresh snow. The roaring crackle of fire in a stone hearth. Auroras draping over jagged granite peaks where dragons roar.',
  sharpen: [
    'clean moral boundaries',
    'logical scientific conservation of mana',
    'instant silent casting without focus',
    'modern psychological naming',
    'unbreakable timeline laws',
  ],
};

export const COSMERE_WORLD_DNA: WorldDNA = {
  name: 'Cosmere',
  spark: 'Magic is Investiture governed by strict thermodynamic laws, focused by physical catalysts and spiritual oaths.',
  primaryPalette: 'void',
  secondaryPalette: 'forge',
  shapeDescription: 'The smell of cold rain on glass. The high-pitched ring of metal cooling in sand. Sharp blue luminescent gemstones glowing with trapped light.',
  sharpen: [
    'unexplained magical miracles',
    'vague soft magic hand-waving',
    'spells without physical catalysts',
    'gods without limits or intents',
    'medieval Europe tropes',
  ],
};

export const DND_WORLD_DNA: WorldDNA = {
  name: 'D&D Multiverse',
  spark: 'Magic is a universal weave tapped via prepared spell slots and planar elements.',
  primaryPalette: 'root',
  secondaryPalette: 'void',
  shapeDescription: 'Damp stone dungeons and glowing blue runes. The smell of sulfur and old leather books. The humming vibration of portal arches leading to other planes.',
  sharpen: [
    'free-form magic casting',
    'technology-driven civilizations',
    'a single flat physical universe',
    'non-lethal dungeon crawls',
    'narrative-only rules',
  ],
};

export const MARVEL_WORLD_DNA: WorldDNA = {
  name: 'Marvel Multiverse',
  spark: 'Reality is a branching multiverse controlled by cosmic elements and dimensional source code.',
  primaryPalette: 'void',
  secondaryPalette: 'drift',
  shapeDescription: 'The crackle of orange eldritch runes spinning in mid-air. Sparking electric portals opening on city streets. The humming silence of branching timelines.',
  sharpen: [
    'gothic fantasy tropes',
    'soft mythological magic',
    'fixed singular timelines',
    'a world without science or technology',
    'low stakes or street-only problems',
  ],
};

export const GREEK_WORLD_DNA: WorldDNA = {
  name: 'Olympian Mythos',
  spark: 'Gods are archetypes of raw human passion and natural law, interfering directly in mortal affairs with tragic and epic consequences.',
  primaryPalette: 'tide',
  secondaryPalette: 'forge',
  shapeDescription: 'Sun-drenched marble columns against a deep blue Aegean Sea. The scent of olive oil, sea salt, and lightning-burned oak. High theatrical strings and the distant roar of a minotaur.',
  sharpen: [
    'generic high fantasy magic',
    'bloodless battles',
    'impersonal sterile deities',
    'scientific classification of monsters',
    'monogamous orderly gods',
  ],
};

export const NORSE_WORLD_DNA: WorldDNA = {
  name: 'Norse Eddas',
  spark: 'Fate (Ørlög/Wyrd) is absolute and inescapable, and even the gods are mortal, marching inevitably toward their doom at Ragnarok.',
  primaryPalette: 'root',
  secondaryPalette: 'void',
  shapeDescription: 'The biting chill of pine forests and frozen fjords. The smell of woodsmoke, iron ore, and horn-poured mead. The deep thrumming of war drums and the crackle of bifrost light.',
  sharpen: [
    'invincible immortal gods',
    'sunshine and easy virtue',
    'peaceful resolution',
    'magic without blood or runes',
    'sterile stone castles',
  ],
};

export const EGYPTIAN_WORLD_DNA: WorldDNA = {
  name: 'Kemetian Duat',
  spark: 'Existence is a cosmic struggle to maintain Ma\'at (order and balance) against Isfet (chaos), overseen by gods who guide souls through the weighing of the heart.',
  primaryPalette: 'forge',
  secondaryPalette: 'tide',
  shapeDescription: 'Golden desert sands glowing under a blinding sun. The scent of myrrh, dry reeds, and linen wraps. The silent flow of a massive river and the whispering of spells from stone tombs.',
  sharpen: [
    'medieval gothic architecture',
    'instant resurrection without ritual',
    'magic without names or symbols',
    'monsters as simple beasts',
    'gods without animal aspects',
  ],
};

export const SHINTO_WORLD_DNA: WorldDNA = {
  name: 'Yamato Kami',
  spark: 'All aspects of nature—trees, rivers, rocks, and storm—possess their own Kami (spirits), and the boundary between the mortal world and the spirit world is paper-thin.',
  primaryPalette: 'drift',
  secondaryPalette: 'tide',
  shapeDescription: 'The scent of cedarwood incense, wet moss, and cherry blossoms after rain. The gentle ringing of brass bells at a vermilion shrine. The rustle of paper doors and the soft padding of fox paws.',
  sharpen: [
    'monotheistic structures',
    'permanently dead spirits',
    'purely evil villains',
    'industrial machinery',
    'knights in plate armor',
  ],
};

export const HINDU_WORLD_DNA: WorldDNA = {
  name: 'Vedic Cosmos',
  spark: 'Reality is Maya (cosmic illusion), a cyclical dance of creation, preservation, and dissolution governed by Karma and Dharma across infinite kalpas.',
  primaryPalette: 'drift',
  secondaryPalette: 'void',
  shapeDescription: 'The scent of sandalwood, burning camphor, and crushed marigolds. The blinding radiance of multi-armed avatars. The echoing vibration of the cosmic syllable OM across stellar planes.',
  sharpen: [
    'linear time',
    'permanent death or hells',
    'magic without mantric sound',
    'pure physical limits',
    'western feudal society',
  ],
};

export const ABRAHAMIC_WORLD_DNA: WorldDNA = {
  name: 'Celestial Court',
  spark: 'Reality is governed by a singular, supreme Creator, whose will is executed by multi-eyed, burning celestial messengers of infinite purity and terrifying authority.',
  primaryPalette: 'void',
  secondaryPalette: 'drift',
  shapeDescription: 'The smell of frankincense and burning copper. The blinding, geometric light of spinning wheels covered in eyes. The deafening chorus of a thousand voices singing Sanctus.',
  sharpen: [
    'soft nature spirits',
    'pantheons of human-like deities',
    'moral ambiguity in celestial hierarchy',
    'magic points or spells',
    'cute winged baby angels',
  ],
};

export const MESOPOTAMIAN_CELTIC_WORLD_DNA: WorldDNA = {
  name: 'Primeval Silt & Otherworld Mist',
  spark: 'Civilization is carved from chaotic primeval waters through divine decrees (Me), balanced by the shifting seasonal tides of the Celtic Otherworld.',
  primaryPalette: 'root',
  secondaryPalette: 'tide',
  shapeDescription: 'The scent of baked clay, fertile river silt, and mist-laden heather. The humming of ancient bronze harps. The looming shadows of towering ziggurats and moss-grown standing stones.',
  sharpen: [
    'modern urban logic',
    'individual heroism without communal debt',
    'spells without contracts or blood oaths',
    'fixed global geography',
    'monumental steel structures',
  ],
};

export const WORLD_DNA_PRESETS: Record<string, WorldDNA> = {
  arcanea: ARCANEA_WORLD_DNA,
  tolkien: TOLKIEN_WORLD_DNA,
  wizarding: WIZARDING_WORLD_DNA,
  elderscrolls: ELDER_SCROLLS_WORLD_DNA,
  cosmere: COSMERE_WORLD_DNA,
  dnd: DND_WORLD_DNA,
  marvel: MARVEL_WORLD_DNA,
  greek: GREEK_WORLD_DNA,
  norse: NORSE_WORLD_DNA,
  egyptian: EGYPTIAN_WORLD_DNA,
  shinto: SHINTO_WORLD_DNA,
  hindu: HINDU_WORLD_DNA,
  abrahamic: ABRAHAMIC_WORLD_DNA,
  mesopotamian_celtic: MESOPOTAMIAN_CELTIC_WORLD_DNA,
};

