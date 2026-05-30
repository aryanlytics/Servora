import type { Request, Response, NextFunction } from "express";
import { Booking } from "../models/booking.model";
import {
  ApiResponse,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  createBookingSchema,
  reviewSchema,
  paginationSchema,
} from "@servora/shared-utils";
import { publishEvent } from "../services/event.service";

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["accepted", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: ["rated"],
};

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const validated = createBookingSchema.parse(req.body);

    const booking = await Booking.create({
      customerId: userId,
      workerId: validated.workerId,
      service: validated.service,
      description: validated.description,
      scheduledAt: new Date(validated.scheduledAt),
      location: {
        type: "Point",
        coordinates: [validated.location.longitude, validated.location.latitude],
        address: validated.location.address,
      },
      pricing: {
        estimatedCost: validated.estimatedCost ?? 0,
        currency: "INR",
      },
      statusHistory: [{ status: "pending", timestamp: new Date() }],
    });

    // Publish event for real-time notification
    await publishEvent("booking:new", {
      bookingId: booking._id,
      customerId: userId,
      workerId: validated.workerId,
      service: validated.service,
    });

    res.status(201).json(ApiResponse.success(booking, "Booking created"));
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const role = req.headers["x-user-role"] as string;
    const { page, limit } = paginationSchema.parse(req.query);

    const query = role === "worker" ? { workerId: userId } : { customerId: userId };
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(query),
    ]);

    res.json(ApiResponse.paginated(bookings, { page, limit, total }));
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    res.json(ApiResponse.success(booking));
  } catch (error) {
    next(error);
  }
}

async function transitionStatus(
  bookingId: string,
  userId: string,
  userRole: string,
  targetStatus: string,
  note?: string
) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  // Verify authorization
  if (userRole === "worker" && booking.workerId !== userId) {
    throw new ForbiddenError("Not authorized for this booking");
  }
  if (userRole === "customer" && booking.customerId !== userId) {
    throw new ForbiddenError("Not authorized for this booking");
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[booking.status];
  if (!allowed || !allowed.includes(targetStatus)) {
    throw new BadRequestError(`Cannot transition from ${booking.status} to ${targetStatus}`);
  }

  booking.status = targetStatus as typeof booking.status;
  booking.statusHistory.push({
    status: targetStatus as any,
    timestamp: new Date(),
    note,
  });
  await booking.save();

  // Publish status change event
  await publishEvent("booking:status_changed", {
    bookingId: booking._id,
    customerId: booking.customerId,
    workerId: booking.workerId,
    status: targetStatus,
  });

  return booking;
}

export async function acceptBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const booking = await transitionStatus(req.params.id as string, userId, "worker", "accepted");
    res.json(ApiResponse.success(booking, "Booking accepted"));
  } catch (error) {
    next(error);
  }
}

export async function rejectBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const booking = await transitionStatus(req.params.id as string, userId, "worker", "cancelled", "Rejected by worker");
    res.json(ApiResponse.success(booking, "Booking rejected"));
  } catch (error) {
    next(error);
  }
}

export async function startBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const booking = await transitionStatus(req.params.id as string, userId, "worker", "in_progress");
    res.json(ApiResponse.success(booking, "Booking started"));
  } catch (error) {
    next(error);
  }
}

export async function completeBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const booking = await transitionStatus(req.params.id as string, userId, "worker", "completed");
    res.json(ApiResponse.success(booking, "Booking completed"));
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const role = req.headers["x-user-role"] as string;
    const booking = await transitionStatus(req.params.id as string, userId, role, "cancelled", req.body.reason);
    res.json(ApiResponse.success(booking, "Booking cancelled"));
  } catch (error) {
    next(error);
  }
}

export async function submitReview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const validated = reviewSchema.parse(req.body);

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    if (booking.customerId !== userId) {
      throw new ForbiddenError("Only the customer can review");
    }
    if (booking.status !== "completed") {
      throw new BadRequestError("Can only review completed bookings");
    }

    booking.review = {
      rating: validated.rating,
      comment: validated.comment,
      createdAt: new Date(),
    };
    booking.status = "rated";
    booking.statusHistory.push({ status: "rated", timestamp: new Date() });
    await booking.save();

    // Publish review event
    await publishEvent("booking:reviewed", {
      bookingId: booking._id,
      workerId: booking.workerId,
      rating: validated.rating,
    });

    res.json(ApiResponse.success(booking, "Review submitted"));
  } catch (error) {
    next(error);
  }
}
