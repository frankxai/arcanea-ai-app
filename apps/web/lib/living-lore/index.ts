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
