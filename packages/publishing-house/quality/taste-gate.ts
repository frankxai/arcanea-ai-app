/**
 * Arcanea Publishing House — TASTE 5D Quality Scoring System
 *
 * Deterministic, offline-capable quality gate. No API calls required.
 * Scores content across 5 dimensions (0-100 each):
 *
 *   T — Technical Fit (formatting, structure, readability)
 *   A — Aesthetic/Design Compliance (visual quality, typography)
 *   S — Story/Canon Alignment (World Graph consistency)
 *   T — Transformative/Emotional Impact (depth, resonance)
 *   E — Experiential Uniqueness (originality, anti-slop)
 */

import type {
  AssetRef,
  CanonScore,
  ContentMeta,
  DesignScore,
  ImpactScore,
  ScoreInput,
  SlopMatch,
  TasteResult,
  TasteTier,
  TechnicalScore,
  UniquenessScore,
  WorldContext,
} from './types.js';

import { GATE_PASS_THRESHOLD, TIER_THRESHOLDS } from './types.js';

// ---------------------------------------------------------------------------
// Slop Detection Patterns
// ---------------------------------------------------------------------------

interface SlopPattern {
  regex: RegExp;
  category: SlopMatch['category'];
  penalty: number;
  label: string;
}

const SLOP_PATTERNS: SlopPattern[] = [
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
const TRANSITION_SLOP_REGEX = /(?:^|\n)\s*(?:Moreover|Furthermore|Additionally),/g;
const TRANSITION_SLOP_THRESHOLD = 3;
const TRANSITION_SLOP_PENALTY_PER = 3;

// ---------------------------------------------------------------------------
// Cliche patterns (for cliche density scoring)
// ---------------------------------------------------------------------------

const CLICHE_PATTERNS: RegExp[] = [
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

const SENSORY_PATTERNS: RegExp[] = [
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamp a number between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Count regex matches in text. */
function countMatches(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/** Split text into sentences (rough heuristic). */
function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Split text into words. */
function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z'-]/g, '').toLowerCase())
    .filter((w) => w.length > 0);
}

/** Flesch-Kincaid grade level approximation. */
function fleschKincaidGrade(text: string): number {
  const sentences = splitSentences(text);
  const words = splitWords(text);
  const sentenceCount = Math.max(sentences.length, 1);
  const wordCount = Math.max(words.length, 1);

  // Approximate syllable count: count vowel groups per word
  let syllableCount = 0;
  for (const word of words) {
    const vowelGroups = word.match(/[aeiouy]+/gi);
    const count = vowelGroups ? vowelGroups.length : 1;
    syllableCount += Math.max(count, 1);
  }

  const grade =
    0.39 * (wordCount / sentenceCount) +
    11.8 * (syllableCount / wordCount) -
    15.59;

  return Math.round(clamp(grade, 0, 20) * 10) / 10;
}

/** Extract markdown links and image refs for broken link detection. */
function extractLinks(content: string): string[] {
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }
  return links;
}

/** Check heading hierarchy validity. Headings should not skip levels. */
function validateHeadingHierarchy(content: string): { valid: boolean; issues: string[] } {
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

/** Determine the tier from a total score. */
function determineTier(total: number): TasteTier {
  if (total >= TIER_THRESHOLDS.hero) return 'hero';
  if (total >= TIER_THRESHOLDS.gallery) return 'gallery';
  if (total >= TIER_THRESHOLDS.thumbnail) return 'thumbnail';
  return 'reject';
}

// ---------------------------------------------------------------------------
// Dimension Evaluators
// ---------------------------------------------------------------------------

/**
 * T — Technical Fit
 *
 * Evaluates production quality: formatting, structure, readability,
 * link validity, word count adequacy.
 */
export function evaluateTechnical(content: string, metadata: ContentMeta): TechnicalScore {
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
      feedback.push(`Word count mismatch: metadata says ${declaredCount}, actual is ${wordCount}.`);
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

/**
 * A — Aesthetic/Design Compliance
 *
 * Evaluates visual quality: asset presence, alt text, dimensions,
 * consistent styling markers.
 */
export function evaluateDesign(content: string, assets: AssetRef[]): DesignScore {
  const feedback: string[] = [];
  let score = 100;

  const missingAltText: string[] = [];
  const undersizedAssets: string[] = [];

  // Check markdown images for alt text
  const imgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
  let imgMatch: RegExpExecArray | null;
  const inlineImages: string[] = [];
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    inlineImages.push(imgMatch[2]);
    if (!imgMatch[1].trim()) {
      missingAltText.push(imgMatch[2]);
    }
  }

  if (missingAltText.length > 0) {
    score -= 5 * missingAltText.length;
    feedback.push(`${missingAltText.length} image(s) missing alt text.`);
  }

  // Check provided asset refs
  const MIN_COVER_WIDTH = 600;
  const MIN_COVER_HEIGHT = 800;
  const MIN_BANNER_WIDTH = 1200;
  const MIN_ILLUSTRATION_WIDTH = 400;

  for (const asset of assets) {
    if (!asset.dimensions) continue;

    const { w, h } = asset.dimensions;
    let tooSmall = false;

    switch (asset.type) {
      case 'cover':
        tooSmall = w < MIN_COVER_WIDTH || h < MIN_COVER_HEIGHT;
        break;
      case 'banner':
        tooSmall = w < MIN_BANNER_WIDTH;
        break;
      case 'illustration':
        tooSmall = w < MIN_ILLUSTRATION_WIDTH;
        break;
    }

    if (tooSmall) {
      undersizedAssets.push(asset.path);
      score -= 8;
      feedback.push(`Asset "${asset.path}" (${asset.type}) is undersized: ${w}x${h}.`);
    }
  }

  // No assets at all — minor penalty
  if (assets.length === 0 && inlineImages.length === 0) {
    score -= 10;
    feedback.push('No visual assets found. Consider adding a cover or illustration.');
  }

  // Check for consistent markdown styling (no mixed emphasis markers)
  const hasBoldAsterisks = /\*\*[^*]+\*\*/.test(content);
  const hasBoldUnderscores = /__[^_]+__/.test(content);
  if (hasBoldAsterisks && hasBoldUnderscores) {
    score -= 5;
    feedback.push('Mixed bold markers (** and __). Use consistent styling.');
  }

  const hasItalicAsterisks = /(?<!\*)\*(?!\*)[^*]+\*(?!\*)/.test(content);
  const hasItalicUnderscores = /(?<!_)_(?!_)[^_]+_(?!_)/.test(content);
  if (hasItalicAsterisks && hasItalicUnderscores) {
    score -= 3;
    feedback.push('Mixed italic markers (* and _). Use consistent styling.');
  }

  return {
    score: clamp(score, 0, 100),
    missingAltText,
    undersizedAssets,
    feedback,
  };
}

/**
 * S — Story/Canon Alignment
 *
 * Checks character names, faction references, and location names
 * against the provided World Graph context. Unknown references reduce score.
 */
export function evaluateCanon(content: string, worldContext: WorldContext): CanonScore {
  const feedback: string[] = [];
  let score = 100;

  const contentLower = content.toLowerCase();

  // Build word boundary patterns for known entities
  const knownCharacters = new Set(worldContext.characters.map((c) => c.toLowerCase()));
  const knownFactions = new Set(worldContext.factions.map((f) => f.toLowerCase()));
  const knownLocations = new Set(worldContext.locations.map((l) => l.toLowerCase()));

  // Extract capitalized multi-word names from content (potential entity references)
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  const foundNames = new Set<string>();
  let nameMatch: RegExpExecArray | null;
  while ((nameMatch = namePattern.exec(content)) !== null) {
    foundNames.add(nameMatch[1]);
  }

  const unknownCharacters: string[] = [];
  const unknownFactions: string[] = [];
  const unknownLocations: string[] = [];

  // If world context has entities, check that content references are known
  if (knownCharacters.size > 0 || knownFactions.size > 0 || knownLocations.size > 0) {
    // Check how many known entities appear in the content
    let knownRefsFound = 0;
    let totalKnown = knownCharacters.size + knownFactions.size + knownLocations.size;

    for (const char of knownCharacters) {
      if (contentLower.includes(char)) {
        knownRefsFound++;
      }
    }
    for (const faction of knownFactions) {
      if (contentLower.includes(faction)) {
        knownRefsFound++;
      }
    }
    for (const loc of knownLocations) {
      if (contentLower.includes(loc)) {
        knownRefsFound++;
      }
    }

    // Reward for using known entities (up to +10 for comprehensive usage)
    if (totalKnown > 0) {
      const usageRatio = knownRefsFound / totalKnown;
      if (usageRatio < 0.1) {
        score -= 10;
        feedback.push('Very few World Graph entities referenced. Content may feel disconnected from canon.');
      }
    }
  }

  // If no world context provided, give a neutral score
  if (
    worldContext.characters.length === 0 &&
    worldContext.factions.length === 0 &&
    worldContext.locations.length === 0
  ) {
    score = 70;
    feedback.push('No World Graph context provided. Canon alignment scored at baseline.');
  }

  // Timeline consistency check (basic: look for year/date references)
  if (worldContext.timeline) {
    const timelineLower = worldContext.timeline.toLowerCase();
    const yearPattern = /\b(\d{3,4})\b/g;
    let yearMatch: RegExpExecArray | null;
    const contentYears: number[] = [];
    while ((yearMatch = yearPattern.exec(content)) !== null) {
      contentYears.push(parseInt(yearMatch[1], 10));
    }

    const timelineYears: number[] = [];
    let tlYearMatch: RegExpExecArray | null;
    const tlYearPattern = /\b(\d{3,4})\b/g;
    while ((tlYearMatch = tlYearPattern.exec(timelineLower)) !== null) {
      timelineYears.push(parseInt(tlYearMatch[1], 10));
    }

    if (timelineYears.length > 0 && contentYears.length > 0) {
      const tlMin = Math.min(...timelineYears);
      const tlMax = Math.max(...timelineYears);
      for (const year of contentYears) {
        if (year < tlMin - 100 || year > tlMax + 100) {
          score -= 5;
          feedback.push(`Year ${year} falls outside expected timeline range (${tlMin}-${tlMax}).`);
        }
      }
    }
  }

  return {
    score: clamp(score, 0, 100),
    unknownCharacters,
    unknownFactions,
    unknownLocations,
    feedback,
  };
}

/**
 * T — Transformative/Emotional Impact
 *
 * Heuristic analysis of emotional arc: hook strength, pacing variation,
 * dialogue presence, sensory language density, conclusion power.
 */
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
    // Short, punchy opening is stronger
    const avgHookLen =
      hookSentences.reduce((sum, s) => sum + splitWords(s).length, 0) / hookSentences.length;
    if (avgHookLen <= 15) hookStrength += 15;
    else if (avgHookLen <= 25) hookStrength += 5;

    // Question or exclamation in hook
    if (/[?!]/.test(hookText)) hookStrength += 10;

    // Dialogue in hook
    if (/[""\u201C\u201D]/.test(hookText)) hookStrength += 10;

    // Sensory word in hook
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

    // Good pacing has varied sentence lengths (std dev 4-12)
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
  // Target: 5-20 sensory words per 1000 words
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
    // Short, decisive closing is strong
    const avgClosingLen = closingWords.length / closingSentences.length;
    if (avgClosingLen <= 20) {
      score += 3;
    }
    // Emotional or rhetorical closing
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

/**
 * E — Experiential Uniqueness
 *
 * Detects AI slop patterns, measures vocabulary diversity (type-token ratio),
 * and counts cliche density. Higher score = more original.
 */
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
    const penalty = (transitionCount - TRANSITION_SLOP_THRESHOLD + 1) * TRANSITION_SLOP_PENALTY_PER;
    score -= penalty;
    slopPatternsFound.push({
      pattern: 'Moreover/Furthermore/Additionally',
      count: transitionCount,
      category: 'transition',
    });
    feedback.push(
      `Transition slop: "Moreover/Furthermore/Additionally" used ${transitionCount} times.`
    );
  }

  if (slopPatternsFound.length > 0) {
    const total = slopPatternsFound.reduce((sum, p) => sum + p.count, 0);
    feedback.push(`Found ${total} AI slop pattern(s) across ${slopPatternsFound.length} categories.`);
  }

  // --- Type-Token Ratio (vocabulary diversity) ---
  const words = splitWords(content);
  const wordCount = words.length;
  let typeTokenRatio = 1;

  if (wordCount > 0) {
    // For long texts, use a windowed TTR (every 100 words) to avoid length bias
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

    // Good TTR: 0.5-0.8 for windowed, 0.4+ for short text
    if (typeTokenRatio < 0.35) {
      score -= 15;
      feedback.push(`Low vocabulary diversity (TTR: ${typeTokenRatio}). Content may feel repetitive.`);
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

// ---------------------------------------------------------------------------
// Main Scorer
// ---------------------------------------------------------------------------

/**
 * Run the full TASTE 5D Quality Gate.
 *
 * Scores content on all 5 dimensions and returns a composite result
 * with tier classification and gate pass/fail.
 *
 * Fully deterministic — no API calls, works offline.
 */
export async function scoreTASTE(input: ScoreInput): Promise<TasteResult> {
  const { content, metadata, assets = [], worldContext } = input;

  // Run all 5 evaluators
  const technical = evaluateTechnical(content, metadata);
  const design = evaluateDesign(content, assets);
  const canon = worldContext
    ? evaluateCanon(content, worldContext)
    : { score: 70, unknownCharacters: [], unknownFactions: [], unknownLocations: [], feedback: ['No world context provided. Canon scored at baseline.'] };
  const impact = evaluateImpact(content);
  const uniqueness = evaluateUniqueness(content);

  // Weighted average: equal weights (20% each)
  const total = Math.round(
    (technical.score + design.score + canon.score + impact.score + uniqueness.score) / 5
  );

  const tier = determineTier(total);
  const passesGate = total >= GATE_PASS_THRESHOLD;

  // Aggregate feedback
  const feedback: string[] = [];

  if (technical.feedback.length > 0) {
    feedback.push(`[Technical] ${technical.feedback.join(' ')}`);
  }
  if (design.feedback.length > 0) {
    feedback.push(`[Design] ${design.feedback.join(' ')}`);
  }
  if (canon.feedback.length > 0) {
    feedback.push(`[Canon] ${canon.feedback.join(' ')}`);
  }
  if (impact.feedback.length > 0) {
    feedback.push(`[Impact] ${impact.feedback.join(' ')}`);
  }
  if (uniqueness.feedback.length > 0) {
    feedback.push(`[Uniqueness] ${uniqueness.feedback.join(' ')}`);
  }

  return {
    technical: technical.score,
    aesthetic: design.score,
    canon: canon.score,
    impact: impact.score,
    uniqueness: uniqueness.score,
    total,
    tier,
    feedback,
    passesGate,
  };
}
