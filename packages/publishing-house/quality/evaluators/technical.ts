/**
 * T — Technical Fit Evaluator
 *
 * Production quality checks: formatting, structure, readability,
 * link validity, word count adequacy.
 */

import type { ContentMeta, TechnicalScore } from '../types.js';
import {
  clamp,
  extractLinks,
  fleschKincaidGrade,
  splitWords,
  validateHeadingHierarchy,
} from '../utils.js';

export function evaluateTechnical(
  content: string,
  metadata: ContentMeta,
): TechnicalScore {
  const feedback: string[] = [];
  let score = 100;

  // Word count
  const words = splitWords(content);
  const wordCount = words.length;
  const declaredCount = metadata.wordCount ?? wordCount;

  if (wordCount < 100) {
    score -= 25;
    feedback.push(`Content is very short (${wordCount} words). Minimum recommended: 100.`);
  } else if (wordCount < 300) {
    score -= 10;
    feedback.push(`Content is short (${wordCount} words). Consider expanding.`);
  }

  // Word count mismatch with metadata
  if (metadata.wordCount !== undefined) {
    const drift = Math.abs(wordCount - declaredCount) / Math.max(declaredCount, 1);
    if (drift > 0.2) {
      score -= 5;
      feedback.push(
        `Word count mismatch: metadata says ${declaredCount}, actual is ${wordCount}.`,
      );
    }
  }

  // Heading hierarchy
  const headings = validateHeadingHierarchy(content);
  if (!headings.valid) {
    score -= 5 * headings.issues.length;
    for (const issue of headings.issues) {
      feedback.push(`Heading issue: ${issue}`);
    }
  }

  // Readability
  const grade = fleschKincaidGrade(content);
  if (grade > 16) {
    score -= 10;
    feedback.push(`Readability is very dense (FK grade ${grade}). Consider simpler sentences.`);
  } else if (grade > 13) {
    score -= 5;
    feedback.push(`Readability could improve (FK grade ${grade}).`);
  }

  // Broken links (heuristic: empty hrefs, obviously malformed)
  const links = extractLinks(content);
  const brokenLinks: string[] = [];
  for (const link of links) {
    const trimmed = link.trim();
    if (
      trimmed === '' ||
      trimmed === '#' ||
      trimmed.startsWith('javascript:') ||
      /\s/.test(trimmed)
    ) {
      brokenLinks.push(trimmed || '(empty)');
    }
  }
  if (brokenLinks.length > 0) {
    score -= 5 * brokenLinks.length;
    feedback.push(`Found ${brokenLinks.length} potentially broken link(s).`);
  }

  // Empty title
  if (!metadata.title.trim()) {
    score -= 10;
    feedback.push('Missing title in metadata.');
  }

  // Missing author
  if (!metadata.author.trim()) {
    score -= 5;
    feedback.push('Missing author in metadata.');
  }

  return {
    score: clamp(score, 0, 100),
    headingHierarchyValid: headings.valid,
    wordCount,
    readabilityGrade: grade,
    brokenLinks,
    feedback,
  };
}
