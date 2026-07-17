export const CODEX_ELEMENTS = ['Earth', 'Water', 'Fire', 'Wind', 'Void', 'Spirit'] as const;

export type CodexElement = (typeof CODEX_ELEMENTS)[number];

export interface CodexEntity {
  id: string;
  name: string;
  form: string;
  element: CodexElement;
  secondaryElement?: CodexElement;
  guardian: string;
  guardianSlug: string;
  gate: string;
  image: string;
  summary: string;
  signature: string;
  ecology: string;
  designSignals: readonly string[];
  canonStatus: 'locked-anchor';
}

export const CODEX_ENTITIES: readonly CodexEntity[] = [
  {
    id: 'kaelith',
    name: 'Kaelith',
    form: 'Colossal stone serpent-dragon',
    element: 'Earth',
    guardian: 'Lyssandria',
    guardianSlug: 'lyssandria',
    gate: 'Foundation',
    image: '/guardians/v2/kaelith-godbeast.webp',
    summary: 'An ancient presence whose body reads as mountain, bedrock, and patient force.',
    signature: 'Shapes terrain and stabilizes what must endure.',
    ecology: 'The world arranges itself around Kaelith. Scale is communicated through stillness rather than spectacle.',
    designSignals: ['living mountain', 'tectonic mass', 'patient motion'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'veloura',
    name: 'Veloura',
    form: 'Phoenix-serpent of silver waters',
    element: 'Water',
    secondaryElement: 'Fire',
    guardian: 'Leyla',
    guardianSlug: 'leyla',
    gate: 'Flow',
    image: '/guardians/v2/veloura-godbeast.webp',
    summary: 'A living paradox: fire that flows, water that burns, and a body built for continuous reinvention.',
    signature: 'Catalyzes new forms where opposing forces meet.',
    ecology: 'Veloura follows tension rather than territory, appearing where resistance can become creative motion.',
    designSignals: ['steam plumage', 'serpentine flight', 'liquid fire'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'draconis',
    name: 'Draconis',
    form: 'Lion-dragon crowned in solar fire',
    element: 'Fire',
    guardian: 'Draconia',
    guardianSlug: 'draconia',
    gate: 'Fire',
    image: '/guardians/v2/draconis-godbeast.webp',
    summary: 'Will made visible: leonine authority, draconic force, and a mane that behaves like a small sun.',
    signature: 'Amplifies conviction until hidden strength becomes action.',
    ecology: 'Its heat responds to doubt. Approach is possible only through genuine resolve, making proximity itself a trial.',
    designSignals: ['solar mane', 'lion-dragon silhouette', 'forge heat'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'laeylinn',
    name: 'Laeylinn',
    form: 'Worldtree deer',
    element: 'Earth',
    secondaryElement: 'Spirit',
    guardian: 'Maylinn',
    guardianSlug: 'maylinn',
    gate: 'Heart',
    image: '/guardians/v2/laeylinn-godbeast.webp',
    summary: 'A luminous stag whose antlers carry an ecosystem and whose presence turns grief into living warmth.',
    signature: 'Accelerates growth and preserves the emotional memory of living places.',
    ecology: 'Forests reorganize around its rest sites. Moss, flowers, and canopy growth make its passage legible long after it leaves.',
    designSignals: ['worldtree antlers', 'living canopy', 'quiet warmth'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'otome',
    name: 'Otome',
    form: 'Colossal whale of deep song',
    element: 'Water',
    secondaryElement: 'Spirit',
    guardian: 'Alera',
    guardianSlug: 'alera',
    gate: 'Voice',
    image: '/guardians/v2/otome-godbeast.webp',
    summary: 'A vast being that travels through resonance as easily as other creatures move through water or air.',
    signature: 'Its song dissolves deception and returns a place to truthful resonance.',
    ecology: 'Otome migrates through acoustic corridors. Its arrival is felt in architecture, water, and bone before it is seen.',
    designSignals: ['impossible scale', 'resonant wake', 'oceanic flight'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'yumiko',
    name: 'Yumiko',
    form: 'Owl-serpent between waking and dream',
    element: 'Void',
    secondaryElement: 'Spirit',
    guardian: 'Lyria',
    guardianSlug: 'lyria',
    gate: 'Sight',
    image: '/guardians/v2/yumiko-godbeast.webp',
    summary: 'A shifting observer whose form occupies both the waking world and the Dreaming Beyond.',
    signature: 'Reveals patterns already present but not yet consciously seen.',
    ecology: 'Yumiko gathers near thresholds: sleep, prophecy, unresolved choices, and places where two futures remain possible.',
    designSignals: ['owl-serpent geometry', 'smoke-water body', 'threshold gaze'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'sol',
    name: 'Sol',
    form: 'Dragon of crystallized light',
    element: 'Spirit',
    secondaryElement: 'Fire',
    guardian: 'Aiyami',
    guardianSlug: 'aiyami',
    gate: 'Crown',
    image: '/guardians/v2/sol-godbeast.webp',
    summary: 'A radiant dragon whose crystalline body refracts clarity rather than merely reflecting light.',
    signature: 'Burns away illusion until the structure of a problem becomes visible.',
    ecology: 'Sol seeks the highest point in a realm, turning elevation into an instrument for orientation and collective sight.',
    designSignals: ['crystal scales', 'crown silhouette', 'white-gold clarity'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'vaelith',
    name: 'Vaelith',
    form: 'Fox of eight prismatic tails',
    element: 'Wind',
    secondaryElement: 'Void',
    guardian: 'Elara',
    guardianSlug: 'elara',
    gate: 'Starweave',
    image: '/guardians/v2/vaelith-godbeast.webp',
    summary: 'Eight tails hold eight readings of the same moment, making perspective a physical phenomenon.',
    signature: 'Refracts a single event into simultaneous, valid interpretations.',
    ecology: 'Its overlapping trails lead toward different versions of one destination. Following requires choosing a perspective, not finding a correct path.',
    designSignals: ['eight-tail rhythm', 'prismatic edges', 'overlapping tracks'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'kyuro',
    name: 'Kyuro',
    form: 'Tiger-dragon of nine plasma tails',
    element: 'Spirit',
    secondaryElement: 'Earth',
    guardian: 'Ino',
    guardianSlug: 'ino',
    gate: 'Unity',
    image: '/guardians/v2/kyuro-godbeast.webp',
    summary: 'A living covenant whose nine tails make authentic bonds visible and false commitments unstable.',
    signature: 'Amplifies partnership and tests whether a bond can survive pressure.',
    ecology: 'Kyuro appears around vows, crews, and shared work. Its field rewards reciprocity rather than obedience.',
    designSignals: ['nine-tail braid', 'tiger-dragon mass', 'paired plasma'],
    canonStatus: 'locked-anchor',
  },
  {
    id: 'source',
    name: 'Source',
    form: 'Cosmic wolf of starlight',
    element: 'Void',
    secondaryElement: 'Spirit',
    guardian: 'Shinkami',
    guardianSlug: 'shinkami',
    gate: 'Source',
    image: '/guardians/v2/source-godbeast.webp',
    summary: 'A being made from the fertile interval between stars, present across more than one moment at once.',
    signature: 'Dissolves the false boundary between witness, creator, and creation.',
    ecology: 'Source is encountered as a convergence rather than a location. Its tracks are changes in attention, memory, and scale.',
    designSignals: ['stellar negative space', 'wolf silhouette', 'cosmic convergence'],
    canonStatus: 'locked-anchor',
  },
] as const;

export function getCodexEntity(id: string): CodexEntity | undefined {
  return CODEX_ENTITIES.find((entity) => entity.id === id);
}
