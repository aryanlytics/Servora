import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createLogger } from "@servora/shared-utils";
import proxyRoutes from "./routes/proxy";
import { errorHandler } from "./middleware/error-handler";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const logger = createLogger("api-gateway");
const PORT = process.env.API_GATEWAY_PORT ?? 4000;

// ─── Global Middleware ───────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  credentials: true,
}));
app.use(morgan("short"));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
}));

// ─── Health Check ────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway", timestamp: new Date().toISOString() });
});

// ─── Proxy Routes ────────────────────────────────────────
app.use("/api", proxyRoutes);

// ─── Error Handler ───────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

export default app;
