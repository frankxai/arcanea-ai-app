/**
 * Arcanea Publishing House — Editor Claw: Line Edit Pass
 *
 * Prose-level review: sentence rhythm, weak verbs, adverb density,
 * repeated words, dialogue tags, show-vs-tell, purple prose.
 * ALL HEURISTIC — no LLM calls, works offline.
 *
 * Channeled by Aiyami (Crown Gate).
 */

import { splitSentences, splitWords } from '../../quality/utils.js';
import type { EditorialPass, LineFeedback, LineCategory } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEAK_VERB_PATTERN = /\b(was|were|had been|seemed to|began to|started to|appeared to)\b/gi;
const ADVERB_PATTERN = /\b\w+ly\b/gi;
const WEAK_VERBS_THRESHOLD = 15; // per 1000 words
const ADVERB_THRESHOLD = 8;      // per 1000 words
const RHYTHM_WINDOW = 5;
const RHYTHM_TOLERANCE = 3;
const REPEAT_WINDOW = 200;
const REPEAT_THRESHOLD = 3;

const TELL_PHRASES: RegExp[] = [
  /\b(he|she|they|I)\s+(felt|was|were)\s+(angry|sad|happy|excited|nervous|afraid|scared|anxious|furious|jealous|lonely|proud|ashamed|embarrassed|confused|frustrated|disappointed)\b/gi,
  /\b(he|she|they|I)\s+(felt|was|were)\s+filled\s+with\s+(rage|sadness|joy|fear|excitement|dread)\b/gi,
  /\b(he|she|they|I)\s+(felt|was|were)\s+(a|an)\s+(wave|surge|rush|pang)\s+of\b/gi,
];

const DIALOGUE_TAG_PATTERN = /[""\u201D],?\s+(he|she|they|I|[A-Z]\w+)\s+(\w+)/g;
const SAID_VARIANTS = new Set(['said', 'asked', 'replied', 'answered']);

const ARTICLES_AND_PREPOSITIONS = new Set([
  'a', 'an', 'the', 'of', 'in', 'to', 'for', 'on', 'at', 'by', 'with',
  'from', 'as', 'is', 'it', 'or', 'and', 'but', 'not', 'so', 'if',
  'be', 'do', 'no', 'up', 'he', 'she', 'we', 'my', 'me', 'am',
  'was', 'were', 'had', 'has', 'his', 'her', 'its', 'our', 'that', 'this',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function lineRef(text: string): string {
  return text.trim().slice(0, 40);
}

function fb(
  category: LineCategory,
  ref: string,
  issue: string,
  suggestion: string,
): LineFeedback {
  return { category, lineRef: ref, issue, suggestion };
}

// ---------------------------------------------------------------------------
// Main Pass
// ---------------------------------------------------------------------------

export function runLinePass(content: string): EditorialPass {
  const items: LineFeedback[] = [];
  const sentences = splitSentences(content);
  const allWords = splitWords(content);
  const totalWords = allWords.length;
  const per1k = totalWords > 0 ? 1000 / totalWords : 1;

  // --- Sentence rhythm: detect monotonous stretches ---
  if (sentences.length >= RHYTHM_WINDOW) {
    const lengths = sentences.map(s => splitWords(s).length);
    for (let i = 0; i <= lengths.length - RHYTHM_WINDOW; i++) {
      const window = lengths.slice(i, i + RHYTHM_WINDOW);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      const allSimilar = window.every(l => Math.abs(l - avg) <= RHYTHM_TOLERANCE);
      if (allSimilar) {
        items.push(fb(
          'rhythm',
          lineRef(sentences[i]),
          `${RHYTHM_WINDOW} consecutive sentences with near-identical length (~${Math.round(avg)} words each).`,
          'Break the monotony: insert a short punchy sentence, a question, or a fragment.',
        ));
        // Skip ahead to avoid duplicate flags on the same stretch
        break;
      }
    }
  }

  // --- Weak verbs ---
  const weakMatches = content.match(WEAK_VERB_PATTERN) ?? [];
  const weakPer1k = weakMatches.length * per1k;
  if (weakPer1k > WEAK_VERBS_THRESHOLD) {
    items.push(fb(
      'voice',
      lineRef(content),
      `${weakMatches.length} weak/passive constructions (${Math.round(weakPer1k)} per 1000 words). Threshold: ${WEAK_VERBS_THRESHOLD}.`,
      'Replace "was walking" with "walked", "seemed to know" with "knew". Use active, specific verbs.',
    ));
  }

  // --- Adverb density ---
  const adverbMatches = content.match(ADVERB_PATTERN) ?? [];
  // Filter out false positives (common non-adverb -ly words)
  const realAdverbs = adverbMatches.filter(w =>
    !['only', 'early', 'likely', 'family', 'holy', 'ugly', 'lonely', 'friendly',
      'daily', 'belly', 'rally', 'ally', 'july', 'lily', 'folly', 'reply',
      'supply', 'apply', 'fly', 'rely', 'multiply', 'imply'].includes(w.toLowerCase()),
  );
  const adverbPer1k = realAdverbs.length * per1k;
  if (adverbPer1k > ADVERB_THRESHOLD) {
    items.push(fb(
      'voice',
      lineRef(content),
      `${realAdverbs.length} adverbs (${Math.round(adverbPer1k)} per 1000 words). Threshold: ${ADVERB_THRESHOLD}.`,
      'Cut adverbs where the verb can do the work alone: "ran quickly" becomes "sprinted".',
    ));
  }

  // --- Repeated words in 200-word windows ---
  if (allWords.length >= REPEAT_WINDOW) {
    const flagged = new Set<string>();
    for (let i = 0; i + REPEAT_WINDOW <= allWords.length; i += Math.floor(REPEAT_WINDOW / 2)) {
      const window = allWords.slice(i, i + REPEAT_WINDOW);
      const counts = new Map<string, number>();
      for (const w of window) {
        if (w.length <= 2 || ARTICLES_AND_PREPOSITIONS.has(w)) continue;
        counts.set(w, (counts.get(w) ?? 0) + 1);
      }
      for (const [word, count] of counts) {
        if (count >= REPEAT_THRESHOLD && !flagged.has(word)) {
          flagged.add(word);
          items.push(fb(
            'redundancy',
            word,
            `"${word}" appears ${count} times within a 200-word window.`,
            'Use a synonym or restructure sentences to reduce repetition.',
          ));
        }
      }
      if (flagged.size >= 5) break; // Cap to avoid flooding
    }
  }

  // --- Dialogue tags ---
  const tagMatches: { tag: string; verb: string }[] = [];
  let tagMatch: RegExpExecArray | null;
  const tagRegex = new RegExp(DIALOGUE_TAG_PATTERN.source, 'g');
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    tagMatches.push({ tag: tagMatch[0], verb: tagMatch[2].toLowerCase() });
  }
  if (tagMatches.length >= 3) {
    const nonSaid = tagMatches.filter(t => !SAID_VARIANTS.has(t.verb));
    const ratio = nonSaid.length / tagMatches.length;
    if (ratio > 0.30) {
      const examples = nonSaid.slice(0, 3).map(t => `"${t.verb}"`).join(', ');
      items.push(fb(
        'dialogue',
        lineRef(nonSaid[0]?.tag ?? content),
        `${Math.round(ratio * 100)}% of dialogue tags use non-said verbs (${examples}). Over-tagging.`,
        '"Said" is invisible to readers. Reserve fancy tags for emphasis; default to "said" or action beats.',
      ));
    }
  }

  // --- Show vs Tell ---
  for (const pattern of TELL_PHRASES) {
    const tellRegex = new RegExp(pattern.source, 'gi');
    let tellMatch: RegExpExecArray | null;
    let tellCount = 0;
    while ((tellMatch = tellRegex.exec(content)) !== null) {
      if (tellCount < 3) {
        items.push(fb(
          'clarity',
          lineRef(tellMatch[0]),
          `Emotional telling: "${tellMatch[0].trim()}". The reader is told how to feel instead of shown.`,
          'Show the emotion through body language, dialogue, or action. "Her fists clenched" not "she was angry".',
        ));
      }
      tellCount++;
    }
  }

  // --- Purple prose: 3+ consecutive adjectives before a noun ---
  const purplePattern = /\b((?:[A-Za-z]+,?\s+){3,})((?:and\s+)?[A-Za-z]+\s+)(?=[A-Z]?[a-z]+(?:\s|[.,;:!?]))/g;
  // Simpler approach: find strings of comma-separated adjectives
  const adjectiveChain = /\b(\w+),\s+(\w+),\s+(?:and\s+)?(\w+)\s+(\w+)\b/g;
  let purpleMatch: RegExpExecArray | null;
  let purpleCount = 0;
  while ((purpleMatch = adjectiveChain.exec(content)) !== null) {
    if (purpleCount < 3) {
      items.push(fb(
        'description',
        lineRef(purpleMatch[0]),
        `Dense adjective chain: "${purpleMatch[0].trim()}". Three or more stacked modifiers slow the reader.`,
        'Pick the single strongest adjective. Kill the rest or distribute across sentences.',
      ));
    }
    purpleCount++;
  }

  return {
    pass: 'line',
    feedbackCount: items.length,
    items,
  };
}
