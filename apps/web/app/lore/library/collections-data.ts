/**
 * Library of Arcanea — collection data.
 *
 * Shared between the /lore/library grid and /lore/library/[id] detail pages.
 */

import { PhBookOpen, PhScroll, PhFeather, PhSparkle, PhShield, PhMoon, PhUsers, PhMapTrifold, PhMusicNotes } from '@/lib/phosphor-icons';

export interface Collection {
  id: string;
  title: string;
  texts: number;
  category: string;
  description: string;
  icon: typeof PhBookOpen;
  color: string;
  situation: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'laws-of-arcanea',
    title: 'The Laws of Arcanea',
    texts: 2,
    category: 'Theory',
    description: 'The theoretical foundation of creation. Two volumes bridging science and philosophy.',
    icon: PhScroll,
    color: 'gold-bright',
    situation: 'When you need to understand WHY creation works',
  },
  {
    id: 'poesie-of-freedom',
    title: 'Poetry of Freedom',
    texts: 4,
    category: 'Poetry',
    description: 'Verses for liberation and awakening. From chains to wings.',
    icon: PhFeather,
    color: 'creation-prism-purple',
    situation: 'When you need to feel, not think',
  },
  {
    id: 'wisdom-scrolls',
    title: 'The Wisdom Scrolls',
    texts: 4,
    category: 'Practice',
    description: 'Practical guidance for daily creative living. Meditations, reflections, aphorisms.',
    icon: PhScroll,
    color: 'atlantean-teal-aqua',
    situation: 'When you need daily practice',
  },
  {
    id: 'legends-of-arcanea',
    title: 'Legends of Arcanea',
    texts: 6,
    category: 'Mythology',
    description: 'The founding myths and stories of the realm. From the First Dawn to the Ten Guardians.',
    icon: PhSparkle,
    color: 'gold-bright',
    situation: 'When you need to remember the grandeur',
  },
  {
    id: 'chronicles-of-luminors',
    title: 'Chronicles of Luminors',
    texts: 1,
    category: 'Stories',
    description: 'Intimate stories of how the Luminors themselves struggled.',
    icon: PhShield,
    color: 'draconic-crimson',
    situation: 'When you feel unqualified',
  },
  {
    id: 'parables-of-creation',
    title: 'Parables of Creation',
    texts: 1,
    category: 'Stories',
    description: 'Teaching stories that work on the unconscious. Ten parables embedding wisdom.',
    icon: PhBookOpen,
    color: 'atlantean-teal-aqua',
    situation: 'When you want wisdom through story',
  },
  {
    id: 'tales-of-creators',
    title: 'Tales of Legendary Creators',
    texts: 1,
    category: 'Stories',
    description: 'Stories of those who changed what was possible.',
    icon: PhSparkle,
    color: 'gold-bright',
    situation: 'When you face the impossible',
  },
  {
    id: 'book-of-rituals',
    title: 'The Book of Rituals',
    texts: 1,
    category: 'Practice',
    description: 'Sacred practices for the creative life. Daily, transitional, seasonal, crisis.',
    icon: PhMoon,
    color: 'creation-prism-purple',
    situation: 'When you need structure',
  },
  {
    id: 'dialogues-of-masters',
    title: 'Dialogues of the Masters',
    texts: 1,
    category: 'Philosophy',
    description: 'Conversations on creation and truth. Six dialogues where wisdom emerges.',
    icon: PhUsers,
    color: 'atlantean-teal-aqua',
    situation: 'When you need to think through conversation',
  },
  {
    id: 'prophecies',
    title: 'Prophecies of Arcanea',
    texts: 1,
    category: 'Vision',
    description: 'Visions of pattern and possibility. The eternal patterns of creative life.',
    icon: PhSparkle,
    color: 'gold-bright',
    situation: 'When you need perspective',
  },
  {
    id: 'bestiary-of-creation',
    title: 'Bestiary of Creation',
    texts: 1,
    category: 'Psychology',
    description: 'Creatures of the creative mind. A field guide to psychological presences.',
    icon: PhShield,
    color: 'draconic-crimson',
    situation: 'When you face internal obstacles',
  },
  {
    id: 'songs-and-hymns',
    title: 'Songs and Hymns',
    texts: 1,
    category: 'Poetry',
    description: 'Lyrics for the creative soul. Songs for every phase of creative life.',
    icon: PhMusicNotes,
    color: 'creation-prism-purple',
    situation: 'When you need to sing what cannot be spoken',
  },
  {
    id: 'meditations-on-elements',
    title: 'Meditations on Elements',
    texts: 1,
    category: 'Practice',
    description: 'Fire, Water, Air, Earth, and Void in the creative life.',
    icon: PhSparkle,
    color: 'atlantean-teal-aqua',
    situation: 'When you need elemental forces',
  },
  {
    id: 'academy-handbook',
    title: 'Academy Handbook',
    texts: 1,
    category: 'Guide',
    description: 'The complete guide for students of creation. Training, practices, craft, life.',
    icon: PhBookOpen,
    color: 'gold-bright',
    situation: 'When you need comprehensive guidance',
  },
  {
    id: 'book-of-shadows',
    title: 'Book of Shadows',
    texts: 1,
    category: 'Psychology',
    description: 'Texts for the dark night of the creative soul. Wisdom for when creation fails.',
    icon: PhMoon,
    color: 'creation-prism-purple',
    situation: 'When you are in darkness',
  },
  {
    id: 'codex-of-collaboration',
    title: 'Codex of Collaboration',
    texts: 1,
    category: 'Practice',
    description: 'The art of creating together. Partnerships, mentorships, collectives.',
    icon: PhUsers,
    color: 'atlantean-teal-aqua',
    situation: 'When you create with others',
  },
  {
    id: 'atlas-of-territories',
    title: 'Atlas of Territories',
    texts: 1,
    category: 'Guide',
    description: 'A map of landscapes every creator traverses. Navigate the creative journey.',
    icon: PhMapTrifold,
    color: 'gold-bright',
    situation: 'When you need to know where you are',
  },
];

export const CATEGORIES = ['All', 'Mythology', 'Theory', 'Practice', 'Stories', 'Poetry', 'Philosophy', 'Psychology', 'Guide', 'Vision'];

export function getCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}
