/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Studio Content Classifier
 *
 * Given raw text (a file, doc, paste), classify it into one of Arcanea's
 * content types so the Studio can route it to the right part of the world
 * graph.
 *
 * Cheap Haiku-class call. Falls back to heuristics if no Anthropic key.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

export const CLASSIFICATIONS = [
  'character',
  'location',
  'magic',
  'scene',
  'lore',
  'reference',
  'chapter',
  'note',
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

const classificationSchema = z.object({
  classification: z.enum(CLASSIFICATIONS),
  confidence: z.number().min(0).max(1),
  suggested_title: z.string().max(120),
  suggested_tags: z.array(z.string()).max(8),
  summary: z.string().max(400),
});

export type ClassifyResult = z.infer<typeof classificationSchema>;

const CLASSIFIER_PROMPT = `You are Arcanea's Studio Classifier. You receive a chunk of content a creator has dropped into their universal creative workspace. Your job is to decide what TYPE of content this is so it gets routed correctly in their world graph.

Classifications:
- character — a person, being, agent, NPC — with identity, motivation, or backstory
- location — a place, realm, city, landscape — with setting or atmosphere
- magic — a system, power, spell, technology rule — describing how something works
- scene — a moment, event, encounter — with action or dialogue
- lore — historical or mythological context — backstory, legends, faction history
- chapter — a longer narrative block from a book or saga
- reference — research, notes, external material not yet integrated
- note — free-form thoughts, ideas, todos, scratchpad

Also suggest:
- A concise title (under 120 chars)
- 3-6 relevant tags (single-word or hyphenated, lowercase)
- A 1-2 sentence summary

Return JSON strictly matching the schema.`;

const HEURISTIC_HINTS: { keyword: RegExp; classification: Classification }[] = [
  { keyword: /^\s*#\s/m, classification: 'chapter' },
  { keyword: /\bchapter\s+\d+\b/i, classification: 'chapter' },
  { keyword: /\bmagic system\b|\bspell\b|\bincantation\b/i, classification: 'magic' },
  { keyword: /\bcharacter\b.*\b(backstory|motivation|role)\b/i, classification: 'character' },
  { keyword: /\b(city|kingdom|realm|forest|mountains|capital)\b.*\bof\s/i, classification: 'location' },
  { keyword: /\bonce\s+upon\s+a\s+time\b|\blegend\s+tells\b|\bin\s+the\s+age\s+of\b/i, classification: 'lore' },
];

function heuristicClassify(text: string): ClassifyResult {
  const snippet = text.slice(0, 2000);
  const match = HEURISTIC_HINTS.find((h) => h.keyword.test(snippet));
  const classification: Classification = match?.classification ?? 'reference';

  // Pull first heading or first line as suggested title
  const firstHeading = snippet.match(/^\s*#{1,3}\s+(.{3,100})/m)?.[1];
  const firstLine = snippet.split('\n').find((l) => l.trim().length > 5) ?? 'Untitled note';
  const suggestedTitle = (firstHeading ?? firstLine).slice(0, 120).trim();

  return {
    classification,
    confidence: 0.35, // low — heuristic, not LLM
    suggested_title: suggestedTitle,
    suggested_tags: [],
    summary: snippet.slice(0, 400).replace(/\s+/g, ' ').trim(),
  };
}

export async function classifyContent(
  rawText: string,
): Promise<ClassifyResult> {
  // Trim input — classifier only needs first ~3K chars
  const input = rawText.slice(0, 3000);

  // No Anthropic key → heuristic fallback
  if (!process.env.ANTHROPIC_API_KEY) {
    return heuristicClassify(rawText);
  }

  try {
    const { object } = await generateObject({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: CLASSIFIER_PROMPT,
      prompt: input,
      schema: classificationSchema,
    });
    return object;
  } catch (err) {
    console.warn('[studio/classify] LLM failed, using heuristic:', err);
    return heuristicClassify(rawText);
  }
}

export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 chars for English
  return Math.ceil(text.length / 4);
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
