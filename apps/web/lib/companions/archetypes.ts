import type { CompanionArchetype, Element } from './types';

export const ELEMENT_COLORS: Record<Element, { base: string; glow: string }> = {
  Fire: { base: '#e85d2a', glow: 'rgba(232, 93, 42, 0.3)' },
  Water: { base: '#1a8fa8', glow: 'rgba(26, 143, 168, 0.3)' },
  Earth: { base: '#4a8c3f', glow: 'rgba(74, 140, 63, 0.3)' },
  Wind: { base: '#b0c4d8', glow: 'rgba(176, 196, 216, 0.3)' },
  Void: { base: '#7b2d8e', glow: 'rgba(123, 45, 142, 0.3)' },
};

export const COMPANION_ARCHETYPES: CompanionArchetype[] = [
  {
    id: 'ember-wolf',
    name: 'Ember Wolf',
    description:
      'Born from the first hearth-fires of the world, the Ember Wolf carries the warmth of every flame that ever sheltered a creator through the long night. Its loyalty is absolute, its courage unshakable.',
    element: 'Fire',
    personality: ['fierce', 'loyal', 'brave'],
    visualStyle:
      'Muscular wolf wreathed in smoldering embers, fur shifting between charcoal and molten orange, eyes like twin coals, trailing sparks with each step, warm firelight atmosphere',
    baseColor: '#e87040',
    glowColor: 'rgba(232, 112, 64, 0.25)',
    icon: '\uD83D\uDD25',
    tier: 'common',
  },
  {
    id: 'crystal-stag',
    name: 'Crystal Stag',
    description:
      'Ancient beyond reckoning, the Crystal Stag walks the deep forests where roots remember the first songs. Its antlers are living mineral, each tine a record of patience rewarded.',
    element: 'Earth',
    personality: ['wise', 'patient', 'ancient'],
    visualStyle:
      'Majestic stag with crystalline antlers refracting emerald light, mossy fur texture, standing in an ancient forest clearing, roots and ferns at its feet, soft dappled light',
    baseColor: '#3d8b37',
    glowColor: 'rgba(61, 139, 55, 0.25)',
    icon: '\uD83E\uDD8C',
    tier: 'common',
  },
  {
    id: 'storm-falcon',
    name: 'Storm Falcon',
    description:
      'The Storm Falcon rides the edge of every gale, seeing the world from heights where horizons curve. It knows that true freedom is not the absence of direction but the mastery of it.',
    element: 'Wind',
    personality: ['swift', 'perceptive', 'free'],
    visualStyle:
      'Sleek falcon with feathers of polished silver and white, crackling with faint static arcs, soaring through dramatic cloudscapes, wind trails spiraling from wingtips',
    baseColor: '#c0d0e0',
    glowColor: 'rgba(192, 208, 224, 0.25)',
    icon: '\uD83E\uDD85',
    tier: 'common',
  },
  {
    id: 'void-cat',
    name: 'Void Cat',
    description:
      'The Void Cat walks between what is and what could be, its eyes reflecting realities yet unborn. It chooses its companions carefully and reveals secrets only to those who earn its trust.',
    element: 'Void',
    personality: ['mysterious', 'cunning', 'intuitive'],
    visualStyle:
      'Sleek black cat with fur that seems to absorb light, faint purple constellation patterns visible beneath the surface, eyes of deep violet with pinpoint stars, shadow tendrils curling at its paws',
    baseColor: '#6b2d7b',
    glowColor: 'rgba(107, 45, 123, 0.25)',
    icon: '\uD83D\uDC08\u200D\u2B1B',
    tier: 'common',
  },
  {
    id: 'ocean-serpent',
    name: 'Ocean Serpent',
    description:
      'Gliding through currents both seen and unseen, the Ocean Serpent carries the memory of every tear shed and every wound healed. Its presence is the quiet certainty that depth brings understanding.',
    element: 'Water',
    personality: ['fluid', 'deep', 'healing'],
    visualStyle:
      'Elegant sea serpent with iridescent teal scales, bioluminescent markings along its body, coiling gracefully through deep ocean water, soft caustic light patterns',
    baseColor: '#1a9aaa',
    glowColor: 'rgba(26, 154, 170, 0.25)',
    icon: '\uD83D\uDC09',
    tier: 'common',
  },
  {
    id: 'phoenix-spark',
    name: 'Phoenix Spark',
    description:
      'Not the great Phoenix of legend but its youngest ember, the Spark carries the promise that every ending seeds a beginning. It burns brightest in the hands of those who have known failure.',
    element: 'Fire',
    personality: ['reborn', 'passionate', 'creative'],
    visualStyle:
      'Small radiant phoenix chick with gold-red plumage, trailing ribbons of flame, perched on a charred branch that is already sprouting new growth, warm golden backlight',
    baseColor: '#d4a017',
    glowColor: 'rgba(212, 160, 23, 0.25)',
    icon: '\uD83C\uDF1F',
    tier: 'rare',
  },
  {
    id: 'stone-guardian',
    name: 'Stone Guardian',
    description:
      'Carved from the bones of the oldest mountain, the Stone Guardian stands where others falter. It does not speak often, but when it moves, the earth moves with it.',
    element: 'Earth',
    personality: ['steadfast', 'protective', 'enduring'],
    visualStyle:
      'Massive golem-like bear formed of layered stone and veined with gold ore, moss growing in its crevices, standing sentinel on a mountain ridge, dawn light catching mineral facets',
    baseColor: '#8a7a3a',
    glowColor: 'rgba(138, 122, 58, 0.25)',
    icon: '\uD83E\uDEA8',
    tier: 'common',
  },
  {
    id: 'mist-fox',
    name: 'Mist Fox',
    description:
      'The Mist Fox appears at the edges of perception, a shimmer in the corner of the eye. It teaches that adaptability is not weakness but the highest form of intelligence.',
    element: 'Wind',
    personality: ['elusive', 'clever', 'adaptable'],
    visualStyle:
      'Ethereal fox made of swirling silver mist, features half-formed and shifting, multiple translucent tails fanning out like vapor trails, moving through a fog-laden twilight forest',
    baseColor: '#b8c8d8',
    glowColor: 'rgba(184, 200, 216, 0.25)',
    icon: '\uD83E\uDD8A',
    tier: 'common',
  },
  {
    id: 'shadow-raven',
    name: 'Shadow Raven',
    description:
      'Where others see darkness, the Shadow Raven sees the architecture of possibility. It collects fragments of forgotten ideas and weaves them into strategies no one else could conceive.',
    element: 'Void',
    personality: ['observant', 'strategic', 'silent'],
    visualStyle:
      'Large raven with feathers of absolute black that seem to cut holes in reality, eyes like polished obsidian mirrors, perched on a gnarled branch against a starless sky, faint void distortion around its silhouette',
    baseColor: '#1a1a2e',
    glowColor: 'rgba(26, 26, 46, 0.35)',
    icon: '\uD83E\uDDA2',
    tier: 'legendary',
  },
  {
    id: 'tide-bear',
    name: 'Tide Bear',
    description:
      'The Tide Bear walks the shores between worlds, its footprints filling with salt water that never dries. It holds the strength of the deep ocean and the gentleness of a receding wave.',
    element: 'Water',
    personality: ['nurturing', 'powerful', 'calm'],
    visualStyle:
      'Enormous bear with fur that flows like water, deep blue and foam-white, barnacles and small shells embedded along its shoulders, standing in shallow surf at twilight, bioluminescent tide at its feet',
    baseColor: '#1a5276',
    glowColor: 'rgba(26, 82, 118, 0.25)',
    icon: '\uD83D\uDC3B',
    tier: 'common',
  },
  {
    id: 'flame-drake',
    name: 'Flame Drake',
    description:
      'Smaller than the great dragons but no less fierce, the Flame Drake embodies raw ambition given form. It burns away hesitation and leaves only the molten core of purpose.',
    element: 'Fire',
    personality: ['ambitious', 'fierce', 'transforming'],
    visualStyle:
      'Compact dragon with crimson scales that glow from within, smoke rising from between armored plates, wings spread and wreathed in controlled fire, volcanic rock beneath, heat distortion in the air',
    baseColor: '#a81c1c',
    glowColor: 'rgba(168, 28, 28, 0.25)',
    icon: '\uD83D\uDC32',
    tier: 'rare',
  },
  {
    id: 'moss-tortoise',
    name: 'Moss Tortoise',
    description:
      'The Moss Tortoise carries a garden on its back and a century of stillness in its gaze. It knows the secret that the most profound creations grow slowly, one patient layer at a time.',
    element: 'Earth',
    personality: ['thoughtful', 'grounded', 'patient'],
    visualStyle:
      'Ancient tortoise with a shell overgrown with lush moss, tiny mushrooms, and miniature ferns, small flowers blooming in the crevices, resting in a sunlit glade, warm green tones',
    baseColor: '#2d6a2d',
    glowColor: 'rgba(45, 106, 45, 0.25)',
    icon: '\uD83D\uDC22',
    tier: 'common',
  },
  {
    id: 'gale-hummingbird',
    name: 'Gale Hummingbird',
    description:
      'Moving so fast it exists in several moments at once, the Gale Hummingbird turns stillness into music and motion into meaning. Joy is not its mood but its element.',
    element: 'Wind',
    personality: ['joyful', 'quick', 'expressive'],
    visualStyle:
      'Iridescent hummingbird with wings that blur into prismatic light, feathers shifting through every color of the spectrum, hovering amid floating flower petals, rainbow light trails in its wake',
    baseColor: '#48b8a0',
    glowColor: 'rgba(72, 184, 160, 0.25)',
    icon: '\uD83D\uDC26',
    tier: 'rare',
  },
  {
    id: 'abyss-jellyfish',
    name: 'Abyss Jellyfish',
    description:
      'Drifting through the space between thoughts, the Abyss Jellyfish is a living meditation. It has no urgency, no agenda, only the serene awareness of a mind that has touched the infinite.',
    element: 'Void',
    personality: ['alien', 'peaceful', 'transcendent'],
    visualStyle:
      'Enormous translucent jellyfish glowing with ultraviolet bioluminescence, tentacles trailing into infinite darkness, faint geometric patterns pulsing through its bell, deep void background with distant star clusters',
    baseColor: '#5a1a8a',
    glowColor: 'rgba(90, 26, 138, 0.25)',
    icon: '\uD83E\uDEBC',
    tier: 'rare',
  },
  {
    id: 'coral-otter',
    name: 'Coral Otter',
    description:
      'The Coral Otter finds treasure where others see debris and builds wonders from what the tide brings in. It reminds creators that play is not the opposite of seriousness but its deepest expression.',
    element: 'Water',
    personality: ['playful', 'resourceful', 'connected'],
    visualStyle:
      'Sleek otter with turquoise-tinted fur, small coral formations growing along its spine, holding a luminous pearl, swimming through crystal-clear shallows above a colorful reef, dappled sunlight from above',
    baseColor: '#30b8b0',
    glowColor: 'rgba(48, 184, 176, 0.25)',
    icon: '\uD83E\uDDA6',
    tier: 'common',
  },
  {
    id: 'starweave-moth',
    name: 'Starweave Moth',
    description:
      'The Starweave Moth is drawn not to flame but to the light between stars. Its wings are tapestries of possibility, each scale a universe that almost was. To witness its flight is to remember that transformation is the only constant.',
    element: 'Void',
    personality: ['ethereal', 'transformative', 'luminous'],
    visualStyle:
      'Large moth with wings woven from visible starlight and golden threads, cosmic nebula patterns shifting across its surface, bioluminescent antennae, floating in a void filled with distant galaxies, soft divine glow',
    baseColor: '#c8a830',
    glowColor: 'rgba(200, 168, 48, 0.25)',
    icon: '\uD83E\uDD8B',
    tier: 'legendary',
  },
];
