/**
 * Configurable rate limiter with exponential backoff and jitter.
 * Used for downloads, API calls, and scroll automation.
 */
export class RateLimiter {
  private lastCall = 0;

  constructor(private delayMs: number) {}

  /** Wait until enough time has passed since last call */
  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastCall;
    if (elapsed < this.delayMs) {
      await sleep(this.delayMs - elapsed);
    }
    this.lastCall = Date.now();
  }

  /** Update the delay (e.g., when user changes settings) */
  setDelay(ms: number): void {
    this.delayMs = ms;
  }
}

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter for retry logic.
 * Returns delay in ms for the given attempt number.
 */
export function backoffDelay(attempt: number, baseMs = 2000, maxMs = 30000): number {
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseMs;
  return Math.min(exponential + jitter, maxMs);
}

/**
 * Randomized delay within a range (anti-detection pattern from imagine-loop).
 * Returns a delay between minFactor*base and base.
 */
export function randomizedDelay(baseMs: number, minFactor = 0.33): number {
  const min = baseMs * minFactor;
  return min + Math.random() * (baseMs - min);
}

/**
 * Execute a function with retry logic and exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs = 2000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxAttempts - 1) {
        await sleep(backoffDelay(attempt, baseDelayMs));
      }
    }
  }

  throw lastError ?? new Error('All retry attempts failed');
}
