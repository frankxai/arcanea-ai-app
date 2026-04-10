/**
 * Arcanea Publishing House — Shared Quality Utilities
 *
 * Generic text/number helpers used by the TASTE dimension evaluators.
 * Kept stateless and deterministic so they can be imported freely.
 */

import type { TasteTier } from './types.js';
import { TIER_THRESHOLDS } from './types.js';

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Round to one decimal place. */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Count regex matches in text. Resets lastIndex implicitly via String.match. */
export function countMatches(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/** Split text into sentences (rough heuristic). */
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Split text into normalized words (lowercase, stripped of punctuation). */
export function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z'-]/g, '').toLowerCase())
    .filter((w) => w.length > 0);
}

/**
 * Estimate syllable count for a single word by counting vowel groups.
 * Minimum of 1 syllable per non-empty word.
 */
export function estimateSyllables(word: string): number {
  const vowelGroups = word.match(/[aeiouy]+/gi);
  const count = vowelGroups ? vowelGroups.length : 1;
  return Math.max(count, 1);
}

/** Flesch-Kincaid grade level approximation. */
export function fleschKincaidGrade(text: string): number {
  const sentences = splitSentences(text);
  const words = splitWords(text);
  const sentenceCount = Math.max(sentences.length, 1);
  const wordCount = Math.max(words.length, 1);

  let syllableCount = 0;
  for (const word of words) {
    syllableCount += estimateSyllables(word);
  }

  const grade =
    0.39 * (wordCount / sentenceCount) +
    11.8 * (syllableCount / wordCount) -
    15.59;

  return round1(clamp(grade, 0, 20));
}

/** Extract markdown links and image refs for broken link detection. */
export function extractLinks(content: string): string[] {
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }
  return links;
}

/** Check heading hierarchy validity. Headings should not skip levels. */
export function validateHeadingHierarchy(
  content: string,
): { valid: boolean; issues: string[] } {
  const headingRegex = /^(#{1,6})\s/gm;
  const levels: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    levels.push(match[1].length);
  }

  const issues: string[] = [];
  if (levels.length === 0) {
    issues.push('No headings found');
    return { valid: false, issues };
  }

  for (let i = 1; i < levels.length; i++) {
    const jump = levels[i] - levels[i - 1];
    if (jump > 1) {
      issues.push(`Heading level jumps from h${levels[i - 1]} to h${levels[i]}`);
    }
  }

  return { valid: issues.length === 0, issues };
}

/** Determine the TASTE tier from a total score. */
export function determineTier(total: number): TasteTier {
  if (total >= TIER_THRESHOLDS.hero) return 'hero';
  if (total >= TIER_THRESHOLDS.gallery) return 'gallery';
  if (total >= TIER_THRESHOLDS.thumbnail) return 'thumbnail';
  return 'reject';
}
