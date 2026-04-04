/**
 * World Cache — In-memory cache for world discovery.
 * Reduces Supabase queries on the discovery page.
 *
 * Simple TTL cache — no external dependencies.
 * Works in serverless (per-instance), refreshes automatically.
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 60_000; // 1 minute

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, expires: Date.now() + ttl });
}

/**
 * Fetch with cache — wraps any async fetcher with TTL caching.
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL,
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}
