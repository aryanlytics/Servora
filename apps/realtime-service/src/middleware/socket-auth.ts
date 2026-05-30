import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("socket-auth");

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

/**
 * Socket.io authentication middleware.
 * Verifies JWT from the handshake auth payload.
 */
export function socketAuthMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): void {
  const token = socket.handshake.auth?.token;

  if (!token) {
    logger.warn("Socket connection rejected: No token provided");
    next(new Error("Authentication required"));
    return;
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET ?? "default-secret";
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
    };

    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    socket.userEmail = decoded.email;

    logger.debug(`Socket authenticated: ${decoded.email}`);
    next();
  } catch {
    logger.warn("Socket connection rejected: Invalid token");
    next(new Error("Invalid token"));
  }
}
