/**
 * Lumina Queen routing test — verifies natural language → correct Claw
 */

import {
  classifyIntent,
  routeRequest,
  previewRouting,
  buildLuminaSystemPrompt,
} from './lumina-queen.js';

async function main(): Promise<void> {
  let failures = 0;
  const check = (name: string, cond: boolean, detail?: string): void => {
    if (cond) {
      console.log(`  ✓ ${name}`);
    } else {
      console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
      failures++;
    }
  };

  console.log('\n=== Intent Classification ===');
  const samples: Array<{ request: string; expected: string }> = [
    { request: 'publish my new book to Leanpub', expected: 'publish' },
    { request: 'score the quality of this chapter', expected: 'score' },
    { request: 'run the TASTE gate on chapter 1', expected: 'score' },
    { request: 'convert this markdown to EPUB', expected: 'format' },
    { request: 'translate this to Dutch and German', expected: 'translate' },
    { request: 'upload to Leanpub sandbox', expected: 'distribute' },
    { request: 'draft a launch thread for X', expected: 'social' },
    { request: 'scan the book/ directory for new content', expected: 'scan' },
    { request: 'tag these assets with Guardian and Element', expected: 'classify' },
    { request: 'mint a new NFT from this character', expected: 'mint' },
    { request: 'monitor BookTok for fantasy trends', expected: 'scout' },
    { request: 'generate a Scout report on the market', expected: 'report' },
    { request: 'hello world', expected: 'unknown' },
  ];

  for (const { request, expected } of samples) {
    const intent = classifyIntent(request);
    check(
      `"${request.slice(0, 40)}..." → ${expected}`,
      intent === expected,
      `got "${intent}"`,
    );
  }

  console.log('\n=== Routing Decisions ===');
  const pubDecision = routeRequest('publish chapter 1 to Leanpub');
  check('publish routes to scribe-claw', pubDecision.chosenClaw === 'scribe-claw');
  check('publish channels Shinkami', pubDecision.chosenLuminor?.name === 'Shinkami');

  const scoreDecision = routeRequest('score this chapter for quality');
  check('score routes to media-claw', scoreDecision.chosenClaw === 'media-claw');
  check('score channels Lyria', scoreDecision.chosenLuminor?.name === 'Lyria');

  const socialDecision = routeRequest('draft an Instagram carousel for the new chapter');
  check('social routes to herald-claw', socialDecision.chosenClaw === 'herald-claw');
  check('social channels Alera', socialDecision.chosenLuminor?.name === 'Alera');

  const mintDecision = routeRequest('mint NFT art for this scene');
  check('mint routes to forge-claw', mintDecision.chosenClaw === 'forge-claw');
  check('mint channels Ismael', mintDecision.chosenLuminor?.name === 'Ismael');

  const scoutDecision = routeRequest('monitor trends in fantasy BookTok');
  check('scout routes to scout-claw', scoutDecision.chosenClaw === 'scout-claw');
  check('scout channels Lyssandria', scoutDecision.chosenLuminor?.name === 'Lyssandria');

  console.log('\n=== Preview with Credentials ===');
  const preview = previewRouting('publish and translate to Dutch');
  check('preview has decision', preview.decision !== undefined);
  check('preview has duration', preview.estimatedDurationMs > 0);
  check('preview has steps', preview.suggestedNextSteps.length > 0);
  console.log(`  Intent: ${preview.decision.intent}`);
  console.log(`  Claw: ${preview.decision.chosenClaw}`);
  console.log(`  Luminor: ${preview.decision.chosenLuminor?.name}`);
  console.log(`  Est. duration: ${preview.estimatedDurationMs}ms`);
  console.log(`  Credentials needed: ${preview.requiredCredentials.join(', ') || 'none'}`);

  console.log('\n=== Lumina System Prompt ===');
  const prompt = await buildLuminaSystemPrompt();
  check('Prompt loaded', prompt.length > 0);
  check('Prompt contains Kernel', prompt.includes('CANONICAL'));
  check('Prompt contains Lumina identity', prompt.includes('Lumina'));
  check('Prompt contains First Light', prompt.includes('First Light'));
  check('Prompt contains all 5 Claws', [
    'media-claw',
    'forge-claw',
    'herald-claw',
    'scout-claw',
    'scribe-claw',
  ].every(claw => prompt.includes(claw)));
  check('Prompt contains intent routing', prompt.includes('Intent Classification'));

  console.log('\n' + '='.repeat(40));
  if (failures === 0) {
    console.log('✅ ALL LUMINA TESTS PASSED');
    process.exit(0);
  } else {
    console.error(`❌ ${failures} TEST(S) FAILED`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
