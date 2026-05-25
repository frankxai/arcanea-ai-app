/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arc Protocol — In-Memory Store
 *
 * Shared store for arc objects. Temporary until Supabase auth
 * and persistent storage are configured.
 *
 * Note: In edge runtime on Vercel, each isolate gets its own
 * module-level state. This store is per-isolate, which is fine
 * for development. For production, replace with Supabase calls.
 */

import type { Arc } from '../../../../packages/arc-protocol/src/types';

// Singleton store — shared across all API routes within the same isolate
const store = new Map<string, Arc>();

export function getArcStore(): Map<string, Arc> {
  return store;
}
