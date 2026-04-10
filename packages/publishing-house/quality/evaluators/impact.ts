/**
 * T — Transformative/Emotional Impact Evaluator
 *
 * Heuristic analysis of emotional arc: hook strength, pacing variation,
 * dialogue presence, sensory language density, conclusion power.
 */

import type { ImpactScore } from '../types.js';
import { SENSORY_PATTERNS } from '../patterns.js';
import { clamp, countMatches, splitSentences, splitWords } from '../utils.js';

export function evaluateImpact(content: string): ImpactScore {
  const feedback: string[] = [];
  let score = 70; // Baseline — adjust up or down

  const sentences = splitSentences(content);
  const words = splitWords(content);
  const wordCount = words.length;

  // --- Hook strength (first 3 sentences) ---
  const hookSentences = sentences.slice(0, 3);
  let hookStrength = 50;

  if (hookSentences.length > 0) {
    const hookText = hookSentences.join(' ');
    const avgHookLen =
      hookSentences.reduce((sum, s) => sum + splitWords(s).length, 0) / hookSentences.length;
    if (avgHookLen <= 15) hookStrength += 15;
    else if (avgHookLen <= 25) hookStrength += 5;

    if (/[?!]/.test(hookText)) hookStrength += 10;

    if (/[""\u201C\u201D]/.test(hookText)) hookStrength += 10;

    const hookSensory = SENSORY_PATTERNS.filter((p) => p.test(hookText)).length;
    hookStrength += Math.min(hookSensory * 5, 15);
  }
  hookStrength = clamp(hookStrength, 0, 100);

  if (hookStrength >= 70) {
    score += 10;
  } else if (hookStrength < 40) {
    score -= 10;
    feedback.push('Weak opening hook. Consider starting with action, dialogue, or a question.');
  }

  // --- Pacing variance (sentence length variation) ---
  let pacingVariance = 0;
  if (sentences.length > 2) {
    const lengths = sentences.map((s) => splitWords(s).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + (l - mean) ** 2, 0) / lengths.length;
    pacingVariance = Math.sqrt(variance);

    if (pacingVariance >= 4 && pacingVariance <= 12) {
      score += 8;
    } else if (pacingVariance < 2) {
      score -= 10;
      feedback.push('Monotonous pacing. Vary sentence lengths for better rhythm.');
    } else if (pacingVariance > 15) {
      score -= 3;
      feedback.push('Erratic sentence lengths. Some smoothing may help readability.');
    }
  }

  // --- Dialogue presence ---
  const dialogueMarkers = content.match(/[""\u201C\u201D][^""\u201C\u201D]{2,}[""\u201C\u201D]/g);
  const dialoguePresence = dialogueMarkers !== null && dialogueMarkers.length > 0;
  if (dialoguePresence) {
    score += 5;
  } else if (wordCount > 500) {
    feedback.push('No dialogue detected. Dialogue can increase engagement.');
  }

  // --- Sensory language density ---
  let sensoryHits = 0;
  for (const pattern of SENSORY_PATTERNS) {
    sensoryHits += countMatches(content, pattern);
  }
  const sensoryDensity = wordCount > 0 ? (sensoryHits / wordCount) * 1000 : 0;
  if (sensoryDensity >= 5 && sensoryDensity <= 20) {
    score += 7;
  } else if (sensoryDensity < 2) {
    score -= 5;
    feedback.push('Low sensory language. Add sight, sound, smell, touch, or taste details.');
  } else if (sensoryDensity > 30) {
    score -= 3;
    feedback.push('Very high sensory density — may feel overwrought.');
  }

  // --- Conclusion power (last 3 sentences) ---
  const closingSentences = sentences.slice(-3);
  if (closingSentences.length > 0) {
    const closingText = closingSentences.join(' ');
    const closingWords = splitWords(closingText);
    const avgClosingLen = closingWords.length / closingSentences.length;
    if (avgClosingLen <= 20) {
      score += 3;
    }
    if (/[?!]/.test(closingText)) {
      score += 2;
    }
  }

  return {
    score: clamp(score, 0, 100),
    hookStrength,
    pacingVariance: Math.round(pacingVariance * 100) / 100,
    dialoguePresence,
    sensoryDensity: Math.round(sensoryDensity * 100) / 100,
    feedback,
  };
}
