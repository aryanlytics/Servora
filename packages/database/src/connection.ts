import mongoose from "mongoose";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("database");

/**
 * Connect to MongoDB with retry logic.
 * Each service calls this with its own database name.
 */
export async function connectMongoDB(
  uri: string,
  dbName: string
): Promise<typeof mongoose> {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await mongoose.connect(uri, {
        dbName,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`MongoDB connected: ${dbName}`);

      mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
      });

      return connection;
    } catch (error) {
      retries++;
      logger.error(
        `MongoDB connection failed (attempt ${retries}/${maxRetries}):`,
        error
      );
      if (retries === maxRetries) {
        throw new Error(
          `Failed to connect to MongoDB after ${maxRetries} attempts`
        );
      }
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, retries) * 1000)
      );
    }
  }

  throw new Error("Failed to connect to MongoDB");
}

/**
 * Gracefully disconnect from MongoDB.
 */
export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected gracefully");
}

/**
 * Health check for MongoDB connection.
 */
export function isMongoDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
