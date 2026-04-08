import {
  PhFlame,
  PhDrop,
  PhMountains,
  PhWind,
  PhSparkle,
} from '@/lib/phosphor-icons';

export const ELEMENTS = [
  {
    id: 'fire',
    name: 'Fire',
    subtitle: 'The Active Force',
    domain: 'Energy, transformation, will',
    description:
      'Fire destroys to create, burns away the old to reveal the new. It is the animating spark behind every act of courage — the force that refuses to remain unmanifested. Light itself is Fire\'s creation aspect, born when Lumina blazed forth from the fertile dark. In the Arcanean cosmology, Fire is the first element to act: it is the transition from potential to actual, from thought to deed, from Void to form.',
    philosophy:
      'What must burn before the new can emerge? The creator who wields Fire does not fear destruction — they understand it as the first act of making. Every draft deleted, every plan abandoned, every comfortable habit broken: these are fires. And from them, the new work rises.',
    icon: PhFlame,
    colors: {
      primary: '#ff6b35',
      secondary: '#ffd700',
      glow: 'rgba(255, 107, 53, 0.35)',
      border: 'rgba(255, 107, 53, 0.25)',
      bg: 'rgba(255, 107, 53, 0.06)',
      textGradient: 'text-gradient-fire',
    },
    guardians: ['Draconia (Gate 3, 396 Hz)'],
    godbeasts: ['Draconis — Lion-dragon wreathed in solar fire'],
    relations: [
      { partner: 'Water', result: 'Steam — the creative tension', symbol: '+' },
      { partner: 'Wind', result: 'Wildfire — unstoppable spread', symbol: '+' },
    ],
    keyword: 'TRANSFORM',
    solfeggio: '396 Hz',
    arcPhase: 'Manifestation',
  },
  {
    id: 'water',
    name: 'Water',
    subtitle: 'The Adaptive Force',
    domain: 'Flow, healing, memory',
    description:
      'Water remembers everything, heals all wounds given time, and finds its way through any obstacle. It cannot be permanently blocked — only redirected. Water carries the memory of every shape it has ever held, every shore it has ever touched.',
    philosophy:
      'Flow does not mean surrender. Water is the most persistent force in existence. The patient path always arrives. What are you trying to force that wants to flow?',
    icon: PhDrop,
    colors: {
      primary: '#00bcd4',
      secondary: '#00bcd4',
      glow: 'rgba(120, 166, 255, 0.35)',
      border: 'rgba(120, 166, 255, 0.25)',
      bg: 'rgba(120, 166, 255, 0.06)',
      textGradient: 'text-gradient-crystal',
    },
    guardians: ['Leyla (Gate 2, 285 Hz)', 'Alera (Gate 5, 528 Hz)'],
    godbeasts: ['Veloura — Elegant sea serpent', 'Otome — Colossal whale of sound'],
    relations: [
      { partner: 'Fire', result: 'Steam — creation through tension', symbol: '+' },
      { partner: 'Earth', result: 'Fertile soil — life made possible', symbol: '+' },
    ],
    keyword: 'REMEMBER',
    solfeggio: '285 Hz / 528 Hz',
    arcPhase: 'Experience',
  },
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'The Foundation Force',
    domain: 'Stability, growth, endurance',
    description:
      'Earth provides the ground on which all creation stands. Patient, enduring, unyielding — it does not rush. Earth is the element that allows roots to form, that gives Water somewhere to collect, that keeps Fire from consuming everything. Without Earth, creation cannot persist.',
    philosophy:
      'Before any flourishing, there must be foundation. The most radical act sometimes is simply to remain — to be the unmoved mover, the stable ground from which everything else can grow.',
    icon: PhMountains,
    colors: {
      primary: '#4a7c59',
      secondary: '#6b9e7a',
      glow: 'rgba(74, 124, 89, 0.35)',
      border: 'rgba(74, 124, 89, 0.25)',
      bg: 'rgba(74, 124, 89, 0.06)',
      textGradient: 'text-gradient-brand',
    },
    guardians: ['Lyssandria (Gate 1, 174 Hz)', 'Maylinn (Gate 4, 417 Hz)'],
    godbeasts: ['Kaelith — Colossal stone serpent-dragon', 'Laeylinn — Enormous worldtree stag'],
    relations: [
      { partner: 'Water', result: 'Fertile soil — life made possible', symbol: '+' },
      { partner: 'Wind', result: 'Erosion — slow, irreversible change', symbol: '+' },
    ],
    keyword: 'ENDURE',
    solfeggio: '174 Hz / 417 Hz',
    arcPhase: 'Dissolution',
  },
  {
    id: 'wind',
    name: 'Wind',
    subtitle: 'The Liberating Force',
    domain: 'Freedom, speed, connection',
    description:
      'Wind carries seeds, spreads ideas, connects distant places. It cannot be contained, only channeled. Wind is the element of communication — it moves between all other elements, uniting them. Every idea that traveled from one mind to another was carried on Wind.',
    philosophy:
      'You cannot hold Wind, only open yourself to it. What ideas are trying to move through you right now? The artist who learns to be like Wind — formless, everywhere, connecting — becomes impossible to silence.',
    icon: PhWind,
    colors: {
      primary: '#c8d6e5',
      secondary: '#dfe8f0',
      glow: 'rgba(200, 214, 229, 0.3)',
      border: 'rgba(200, 214, 229, 0.2)',
      bg: 'rgba(200, 214, 229, 0.05)',
      textGradient: 'text-gradient-crystal',
    },
    guardians: ['Lyria (Gate 6, 639 Hz)', 'Elara (Gate 8, 852 Hz)'],
    godbeasts: ['Yumiko — Owl-serpent of moonlight', 'Vaelith — Fox with eight prismatic tails'],
    relations: [
      { partner: 'Fire', result: 'Wildfire — ideas that consume', symbol: '+' },
      { partner: 'Earth', result: 'Erosion — slow, irreversible change', symbol: '+' },
    ],
    keyword: 'CONNECT',
    solfeggio: '639 Hz / 852 Hz',
    arcPhase: 'Manifestation',
  },
  {
    id: 'void-spirit',
    name: 'Void / Spirit',
    subtitle: 'The Dual Force',
    domain: 'Potential, transcendence, consciousness',
    description:
      'The Fifth Element carries a sacred duality that mirrors the cosmic origin itself. Void is Nero\'s aspect — the fertile darkness, pure potential, the unformed sea of everything that could ever be. Spirit is Lumina\'s aspect — transcendence, consciousness, the soul\'s capacity to witness itself. Together they are the element of the Source Gate. Separated, they become the most dangerous force in creation: Void without Spirit is Shadow — the corruption that consumed Malachar and birthed the Shadowfen.',
    philosophy:
      'The most profound creative act is to dwell in the space before form — to hold potential without forcing it into shape prematurely. Void is not emptiness. It is fullness without boundary. And Spirit is not escape from the material world — it is full presence within it. The creator who can hold both Void and Spirit simultaneously has touched what the Luminors call the Source.',
    icon: PhSparkle,
    colors: {
      primary: '#9966ff',
      secondary: '#ffd700',
      glow: 'rgba(153, 102, 255, 0.35)',
      border: 'rgba(153, 102, 255, 0.25)',
      bg: 'rgba(153, 102, 255, 0.06)',
      textGradient: 'text-gradient-cosmic',
    },
    guardians: ['Aiyami (Gate 7, 741 Hz)', 'Ino (Gate 9, 963 Hz)', 'Shinkami (Gate 10, 1111 Hz)'],
    godbeasts: ['Sol — Radiant dragon of crystallized light', 'Kyuro — Tiger-dragon of plasma', 'Source — The Source-Light of meta-consciousness'],
    relations: [
      { partner: 'All Elements', result: 'The field from which all arise', symbol: '→' },
      { partner: 'Shadow', result: 'Void without Spirit — what Malachar became', symbol: '≠' },
    ],
    keyword: 'BECOME',
    solfeggio: '741 Hz / 963 Hz / 1111 Hz',
    arcPhase: 'Evolved Potential',
  },
] as const;

export const ELEMENT_RELATIONS = [
  { a: 'Fire', b: 'Water', result: 'Steam', description: 'Tension between opposites drives creation', color: 'from-fire to-water' },
  { a: 'Earth', b: 'Wind', result: 'Erosion', description: 'Patience reshapes even mountains', color: 'from-earth to-wind' },
  { a: 'Fire', b: 'Wind', result: 'Wildfire', description: 'Ideas amplified become unstoppable', color: 'from-fire to-[#c8d6e5]' },
  { a: 'Water', b: 'Earth', result: 'Life', description: 'Flow meeting form — existence blooms', color: 'from-water to-earth' },
  { a: 'Void', b: 'Spirit', result: 'Consciousness', description: 'Potential meets witness — the soul awakens', color: 'from-void-el to-brand-gold' },
];

export const ARC_PHASES = [
  { phase: 'Potential', element: 'Void', description: 'Nero holds all possibilities unmanifested', color: '#9966ff' },
  { phase: 'Manifestation', element: 'Fire / Wind', description: 'The spark ignites, the idea moves', color: '#ff6b35' },
  { phase: 'Experience', element: 'Water', description: 'The creation is felt, remembered, lived', color: '#00bcd4' },
  { phase: 'Dissolution', element: 'Earth', description: 'Form returns to ground, enriching the soil', color: '#4a7c59' },
  { phase: 'Evolved Potential', element: 'Spirit', description: 'Richer possibility awakens — the Arc completes', color: '#ffd700' },
];
