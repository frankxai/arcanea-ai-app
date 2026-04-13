/**
 * Arcanea Publishing House — Editor Claw: Developmental Pass
 *
 * Structural review of manuscript: opening hook, chapter balance,
 * POV consistency, dialogue ratio, canon alignment, scene structure,
 * ending power. ALL HEURISTIC — no LLM calls, works offline.
 *
 * Channeled by Aiyami (Crown Gate).
 */

import type { WorldContext } from '../../quality/types.js';
import { splitSentences, splitWords } from '../../quality/utils.js';
import type { EditorialPass, StructuralFeedback, Severity } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOOK_WINDOW = 200;
const ENDING_WINDOW = 200;
const MIN_DIALOGUE_RATIO = 0.10;
const MAX_DIALOGUE_RATIO = 0.70;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wordCount(text: string): number {
  return splitWords(text).length;
}

function firstNWords(text: string, n: number): string {
  return text.split(/\s+/).slice(0, n).join(' ');
}

function lastNWords(text: string, n: number): string {
  const words = text.split(/\s+/);
  return words.slice(Math.max(0, words.length - n)).join(' ');
}

function splitChapters(content: string): { heading: string; body: string }[] {
  const parts = content.split(/^(#{1,2}\s+.+)$/gm);
  const chapters: { heading: string; body: string }[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const body = (parts[i + 1] ?? '').trim();
    if (body.length > 0) {
      chapters.push({ heading, body });
    }
  }
  if (chapters.length === 0 && content.trim().length > 0) {
    chapters.push({ heading: 'Overall', body: content });
  }
  return chapters;
}

function splitScenes(text: string): string[] {
  return text.split(/(?:\r?\n){2,}(?:---|\*\*\*|___)(?:\r?\n){2,}/).filter(s => s.trim().length > 0);
}

function countDialogueLines(text: string): number {
  const dialoguePattern = /[""\u201C][^""\u201C\u201D]{2,}[""\u201D]/g;
  const matches = text.match(dialoguePattern);
  return matches ? matches.length : 0;
}

function fb(
  category: StructuralFeedback['category'],
  severity: Severity,
  location: string,
  issue: string,
  suggestion: string,
): StructuralFeedback {
  return { category, severity, location, issue, suggestion };
}

// ---------------------------------------------------------------------------
// Main Pass
// ---------------------------------------------------------------------------

export function runDevelopmentalPass(
  content: string,
  worldContext?: WorldContext,
): EditorialPass {
  const items: StructuralFeedback[] = [];
  const chapters = splitChapters(content);
  const totalWords = wordCount(content);

  // --- Opening hook ---
  const openingText = firstNWords(content, HOOK_WINDOW);
  const openingSentences = splitSentences(openingText);
  if (openingSentences.length > 0) {
    const first = openingSentences[0];
    const startsWithDialogue = /^[""\u201C]/.test(first);
    const startsWithAction = /^(He|She|They|I|The|A)\s+\w+(ed|ing)\b/.test(first);
    const hasSensory = /\b(shimmer|glow|shadow|whisper|echo|warm|chill|bitter|sweet)\w*\b/i.test(openingText);
    const isExposition = /^(The|In|It was|There was|Once upon)\b/.test(first) && !startsWithAction;

    if (isExposition && !hasSensory && !startsWithDialogue) {
      items.push(fb(
        'opening', 'major', 'Opening (first 200 words)',
        'Opening begins with flat exposition — no action, dialogue, or sensory anchor.',
        'Start with a character doing something, a line of dialogue, or a vivid sensory image to hook the reader immediately.',
      ));
    } else if (!startsWithDialogue && !startsWithAction && !hasSensory) {
      items.push(fb(
        'opening', 'minor', 'Opening (first 200 words)',
        'Opening lacks a strong hook — no immediate action, dialogue, or sensory detail.',
        'Consider opening with a compelling image, question, or character in motion.',
      ));
    }
  }

  // --- Chapter balance ---
  if (chapters.length >= 2) {
    const chapterLengths = chapters.map(c => wordCount(c.body));
    const avg = chapterLengths.reduce((a, b) => a + b, 0) / chapterLengths.length;

    for (let i = 0; i < chapters.length; i++) {
      const len = chapterLengths[i];
      if (len > avg * 2) {
        items.push(fb(
          'structure', 'minor', chapters[i].heading,
          `Chapter is ${len} words — over 2x the average (${Math.round(avg)} words). May feel bloated.`,
          'Consider splitting this chapter or tightening scenes to match the manuscript rhythm.',
        ));
      } else if (len < avg * 0.5 && len > 50) {
        items.push(fb(
          'structure', 'minor', chapters[i].heading,
          `Chapter is only ${len} words — under half the average (${Math.round(avg)} words). May feel rushed.`,
          'Develop the scenes further or merge with an adjacent chapter.',
        ));
      }
    }
  }

  // --- POV consistency ---
  const scenes = splitScenes(content);
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const hasFirstPerson = /\bI\s+(said|thought|felt|walked|looked|knew|saw)\b/i.test(scene);
    const hasThirdPerson = /\b(she|he)\s+(said|thought|felt|walked|looked|knew|saw)\b/i.test(scene);
    if (hasFirstPerson && hasThirdPerson) {
      items.push(fb(
        'character', 'major', `Scene ${i + 1}`,
        'POV shifts between first person and third person within the same scene.',
        'Maintain a single POV per scene. Use scene breaks (---) when switching perspective.',
      ));
    }
  }

  // --- Dialogue ratio ---
  const dialogueLines = countDialogueLines(content);
  const totalSentences = splitSentences(content).length;
  if (totalSentences > 10) {
    const ratio = dialogueLines / totalSentences;
    if (ratio < MIN_DIALOGUE_RATIO && totalWords > 500) {
      items.push(fb(
        'pacing', 'minor', 'Overall',
        `Dialogue ratio is ${Math.round(ratio * 100)}% — below 10%. The text may read as narration-heavy.`,
        'Add character exchanges to break up narration and reveal personality through speech.',
      ));
    } else if (ratio > MAX_DIALOGUE_RATIO) {
      items.push(fb(
        'pacing', 'minor', 'Overall',
        `Dialogue ratio is ${Math.round(ratio * 100)}% — above 70%. Reads more like a screenplay than prose.`,
        'Weave in narrative beats, interiority, and setting between dialogue exchanges.',
      ));
    }
  }

  // --- Canon consistency ---
  if (worldContext) {
    const contentLower = content.toLowerCase();
    const allKnown = [
      ...worldContext.characters,
      ...worldContext.factions,
      ...worldContext.locations,
    ];

    if (allKnown.length > 0) {
      const namePattern = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]+)*)\b/g;
      const foundNames = new Set<string>();
      let match: RegExpExecArray | null;
      while ((match = namePattern.exec(content)) !== null) {
        foundNames.add(match[1]);
      }

      const knownLower = new Set(allKnown.map(n => n.toLowerCase()));
      for (const name of foundNames) {
        if (
          !knownLower.has(name.toLowerCase()) &&
          !isCommonWord(name.toLowerCase()) &&
          name.length > 3
        ) {
          // Only flag if it appears 2+ times (likely a proper noun, not a sentence start)
          const occurrences = (contentLower.match(new RegExp(`\\b${escapeRegex(name.toLowerCase())}\\b`, 'g')) ?? []).length;
          if (occurrences >= 2) {
            items.push(fb(
              'canon', 'suggestion', 'Overall',
              `"${name}" appears ${occurrences} times but is not in the World Graph context.`,
              'Verify this is intentional. If it is a new entity, add it to the World Graph.',
            ));
          }
        }
      }
    }
  }

  // --- Scene structure (sentence length variance as tension proxy) ---
  for (let i = 0; i < scenes.length; i++) {
    const sceneSentences = splitSentences(scenes[i]);
    if (sceneSentences.length < 5) continue;
    const lengths = sceneSentences.map(s => splitWords(s).length);
    const variance = computeVariance(lengths);
    if (variance < 4) {
      items.push(fb(
        'pacing', 'suggestion', `Scene ${i + 1}`,
        'Sentence lengths are very uniform — the scene may lack tension or rhythmic variation.',
        'Vary sentence length: short punchy sentences for tension, longer ones for reflection.',
      ));
    }
  }

  // --- Ending power ---
  const endingText = lastNWords(content, ENDING_WINDOW);
  const endingSentences = splitSentences(endingText);
  if (endingSentences.length > 0) {
    const last = endingSentences[endingSentences.length - 1];
    const endsOnImage = /\b(shimmer|glow|shadow|light|dark|silence|echo|stars?|moon|sun)\w*\b/i.test(last);
    const endsOnQuestion = /\?$/.test(last.trim());
    const endsOnResonance = last.split(/\s+/).length <= 12;

    if (!endsOnImage && !endsOnQuestion && !endsOnResonance) {
      items.push(fb(
        'ending', 'minor', 'Ending (last 200 words)',
        'The ending trails off without a resonant image, question, or punchy final statement.',
        'End on a vivid image, a provocative question, or a short sentence that lingers.',
      ));
    }
  }

  return {
    pass: 'developmental',
    feedbackCount: items.length,
    items,
  };
}

// ---------------------------------------------------------------------------
// Internal Utilities
// ---------------------------------------------------------------------------

const COMMON_WORDS = new Set([
  'the', 'and', 'but', 'not', 'this', 'that', 'with', 'from', 'have', 'been',
  'they', 'their', 'them', 'will', 'would', 'could', 'should', 'about', 'into',
  'just', 'then', 'than', 'when', 'what', 'which', 'where', 'there', 'here',
  'before', 'after', 'through', 'between', 'under', 'over', 'again', 'once',
  'still', 'also', 'even', 'back', 'down', 'chapter', 'part', 'section',
]);

function isCommonWord(word: string): boolean {
  return COMMON_WORDS.has(word);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function computeVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sumSq = values.reduce((sum, v) => sum + (v - mean) ** 2, 0);
  return Math.sqrt(sumSq / values.length);
}
