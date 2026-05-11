/**
 * CLI dispatcher for the ecosystem pipeline. Two commands:
 *   - `build`: regenerate apps/web/lib/ecosystem/derived.ts
 *   - `verify`: fail (exit 1) if derived.ts has drifted from sources
 *
 * Run via the package npm scripts (uses tsx, no compilation needed).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.js';
import { verify } from './verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// CLI runs from packages/orchestrator/dist/ecosystem/cli.js → repo root is 4 levels up.
const REPO_ROOT = path.resolve(__dirname, '../../../..');

const command = process.argv[2];

(async () => {
  if (command === 'build') {
    const result = await build({ repoRoot: REPO_ROOT });
    console.log(`✓ wrote ${result.outPath} (${result.nodeCount} nodes, generated ${result.generatedAt})`);
  } else if (command === 'verify') {
    const result = await verify(REPO_ROOT);
    if (result.drift) {
      console.error(`✗ ${result.message}`);
      process.exit(1);
    }
    console.log(`✓ ${result.message}`);
  } else {
    console.error('Usage: ecosystem [build|verify]');
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
