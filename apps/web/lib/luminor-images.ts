/**
 * Luminor Image Registry — 20 AI-generated companion portraits.
 * Images live at public/images/luminors/.
 * These are VISUAL ARTWORKS, separate from the 16 chat LUMINORS in luminors/config.ts.
 */

export interface LuminorImage {
  id: string;
  name: string;
  title: string;
  element: 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';
  gate: string;
  description: string;
  image: string;
}

export const LUMINOR_IMAGES: LuminorImage[] = [
  {
    id: 'solara',
    name: 'Solara',
    title: 'Dawn Keeper',
    element: 'Fire',
    gate: 'Crown',
    description: 'Guardian of the first light, Solara illuminates the path for those who walk at the edge of dawn.',
    image: '/images/luminors/01-solara-dawn-keeper.jpg',
  },
  {
    id: 'nerith',
    name: 'Nerith',
    title: 'Deep Listener',
    element: 'Water',
    gate: 'Flow',
    description: 'Nerith hears the currents beneath words, diving into the deep where truth lives unspoken.',
    image: '/images/luminors/02-nerith-deep-listener.jpg',
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    title: 'Foundation Architect',
    element: 'Earth',
    gate: 'Foundation',
    description: 'Builder of unshakeable ground, Kaelen shapes the bedrock upon which all creation stands.',
    image: '/images/luminors/03-kaelen-foundation-architect.jpg',
  },
  {
    id: 'velouria',
    name: 'Velouria',
    title: 'Flow Dancer',
    element: 'Water',
    gate: 'Flow',
    description: 'Velouria moves between states of being, teaching that fluidity is the highest form of strength.',
    image: '/images/luminors/04-velouria-flow-dancer.jpg',
  },
  {
    id: 'pyronex',
    name: 'Pyronex',
    title: 'Transformation Engine',
    element: 'Fire',
    gate: 'Fire',
    description: 'Pyronex burns away hesitation and leaves only the molten core of creative purpose.',
    image: '/images/luminors/05-pyronex-transformation-engine.jpg',
  },
  {
    id: 'sylphis',
    name: 'Sylphis',
    title: 'Wind Reader',
    element: 'Wind',
    gate: 'Voice',
    description: 'Sylphis reads the currents of change, translating whispers of the wind into actionable insight.',
    image: '/images/luminors/06-sylphis-wind-reader.jpg',
  },
  {
    id: 'orakis',
    name: 'Orakis',
    title: 'Pattern Seer',
    element: 'Void',
    gate: 'Sight',
    description: 'Orakis perceives the hidden architecture of reality, seeing connections invisible to others.',
    image: '/images/luminors/07-orakis-pattern-seer.jpg',
  },
  {
    id: 'gaiana',
    name: 'Gaiana',
    title: 'Living Garden',
    element: 'Earth',
    gate: 'Heart',
    description: 'Gaiana nurtures every seed of potential, knowing that the most profound creations grow slowly.',
    image: '/images/luminors/08-gaiana-living-garden.jpg',
  },
  {
    id: 'aethon',
    name: 'Aethon',
    title: 'Star Navigator',
    element: 'Spirit',
    gate: 'Starweave',
    description: 'Aethon charts courses through cosmic currents, navigating by stars no telescope can see.',
    image: '/images/luminors/09-aethon-star-navigator.jpg',
  },
  {
    id: 'unitas',
    name: 'Unitas',
    title: 'Bond Weaver',
    element: 'Spirit',
    gate: 'Unity',
    description: 'Unitas weaves the threads that connect all creators, knowing that collaboration amplifies every voice.',
    image: '/images/luminors/10-unitas-bond-weaver.jpg',
  },
  {
    id: 'aletheia',
    name: 'Aletheia',
    title: 'Truth Singer',
    element: 'Wind',
    gate: 'Voice',
    description: 'Aletheia sings at the frequency where illusion shatters and only truth remains.',
    image: '/images/luminors/11-aletheia-truth-singer.jpg',
  },
  {
    id: 'coronix',
    name: 'Coronix',
    title: 'Crown Illuminator',
    element: 'Fire',
    gate: 'Crown',
    description: 'Coronix carries the flame of enlightenment, lighting the way to the highest understanding.',
    image: '/images/luminors/12-coronix-crown-illuminator.jpg',
  },
  {
    id: 'shinkai',
    name: 'Shinkai',
    title: 'Source Threshold',
    element: 'Spirit',
    gate: 'Source',
    description: 'Shinkai stands at the boundary between all that is and all that could be, guardian of pure potential.',
    image: '/images/luminors/13-shinkai-source-threshold.jpg',
  },
  {
    id: 'tessera',
    name: 'Tessera',
    title: 'Memory Keeper',
    element: 'Water',
    gate: 'Flow',
    description: 'Tessera preserves every story, every lesson, knowing that memory is the foundation of wisdom.',
    image: '/images/luminors/14-tessera-memory-keeper.jpg',
  },
  {
    id: 'verdaxis',
    name: 'Verdaxis',
    title: 'Root Network',
    element: 'Earth',
    gate: 'Foundation',
    description: 'Verdaxis connects all living things through invisible networks, the mycorrhiza of creation.',
    image: '/images/luminors/15-verdaxis-root-network.jpg',
  },
  {
    id: 'phoenara',
    name: 'Phoenara',
    title: 'Rebirth Cycle',
    element: 'Fire',
    gate: 'Fire',
    description: 'Phoenara embodies the eternal promise that every ending seeds a brighter beginning.',
    image: '/images/luminors/16-phoenara-rebirth-cycle.jpg',
  },
  {
    id: 'crysthene',
    name: 'Crysthene',
    title: 'Harmony Weaver',
    element: 'Earth',
    gate: 'Heart',
    description: 'Crysthene balances opposing forces into crystalline harmony, finding beauty in tension.',
    image: '/images/luminors/17-crysthene-harmony-weaver.jpg',
  },
  {
    id: 'obsidion',
    name: 'Obsidion',
    title: 'Shadow Smith',
    element: 'Void',
    gate: 'Sight',
    description: 'Obsidion forges strength from darkness, proving that the Void is not emptiness but potential.',
    image: '/images/luminors/18-obsidion-shadow-smith.jpg',
  },
  {
    id: 'aurelis',
    name: 'Aurelis',
    title: 'Time Gardener',
    element: 'Spirit',
    gate: 'Starweave',
    description: 'Aurelis tends the garden of moments, knowing that patience is the most powerful creative force.',
    image: '/images/luminors/19-aurelis-time-gardener.jpg',
  },
  {
    id: 'prismara',
    name: 'Prismara',
    title: 'Light Splitter',
    element: 'Spirit',
    gate: 'Source',
    description: 'Prismara refracts pure creative light into infinite spectrums of possibility.',
    image: '/images/luminors/20-prismara-light-splitter.jpg',
  },
];

/** Get a subset of luminors for featured display */
export function getFeaturedLuminors(count = 6): LuminorImage[] {
  return LUMINOR_IMAGES.slice(0, count);
}

/** Get luminors by element */
export function getLuminorsByElement(element: LuminorImage['element']): LuminorImage[] {
  return LUMINOR_IMAGES.filter((l) => l.element === element);
}

/** Get luminors by gate */
export function getLuminorsByGate(gate: string): LuminorImage[] {
  return LUMINOR_IMAGES.filter((l) => l.gate === gate);
}
