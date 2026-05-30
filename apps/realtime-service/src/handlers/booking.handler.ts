import type { Server } from "socket.io";
import type { AuthenticatedSocket } from "../middleware/socket-auth";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("booking-handler");

/**
 * Register booking-related socket event handlers.
 */
export function registerBookingHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Join user-specific room for receiving booking notifications
  const userId = socket.userId!;
  socket.join(`user:${userId}`);

  // Join a specific booking room to receive status updates
  socket.on("booking:join", (bookingId: string) => {
    socket.join(`booking:${bookingId}`);
    logger.debug(`${userId} joined booking room: ${bookingId}`);
  });

  // Leave a booking room
  socket.on("booking:leave", (bookingId: string) => {
    socket.leave(`booking:${bookingId}`);
    logger.debug(`${userId} left booking room: ${bookingId}`);
  });
}
