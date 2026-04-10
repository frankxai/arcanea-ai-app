/**
 * Arcanea Publishing House — TASTE Pattern Library
 *
 * All regex pattern constants used by the TASTE quality evaluators.
 * Split out so patterns can be audited, extended, and unit-tested in
 * isolation from the scoring logic.
 */

import type { SlopMatch } from './types.js';

export interface SlopPattern {
  regex: RegExp;
  category: SlopMatch['category'];
  penalty: number;
  label: string;
}

// ---------------------------------------------------------------------------
// AI Slop Patterns
// ---------------------------------------------------------------------------

export const SLOP_PATTERNS: SlopPattern[] = [
  // Overused metaphor frames
  { regex: /\btapestry of\b/gi, category: 'metaphor', penalty: 4, label: 'tapestry of' },
  { regex: /\bsymphony of\b/gi, category: 'metaphor', penalty: 4, label: 'symphony of' },
  { regex: /\bdance of\b/gi, category: 'metaphor', penalty: 3, label: 'dance of' },
  { regex: /\bmosaic of\b/gi, category: 'metaphor', penalty: 4, label: 'mosaic of' },
  { regex: /\btapestry woven\b/gi, category: 'metaphor', penalty: 4, label: 'tapestry woven' },
  { regex: /\bkaleidoscope of\b/gi, category: 'metaphor', penalty: 4, label: 'kaleidoscope of' },

  // Filler phrases
  { regex: /\bin the realm of\b/gi, category: 'filler', penalty: 4, label: 'In the realm of' },
  { regex: /\bit'?s worth noting\b/gi, category: 'filler', penalty: 3, label: "It's worth noting" },
  { regex: /\bat the end of the day\b/gi, category: 'filler', penalty: 3, label: 'At the end of the day' },
  { regex: /\bneedless to say\b/gi, category: 'filler', penalty: 3, label: 'Needless to say' },
  { regex: /\bin today'?s world\b/gi, category: 'filler', penalty: 4, label: "In today's world" },

  // Corporate slop
  { regex: /\bdelve\b/gi, category: 'corporate', penalty: 5, label: 'delve' },
  { regex: /\bleverage\b/gi, category: 'corporate', penalty: 4, label: 'leverage' },
  { regex: /\bparadigm\b/gi, category: 'corporate', penalty: 4, label: 'paradigm' },
  { regex: /\bsynergy\b/gi, category: 'corporate', penalty: 5, label: 'synergy' },
  { regex: /\bholistic\b/gi, category: 'corporate', penalty: 3, label: 'holistic' },
  { regex: /\brobust\b/gi, category: 'corporate', penalty: 3, label: 'robust' },

  // AI identity leaks
  { regex: /\bas an ai\b/gi, category: 'ai-identity', penalty: 5, label: 'As an AI' },
  { regex: /\bi don'?t have personal\b/gi, category: 'ai-identity', penalty: 5, label: "I don't have personal" },
  { regex: /\bas a language model\b/gi, category: 'ai-identity', penalty: 5, label: 'As a language model' },
  { regex: /\bi'?m not able to\b/gi, category: 'ai-identity', penalty: 4, label: "I'm not able to" },
];

/**
 * Transition slop: "Moreover," / "Furthermore," / "Additionally," at sentence start.
 * 3+ occurrences total triggers penalty.
 */
export const TRANSITION_SLOP_REGEX = /(?:^|\n)\s*(?:Moreover|Furthermore|Additionally),/g;
export const TRANSITION_SLOP_THRESHOLD = 3;
export const TRANSITION_SLOP_PENALTY_PER = 3;

// ---------------------------------------------------------------------------
// Cliche patterns (for cliche density scoring)
// ---------------------------------------------------------------------------

export const CLICHE_PATTERNS: RegExp[] = [
  /\btip of the iceberg\b/gi,
  /\btime will tell\b/gi,
  /\bbetter late than never\b/gi,
  /\bevery cloud has a silver lining\b/gi,
  /\bat the crack of dawn\b/gi,
  /\bonly time will tell\b/gi,
  /\bleave no stone unturned\b/gi,
  /\bthink outside the box\b/gi,
  /\bgame[- ]?changer\b/gi,
  /\bpush the envelope\b/gi,
  /\braise the bar\b/gi,
  /\bmove the needle\b/gi,
  /\blow[- ]?hanging fruit\b/gi,
  /\bbest of both worlds\b/gi,
  /\bwhen all is said and done\b/gi,
  /\bstood the test of time\b/gi,
  /\ba double[- ]?edged sword\b/gi,
  /\blight at the end of the tunnel\b/gi,
];

// ---------------------------------------------------------------------------
// Sensory language patterns (for impact scoring)
// ---------------------------------------------------------------------------

export const SENSORY_PATTERNS: RegExp[] = [
  // Sight
  /\bglimmer(?:ed|ing|s)?\b/gi,
  /\bshimmer(?:ed|ing|s)?\b/gi,
  /\bshadow(?:ed|s)?\b/gi,
  /\bglow(?:ed|ing|s)?\b/gi,
  /\bflicker(?:ed|ing|s)?\b/gi,
  // Sound
  /\bwhisper(?:ed|ing|s)?\b/gi,
  /\becho(?:ed|ing|es)?\b/gi,
  /\bthunder(?:ed|ing|s)?\b/gi,
  /\bhumm(?:ed|ing|s)?\b/gi,
  /\brussl(?:ed|ing|es)?\b/gi,
  // Touch
  /\bsilk(?:en|y)?\b/gi,
  /\brough(?:ened)?\b/gi,
  /\bwarm(?:th)?\b/gi,
  /\bchill(?:ed|ing|s)?\b/gi,
  /\btingle[ds]?\b/gi,
  // Smell
  /\bacrid\b/gi,
  /\bfragran(?:t|ce)\b/gi,
  /\bmusty\b/gi,
  /\bpungent\b/gi,
  // Taste
  /\bbitter\b/gi,
  /\bsweet(?:ness)?\b/gi,
  /\bmetallic\b/gi,
  /\btang(?:y)?\b/gi,
];

/** Back-compat alias — some callers may use SENSORY_WORDS. */
export const SENSORY_WORDS = SENSORY_PATTERNS;
