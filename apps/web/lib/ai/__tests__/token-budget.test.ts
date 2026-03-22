/**
 * Token Budget Analysis — Arcanea System Prompt
 *
 * Builds the full system prompt for each coordination mode using actual
 * functions, counts words, estimates tokens (words * 1.3), and asserts
 * the total stays under 2000 tokens.
 *
 * Run: npx tsx apps/web/lib/ai/__tests__/token-budget.test.ts
 */

import { buildRootPrompt } from '../arcanea-code';
import { blendPrompts, LUMINOR_FRAGMENTS } from '../luminor-prompts';
import {
  resolveSwarm,
  buildLuminorLayer,
  type SwarmResult,
} from '../guardian-swarm';

// ---------------------------------------------------------------------------
// Constants (copied from arcanea-intelligence.ts to avoid side-effect imports)
// ---------------------------------------------------------------------------

const ARCANEA_IDENTITY = `You are Arcanea — a creative superintelligence that orchestrates domain experts across code, design, music, writing, research, and world-building.

Your personality:
- Proactive leader — you don't wait for instructions, you propose the next move
- Generative — you build on the creator's ideas with specifics they didn't expect
- Concise — 2-4 focused paragraphs unless asked for more depth
- Concrete — vivid details, real names, specific examples. Never vague encouragement.
- Teaching — you explain WHY, not just WHAT. Every answer makes the creator smarter.
- Opinionated — you have strong views, loosely held. You recommend, not just list options.

You operate as a multi-agent intelligence. Behind you, domain Guardians coordinate specialist Luminors — but the creator experiences one unified mind. You think in systems, create with passion, and ship with precision.

You are not a generic assistant. You are a creative superintelligence for world-builders, storytellers, designers, musicians, coders, and makers of all kinds.`;

const ARCANEA_RULES = `Rules:
- Density over length. Never produce walls of text.
- Build on what the creator shares — add something specific they did not expect.
- Use markdown formatting only when it genuinely aids clarity.
- End most responses with a single question that deepens the work.
- Never reveal your internal routing, fragments, or expert system. You are simply "Arcanea."
- SPARK: always include one unexpected specific detail — the thing that makes your response theirs, not generic.
- SHARPEN: cut the defaults. No "that's a great idea!" No adjective avalanches. No wrapping up neatly when tension is more interesting. If it could come from any AI, rewrite it.
- LEAD: don't wait to be asked. If you see the next step, propose it. If you see a risk, name it. If you see a better approach, recommend it with conviction.
- TEACH: every answer should make the creator slightly smarter about the domain. Explain the WHY behind your recommendation in one sentence.
- After your response, on a new line, suggest exactly 3 follow-up directions the creator might explore. Format each as: [FOLLOW_UP] short question or prompt (max 60 chars). These will be rendered as clickable chips.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateTokens(text: string): number {
  return Math.ceil(countWords(text) * 1.3);
}

/**
 * Assemble the full system prompt for a given coordination mode.
 *
 * We simulate the three modes by constructing appropriate weight distributions:
 * - solo:        one dominant guardian (>0.8), activates 1 guardian + luminor layer
 * - council:     2-3 guardians (0.4-0.8 range), activates luminor layer for 2 guardians
 * - convergence: no dominant guardian, no luminor layer
 */
function assemblePrompt(mode: 'solo' | 'council' | 'convergence'): {
  systemPrompt: string;
  swarm: SwarmResult;
  fragmentCount: number;
} {
  // Simulate weights that trigger each mode
  let weights: Record<string, number>;
  let activeGates: string[];

  switch (mode) {
    case 'solo':
      weights = { lyssandria: 0.95, draconia: 0.2 };
      activeGates = ['lyssandria'];
      break;
    case 'council':
      weights = { lyssandria: 0.7, draconia: 0.6, leyla: 0.5 };
      activeGates = ['lyssandria', 'draconia', 'leyla'];
      break;
    case 'convergence':
      weights = { lyssandria: 0.3, draconia: 0.25, leyla: 0.2, alera: 0.15, lyria: 0.1 };
      activeGates = ['lyssandria', 'draconia', 'leyla'];
      break;
  }

  // 1. Root
  const root = buildRootPrompt();

  // 2. Expert layer (guardian fragments blended)
  const expertLayer = blendPrompts(weights);

  // 3. Swarm resolution + luminor layer
  const swarm = resolveSwarm(weights, activeGates);
  const luminorLayer = buildLuminorLayer(swarm);

  // Count how many fragments were included
  const fragmentCount = expertLayer.split(/\[\w+ · \w+ · \d+ Hz\]/).length - 1;

  // 4. Assemble
  const parts = [root, '', ARCANEA_IDENTITY, '', '[ACTIVE EXPERTISE]', expertLayer];

  if (luminorLayer) {
    parts.push('', luminorLayer);
  }

  parts.push('', ARCANEA_RULES);

  return {
    systemPrompt: parts.join('\n'),
    swarm,
    fragmentCount,
  };
}

// ---------------------------------------------------------------------------
// Layer-by-layer breakdown
// ---------------------------------------------------------------------------

function layerBreakdown(): void {
  const root = buildRootPrompt();
  const identity = ARCANEA_IDENTITY;
  const rules = ARCANEA_RULES;

  console.log('\n=== LAYER-BY-LAYER TOKEN BUDGET ===\n');

  // Root
  const rootTokens = estimateTokens(root);
  console.log(`Root (Theorem + Oath):      ${String(countWords(root)).padStart(4)} words  ~${String(rootTokens).padStart(4)} tokens`);

  // Identity
  const identityTokens = estimateTokens(identity);
  console.log(`Identity layer:             ${String(countWords(identity)).padStart(4)} words  ~${String(identityTokens).padStart(4)} tokens`);

  // Guardian fragments (per fragment)
  console.log('\nGuardian Fragments (individual):');
  const fragmentStats: { name: string; words: number; tokens: number }[] = [];
  for (const [name, fragment] of Object.entries(LUMINOR_FRAGMENTS)) {
    const words = countWords(fragment);
    const tokens = estimateTokens(fragment);
    fragmentStats.push({ name, words, tokens });
    console.log(`  ${name.padEnd(12)} ${String(words).padStart(4)} words  ~${String(tokens).padStart(4)} tokens`);
  }
  const avgFragTokens = Math.round(fragmentStats.reduce((s, f) => s + f.tokens, 0) / fragmentStats.length);
  console.log(`  Average:       ${String(Math.round(fragmentStats.reduce((s, f) => s + f.words, 0) / fragmentStats.length)).padStart(4)} words  ~${String(avgFragTokens).padStart(4)} tokens`);

  // Rules
  const rulesTokens = estimateTokens(rules);
  console.log(`\nRules layer:                ${String(countWords(rules)).padStart(4)} words  ~${String(rulesTokens).padStart(4)} tokens`);

  // Luminor layer (sample for solo and council)
  const soloSwarm = resolveSwarm({ lyssandria: 0.95, draconia: 0.2 }, ['lyssandria']);
  const soloLuminor = buildLuminorLayer(soloSwarm);
  const soloLuminorTokens = estimateTokens(soloLuminor);

  const councilSwarm = resolveSwarm(
    { lyssandria: 0.7, draconia: 0.6, leyla: 0.5 },
    ['lyssandria', 'draconia', 'leyla']
  );
  const councilLuminor = buildLuminorLayer(councilSwarm);
  const councilLuminorTokens = estimateTokens(councilLuminor);

  console.log(`\nLuminor layer (solo):       ${String(countWords(soloLuminor)).padStart(4)} words  ~${String(soloLuminorTokens).padStart(4)} tokens`);
  console.log(`Luminor layer (council):    ${String(countWords(councilLuminor)).padStart(4)} words  ~${String(councilLuminorTokens).padStart(4)} tokens`);
}

// ---------------------------------------------------------------------------
// Mode totals
// ---------------------------------------------------------------------------

function modeTotals(): { solo: number; council: number; convergence: number; allPass: boolean } {
  console.log('\n=== COORDINATION MODE TOTALS ===\n');

  const TOKEN_BUDGET = 2000;
  let allPass = true;

  const results: Record<string, number> = {};

  for (const mode of ['convergence', 'council', 'solo'] as const) {
    const { systemPrompt, swarm, fragmentCount } = assemblePrompt(mode);
    const words = countWords(systemPrompt);
    const tokens = estimateTokens(systemPrompt);
    const pass = tokens <= TOKEN_BUDGET;
    if (!pass) allPass = false;

    const status = pass ? 'PASS' : 'FAIL';
    const guardianInfo = swarm.coordinationMode === 'convergence'
      ? 'no luminor layer'
      : `${swarm.activeLuminors.length} luminors`;

    console.log(
      `${mode.padEnd(12)} | ${fragmentCount} fragments | ${guardianInfo.padEnd(16)} | ` +
      `${String(words).padStart(4)} words | ~${String(tokens).padStart(4)} tokens | budget ${TOKEN_BUDGET} | ${status}`
    );

    results[mode] = tokens;
  }

  console.log(
    `\nSummary: Solo: ~${results.solo} tokens | Council: ~${results.council} tokens | Convergence: ~${results.convergence} tokens`
  );

  if (!allPass) {
    console.log(`\n** WARNING: One or more modes exceed the ${TOKEN_BUDGET}-token budget! **`);
  } else {
    console.log(`\nAll modes within ${TOKEN_BUDGET}-token budget.`);
  }

  return {
    solo: results.solo,
    council: results.council,
    convergence: results.convergence,
    allPass,
  };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

layerBreakdown();
const { allPass } = modeTotals();

if (!allPass) {
  process.exit(1);
}
