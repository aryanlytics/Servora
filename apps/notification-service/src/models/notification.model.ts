import mongoose, { Schema, type Document } from "mongoose";
import type { INotification, NotificationType } from "@servora/shared-types";

export interface INotificationDocument extends Omit<INotification, "_id">, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        "booking_request",
        "booking_accepted",
        "booking_completed",
        "booking_cancelled",
        "new_message",
        "review_received",
        "system",
      ] as NotificationType[],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      bookingId: { type: String },
      senderId: { type: String },
      conversationId: { type: String },
    },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound index for user's unread notifications
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>(
  "Notification",
  notificationSchema
);
