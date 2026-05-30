import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import dotenv from "dotenv";
import { createLogger } from "@servora/shared-utils";
import { createRedisClient } from "@servora/database";
import { socketAuthMiddleware, type AuthenticatedSocket } from "./middleware/socket-auth";
import { registerBookingHandlers } from "./handlers/booking.handler";
import { registerChatHandlers } from "./handlers/chat.handler";

dotenv.config({ path: "../../.env" });

const logger = createLogger("realtime-service");
const PORT = process.env.REALTIME_SERVICE_PORT ?? 4006;

// ─── HTTP + Socket.io Server ─────────────────────────────
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ─── Redis Adapter (cross-instance sync) ─────────────────
async function setupRedisAdapter() {
  try {
    const pubClient = createRedisClient(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    logger.info("Redis adapter connected");
  } catch (error) {
    logger.warn("Redis adapter failed, running without it:", error);
  }
}

// ─── Redis Subscriber (service events) ───────────────────
async function setupEventSubscriber() {
  const subscriber = createRedisClient(process.env.REDIS_URL);

  // Subscribe to service events
  const channels = [
    "booking:new",
    "booking:status_changed",
    "booking:reviewed",
    "notification:new",
  ];

  for (const channel of channels) {
    await subscriber.subscribe(channel);
  }

  subscriber.on("message", (channel: string, message: string) => {
    try {
      const payload = JSON.parse(message);
      logger.debug(`Received event: ${channel}`);

      switch (channel) {
        case "booking:new":
          // Notify the worker about the new booking
          io.to(`user:${payload.data.workerId}`).emit("booking:new", payload.data);
          break;

        case "booking:status_changed":
          // Notify both customer and worker
          io.to(`user:${payload.data.customerId}`).emit("booking:status_changed", payload.data);
          io.to(`user:${payload.data.workerId}`).emit("booking:status_changed", payload.data);
          // Also emit to booking-specific room
          io.to(`booking:${payload.data.bookingId}`).emit("booking:status_changed", payload.data);
          break;

        case "booking:reviewed":
          io.to(`user:${payload.data.workerId}`).emit("booking:reviewed", payload.data);
          break;

        case "notification:new":
          io.to(`user:${payload.data.userId}`).emit("notification:new", payload.data);
          break;
      }
    } catch (error) {
      logger.error(`Failed to process event ${channel}:`, error);
    }
  });

  logger.info("Event subscriber ready");
}

// ─── Socket Authentication ───────────────────────────────
io.use(socketAuthMiddleware);

// ─── Connection Handler ──────────────────────────────────
io.on("connection", (socket: AuthenticatedSocket) => {
  logger.info(`Client connected: ${socket.userEmail} (${socket.id})`);

  // Join user-specific room
  socket.join(`user:${socket.userId}`);

  // Register domain handlers
  registerBookingHandlers(io, socket);
  registerChatHandlers(io, socket);

  // Worker availability
  socket.on("worker:available", () => {
    socket.broadcast.emit("worker:status_changed", {
      workerId: socket.userId,
      isAvailable: true,
    });
  });

  socket.on("worker:unavailable", () => {
    socket.broadcast.emit("worker:status_changed", {
      workerId: socket.userId,
      isAvailable: false,
    });
  });

  socket.on("disconnect", (reason) => {
    logger.info(`Client disconnected: ${socket.userEmail} (${reason})`);
  });
});

// ─── Start Server ────────────────────────────────────────
async function start() {
  await setupRedisAdapter();
  await setupEventSubscriber();

  httpServer.listen(PORT, () => {
    logger.info(`Realtime Service running on port ${PORT}`);
  });
}

start();
