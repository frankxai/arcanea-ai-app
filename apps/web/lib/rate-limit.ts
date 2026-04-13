/**
 * Lightweight in-memory rate limiter for serverless functions.
 *
 * Uses a sliding window counter stored in a Map. Since each Vercel
 * function instance has its own memory, this provides per-instance
 * limiting — not globally distributed, but enough to stop abuse
 * from a single client hammering a single instance.
 *
 * For distributed rate limiting, upgrade to @upstash/ratelimit.
 */

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Evict expired entries every 60s to prevent memory leaks
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = { limit: 20, windowSeconds: 60 }
): { success: boolean; remaining: number; resetAt: number } {
  cleanup();
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: config.limit - 1, resetAt: now + windowMs };
  }

  entry.count++;
  if (entry.count > config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract a rate limit key from a request.
 * Uses IP (via Vercel headers) + pathname for per-route limiting.
 */
export function rateLimitKey(req: Request): string {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const url = new URL(req.url);
  return `${ip}:${url.pathname}`;
}
