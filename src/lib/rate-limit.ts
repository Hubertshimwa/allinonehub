import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const limiter = redisUrl && redisToken ? new Ratelimit({ redis: new Redis({ url: redisUrl, token: redisToken }), limiter: Ratelimit.slidingWindow(5, "1 m"), analytics: true, prefix: "allinonehub:api" }) : null;

export async function checkRateLimit(identifier: string) {
  if (!limiter) return { success: true, remaining: 999 };
  return limiter.limit(identifier);
}
