import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createLogger, ApiResponse, AppError } from "@servora/shared-utils";
import { connectMongoDB } from "@servora/database";
import userRoutes from "./routes/user.routes";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const logger = createLogger("user-service");
const PORT = process.env.USER_SERVICE_PORT ?? 4002;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "user-service", timestamp: new Date().toISOString() });
});

app.use("/", userRoutes);

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
    await connectMongoDB(MONGODB_URI, "servora_users");
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start User Service:", error);
    process.exit(1);
  }
}

start();

export default app;
