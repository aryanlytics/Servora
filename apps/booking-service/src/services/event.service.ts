import { createRedisClient } from "@servora/database";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("booking-events");

let redisPublisher: ReturnType<typeof createRedisClient> | null = null;

function getPublisher() {
  if (!redisPublisher) {
    redisPublisher = createRedisClient(process.env.REDIS_URL);
  }
  return redisPublisher;
}

/**
 * Publish an event to Redis pub/sub for the realtime service to pick up.
 */
export async function publishEvent(channel: string, data: unknown): Promise<void> {
  try {
    const publisher = getPublisher();
    await publisher.publish(channel, JSON.stringify({ event: channel, data, timestamp: new Date() }));
    logger.debug(`Published event: ${channel}`);
  } catch (error) {
    logger.error(`Failed to publish event ${channel}:`, error);
  }
}
