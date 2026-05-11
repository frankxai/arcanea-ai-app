/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Living Lore — Barrel Export
 *
 * Central entry point for the Living Lore system:
 * - Types for episodes, encounters, crew, and progression
 * - Crew data and chat-system bridge
 * - Filesystem loaders for episodes and encounters
 * - Cross-references to the Library of Arcanea
 * - XP, bond, and gate-unlock calculations
 */

export * from './types';
export * from './crew-data';
export * from './crew-prompts';
export * from './episode-loader';
export * from './lore-connections';
export * from './progression';
export * from './crew-visuals';
export * from './crew-audio';
export * from './encounter-choices';
