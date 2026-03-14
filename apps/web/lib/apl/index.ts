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
export { buildWorldDNA, type WorldDNA } from './world-dna';
export { formatPrompt, type APLPrompt } from './format';
