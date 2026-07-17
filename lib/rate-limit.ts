/**
 * Lightweight in-memory rate limiter (sliding window). Serverless
 * instances don't share memory, so this is best-effort abuse
 * protection — combined with the form honeypots it stops casual
 * spamming and brute-force loops without adding infrastructure.
 */
const buckets = new Map<string, number[]>();

const MAX_BUCKETS = 5000;

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Cheap cleanup so the map can't grow without bound.
  if (buckets.size > MAX_BUCKETS) buckets.clear();

  const hits = (buckets.get(key) ?? []).filter((t) => t > windowStart);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
