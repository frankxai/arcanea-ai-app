/**
 * APL Enhance — transforms a generic prompt into a SPARK.SHAPE.SHARPEN prompt
 *
 * This is the core engine. Given a plain prompt, it:
 * 1. Detects likely palette from content
 * 2. Checks for slop patterns
 * 3. Builds enhancement suggestions
 * 4. Returns a structured APL prompt
 */

import { detectPalette } from './palettes';
import { detectSlop, slopScore, type SlopMatch } from './anti-slop';

export interface EnhanceOptions {
  /** Force a specific palette */
  palette?: string;
  /** Force a secondary palette */
  secondaryPalette?: string;
  /** Additional sharpen constraints */
  extraSharpen?: string[];
  /** World DNA prefix to inherit */
  worldPrefix?: string;
}

export interface EnhanceResult {
  /** The original prompt */
  original: string;
  /** Detected slop patterns */
  slopMatches: SlopMatch[];
  /** Slop score (0 = clean, 1 = maximum slop) */
  slopScore: number;
  /** Detected palette affinity */
  detectedPalettes: { palette: string; confidence: number }[];
  /** Suggestions for improvement */
  suggestions: string[];
  /** Quality level estimate */
  qualityLevel: 'generic' | 'clear' | 'vivid' | 'resonant';
}

/**
 * Analyze a prompt and return enhancement suggestions
 */
export function enhance(prompt: string, options?: EnhanceOptions): EnhanceResult {
  const slop = detectSlop(prompt);
  const score = slopScore(prompt);
  const palettes = detectPalette(prompt);
  const suggestions: string[] = [];

  // Check for SPARK (specificity)
  const hasSpecificDetail = /\b(?:every night|always|never fails to|the way she|his habit of|the scar from)\b/i.test(prompt);
  const hasNumbers = /\b\d+\b/.test(prompt);
  const hasProperNouns = /\b[A-Z][a-z]{2,}\b/.test(prompt);

  if (!hasSpecificDetail && !hasNumbers && !hasProperNouns) {
    suggestions.push('SPARK: Add one specific, surprising detail — the thing only YOU would think of.');
  }

  // Check for SHAPE (sensory language)
  const sensoryWords = /\b(?:smell|taste|feel|sound|texture|heat|cold|weight|echo|crackle|hum|glow|rough|smooth|bitter|sweet)\b/i;
  if (!sensoryWords.test(prompt)) {
    suggestions.push('SHAPE: Add sensory language — what does this feel/smell/sound like?');
    if (palettes.length > 0) {
      suggestions.push(`Try the ${palettes[0].palette.toUpperCase()} palette for atmosphere.`);
    }
  }

  // Check for SHARPEN (constraints)
  const hasNegation = /\b(?:not|never|no|without|avoid|don't|must not|isn't)\b/i.test(prompt);
  if (!hasNegation) {
    suggestions.push('SHARPEN: Tell the AI what to AVOID — what must this NOT be?');
  }

  // Slop-specific suggestions
  for (const match of slop) {
    suggestions.push(`Cut "${match.match}" — ${match.fix}`);
  }

  // Quality level
  let qualityLevel: EnhanceResult['qualityLevel'] = 'generic';
  if (hasSpecificDetail || hasProperNouns) qualityLevel = 'clear';
  if (qualityLevel === 'clear' && sensoryWords.test(prompt)) qualityLevel = 'vivid';
  if (qualityLevel === 'vivid' && hasNegation && slop.length === 0) qualityLevel = 'resonant';

  return {
    original: prompt,
    slopMatches: slop,
    slopScore: score,
    detectedPalettes: palettes,
    suggestions,
    qualityLevel,
  };
}
