/**
 * Module Loader test — verifies .arcanea Luminor modules load and compose correctly
 */

import {
  loadModule,
  loadModules,
  loadDefaultModulesForClaw,
  clearModuleCache,
  composeFullPrompt,
  ALL_MODULES,
  CLAW_DEFAULT_MODULES,
} from './module-loader.js';
import { loadClawKernel } from './kernel-loader.js';
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

  console.log('\n=== Load all 9 Luminor modules ===');
  clearModuleCache();

  for (const module of ALL_MODULES) {
    try {
      const content = await loadModule(module);
      check(
        `${module} loads (${content.length} bytes)`,
        content.length > 100,
        `got ${content.length} bytes`,
      );
    } catch (err) {
      check(`${module} loads`, false, (err as Error).message);
    }
  }

  console.log('\n=== Default modules per Claw ===');
  const clawNames: ClawName[] = [
    'media-claw',
    'forge-claw',
    'herald-claw',
    'scout-claw',
    'scribe-claw',
  ];

  for (const clawName of clawNames) {
    const defaults = CLAW_DEFAULT_MODULES[clawName];
    check(`${clawName} has default modules`, defaults.length > 0, `count: ${defaults.length}`);
    try {
      const modules = await loadDefaultModulesForClaw(clawName);
      check(
        `${clawName} loads ${modules.length} modules`,
        modules.length === defaults.length,
      );
    } catch (err) {
      check(`${clawName} loads default modules`, false, (err as Error).message);
    }
  }

  console.log('\n=== Full prompt composition ===');
  const kernel = await loadClawKernel();
  const modules = await loadModules(['lore', 'research']);
  const clawSection = '## YOUR CLAW — test-claw\n\nThis is the test claw section.';
  const full = composeFullPrompt(kernel, modules, clawSection);

  check('Full prompt has kernel', full.includes('CANONICAL'));
  check('Full prompt has inherited modules header', full.includes('Inherited Luminor Modules'));
  check('Full prompt has claw section', full.includes('YOUR CLAW'));
  check(
    'Full prompt length reasonable',
    full.length > kernel.length,
    `kernel: ${kernel.length}, full: ${full.length}`,
  );

  console.log(`  (Full prompt size: ${full.length} bytes = kernel ${kernel.length} + 2 modules + claw section)`);

  console.log('\n=== Cache behavior ===');
  clearModuleCache();
  const t1 = Date.now();
  await loadModule('lore');
  const firstLoadMs = Date.now() - t1;

  const t2 = Date.now();
  await loadModule('lore');
  const secondLoadMs = Date.now() - t2;

  check(
    `Cache speeds up second load (${firstLoadMs}ms → ${secondLoadMs}ms)`,
    secondLoadMs <= firstLoadMs,
  );

  console.log('\n' + '='.repeat(40));
  if (failures === 0) {
    console.log('✅ ALL MODULE LOADER TESTS PASSED');
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
