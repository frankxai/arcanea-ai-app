/**
 * Built-in Arcanean Prompts — ready to use examples
 *
 * These are not documentation. These are actual prompts you can
 * copy-paste into any AI model and get remarkable results.
 */

export interface APLExample {
  id: string;
  category: 'character' | 'image' | 'music' | 'scene' | 'world';
  title: string;
  /** The generic version most people would write */
  before: string;
  /** The SPARK.SHAPE.SHARPEN version */
  after: string;
  /** Which AI models this works best on */
  bestModels: string[];
}

export const EXAMPLES: APLExample[] = [
  // ── Characters ──────────────────────────────────────────────────
  {
    id: 'lonely-king',
    category: 'character',
    title: 'The Lonely King',
    before: 'Write a story about a lonely king',
    after: `SPARK: A king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine

SHAPE: TIDE — the dining hall echoes. Rain against tall windows. Everything is silver and cold and too clean. His wine tastes like the sea because he has been crying into it.

SHARPEN: NOT a noble king mourning nobly. NOT a dramatic monologue about loss. NOT a resolution where he "learns to move on." He is pathetic and he knows it and he pours the wine anyway.

Write the scene. Start with the sound of wine hitting the glass.`,
    bestModels: ['Claude Opus', 'GPT-5', 'Gemini Pro'],
  },
  {
    id: 'data-scientist-baker',
    category: 'character',
    title: 'The Baker Who Quit',
    before: 'Write a character who changed careers',
    after: `SPARK: She counts things when she is nervous — ceiling tiles, buttons, heartbeats

SHAPE: ROOT — earthy, grounded, heavy. Smells like coffee and old paper. Moves slowly and deliberately.

SHARPEN: NOT a manic pixie. NOT tragically broken. NOT saved by love. She is brilliant and she knows it, which makes her terrible at asking for help.

A data scientist who quit her job to open a bakery. Her sourdough starter is named after her thesis advisor. She is funnier than she realizes and sadder than she admits.`,
    bestModels: ['Claude Opus', 'GPT-5'],
  },

  // ── Images ──────────────────────────────────────────────────────
  {
    id: 'living-library',
    category: 'image',
    title: 'The Living Library',
    before: 'Create an image of a fantasy library',
    after: `SPARK: A library where the books are warm to the touch — they are alive, dreaming

SHAPE: VOID — near-black space, a single warm light source from within the shelves. Dust motes that move too slowly, like they are suspended in honey.

SHARPEN: NOT a grand fantasy library. NOT colorful spines. NOT orderly. The books have GROWN into the shelves like roots into soil.

Cinematic wide shot. Film grain. Aspect ratio 21:9. A figure stands small in the center aisle, touching a spine that pulses faintly gold.`,
    bestModels: ['Midjourney', 'DALL-E', 'Grok Imagine', 'Gemini Imagen'],
  },
  {
    id: 'forge-guardian',
    category: 'image',
    title: 'The Forge Guardian',
    before: 'Create an image of a fire warrior',
    after: `SPARK: A warrior whose armor is covered in children's handprints — she lets them touch it for luck before she leaves

SHAPE: FORGE — heat distortion in the air around her. Ember-gold light from cracks in her gauntlets. The ground is scorched where she stands. Sweat on dark skin reflecting firelight.

SHARPEN: NOT clean, polished fantasy armor. NOT a battle pose. NOT symmetrical. She is standing still, looking back at the village. One hand raised in farewell, fingers spread wide so a child's handprint shows.

Portrait composition. Rembrandt lighting. Warm palette: burnt sienna, aged gold, charcoal. Film grain. Textured oil painting style.`,
    bestModels: ['Midjourney', 'Stable Diffusion', 'Grok Imagine'],
  },

  // ── Music ───────────────────────────────────────────────────────
  {
    id: 'wrong-note-cello',
    category: 'music',
    title: 'The Wrong Note',
    before: 'Compose an epic orchestral track',
    after: `SPARK: The cello is slightly out of tune — on purpose. It sounds like someone trying not to cry.

SHAPE: TIDE — sustained, reverberant, oceanic. A piano underneath like distant rain on glass.

SHARPEN: NOT epic. NOT building to a climax. It stays quiet the entire time. The power is in the restraint.

Ambient neoclassical, 72 BPM, solo cello with sparse piano, large reverb space, intimate recording, no percussion, instrumental only.`,
    bestModels: ['Suno', 'Udio'],
  },
  {
    id: 'forge-drums',
    category: 'music',
    title: 'Forge Drums',
    before: 'Make a powerful drumming track',
    after: `SPARK: Every third beat is replaced by the sound of a hammer striking an anvil — the rhythm IS the work

SHAPE: FORGE — heat-shimmer reverb, close-miked percussion, breathing between hits. The room is small and hot.

SHARPEN: NOT tribal drums. NOT a build-drop structure. NOT clean production. Leave the room noise — the shuffle of feet, the creak of the bellows. The imperfection is the point.

Industrial ritual percussion, 96 BPM, taiko + found-metal percussion, anvil as rhythmic anchor, mono recording with room ambience, no synths, no melody.`,
    bestModels: ['Suno', 'Udio'],
  },

  // ── Scenes ──────────────────────────────────────────────────────
  {
    id: 'last-lesson',
    category: 'scene',
    title: 'The Last Lesson',
    before: 'Write a scene where a teacher says goodbye to students',
    after: `SPARK: She erases the blackboard slowly, knowing it is the last time. Her hand trembles not from age but from the effort of not turning around.

SHAPE: ROOT — chalk dust in the air, the smell of old wood and floor polish. Late afternoon light making rectangles on the floor. The classroom is silent except for breathing.

SHARPEN: NOT a speech. NOT tears. NOT students standing and clapping. She never turns around. They never say goodbye. The scene ends with the sound of chalk being placed in the tray for the last time.

Write this in third person, present tense. Under 400 words. The emotion is entirely in the physical details — never name what she feels.`,
    bestModels: ['Claude Opus', 'GPT-5', 'Gemini Pro'],
  },

  // ── Worlds ──────────────────────────────────────────────────────
  {
    id: 'flammable-memories',
    category: 'world',
    title: 'The World Where Memories Burn',
    before: 'Create a fantasy world with unique magic',
    after: `WORLD SPARK: Memories are literally flammable here. The more painful the memory, the hotter it burns. Libraries are fireproof vaults. Forgetting is arson. Grief counselors are called fire wardens.

WORLD SHAPE: FORGE + TIDE — everything is either burning or drowning. The air smells like heated copper and salt water. Buildings sweat in the humidity. People carry cooling stones carved from river beds.

WORLD SHARPEN: NOT medieval Europe. NOT a chosen one narrative. NOT magic without cost. Every spell burns a memory forever — and you choose which one.

Build this world. Start with what an ordinary Tuesday looks like for someone who works in a memory vault. What precautions do they take? What happens when they go home? What do they dream about?`,
    bestModels: ['Claude Opus', 'GPT-5', 'Gemini Pro'],
  },
];

/**
 * Get examples by category
 */
export function getExamples(category?: APLExample['category']): APLExample[] {
  if (!category) return EXAMPLES;
  return EXAMPLES.filter((e) => e.category === category);
}

/**
 * Get a random example
 */
export function getRandomExample(): APLExample {
  return EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
}
