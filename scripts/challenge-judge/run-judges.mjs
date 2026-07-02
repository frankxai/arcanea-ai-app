#!/usr/bin/env node
/**
 * Arcanea Arena — judge panel scorer
 *
 * Scores ONE anonymized entry output (a directory of world markdown from the
 * held-out run) against the published rubric via a 3-judge panel:
 *   judge 1+2: Claude Opus, temp 0.2, two framings (craft critic / systems analyst)
 *   judge 3:   Gemini (independent non-Anthropic opinion)
 * Per-dimension MEDIAN across judges → weighted total (0-100, clamped).
 *
 * Maintainer-run, local only. Keys via env (ANTHROPIC_API_KEY, GEMINI_API_KEY),
 * never committed. `--fixture` verifies the math with canned responses, no API.
 *
 * Spec: docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIMENSIONS = ['canon_coherence', 'world_depth', 'originality', 'workflow_craft', 'output_craft'];
const WEIGHTS = { canon_coherence: 0.25, world_depth: 0.2, originality: 0.2, workflow_craft: 0.2, output_craft: 0.15 };

const FRAMINGS = {
  'opus-craft-critic':
    'You are a senior editor and worldbuilding craft critic judging an anonymized competition entry.',
  'opus-systems-analyst':
    'You are a systems-consistency analyst judging an anonymized competition entry. You care about internal logic: do systems have costs, does geography shape factions, does history explain the present?',
  'gemini-second-opinion':
    'You are an independent judge giving a second opinion on an anonymized competition entry.',
};

const RUBRIC_PROMPT = `Score the entry on five dimensions, each 0-100. Calibration: 70 is solid, 90 is exceptional.
- canon_coherence: respects Arcanea LOCKED canon, uses canon vocabulary with understanding
- world_depth: every element connects to at least two others; no contradictions, no orphaned lore
- originality: distinctive within canon constraints, not a template refill
- workflow_craft: (from the workflow file, if included) clean, reproducible, readable structure
- output_craft: prose quality, structure, usability of the world documents

Respond with STRICT JSON only, no markdown fences:
{"scores":{"canon_coherence":N,"world_depth":N,"originality":N,"workflow_craft":N,"output_craft":N},"rationale":"<3-6 sentences>"}`;

const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));

export function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function aggregate(judgeResults) {
  const dimensions = {};
  for (const dim of DIMENSIONS) {
    dimensions[dim] = median(judgeResults.map((j) => clamp(j.scores[dim])));
  }
  const judgeTotal = DIMENSIONS.reduce((sum, dim) => sum + dimensions[dim] * WEIGHTS[dim], 0);
  return { dimensions, judgeTotal: Math.round(judgeTotal * 100) / 100 };
}

export function finalScore(judgeTotal, communitySignal) {
  return Math.round((0.9 * clamp(judgeTotal) + 0.1 * clamp(communitySignal)) * 100) / 100;
}

function parseStrictJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const parsed = JSON.parse(cleaned);
  if (!parsed.scores || DIMENSIONS.some((d) => typeof parsed.scores[d] !== 'number')) {
    throw new Error('Judge response missing required dimension scores');
  }
  return parsed;
}

function readEntry(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  if (!files.length) throw new Error(`No markdown files in ${dir}`);
  return files.map((f) => `\n\n=== ${f} ===\n${readFileSync(join(dir, f), 'utf8')}`).join('');
}

async function callAnthropic(framing, entryText) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ARENA_JUDGE_MODEL || 'claude-opus-4-6',
      max_tokens: 1024,
      temperature: 0.2,
      system: `${framing}\n\n${RUBRIC_PROMPT}`,
      messages: [{ role: 'user', content: `Entry to judge:${entryText}` }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic judge failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return parseStrictJson(data.content?.[0]?.text ?? '');
}

async function callGemini(framing, entryText) {
  const model = process.env.ARENA_JUDGE_MODEL_GEMINI || 'gemini-2.5-pro';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: `${framing}\n\n${RUBRIC_PROMPT}` }] },
        contents: [{ parts: [{ text: `Entry to judge:${entryText}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini judge failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return parseStrictJson(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
}

function runFixture() {
  const canned = [
    { scores: { canon_coherence: 80, world_depth: 70, originality: 90, workflow_craft: 60, output_craft: 75 }, rationale: 'fixture-1' },
    { scores: { canon_coherence: 70, world_depth: 74, originality: 60, workflow_craft: 80, output_craft: 71 }, rationale: 'fixture-2' },
    { scores: { canon_coherence: 90, world_depth: 68, originality: 72, workflow_craft: 70, output_craft: 95 }, rationale: 'fixture-3' },
  ];
  const { dimensions, judgeTotal } = aggregate(canned);
  const expected = { canon_coherence: 80, world_depth: 70, originality: 72, workflow_craft: 70, output_craft: 75 };
  for (const dim of DIMENSIONS) {
    if (dimensions[dim] !== expected[dim]) {
      throw new Error(`Fixture median mismatch on ${dim}: got ${dimensions[dim]}, expected ${expected[dim]}`);
    }
  }
  // 80*.25 + 70*.2 + 72*.2 + 70*.2 + 75*.15 = 73.65
  if (judgeTotal !== 73.65) throw new Error(`Fixture total mismatch: got ${judgeTotal}, expected 73.65`);
  if (finalScore(73.65, 50) !== 71.29) throw new Error(`Fixture final mismatch: got ${finalScore(73.65, 50)}`);
  // strict-JSON parser handles fenced output
  const parsed = parseStrictJson('```json\n{"scores":{"canon_coherence":1,"world_depth":2,"originality":3,"workflow_craft":4,"output_craft":5},"rationale":"r"}\n```');
  if (parsed.scores.output_craft !== 5) throw new Error('Fixture parse mismatch');
  console.log('fixture: OK — medians, weighted total, final score, strict-JSON parse all correct');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--fixture')) return runFixture();

  const entryDir = args[args.indexOf('--entry') + 1];
  const outPath = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
  if (!args.includes('--entry') || !entryDir) {
    console.error('Usage: run-judges.mjs --entry <dir> [--out score.json] | --fixture');
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY || !process.env.GEMINI_API_KEY) {
    console.error('ANTHROPIC_API_KEY and GEMINI_API_KEY must be set (local env only — never commit keys)');
    process.exit(1);
  }

  const entryText = readEntry(entryDir);
  const [j1, j2, j3] = await Promise.all([
    callAnthropic(FRAMINGS['opus-craft-critic'], entryText),
    callAnthropic(FRAMINGS['opus-systems-analyst'], entryText),
    callGemini(FRAMINGS['gemini-second-opinion'], entryText),
  ]);

  const judges = [
    { judge: 'opus-craft-critic', ...j1 },
    { judge: 'opus-systems-analyst', ...j2 },
    { judge: 'gemini-second-opinion', ...j3 },
  ];
  const { dimensions, judgeTotal } = aggregate(judges);
  const record = { dimensions, judgeTotal, judges };

  const output = JSON.stringify(record, null, 2);
  if (outPath) {
    writeFileSync(outPath, output);
    console.log(`score written to ${outPath}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
