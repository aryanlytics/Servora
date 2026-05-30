import type { Server } from "socket.io";
import type { AuthenticatedSocket } from "../middleware/socket-auth";
import { createLogger } from "@servora/shared-utils";

const logger = createLogger("chat-handler");

/**
 * Register chat-related socket event handlers.
 */
export function registerChatHandlers(io: Server, socket: AuthenticatedSocket): void {
  const userId = socket.userId!;

  // Join a conversation room
  socket.on("chat:join", (conversationId: string) => {
    socket.join(`chat:${conversationId}`);
    logger.debug(`${userId} joined chat room: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("chat:leave", (conversationId: string) => {
    socket.leave(`chat:${conversationId}`);
  });

  // Send a message (real-time path)
  socket.on("chat:send_message", (data: { conversationId: string; content: string; type?: string }) => {
    const message = {
      conversationId: data.conversationId,
      senderId: userId,
      content: data.content,
      type: data.type ?? "text",
      createdAt: new Date(),
    };

    // Broadcast to all participants in the conversation room
    io.to(`chat:${data.conversationId}`).emit("chat:new_message", message);
    logger.debug(`Message sent to chat:${data.conversationId}`);
  });

  // Typing indicator
  socket.on("chat:typing", (data: { conversationId: string; isTyping: boolean }) => {
    socket.to(`chat:${data.conversationId}`).emit("chat:typing", {
      userId,
      isTyping: data.isTyping,
    });
  });

  // Read receipt
  socket.on("chat:read", (data: { conversationId: string }) => {
    socket.to(`chat:${data.conversationId}`).emit("chat:read", {
      userId,
      conversationId: data.conversationId,
    });
  });
}
