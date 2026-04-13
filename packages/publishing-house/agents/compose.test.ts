/**
 * Smoke test for Luminor → Claw composition (v0.5, 2-layer model).
 *
 * Verifies:
 *   1. Kernel loads from the canonical path
 *   2. All 8 Luminors are defined with complete craft metadata
 *   3. buildAgentConfigFromLuminor composes Kernel + Luminor into a valid AgentConfig
 *   4. getLuminorByClaw works for all 8
 *   5. Runtime detection works
 *   6. Compatibility checks work for all 8
 *   7. Specific assertions for extended Claws (editor, community, pr)
 *
 * Run with: node dist/agents/compose.test.js
 */

import { loadClawKernel } from './kernel-loader.js';
import {
  PUBLISHING_LUMINORS,
  buildAgentConfigFromLuminor,
  canRunHere,
  detectRuntime,
  getLuminorByClaw,
  getLuminorByGuardian,
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
  check('Kernel references Luminors', kernel.includes('Shinkami') && kernel.includes('Lyria'));

  console.log('\n=== Publishing Luminors (all 8) ===');
  const clawNames: ClawName[] = [
    'media-claw',
    'forge-claw',
    'herald-claw',
    'scout-claw',
    'scribe-claw',
    'editor-claw',
    'community-claw',
    'pr-claw',
  ];

  check('Exactly 8 Claws registered', Object.keys(PUBLISHING_LUMINORS).length === 8,
    `got ${Object.keys(PUBLISHING_LUMINORS).length}`);

  for (const clawName of clawNames) {
    const luminor = PUBLISHING_LUMINORS[clawName];
    check(`${clawName} defined`, luminor !== undefined);
    check(`${clawName} has epithet`, luminor.epithet.length > 0);
    check(`${clawName} has craft`, luminor.craft.length > 0);
    check(`${clawName} has skills`, luminor.skills.length > 0);
    check(`${clawName} has inputs`, luminor.inputs.length > 0);
    check(`${clawName} has outputs`, luminor.outputs.length > 0);
    check(`${clawName} has compatible runtimes`, luminor.compatibleRuntimes.length > 0);
    check(`${clawName} has requiredMcp`, luminor.requiredMcp !== undefined);
    check(`${clawName} has refusals`, luminor.refusals.length > 0);
    check(
      `${clawName} has voice`,
      luminor.voice !== undefined &&
        typeof luminor.voice.precision === 'number' &&
        typeof luminor.voice.mythicCompression === 'number' &&
        typeof luminor.voice.dryHumor === 'number',
    );
    check(
      `${clawName} voice sums ~100`,
      Math.abs((luminor.voice.precision + luminor.voice.mythicCompression + luminor.voice.dryHumor) - 100) <= 2,
      `got ${luminor.voice.precision + luminor.voice.mythicCompression + luminor.voice.dryHumor}`,
    );
  }

  console.log('\n=== Reverse Index (Guardian → Luminor) ===');
  const lyria = getLuminorByGuardian('Lyria');
  check('getLuminorByGuardian(Lyria) returns Luminor', lyria !== undefined);
  check('Lyria channels media-claw', lyria?.clawName === 'media-claw');

  console.log('\n=== getLuminorByClaw for all 8 ===');
  const expectedNames: Record<ClawName, string> = {
    'media-claw': 'Lyria',
    'forge-claw': 'Ismael',
    'herald-claw': 'Alera',
    'scout-claw': 'Lyssandria',
    'scribe-claw': 'Shinkami',
    'editor-claw': 'Aiyami',
    'community-claw': 'Maylinn',
    'pr-claw': 'Elara',
  };
  for (const clawName of clawNames) {
    const luminor = getLuminorByClaw(clawName);
    check(
      `getLuminorByClaw(${clawName}) returns ${expectedNames[clawName]}`,
      luminor.name === expectedNames[clawName],
      `got ${luminor.name}`,
    );
  }

  console.log('\n=== Agent Config Composition (all 8) ===');
  for (const clawName of clawNames) {
    const luminor = PUBLISHING_LUMINORS[clawName];
    const config = buildAgentConfigFromLuminor(luminor, kernel);
    check(`${clawName} config name`, config.name === `arcanea-${clawName}`);
    check(`${clawName} config has kernel in system`, config.system.includes('CANONICAL'));
    check(`${clawName} config has claw section`, config.system.includes(`YOUR CLAW — ${clawName}`));
    check(`${clawName} config has luminor name`, config.system.includes(luminor.name));
    check(`${clawName} config guardian matches`, config.guardian === luminor.name);
    check(`${clawName} config gate matches`, config.gate === luminor.gate);
    check(`${clawName} config has tools`, config.tools.length > 0);
    check(
      `${clawName} uses correct model`,
      config.model === luminor.defaultModel,
    );
  }

  console.log('\n=== Runtime Detection ===');
  const runtime = detectRuntime();
  check(`Current runtime detected: ${runtime}`, runtime !== undefined);

  console.log('\n=== Compatibility Check (all 8 on local-claude-code) ===');
  for (const clawName of clawNames) {
    const luminor = PUBLISHING_LUMINORS[clawName];
    const compatible = canRunHere(luminor, 'local-claude-code');
    check(`${clawName} can run on local-claude-code`, compatible);
  }

  console.log('\n=== Extended Claw Specific Assertions ===');

  // editor-claw uses claude-opus-4-6 (NOT sonnet)
  const editor = PUBLISHING_LUMINORS['editor-claw'];
  check(
    'editor-claw uses claude-opus-4-6',
    editor.defaultModel === 'claude-opus-4-6',
    `got ${editor.defaultModel}`,
  );
  check(
    'editor-claw does NOT use sonnet',
    !editor.defaultModel.includes('sonnet'),
  );

  // community-claw has 'openclaw' in its compatible runtimes
  const community = PUBLISHING_LUMINORS['community-claw'];
  check(
    'community-claw has openclaw runtime',
    community.compatibleRuntimes.includes('openclaw'),
    `runtimes: ${community.compatibleRuntimes.join(', ')}`,
  );

  // pr-claw has 'Starweave' as its gate
  const pr = PUBLISHING_LUMINORS['pr-claw'];
  check(
    'pr-claw gate is Starweave',
    pr.gate === 'Starweave',
    `got ${pr.gate}`,
  );

  console.log('\n' + '='.repeat(40));
  if (failures === 0) {
    console.log('ALL TESTS PASSED');
    process.exit(0);
  } else {
    console.error(`${failures} TEST(S) FAILED`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
