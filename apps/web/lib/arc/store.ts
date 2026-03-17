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
