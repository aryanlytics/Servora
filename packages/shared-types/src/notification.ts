// ─── Notification Types ──────────────────────────────────

export type NotificationType =
  | "booking_request"
  | "booking_accepted"
  | "booking_completed"
  | "booking_cancelled"
  | "new_message"
  | "review_received"
  | "system";

export interface INotificationData {
  bookingId?: string;
  senderId?: string;
  conversationId?: string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: INotificationData;
  isRead: boolean;
  createdAt: Date;
}
