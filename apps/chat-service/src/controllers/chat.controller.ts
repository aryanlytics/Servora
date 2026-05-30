import type { Request, Response, NextFunction } from "express";
import { Conversation, Message } from "../models/chat.model";
import {
  ApiResponse,
  NotFoundError,
  sendMessageSchema,
  paginationSchema,
} from "@servora/shared-utils";

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(ApiResponse.success(conversations));
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ conversationId: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversationId: req.params.id }),
    ]);

    res.json(ApiResponse.paginated(messages.reverse(), { page, limit, total }));
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const validated = sendMessageSchema.parse(req.body);

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    const message = await Message.create({
      conversationId: req.params.id,
      senderId: userId,
      content: validated.content,
      type: validated.type,
      readBy: [userId],
    });

    // Update last message on conversation
    conversation.lastMessage = {
      content: validated.content,
      senderId: userId,
      sentAt: new Date(),
    };
    await conversation.save();

    res.status(201).json(ApiResponse.success(message, "Message sent"));
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;

    await Message.updateMany(
      {
        conversationId: req.params.id,
        readBy: { $ne: userId },
      },
      { $addToSet: { readBy: userId } }
    );

    res.json(ApiResponse.success(null, "Messages marked as read"));
  } catch (error) {
    next(error);
  }
}
