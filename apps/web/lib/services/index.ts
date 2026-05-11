/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arcanea Services - Barrel Export
 *
 * Central export point for all service modules.
 * Services provide core functionality for embedding, search, and AI operations.
 *
 * @module lib/services
 */

// ============================================
// EMBEDDING SERVICE
// ============================================

export {
  // Class
  EmbeddingService,
  // Singleton getter
  getEmbeddingService,
  // Convenience functions
  generateEmbedding,
  batchEmbeddings,
  chunkText,
  // Types
  type EmbeddingResult,
  type BatchEmbeddingResult,
  type TextChunk,
  type ChunkMetadata,
  type EmbeddingServiceConfig,
  // Re-export TaskType enum
  TaskType,
} from './embeddings';

// ============================================
// VECTOR SEARCH SERVICE
// ============================================

export {
  // Class
  VectorSearchService,
  // Singleton getter
  getVectorSearchService,
  // Convenience functions
  searchLore,
  searchCreations,
  findSimilar,
  // Types
  type LoreFragment,
  type LoreCategory,
  type CreationWithEmbedding,
  type SearchResult,
  type SearchOptions,
  type CreationSearchOptions,
} from './vector-search';
