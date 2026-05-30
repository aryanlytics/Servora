import Redis from "ioredis";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("redis");

/**
 * Create a Redis client with connection handling.
 */
export function createRedisClient(url?: string): Redis {
  const redisUrl = url ?? process.env.REDIS_URL ?? "redis://localhost:6379";
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 3000);
      return delay;
    },
  });

  client.on("connect", () => {
    logger.info("Redis connected");
  });

  client.on("error", (err) => {
    logger.error("Redis connection error:", err);
  });

  client.on("close", () => {
    logger.warn("Redis connection closed");
  });

  return client;
}
