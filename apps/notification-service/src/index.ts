import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createLogger, ApiResponse, AppError } from "@servora/shared-utils";
import { connectMongoDB } from "@servora/database";
import notificationRoutes from "./routes/notification.routes";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const logger = createLogger("notification-service");
const PORT = process.env.NOTIFICATION_SERVICE_PORT ?? 4005;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "notification-service", timestamp: new Date().toISOString() });
});

app.use("/", notificationRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message));
    return;
  }
  logger.error("Unhandled error:", err);
  res.status(500).json(ApiResponse.error("Internal server error"));
});

async function start() {
  try {
    await connectMongoDB(MONGODB_URI, "servora_notifications");
    app.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start Notification Service:", error);
    process.exit(1);
  }
}

start();

export default app;
