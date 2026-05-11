/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Library of Arcanea - Content System
 *
 * ★ Insight ─────────────────────────────────────
 * This barrel export provides a clean API for the content system.
 * All content operations flow through here:
 * - Type definitions for type-safe content handling
 * - Loader functions for fetching and querying content
 * - Graph operations for relationship visualization
 * ─────────────────────────────────────────────────
 */

// Types
export * from './types';

// Loader functions
export {
  // Collections
  getCollections,
  getCollection,
  COLLECTIONS,

  // Texts
  getText,
  getAllTexts,
  getTextsInCollection,
  queryTexts,

  // Situational recommendations
  getTextsForSituation,

  // Relationships
  buildContentGraph,
  getRelatedTexts,
  generateReadingPath,
} from './loader';
