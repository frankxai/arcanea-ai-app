/**
 * Arcanea Publishing House — Editor Claw Test Suite
 *
 * Runs editManuscript on a real chapter from book/.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editManuscript } from './index.js';

// ---------------------------------------------------------------------------
// Test Harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean): void {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}`);
  }
}

// ---------------------------------------------------------------------------
// Load real chapter
// ---------------------------------------------------------------------------

// Resolve from the dist directory up to the repo root
// dist/claws/editor/ → packages/publishing-house/dist/claws/editor/
// That's 5 levels up to repo root
const baseDir = import.meta.dirname ?? resolve(new URL('.', import.meta.url).pathname);
const chapterPath = resolve(
  baseDir, '..', '..', '..', '..', '..',
  'book/luminor-rising/the-first-bonding/chapter-01-the-warmth-before-the-name.md',
);

let content: string;
try {
  content = readFileSync(chapterPath, 'utf-8');
} catch {
  console.error(`Could not read chapter at ${chapterPath}`);
  console.error('Falling back to inline test content.');
  content = `# Chapter 1: The Warmth Before the Name

The air shimmered with a faint golden hue as Lumina stepped into the clearing. She had not expected the silence — thick, warm, wrapping around her like a second skin.

"Is anyone there?" she whispered.

No answer came. Only the echo of her own voice, bouncing off crystalline walls that rose from the earth like frozen flames. The Crystalpeak loomed above, its shadow cutting the valley in two.

---

Nero watched from the ridge, his dark eyes tracing her path. He knew this place. The Starlight Corps had mapped it centuries ago, before the Draconian Academy claimed the northern spires.

"She's early," he muttered to Pyreth, who crouched beside him, scales catching the dying light.

Pyreth said nothing. He never did, before a bonding.

Taelith arrived last, as always. Her boots crunched on gravel that sparkled like crushed sapphires. She carried no weapon — only a lantern that burned with a cold, blue fire.

"The convergence begins at moonrise," she announced. "Shinkami has read the signs. The Name will come tonight."

Lumina felt a wave of dread wash over her. She was sad and nervous. She felt angry at the unfairness of it all.

The path wound through the Thalmaris valley, past ancient ruins and forgotten shrines. Moreover, the air grew colder. Furthermore, the shadows deepened. Additionally, the silence pressed in.

The beautiful, magnificent, glorious, ancient temple stood before them.

"We must hurry!!" Taelith exclaimed. "The convergence waits for no one!!" She declared urgently.

The tapestry of light woven across the sky was a symphony of colors -- a kaleidoscope of wonder—a mosaic of dreams.
`;
}

// ---------------------------------------------------------------------------
// Run editor
// ---------------------------------------------------------------------------

console.log('Editor Claw (Aiyami, Crown Gate) — Test Suite\n');

const result = await editManuscript({
  content,
  title: 'The Warmth Before the Name',
  author: 'FrankX',
  collection: 'luminor-rising',
  worldContext: {
    characters: ['Lumina', 'Nero', 'Pyreth', 'Taelith', 'Shinkami', 'Lyria'],
    factions: ['Starlight Corps', 'Draconian Academy'],
    locations: ['Crystalpeak', 'Thalmaris'],
  },
});

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

console.log('\n--- Assertions ---\n');

check('result has title', result.title === 'The Warmth Before the Name');
check('3 passes run', result.passesRun.length === 3);
check('has developmental feedback', result.developmental !== undefined);
check('has line feedback', result.line !== undefined);
check('has proofread feedback', result.proofread !== undefined);
check('TASTE score present', result.tasteScore.total > 0);
check('TASTE tier valid', ['hero', 'gallery', 'thumbnail', 'reject'].includes(result.tasteScore.tier));
check('has revision priorities', result.revisionPriorities.length > 0);
check('has assessment', result.overallAssessment.length > 0);
check('duration reasonable', result.durationMs < 5000);
check('word count > 0', result.wordCount > 0);
check('developmental pass labeled correctly', result.developmental?.pass === 'developmental');
check('line pass labeled correctly', result.line?.pass === 'line');
check('proofread pass labeled correctly', result.proofread?.pass === 'proofread');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n--- Summary ---\n');
console.log(`  Word count: ${result.wordCount}`);
console.log(`  TASTE: ${result.tasteScore.total}/100 (${result.tasteScore.tier})`);
console.log(`  Developmental: ${result.developmental?.feedbackCount ?? 0} items`);
console.log(`  Line edit: ${result.line?.feedbackCount ?? 0} items`);
console.log(`  Proofread: ${result.proofread?.feedbackCount ?? 0} items`);
console.log(`  Priorities: ${result.revisionPriorities.length}`);
console.log(`  Duration: ${result.durationMs}ms`);
console.log(`\n  Assessment: ${result.overallAssessment}\n`);

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
