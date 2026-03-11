/**
 * Arcanea Intelligence Gateway — Rate Limiter
 *
 * Token bucket algorithm with per-key sliding window rate limiting.
 * Tiered to match the pricing model: Seeker, Creator, Studio.
 *
 * Edge-runtime compatible — no Node.js APIs, no external dependencies.
 */

// ─── Types ──────────────────────────────────────────────────────────

export type RateLimitTier = 'seeker' | 'creator' | 'studio';

export interface TierConfig {
  /** Maximum requests per minute */
  requestsPerMinute: number;
  /** Maximum tokens per day (-1 = unlimited) */
  tokensPerDay: number;
  /** Display name for headers/errors */
  label: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the request window resets */
  resetAt: number;
  /** Remaining daily token budget (-1 = unlimited) */
  tokensRemaining: number;
  /** The tier that was evaluated */
  tier: RateLimitTier;
}

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'X-RateLimit-Tier': string;
  'X-RateLimit-Tokens-Remaining': string;
}

// ─── Tier Configuration ─────────────────────────────────────────────

export const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  seeker: {
    requestsPerMinute: 10,
    tokensPerDay: 100_000,
    label: 'Seeker (Free)',
  },
  creator: {
    requestsPerMinute: 60,
    tokensPerDay: 5_000_000,
    label: 'Creator',
  },
  studio: {
    requestsPerMinute: 300,
    tokensPerDay: -1,
    label: 'Studio',
  },
};

// ─── Sliding Window Bucket ──────────────────────────────────────────

interface RequestEntry {
  timestamp: number;
}

interface TokenBucket {
  /** Sliding window of request timestamps within the current minute */
  requests: RequestEntry[];
  /** Token usage: keyed by day string (YYYY-MM-DD) */
  tokensByDay: Map<string, number>;
}

/** In-memory store: key -> bucket */
const buckets = new Map<string, TokenBucket>();

/** Interval tracking for cleanup (module-level, avoids leaks on re-import) */
let cleanupScheduled = false;

const WINDOW_MS = 60_000; // 1 minute sliding window
const DAY_MS = 86_400_000; // 24 hours
const CLEANUP_INTERVAL_MS = 120_000; // 2 minutes
const MAX_BUCKET_AGE_MS = 600_000; // 10 minutes without activity = evict

/**
 * Schedule periodic cleanup of stale buckets.
 * Safe for edge runtime: uses only setTimeout/setInterval equivalents
 * that exist in the Web API standard.
 */
function ensureCleanup(): void {
  if (cleanupScheduled) return;
  cleanupScheduled = true;

  // Use a self-rescheduling setTimeout pattern for edge compatibility.
  // setInterval is available on edge runtimes too, but setTimeout
  // is guaranteed and avoids holding the runtime open.
  const run = () => {
    evictStaleBuckets();
    // Only reschedule if there are still buckets to manage
    if (buckets.size > 0) {
      setTimeout(run, CLEANUP_INTERVAL_MS);
    } else {
      cleanupScheduled = false;
    }
  };
  setTimeout(run, CLEANUP_INTERVAL_MS);
}

/**
 * Remove buckets that have not received traffic recently,
 * and prune old day-level token counters.
 */
function evictStaleBuckets(): void {
  const now = Date.now();
  const todayKey = getDayKey(now);

  for (const [key, bucket] of buckets) {
    // Prune request entries older than the window
    bucket.requests = bucket.requests.filter(
      (r) => now - r.timestamp < WINDOW_MS,
    );

    // Prune token days older than today
    for (const dayKey of bucket.tokensByDay.keys()) {
      if (dayKey !== todayKey) {
        bucket.tokensByDay.delete(dayKey);
      }
    }

    // Evict entirely if no recent requests and no today-token usage
    const latestRequest = bucket.requests[bucket.requests.length - 1];
    const hasRecentActivity =
      latestRequest && now - latestRequest.timestamp < MAX_BUCKET_AGE_MS;
    const hasTodayTokens = bucket.tokensByDay.has(todayKey);

    if (!hasRecentActivity && !hasTodayTokens) {
      buckets.delete(key);
    }
  }
}

function getDayKey(timestamp: number): string {
  // UTC date string: YYYY-MM-DD
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getOrCreateBucket(key: string): TokenBucket {
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = {
      requests: [],
      tokensByDay: new Map(),
    };
    buckets.set(key, bucket);
    ensureCleanup();
  }
  return bucket;
}

// ─── Core Rate Limit Check ──────────────────────────────────────────

/**
 * Check whether a request is allowed under the rate limit for the given
 * key and tier. This uses a sliding window: it counts all requests from
 * the past 60 seconds rather than fixed calendar minutes.
 *
 * @param key   - Unique identifier (user ID, API key, IP address, etc.)
 * @param tier  - The pricing tier to evaluate against
 * @returns       RateLimitResult with allow/deny decision and metadata
 */
export function checkRateLimit(
  key: string,
  tier: RateLimitTier = 'seeker',
): RateLimitResult {
  const config = TIER_CONFIGS[tier];
  const now = Date.now();
  const bucket = getOrCreateBucket(key);

  // ── Sliding window: discard requests older than 1 minute ──
  const windowStart = now - WINDOW_MS;
  bucket.requests = bucket.requests.filter((r) => r.timestamp > windowStart);

  const currentCount = bucket.requests.length;

  // ── Check request rate ──
  if (currentCount >= config.requestsPerMinute) {
    // Find when the oldest request in the window expires
    const oldestInWindow = bucket.requests[0];
    const resetAt = oldestInWindow
      ? oldestInWindow.timestamp + WINDOW_MS
      : now + WINDOW_MS;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      tokensRemaining: getTokensRemaining(bucket, config, now),
      tier,
    };
  }

  // ── Check daily token budget ──
  const tokensRemaining = getTokensRemaining(bucket, config, now);
  if (config.tokensPerDay !== -1 && tokensRemaining <= 0) {
    // Token budget exhausted — deny even though request rate is fine
    const tomorrow = getNextDayResetTimestamp(now);
    return {
      allowed: false,
      remaining: config.requestsPerMinute - currentCount,
      resetAt: tomorrow,
      tokensRemaining: 0,
      tier,
    };
  }

  // ── Allowed: record the request ──
  bucket.requests.push({ timestamp: now });

  const remaining = config.requestsPerMinute - (currentCount + 1);
  // Reset time: when the oldest entry in the current window expires
  const oldestInWindow = bucket.requests[0];
  const resetAt = oldestInWindow
    ? oldestInWindow.timestamp + WINDOW_MS
    : now + WINDOW_MS;

  return {
    allowed: true,
    remaining,
    resetAt,
    tokensRemaining: getTokensRemaining(bucket, config, now),
    tier,
  };
}

// ─── Token Budget ───────────────────────────────────────────────────

/**
 * Record token consumption for a key. Call this after a successful
 * completion to track daily token usage.
 *
 * @param key    - Same key used in checkRateLimit
 * @param tokens - Number of tokens consumed (prompt + completion)
 */
export function recordTokenUsage(key: string, tokens: number): void {
  const bucket = getOrCreateBucket(key);
  const dayKey = getDayKey(Date.now());
  const current = bucket.tokensByDay.get(dayKey) ?? 0;
  bucket.tokensByDay.set(dayKey, current + tokens);
}

/**
 * Get the remaining daily token budget for a key.
 *
 * @param key  - Same key used in checkRateLimit
 * @param tier - Pricing tier
 * @returns      Remaining tokens (-1 = unlimited)
 */
export function getTokenBudget(key: string, tier: RateLimitTier): number {
  const config = TIER_CONFIGS[tier];
  if (config.tokensPerDay === -1) return -1;

  const bucket = buckets.get(key);
  if (!bucket) return config.tokensPerDay;

  return getTokensRemaining(bucket, config, Date.now());
}

function getTokensRemaining(
  bucket: TokenBucket,
  config: TierConfig,
  now: number,
): number {
  if (config.tokensPerDay === -1) return -1;

  const dayKey = getDayKey(now);
  const used = bucket.tokensByDay.get(dayKey) ?? 0;
  return Math.max(0, config.tokensPerDay - used);
}

function getNextDayResetTimestamp(now: number): number {
  const d = new Date(now);
  // Next UTC midnight
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

// ─── Response Headers Helper ────────────────────────────────────────

/**
 * Build standard X-RateLimit-* headers from a rate limit result.
 * Attach these to every response (both allowed and denied) so clients
 * can implement backoff and display quota info.
 *
 * @param result - The result from checkRateLimit()
 * @returns        A plain object of header name-value pairs
 */
export function rateLimitHeaders(result: RateLimitResult): RateLimitHeaders {
  const config = TIER_CONFIGS[result.tier];
  return {
    'X-RateLimit-Limit': String(config.requestsPerMinute),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    'X-RateLimit-Tier': result.tier,
    'X-RateLimit-Tokens-Remaining':
      result.tokensRemaining === -1
        ? 'unlimited'
        : String(result.tokensRemaining),
  };
}

// ─── Utilities ──────────────────────────────────────────────────────

/**
 * Resolve a tier from an optional user/subscription context.
 * This is a placeholder — in production, look up the user's subscription
 * from Supabase or a JWT claim.
 *
 * @param tierHint - An explicit tier string, or undefined for default
 * @returns          A validated RateLimitTier
 */
export function resolveTier(tierHint?: string): RateLimitTier {
  if (
    tierHint === 'seeker' ||
    tierHint === 'creator' ||
    tierHint === 'studio'
  ) {
    return tierHint;
  }
  return 'seeker';
}

/**
 * Get a snapshot of the current store size (for observability).
 * Useful in health-check endpoints.
 */
export function getRateLimiterStats(): {
  activeBuckets: number;
  tiers: Record<string, number>;
} {
  return {
    activeBuckets: buckets.size,
    tiers: {
      // Not tracked per-tier in-memory; would need external store
      total: buckets.size,
    },
  };
}

/**
 * Reset rate limit state for a specific key.
 * Useful for admin overrides or testing.
 */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Reset all rate limit state.
 * Use only in tests.
 */
export function resetAllRateLimits(): void {
  buckets.clear();
}
