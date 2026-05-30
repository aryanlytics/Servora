// ─── Chat Types ──────────────────────────────────────────

export type MessageType = "text" | "image" | "system";

export interface ILastMessage {
  content: string;
  senderId: string;
  sentAt: Date;
}

export interface IConversation {
  _id: string;
  bookingId: string;
  participants: [string, string]; // customerId, workerId
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  readBy: string[];
  createdAt: Date;
}
