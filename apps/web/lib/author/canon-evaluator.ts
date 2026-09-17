/**
 * Arcanea Canon Evaluator & Humanizer Rule Engine
 * Performs real-time entity recognition, continuity checking against locked canon,
 * and meaning-preserving AI-tell detection.
 */

import type { LoreEntity } from './types';

// Banned AI phrases according to Arcanea Quality Canon and Starlight Humanizer
export const AI_TELL_PATTERNS: Array<{
  pattern: RegExp;
  category: 'verbal-tic' | 'hollow-enthusiasm' | 'announcement' | 'cliche';
  suggestion: string;
}> = [
  {
    pattern: /\bdelve\b|\bdelves\b|\bdelving\b/gi,
    category: 'verbal-tic',
    suggestion: 'Replace with specific action: investigate, dig, uncover, explore, examine',
  },
  {
    pattern: /\btapestry\b|\btapestries\b/gi,
    category: 'verbal-tic',
    suggestion: 'Replace with concrete imagery: weave, mosaic, network, complex web',
  },
  {
    pattern: /\bnestled\b/gi,
    category: 'verbal-tic',
    suggestion: 'Replace with grounded physical placement: tucked, situated, carved into, resting',
  },
  {
    pattern: /\btestament to\b/gi,
    category: 'hollow-enthusiasm',
    suggestion: 'Show the physical evidence instead of asserting "testament to"',
  },
  {
    pattern: /\bseamless\b|\bseamlessly\b/gi,
    category: 'hollow-enthusiasm',
    suggestion: 'Describe how the transition actually occurs without generic praise',
  },
  {
    pattern: /\bworld-class\b|\brevolutionary\b/gi,
    category: 'hollow-enthusiasm',
    suggestion: 'Demonstrate excellence through concrete details; cut the promotional adjectives',
  },
  {
    pattern: /\bit's worth noting that\b|\bimportantly,\b/gi,
    category: 'announcement',
    suggestion: 'Cut the introductory padding and state the fact directly',
  },
  {
    pattern: /\bin essence,\b|\bat its core,\b/gi,
    category: 'announcement',
    suggestion: 'State the principle directly without philosophical hedging',
  },
  {
    pattern: /\bnot only (.*?), but also (.*?)\b/gi,
    category: 'cliche',
    suggestion: 'Break into two direct, punchy sentences or vary the syntactic rhythm',
  },
];

export interface TellViolation {
  matchedText: string;
  category: string;
  suggestion: string;
  index: number;
}

export interface EvaluatorResult {
  detectedEntities: LoreEntity[];
  aiTells: TellViolation[];
  humanizerScore: number; // 0 to 100
  pacingMetrics: {
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    dialogueRatioPercent: number;
  };
}

export function evaluateProse(prose: string, existingLore: LoreEntity[] = []): EvaluatorResult {
  if (!prose || typeof prose !== 'string') {
    return {
      detectedEntities: [],
      aiTells: [],
      humanizerScore: 100,
      pacingMetrics: { wordCount: 0, sentenceCount: 0, avgSentenceLength: 0, dialogueRatioPercent: 0 },
    };
  }

  // 1. Detect AI Tells
  const tells: TellViolation[] = [];
  for (const { pattern, category, suggestion } of AI_TELL_PATTERNS) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(prose)) !== null) {
      tells.push({
        matchedText: match[0],
        category,
        suggestion,
        index: match.index,
      });
    }
  }

  // 2. Entity Matching
  const detected: LoreEntity[] = [];
  const lowerProse = prose.toLowerCase();
  for (const entity of existingLore) {
    if (lowerProse.includes(entity.name.toLowerCase())) {
      detected.push(entity);
    }
  }

  // 3. Pacing & Sentence Analysis
  const words = prose.split(/\s+/).filter(Boolean);
  const sentences = prose.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

  // Dialogue ratio heuristic: text inside quotes vs total
  const dialogueMatches = prose.match(/"([^"]*)"|“([^”]*)”/g) || [];
  const dialogueWordCount = dialogueMatches.reduce(
    (sum, quote) => sum + quote.split(/\s+/).filter(Boolean).length,
    0,
  );
  const dialogueRatioPercent = words.length > 0 ? Math.round((dialogueWordCount / words.length) * 100) : 0;

  // Humanizer Score formula: penalize 5 points per tell, clamp to 0-100
  const humanizerScore = Math.max(0, Math.min(100, 100 - tells.length * 5));

  return {
    detectedEntities: detected,
    aiTells: tells,
    humanizerScore,
    pacingMetrics: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength,
      dialogueRatioPercent,
    },
  };
}
