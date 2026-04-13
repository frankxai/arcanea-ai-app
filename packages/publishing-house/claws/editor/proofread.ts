/**
 * Arcanea Publishing House — Editor Claw: Proofread Pass
 *
 * Surface-level corrections: double spaces, dash consistency,
 * quote style, markdown formatting, punctuation, capitalization,
 * oxford comma consistency, paragraph length.
 * ALL HEURISTIC — no LLM calls, works offline.
 *
 * Channeled by Aiyami (Crown Gate).
 */

import { splitWords } from '../../quality/utils.js';
import type { EditorialPass, ProofFeedback, ProofCategory } from './types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fb(
  category: ProofCategory,
  ref: string,
  issue: string,
  correction: string,
): ProofFeedback {
  return { category, lineRef: ref.trim().slice(0, 40), issue, correction };
}

function countOccurrences(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

// ---------------------------------------------------------------------------
// Main Pass
// ---------------------------------------------------------------------------

export function runProofreadPass(content: string): EditorialPass {
  const items: ProofFeedback[] = [];
  const totalWords = splitWords(content).length;
  const per1k = totalWords > 0 ? 1000 / totalWords : 1;

  // --- Double spaces ---
  const doubleSpaces = countOccurrences(content, /  +/g);
  if (doubleSpaces > 0) {
    items.push(fb(
      'formatting',
      content.match(/\S  +\S/)?.[0] ?? '(double space)',
      `${doubleSpaces} double-space occurrence(s) found.`,
      'Replace with single spaces.',
    ));
  }

  // --- Inconsistent dashes ---
  const emDash = countOccurrences(content, /\u2014/g);
  const enDash = countOccurrences(content, /\u2013/g);
  const doubleDash = countOccurrences(content, /--/g);
  const dashTypes = [emDash > 0, enDash > 0, doubleDash > 0].filter(Boolean).length;
  if (dashTypes > 1) {
    items.push(fb(
      'consistency',
      content.match(/(?:--|[\u2013\u2014])/)?.[0] ?? '--',
      `Mixed dash styles: em-dash (${emDash}), en-dash (${enDash}), double-dash (${doubleDash}).`,
      'Pick one style (em-dash recommended for fiction) and use it consistently.',
    ));
  }

  // --- Quote style consistency ---
  const straightQuotes = countOccurrences(content, /(?<![\\])"/g);
  const curlyOpen = countOccurrences(content, /[\u201C]/g);
  const curlyClose = countOccurrences(content, /[\u201D]/g);
  const hasStraight = straightQuotes > 0;
  const hasCurly = (curlyOpen + curlyClose) > 0;
  if (hasStraight && hasCurly) {
    items.push(fb(
      'consistency',
      content.match(/[""\u201C\u201D]/)?.[0] ?? '"',
      `Mixed quote styles: straight (${straightQuotes}) and curly (${curlyOpen + curlyClose}).`,
      'Use curly quotes consistently for published prose.',
    ));
  }

  // --- Markdown formatting: unclosed bold/italic, broken links ---
  const unclosedBold = content.match(/\*\*[^*\n]{1,80}(?:\n|$)/g);
  if (unclosedBold) {
    for (const match of unclosedBold.slice(0, 3)) {
      items.push(fb(
        'formatting',
        match,
        'Unclosed bold marker (**). Missing closing **.',
        'Add the closing ** to complete the bold formatting.',
      ));
    }
  }

  const unclosedItalic = content.match(/(?<!\*)\*(?!\*)[^*\n]{1,80}(?:\n|$)/g);
  if (unclosedItalic) {
    for (const match of unclosedItalic.slice(0, 3)) {
      // Skip if it looks like a list marker
      if (/^\*\s/.test(match)) continue;
      items.push(fb(
        'formatting',
        match,
        'Unclosed italic marker (*). Missing closing *.',
        'Add the closing * to complete the italic formatting.',
      ));
    }
  }

  const brokenLinks = content.match(/\[[^\]]*\]\([^)]*$/gm);
  if (brokenLinks) {
    for (const link of brokenLinks.slice(0, 3)) {
      items.push(fb(
        'formatting',
        link,
        'Broken markdown link — missing closing parenthesis.',
        'Close the link URL with a ).',
      ));
    }
  }

  // --- Repeated punctuation overuse ---
  const doubleExclaim = countOccurrences(content, /!!/g);
  const doubleQuestion = countOccurrences(content, /\?\?/g);
  const ellipsis = countOccurrences(content, /\.{3,}/g);
  const repeatedPuncTotal = doubleExclaim + doubleQuestion + ellipsis;
  const repeatedPer1k = repeatedPuncTotal * per1k;

  if (repeatedPer1k > 5) {
    items.push(fb(
      'punctuation',
      content.match(/(?:!!|\?\?|\.{3,})/)?.[0] ?? '...',
      `Repeated punctuation overuse: ${repeatedPuncTotal} instances (${Math.round(repeatedPer1k)}/1000 words). !! (${doubleExclaim}), ?? (${doubleQuestion}), ... (${ellipsis}).`,
      'Use repeated punctuation sparingly. One exclamation mark is enough; ellipses should be rare.',
    ));
  }

  // --- Capitalization after dialogue ---
  const badDialogueCap = content.match(/[""\u201D],\s+[A-Z][a-z]+\s+said\b/g);
  if (badDialogueCap) {
    for (const match of badDialogueCap.slice(0, 3)) {
      items.push(fb(
        'grammar',
        match,
        `Incorrect capitalization after dialogue tag: "${match}".`,
        'After a comma-closed quote, the tag should be lowercase: "Hello," she said.',
      ));
    }
  }

  // --- Oxford comma consistency ---
  const withOxford = countOccurrences(content, /\w+,\s+\w+,\s+and\s+\w+/g);
  const withoutOxford = countOccurrences(content, /\w+,\s+\w+\s+and\s+\w+/g) - withOxford;
  if (withOxford > 0 && withoutOxford > 0) {
    items.push(fb(
      'consistency',
      content.match(/\w+,\s+\w+,?\s+and\s+\w+/)?.[0] ?? '(list)',
      `Inconsistent Oxford comma usage: ${withOxford} with, ${withoutOxford} without.`,
      'Pick one style and apply it consistently throughout the manuscript.',
    ));
  }

  // --- Paragraph length ---
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  for (const para of paragraphs) {
    const paraWords = splitWords(para).length;
    if (paraWords > 300) {
      items.push(fb(
        'formatting',
        para.trim().slice(0, 40),
        `Paragraph is ${paraWords} words — wall of text in fiction (> 300 words).`,
        'Break into smaller paragraphs at natural thought or action shifts.',
      ));
      if (items.filter(i => i.issue.includes('wall of text')).length >= 3) break;
    }
  }

  return {
    pass: 'proofread',
    feedbackCount: items.length,
    items,
  };
}
