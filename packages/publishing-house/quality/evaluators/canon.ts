/**
 * S — Story/Canon Alignment Evaluator
 *
 * Checks character, faction, and location references against the provided
 * World Graph context. Unknown references reduce score.
 */

import type { CanonScore, WorldContext } from '../types.js';
import { clamp } from '../utils.js';

export function evaluateCanon(content: string, worldContext: WorldContext): CanonScore {
  const feedback: string[] = [];
  let score = 100;

  const contentLower = content.toLowerCase();

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
    let knownRefsFound = 0;
    const totalKnown = knownCharacters.size + knownFactions.size + knownLocations.size;

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

    if (totalKnown > 0) {
      const usageRatio = knownRefsFound / totalKnown;
      if (usageRatio < 0.1) {
        score -= 10;
        feedback.push(
          'Very few World Graph entities referenced. Content may feel disconnected from canon.',
        );
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
          feedback.push(
            `Year ${year} falls outside expected timeline range (${tlMin}-${tlMax}).`,
          );
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
