/**
 * E — Experiential Uniqueness Evaluator
 *
 * Detects AI slop patterns, measures vocabulary diversity (type-token ratio),
 * and counts cliche density. Higher score = more original.
 */

import type { SlopMatch, UniquenessScore } from '../types.js';
import {
  CLICHE_PATTERNS,
  SLOP_PATTERNS,
  TRANSITION_SLOP_PENALTY_PER,
  TRANSITION_SLOP_REGEX,
  TRANSITION_SLOP_THRESHOLD,
} from '../patterns.js';
import { clamp, countMatches, splitWords } from '../utils.js';

export function evaluateUniqueness(content: string): UniquenessScore {
  const feedback: string[] = [];
  let score = 100;

  const slopPatternsFound: SlopMatch[] = [];

  // --- AI Slop Pattern Detection ---
  for (const pattern of SLOP_PATTERNS) {
    const count = countMatches(content, pattern.regex);
    if (count > 0) {
      slopPatternsFound.push({
        pattern: pattern.label,
        count,
        category: pattern.category,
      });
      score -= pattern.penalty * count;
    }
  }

  // --- Transition Slop ---
  const transitionCount = countMatches(content, TRANSITION_SLOP_REGEX);
  if (transitionCount >= TRANSITION_SLOP_THRESHOLD) {
    const penalty =
      (transitionCount - TRANSITION_SLOP_THRESHOLD + 1) * TRANSITION_SLOP_PENALTY_PER;
    score -= penalty;
    slopPatternsFound.push({
      pattern: 'Moreover/Furthermore/Additionally',
      count: transitionCount,
      category: 'transition',
    });
    feedback.push(
      `Transition slop: "Moreover/Furthermore/Additionally" used ${transitionCount} times.`,
    );
  }

  if (slopPatternsFound.length > 0) {
    const total = slopPatternsFound.reduce((sum, p) => sum + p.count, 0);
    feedback.push(
      `Found ${total} AI slop pattern(s) across ${slopPatternsFound.length} categories.`,
    );
  }

  // --- Type-Token Ratio (vocabulary diversity) ---
  const words = splitWords(content);
  const wordCount = words.length;
  let typeTokenRatio = 1;

  if (wordCount > 0) {
    if (wordCount > 200) {
      const windowSize = 100;
      let totalTtr = 0;
      let windows = 0;
      for (let i = 0; i + windowSize <= wordCount; i += windowSize) {
        const window = words.slice(i, i + windowSize);
        const unique = new Set(window).size;
        totalTtr += unique / windowSize;
        windows++;
      }
      typeTokenRatio = windows > 0 ? totalTtr / windows : 1;
    } else {
      const unique = new Set(words).size;
      typeTokenRatio = unique / wordCount;
    }

    typeTokenRatio = Math.round(typeTokenRatio * 1000) / 1000;

    if (typeTokenRatio < 0.35) {
      score -= 15;
      feedback.push(
        `Low vocabulary diversity (TTR: ${typeTokenRatio}). Content may feel repetitive.`,
      );
    } else if (typeTokenRatio < 0.45) {
      score -= 7;
      feedback.push(`Below-average vocabulary diversity (TTR: ${typeTokenRatio}).`);
    }
  }

  // --- Cliche Density ---
  let clicheCount = 0;
  for (const pattern of CLICHE_PATTERNS) {
    clicheCount += countMatches(content, pattern);
  }

  const clicheDensity =
    wordCount > 0 ? Math.round((clicheCount / wordCount) * 10000) / 10000 : 0;

  if (clicheCount > 3) {
    score -= 3 * (clicheCount - 3);
    feedback.push(`${clicheCount} cliches detected. Replace with fresh imagery.`);
  } else if (clicheCount > 0) {
    score -= clicheCount;
    feedback.push(`${clicheCount} cliche(s) found. Minor, but consider alternatives.`);
  }

  return {
    score: clamp(score, 0, 100),
    slopPatternsFound,
    typeTokenRatio,
    clicheDensity,
    feedback,
  };
}
