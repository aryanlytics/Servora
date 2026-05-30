import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createLogger, ApiResponse, AppError } from "@servora/shared-utils";
import { connectMongoDB } from "@servora/database";
import authRoutes from "./routes/auth.routes";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const logger = createLogger("auth-service");
const PORT = process.env.AUTH_SERVICE_PORT ?? 4001;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

// ─── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service", timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────
app.use("/", authRoutes);

// ─── Error Handler ───────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message));
    return;
  }
  logger.error("Unhandled error:", err);
  res.status(500).json(ApiResponse.error("Internal server error"));
});

// ─── Start ───────────────────────────────────────────────
async function start() {
  try {
    await connectMongoDB(MONGODB_URI, "servora_auth");
    app.listen(PORT, () => {
      logger.info(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start Auth Service:", error);
    process.exit(1);
  }
}

start();

export default app;
