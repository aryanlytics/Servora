import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createLogger, ApiResponse, AppError } from "@servora/shared-utils";
import { connectMongoDB } from "@servora/database";
import bookingRoutes from "./routes/booking.routes";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const logger = createLogger("booking-service");
const PORT = process.env.BOOKING_SERVICE_PORT ?? 4003;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "booking-service", timestamp: new Date().toISOString() });
});

app.use("/", bookingRoutes);

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
    await connectMongoDB(MONGODB_URI, "servora_bookings");
    app.listen(PORT, () => {
      logger.info(`Booking Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start Booking Service:", error);
    process.exit(1);
  }
}

start();

export default app;
