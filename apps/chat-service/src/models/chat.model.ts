import mongoose, { Schema, type Document } from "mongoose";
import type { IConversation, IMessage, MessageType } from "@servora/shared-types";

// ─── Conversation Model ─────────────────────────────────
export interface IConversationDocument extends Omit<IConversation, "_id">, Document {}

const conversationSchema = new Schema<IConversationDocument>(
  {
    bookingId: { type: String, required: true, index: true },
    participants: { type: [String], required: true },
    lastMessage: {
      content: { type: String },
      senderId: { type: String },
      sentAt: { type: Date },
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversationDocument>(
  "Conversation",
  conversationSchema
);

// ─── Message Model ───────────────────────────────────────
export interface IMessageDocument extends Omit<IMessage, "_id">, Document {}

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "system"] as MessageType[],
      default: "text",
    },
    readBy: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessageDocument>("Message", messageSchema);
