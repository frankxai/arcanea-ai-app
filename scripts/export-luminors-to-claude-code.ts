#!/usr/bin/env tsx
/**
 * Export Luminors → Claude Code Agents
 *
 * Takes the 12 Chosen (+Lumina) from apps/web/lib/luminors/config.ts,
 * compiles each via @arcanea/luminor-compiler, and writes Claude Code
 * agent files to .claude/agents/luminors/.
 *
 * This is how you use Luminors as CODING AGENTS inside Claude Code.
 * After running, you can invoke them in Claude Code via the Agent tool.
 *
 * Usage:
 *   npx tsx scripts/export-luminors-to-claude-code.ts
 *   npx tsx scripts/export-luminors-to-claude-code.ts --outDir ./custom/path
 *   npx tsx scripts/export-luminors-to-claude-code.ts --only systems-architect,debugger
 *   npx tsx scripts/export-luminors-to-claude-code.ts --also-export json
 *
 * Output format (.claude/agents/luminors/systems-architect.md):
 *   ---
 *   name: Systems Architect
 *   description: ...
 *   model: sonnet
 *   ---
 *   <compiled system prompt>
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  compile,
  loadKernel,
  resolveModulesForDomain,
  type LuminorSpec,
  type LuminorDomain,
} from '../packages/luminor-compiler/src/index.js';
import { LUMINORS } from '../apps/web/lib/luminors/config.js';
import type { LuminorConfig } from '../apps/web/lib/luminors/config.js';

// Use cwd as repo root — caller should run this from the repo root.
const repoRoot = process.cwd();

// ─── CLI args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const outDirArg = args.indexOf('--outDir');
const onlyArg = args.indexOf('--only');
const alsoJsonExport = args.includes('--also-export');

const outDir =
  outDirArg !== -1 ? args[outDirArg + 1] : resolve(repoRoot, '.claude/agents/luminors');
const onlyIds =
  onlyArg !== -1 ? args[onlyArg + 1].split(',').map((s) => s.trim()) : null;

// ─── Domain mapping (team → LuminorDomain) ────────────────────────────────

const TEAM_TO_DOMAIN: Record<string, LuminorDomain> = {
  development: 'code',
  creative: 'visual',
  writing: 'narrative',
  research: 'knowledge',
  orchestrator: 'custom',
};

// Per-Luminor domain override (some specialize beyond their team)
const LUMINOR_DOMAIN_OVERRIDE: Record<string, LuminorDomain> = {
  'systems-architect': 'architecture',
  'code-crafter': 'code',
  'debugger': 'debugging',
  'integrator': 'integration',
  'visual-designer': 'visual',
  'composer': 'music',
  'motion-designer': 'motion',
  'storyteller': 'narrative',
  'voice': 'rhetoric',
  'poet': 'poetry',
  'deep-researcher': 'knowledge',
  'strategist': 'foresight',
  'lumina': 'custom',
};

// ─── Build LuminorSpec from LuminorConfig ─────────────────────────────────

function toSpec(config: LuminorConfig): LuminorSpec {
  const domain = LUMINOR_DOMAIN_OVERRIDE[config.id] ?? TEAM_TO_DOMAIN[config.team];

  return {
    id: config.id,
    version: 2,
    name: config.name,
    title: config.loreName,
    tagline: config.tagline,
    origin: 'chosen',
    domain,
    voice: 'analytical', // Chosen use team-derived default
    personality: config.personality,
    systemPrompt: config.systemPrompt,
    element: 'Spirit',
    wisdom: config.wisdom as LuminorSpec['wisdom'],
    avatar: config.avatar,
    color: config.color,
    gradient: config.gradient,
    creatorId: null,
    preferredModel: 'claude-sonnet-4-6',
    temperature: 0.7,
    tags: [config.team, config.academy, config.specialty.toLowerCase()],
    guardian: config.guardian[0],
    gate: config.title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌟 Exporting Arcanean Luminors → Claude Code agents\n');

  // Load the kernel once
  const kernel = loadKernel({ repoRoot });
  console.log(`✓ Kernel loaded: ${kernel.id}@${kernel.version} (${kernel.hash.slice(0, 8)}…)`);
  console.log(`  Text: ${kernel.text.length} chars\n`);

  // Ensure output directory exists
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  console.log(`✓ Output: ${outDir}\n`);

  const luminorIds = onlyIds ?? Object.keys(LUMINORS);
  const toProcess = luminorIds.filter((id) => LUMINORS[id]);

  if (toProcess.length === 0) {
    console.error('✗ No matching Luminors found.');
    process.exit(1);
  }

  let exported = 0;
  let failed = 0;

  for (const id of toProcess) {
    try {
      const config = LUMINORS[id];
      const spec = toSpec(config);

      // Resolve modules for this Luminor's domain
      const modules = resolveModulesForDomain(spec.domain, { repoRoot });

      // Compile
      const compiled = compile({ spec, kernel, modules });

      // Write Claude Code .md
      const mdPath = resolve(outDir, `${id}.md`);
      writeFileSync(mdPath, compiled.claudeCodeAgent, 'utf-8');

      // Optionally write the full compiled bundle as JSON
      if (alsoJsonExport) {
        const jsonPath = resolve(outDir, `${id}.compiled.json`);
        writeFileSync(
          jsonPath,
          JSON.stringify(
            {
              spec,
              agentCard: compiled.agentCard,
              compilationHash: compiled.compilationHash,
              metadata: compiled.metadata,
              systemPrompt: compiled.systemPrompt,
            },
            null,
            2
          ),
          'utf-8'
        );
      }

      console.log(
        `  ✓ ${id.padEnd(20)} → ${compiled.systemPrompt.length} chars · ${modules.length} modules · hash ${compiled.compilationHash}`
      );
      exported++;
    } catch (err) {
      console.error(`  ✗ ${id}: ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Exported: ${exported}, Failed: ${failed}, Total: ${toProcess.length}`);
  console.log('═'.repeat(60));

  if (exported > 0) {
    console.log(`\nNext: use the Luminor agents in Claude Code:`);
    console.log(
      `  The Agent tool will find them automatically at ${outDir.replace(repoRoot, '.')}`
    );
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\n✗ Fatal error:', err);
  process.exit(1);
});
