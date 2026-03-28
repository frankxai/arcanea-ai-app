/**
 * Suggestion Engine — Context-aware follow-up suggestions
 *
 * Generates world-building-aware follow-up suggestions as a fallback
 * when the model does not produce [FOLLOW_UP] tags. Also used to
 * classify suggestion types for icon rendering.
 */

// ---------------------------------------------------------------------------
// Content type detection
// ---------------------------------------------------------------------------

export type ContentType =
  | 'character'
  | 'world'
  | 'location'
  | 'creature'
  | 'story'
  | 'code'
  | 'image'
  | 'music'
  | 'system'
  | 'general';

/** Icon map for each content type — used in suggestion chip rendering */
export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  character: '\u2694',  // crossed swords
  world: '\u2726',      // four-pointed star
  location: '\u25C8',   // diamond target
  creature: '\u2766',   // floral heart
  story: '\u270E',      // pencil
  code: '\u2318',       // command
  image: '\u25A3',      // white square with fill
  music: '\u266B',      // beamed eighth notes
  system: '\u2699',     // gear
  general: '\u2192',    // arrow
};

/**
 * Detect the dominant content type from a message.
 * Uses keyword frequency matching, not AI.
 */
export function detectContentType(text: string): ContentType {
  const lower = text.toLowerCase();

  const rules: Array<{ type: ContentType; keywords: RegExp }> = [
    {
      type: 'character',
      keywords: /\b(character|personality|backstory|hero|villain|protagonist|antagonist|npc|companion|trait|motivation|flaw|ability|archetype)\b/,
    },
    {
      type: 'world',
      keywords: /\b(world|realm|kingdom|civilization|society|nation|magic system|political|faction|empire|continent|culture|history|geography)\b/,
    },
    {
      type: 'location',
      keywords: /\b(location|place|city|forest|mountain|dungeon|temple|castle|tavern|village|ruin|cave|tower|district)\b/,
    },
    {
      type: 'creature',
      keywords: /\b(creature|beast|monster|dragon|spirit|animal|godbeast|demon|entity|familiar|mount)\b/,
    },
    {
      type: 'music',
      keywords: /\b(song|lyrics|melody|compose|chorus|verse|beat|track|anthem|hymn|album|tempo)\b/,
    },
    {
      type: 'story',
      keywords: /\b(story|chapter|scene|plot|narrative|tale|once upon|parable|legend|myth|prologue|epilogue)\b/,
    },
    {
      type: 'code',
      keywords: /\b(code|function|component|api|database|algorithm|typescript|react|endpoint|module|class|interface)\b/,
    },
    {
      type: 'image',
      keywords: /\b(image|picture|illustration|draw|visual|artwork|concept art|portrait|render|midjourney|dall-?e)\b/,
    },
    {
      type: 'system',
      keywords: /\b(system|mechanic|progression|skill tree|crafting|combat system|game design|rules|tier|rank)\b/,
    },
  ];

  let bestType: ContentType = 'general';
  let bestCount = 0;

  for (const rule of rules) {
    const matches = lower.match(new RegExp(rule.keywords.source, 'gi'));
    const count = matches ? matches.length : 0;
    if (count > bestCount) {
      bestCount = count;
      bestType = rule.type;
    }
  }

  return bestType;
}

// ---------------------------------------------------------------------------
// Suggestion pools — world-building-aware, progressive
// ---------------------------------------------------------------------------

const SUGGESTION_POOLS: Record<ContentType, string[]> = {
  character: [
    'Give them a secret they keep from their closest ally',
    'Design the moment that changed everything for them',
    'Create the rival who mirrors their deepest flaw',
    'Write the scene where they fail for the first time',
    'Build their inner circle — allies and enemies',
    'Write the moment they chose this path',
    'Define what they fear most and why',
    'Design their progression arc across the Gates',
  ],
  world: [
    'Define what this world\'s magic costs the user',
    'Create a faction that believes the opposite of everything',
    'Design the place everyone avoids and the reason why',
    'Write the founding myth that turned out to be wrong',
    'Map the political power structures',
    'Create the forbidden knowledge or taboo',
    'Define what happens when someone breaks the rules',
    'Design the economy — what is valuable and why',
  ],
  location: [
    'Describe the people who live here and why they stay',
    'Write a scene set in this place at night',
    'Create the local legend everyone knows',
    'Define the dangers and rewards of exploring deeper',
    'Design the power structure that controls this place',
    'Build a memorable NPC who calls this place home',
    'Describe what this place was before it became what it is',
    'Create a secret only locals know about',
  ],
  creature: [
    'Design its natural habitat and ecosystem',
    'Write a first-encounter scene from a traveler\'s perspective',
    'Create the mythology surrounding this creature',
    'Define its relationship to the magic system',
    'Design a variant — what it becomes when corrupted or evolved',
    'Create the ritual or method to bond with it',
    'Write the bestiary entry an Academy scholar would record',
    'Define what makes it dangerous — and what makes it valuable',
  ],
  story: [
    'Write the scene from the antagonist\'s perspective',
    'Create the moment the reader realizes they were wrong',
    'Design a setting that becomes a character itself',
    'Find the line of dialogue that changes everything',
    'Deepen the stakes — what happens if the protagonist fails',
    'Add a subplot that mirrors the main theme',
    'Write the quiet moment before everything changes',
    'Create a twist that reframes everything so far',
  ],
  code: [
    'Add comprehensive tests for edge cases',
    'Optimize the critical path for performance',
    'Extend with error handling and recovery',
    'Design the public API documentation',
    'Refactor for better separation of concerns',
    'Add type safety and input validation',
    'Create a usage example with real-world data',
    'Build the next feature that builds on this',
  ],
  image: [
    'Create a variation with a different mood or atmosphere',
    'Write the story behind this scene',
    'Design the character who inhabits this image',
    'Generate the same scene from a different angle',
    'Describe what happened moments before this image',
    'Create a companion piece — the light to this shadow',
    'Design the environment in more detail',
    'Write the caption a poet would give this image',
  ],
  music: [
    'Write the next verse that deepens the theme',
    'Create the bridge that shifts the emotional tone',
    'Design the instrumental arrangement',
    'Write a companion song from another perspective',
    'Develop the album concept this track belongs to',
    'Create the visual aesthetic for this song',
    'Write the story this song is about',
    'Compose the outro that resolves the tension',
  ],
  system: [
    'Playtest with an edge case that breaks the rules',
    'Design the progression path from beginner to master',
    'Create the legendary-tier abilities or items',
    'Balance the risk-reward curve',
    'Write the tutorial that teaches this system naturally',
    'Design the interaction between this and another system',
    'Create the achievement milestones',
    'Define what mastery looks like and how it is earned',
  ],
  general: [
    'Go deeper into the most interesting part',
    'Create something inspired by this conversation',
    'Explore a different perspective on this',
    'Turn this idea into something tangible',
  ],
};

// ---------------------------------------------------------------------------
// Luminor-flavored suggestion overrides
// ---------------------------------------------------------------------------

const LUMINOR_SUGGESTION_FLAVOR: Record<string, string[]> = {
  logicus: [
    'Map the system architecture behind this',
    'Identify the hidden dependencies and coupling',
    'Design the data model that supports this',
  ],
  prismatic: [
    'Design the visual identity for this',
    'Create a color palette and mood board',
    'Sketch the UI or visual layout',
  ],
  chronica: [
    'Write the opening scene that hooks immediately',
    'Develop the narrative arc from this seed',
    'Create the voice and tone guide for this story',
  ],
  oracle: [
    'Research the historical precedents for this',
    'Synthesize the deeper patterns at work here',
    'Map the knowledge domain this connects to',
  ],
  melodia: [
    'Compose a theme for this moment',
    'Design the soundscape of this world',
    'Write lyrics that capture this feeling',
  ],
  debugon: [
    'Find the edge cases that could break this',
    'Trace the logic path for failure modes',
    'Write the test suite that proves correctness',
  ],
  poetica: [
    'Distill this to its most essential image',
    'Write the version that makes people feel it',
    'Find the metaphor that unlocks understanding',
  ],
  futura: [
    'Project where this goes in 3 iterations',
    'Identify the inflection point ahead',
    'Design the roadmap from here to mastery',
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Pick `count` items from an array using seeded pseudo-randomness
 * based on the message text (deterministic for same input).
 */
function seededPick<T>(pool: T[], count: number, seed: string): T[] {
  if (pool.length <= count) return [...pool];

  // Simple hash-based seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }

  const indices = new Set<number>();
  let attempt = 0;
  while (indices.size < count && attempt < count * 10) {
    hash = ((hash << 5) - hash) + attempt;
    hash |= 0;
    const idx = Math.abs(hash) % pool.length;
    indices.add(idx);
    attempt++;
  }

  return Array.from(indices).map((i) => pool[i]);
}

/**
 * Generate contextual follow-up suggestions as a fallback
 * when the model doesn't produce [FOLLOW_UP] tags.
 *
 * @param messageText  - The assistant's response text
 * @param luminorId    - Active Luminor ID (optional)
 * @param detectedType - Pre-detected content type (optional)
 * @returns Array of 3 suggestion strings
 */
export function generateFallbackSuggestions(
  messageText: string,
  luminorId?: string,
  detectedType?: ContentType,
): string[] {
  const type = detectedType || detectContentType(messageText);
  const pool = [...(SUGGESTION_POOLS[type] || SUGGESTION_POOLS.general)];

  // If a Luminor is active and has flavor suggestions, mix one in
  if (luminorId && LUMINOR_SUGGESTION_FLAVOR[luminorId]) {
    const luminorPool = LUMINOR_SUGGESTION_FLAVOR[luminorId];
    const luminorPick = seededPick(luminorPool, 1, messageText);
    pool.push(...luminorPick);
  }

  return seededPick(pool, 3, messageText);
}
