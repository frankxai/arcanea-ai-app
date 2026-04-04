/**
 * World Search Tests — detectGenre unit tests
 *
 * Inlines the pure detectGenre function to avoid Supabase import chain.
 * Run with: npx tsx apps/web/lib/worlds/__tests__/world-search.test.ts
 */

// ---------------------------------------------------------------------------
// Inlined from world-search.ts (pure function, no DB dependencies)
// ---------------------------------------------------------------------------

const GENRE_KEYWORDS: Record<string, string[]> = {
  fantasy: ['magic', 'dragon', 'wizard', 'sword', 'quest', 'kingdom', 'enchanted', 'mythical'],
  scifi: ['space', 'star', 'cyber', 'neon', 'android', 'galaxy', 'quantum', 'AI', 'robot'],
  horror: ['dark', 'shadow', 'death', 'undead', 'horror', 'nightmare', 'void', 'curse'],
  steampunk: ['steam', 'clockwork', 'Victorian', 'airship', 'brass', 'gear', 'industrial'],
  mythological: ['god', 'goddess', 'titan', 'olympus', 'norse', 'divine', 'ancient', 'temple'],
  aquatic: ['ocean', 'underwater', 'sea', 'coral', 'deep', 'tide', 'marine', 'abyss'],
};

function detectGenre(description: string): { genre: string; confidence: number } | null {
  const lower = description.toLowerCase();
  let bestGenre = '';
  let bestScore = 0;

  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      bestGenre = genre;
    }
  }

  if (bestScore === 0) return null;

  return {
    genre: bestGenre.charAt(0).toUpperCase() + bestGenre.slice(1),
    confidence: Math.min(bestScore / 3, 1),
  };
}

// ---------------------------------------------------------------------------
// Minimal test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ---------------------------------------------------------------------------
// detectGenre
// ---------------------------------------------------------------------------

describe('detectGenre: fantasy keywords', () => {
  const result = detectGenre('A kingdom of magic and wizards with a dragon');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Fantasy', 'detects fantasy');
  assert(result!.confidence > 0, 'confidence > 0');
  assert(result!.confidence <= 1, 'confidence <= 1');
});

describe('detectGenre: scifi keywords', () => {
  const result = detectGenre('A space station in a distant galaxy with AI robots');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Scifi', 'detects scifi');
});

describe('detectGenre: horror keywords', () => {
  const result = detectGenre('A dark shadow realm of death and nightmares');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Horror', 'detects horror');
});

describe('detectGenre: steampunk keywords', () => {
  const result = detectGenre('Victorian clockwork airship with brass gears');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Steampunk', 'detects steampunk');
});

describe('detectGenre: mythological keywords', () => {
  const result = detectGenre('Ancient temple of the gods and goddess of Olympus');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Mythological', 'detects mythological');
});

describe('detectGenre: aquatic keywords', () => {
  const result = detectGenre('Deep underwater ocean realm with coral and marine life');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Aquatic', 'detects aquatic');
});

describe('detectGenre: no match', () => {
  const result = detectGenre('A pleasant day at the park');
  assert(result === null, 'returns null when no genre matches');
});

describe('detectGenre: empty string', () => {
  const result = detectGenre('');
  assert(result === null, 'returns null for empty string');
});

describe('detectGenre: confidence scales with matches', () => {
  const low = detectGenre('magic');
  const high = detectGenre('magic dragon wizard sword quest kingdom');
  assert(low !== null && high !== null, 'both detect a genre');
  assert(high!.confidence > low!.confidence, 'more keywords = higher confidence');
  assert(high!.confidence === 1, 'confidence caps at 1.0');
});

describe('detectGenre: case insensitive', () => {
  const result = detectGenre('MAGIC DRAGON WIZARD');
  assert(result !== null, 'detects genre from uppercase');
  assert(result!.genre === 'Fantasy', 'case-insensitive fantasy detection');
});

describe('detectGenre: mixed genres picks strongest', () => {
  // More fantasy keywords than scifi
  const result = detectGenre('magic dragon wizard sword in a space station');
  assert(result !== null, 'detects a genre');
  assert(result!.genre === 'Fantasy', 'picks genre with more keyword matches');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
