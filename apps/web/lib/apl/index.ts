/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arcanean Prompt Language — Programmatic Engine
 *
 * SPARK. SHAPE. SHARPEN.
 *
 * Transforms any prompt from generic to genius.
 * Used by: chat API, image enhance, author system, MCP, Academy.
 */

export { enhance, type EnhanceOptions, type EnhanceResult } from './enhance';
export { PALETTES, getPalette, blendPalettes, detectPalette, type Palette } from './palettes';
export { ANTI_SLOP, detectSlop, slopScore, type SlopMatch, type SlopPattern } from './anti-slop';
export { buildWorldDNA, ARCANEA_WORLD_DNA, type WorldDNA } from './world-dna';
export { formatPrompt, parsePrompt, type APLPrompt } from './format';
export { EXAMPLES, getExamples, getRandomExample, type APLExample } from './examples';
