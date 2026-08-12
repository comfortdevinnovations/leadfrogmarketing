import "server-only";

/**
 * Sliding-window rate limiter held in process memory.
 *
 * RAM-only and per-instance by design: counters reset on cold start and are not
 * shared between serverless instances, so this is friction against casual abuse
 * rather than a hard guarantee. Moving to a shared store (Redis, Upstash) is the
 * upgrade path if the form ever attracts determined spam.
 */

export const RATE_LIMIT = {
  max: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Ceiling on distinct tracked keys, so a flood of one-request-each callers
 * cannot grow the map without bound.
 */
const MAX_TRACKED_KEYS = 10_000;

/** key -> ascending timestamps of allowed requests still inside the window. */
const hits = new Map<string, number[]>();
let lastSweepAt = 0;

/** Drops timestamps that have aged out. Entries are appended in order, so the
 *  expired ones are always a prefix. */
function prune(times: number[], now: number): number[] {
  let firstLive = 0;
  while (
    firstLive < times.length &&
    now - times[firstLive] >= RATE_LIMIT.windowMs
  ) {
    firstLive++;
  }
  return firstLive === 0 ? times : times.slice(firstLive);
}

function sweep(now: number): void {
  for (const [key, times] of hits) {
    const live = prune(times, now);
    if (live.length) hits.set(key, live);
    else hits.delete(key);
  }
  lastSweepAt = now;
}

function enforceMemoryCap(now: number): void {
  if (hits.size <= MAX_TRACKED_KEYS) return;

  sweep(now);
  if (hits.size <= MAX_TRACKED_KEYS) return;

  // Still over budget: drop the least recently active keys. Evicting an entry
  // only ever forgives past requests, it can never invent them.
  const byLastSeen = [...hits.entries()].sort(
    (a, b) => a[1][a[1].length - 1] - b[1][b[1].length - 1]
  );
  for (const [key] of byLastSeen.slice(0, hits.size - MAX_TRACKED_KEYS)) {
    hits.delete(key);
  }
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Checks every key against the same allowance and blocks if *any* of them is
 * spent — pass both the client id and the IP so clearing cookies doesn't reset
 * the count, and switching networks doesn't either.
 *
 * A blocked request is not recorded. Counting rejected attempts would let a
 * caller hammering the endpoint hold their own window open forever, so the
 * lockout would never drain.
 */
export function checkRateLimit(keys: string[]): RateLimitResult {
  const now = Date.now();

  if (now - lastSweepAt >= RATE_LIMIT.windowMs) sweep(now);

  const tracked = keys
    .filter(Boolean)
    .map((key) => [key, prune(hits.get(key) ?? [], now)] as const);

  // Free again only once every spent key has drained, hence the max.
  let blockedUntil = 0;
  for (const [, times] of tracked) {
    if (times.length >= RATE_LIMIT.max) {
      blockedUntil = Math.max(blockedUntil, times[0] + RATE_LIMIT.windowMs);
    }
  }

  if (blockedUntil) {
    // Persist the pruning work even on the reject path.
    for (const [key, times] of tracked) hits.set(key, times);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((blockedUntil - now) / 1000)),
    };
  }

  for (const [key, times] of tracked) hits.set(key, [...times, now]);
  enforceMemoryCap(now);

  return { allowed: true };
}
