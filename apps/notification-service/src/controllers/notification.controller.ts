import type { Request, Response, NextFunction } from "express";
import { Notification } from "../models/notification.model";
import { ApiResponse, NotFoundError, paginationSchema } from "@servora/shared-utils";

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { page, limit } = paginationSchema.parse(req.query);
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId }),
    ]);

    res.json(ApiResponse.paginated(notifications, { page, limit, total }));
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    res.json(ApiResponse.success(notification));
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json(ApiResponse.success(null, "All notifications marked as read"));
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.json(ApiResponse.success({ count }));
  } catch (error) {
    next(error);
  }
}
