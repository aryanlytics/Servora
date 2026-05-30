// ─── Booking Types ───────────────────────────────────────

import type { ILocation } from "./user";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rated";

export interface IBookingLocation extends ILocation {
  address: string;
}

export interface IBookingPricing {
  estimatedCost: number;
  finalCost?: number;
  currency: string;
}

export interface IBookingReview {
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface IStatusHistoryEntry {
  status: BookingStatus;
  timestamp: Date;
  note?: string;
}

export interface IBooking {
  _id: string;
  customerId: string;
  workerId: string;
  service: string;
  description: string;
  status: BookingStatus;
  scheduledAt: Date;
  location: IBookingLocation;
  pricing: IBookingPricing;
  review?: IBookingReview;
  statusHistory: IStatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}
