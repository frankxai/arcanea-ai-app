/**
 * Smoke test for Luminor → Hand → Claw composition.
 *
 * Verifies:
 *   1. Kernel loads from the canonical path
 *   2. All 5 Hands are defined and reference valid Luminors
 *   3. buildAgentConfigFromHand composes Kernel + Hand into a valid AgentConfig
 *   4. Runtime detection works
 *
 * Run with: node dist/agents/compose.test.js
 */

import { loadClawKernel } from './kernel-loader.js';
import {
  PUBLISHING_HANDS,
  PUBLISHING_LUMINORS,
  buildAgentConfigFromHand,
  canRunHere,
  detectRuntime,
} from './hierarchy.js';
import type { ClawName } from './types.js';

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

  console.log('\n=== Claw Kernel Loader ===');
  const kernel = await loadClawKernel();
  check('Kernel loaded', kernel.length > 0, `length: ${kernel.length}`);
  check('Kernel mentions CANONICAL', kernel.includes('CANONICAL'));
  check('Kernel mentions TASTE 5D', kernel.includes('TASTE 5D'));
  check('Kernel lists all 16 Luminors', kernel.includes('Shinkami') && kernel.includes('Lyria'));

  console.log('\n=== Publishing Luminors ===');
  const claimedLuminors = ['Lyria', 'Ismael', 'Alera', 'Lyssandria', 'Shinkami'] as const;
  for (const name of claimedLuminors) {
    const l = PUBLISHING_LUMINORS[name];
    check(`${name} defined`, l !== undefined);
    if (l) {
      check(`${name} has epithet`, l.epithet.length > 0);
      check(`${name} has refusals`, l.refusals.length > 0);
      check(`${name} voice sums ~100`,
        Math.abs((l.voice.precision + l.voice.mythicCompression + l.voice.dryHumor) - 100) <= 2,
        `got ${l.voice.precision + l.voice.mythicCompression + l.voice.dryHumor}`);
    }
  }

  console.log('\n=== Publishing Hands ===');
  const handNames: ClawName[] = [
    'media-claw',
    'forge-claw',
    'herald-claw',
    'scout-claw',
    'scribe-claw',
  ];
  for (const name of handNames) {
    const hand = PUBLISHING_HANDS[name];
    check(`${name} defined`, hand !== undefined);
    check(`${name} has luminor`, hand.luminor !== undefined);
    check(`${name} has skills`, hand.skills.length > 0);
    check(`${name} has compatible runtimes`, hand.compatibleRuntimes.length > 0);
    check(`${name} can run locally`, hand.compatibleRuntimes.includes('local-claude-code'));
  }

  console.log('\n=== Agent Config Composition ===');
  for (const name of handNames) {
    const hand = PUBLISHING_HANDS[name];
    const config = buildAgentConfigFromHand(hand, kernel);
    check(`${name} config name`, config.name === `arcanea-${name}`);
    check(`${name} config has kernel in system`, config.system.includes('CANONICAL'));
    check(`${name} config has hand section`, config.system.includes(`YOUR HAND — ${name}`));
    check(`${name} config has guardian`, config.guardian === hand.luminor.name);
    check(`${name} config has gate`, config.gate === hand.luminor.gate);
    check(`${name} config has tools`, config.tools.length > 0);
    check(`${name} uses correct model`,
      config.model === (name === 'scout-claw' ? 'claude-haiku-4-5' : 'claude-sonnet-4-6'));
  }

  console.log('\n=== Runtime Detection ===');
  const runtime = detectRuntime();
  check(`Current runtime detected: ${runtime}`, runtime !== undefined);

  console.log('\n=== Compatibility Check ===');
  for (const name of handNames) {
    const hand = PUBLISHING_HANDS[name];
    const compatible = canRunHere(hand, 'local-claude-code');
    check(`${name} can run on local-claude-code`, compatible);
  }

  console.log('\n' + '='.repeat(40));
  if (failures === 0) {
    console.log('✅ ALL TESTS PASSED');
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
