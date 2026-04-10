/**
 * A — Aesthetic/Design Compliance Evaluator
 *
 * Visual quality checks: asset presence, alt text, dimensions,
 * and consistent markdown styling markers.
 */

import type { AssetRef, DesignScore } from '../types.js';
import { clamp } from '../utils.js';

const MIN_COVER_WIDTH = 600;
const MIN_COVER_HEIGHT = 800;
const MIN_BANNER_WIDTH = 1200;
const MIN_ILLUSTRATION_WIDTH = 400;

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
