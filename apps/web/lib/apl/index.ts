/**
 * Arcanean Prompt Language — Programmatic Engine
 *
 * SPARK. SHAPE. SHARPEN.
 *
 * Transforms any prompt from generic to genius.
 * Used by: chat API, image enhance, author system, MCP, Academy.
 */

export { enhance, type EnhanceOptions, type EnhanceResult } from './enhance';
export { PALETTES, getPalette, blendPalettes, type Palette } from './palettes';
export { ANTI_SLOP, detectSlop, type SlopMatch } from './anti-slop';
export { buildWorldDNA, ARCANEA_WORLD_DNA, type WorldDNA } from './world-dna';
export { formatPrompt, parsePrompt, type APLPrompt } from './format';
export { EXAMPLES, getExamples, getRandomExample, type APLExample } from './examples';
export { slopScore } from './anti-slop';
export { detectPalette } from './palettes';
