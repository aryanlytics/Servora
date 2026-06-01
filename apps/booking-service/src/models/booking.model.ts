import mongoose, { Schema, type Document } from "mongoose";
import type { IBooking, BookingStatus } from "@servora/shared-types";

export interface IBookingDocument extends Omit<IBooking, "_id">, Document {}

const bookingSchema = new Schema<IBookingDocument>(
  {
    customerId: { type: String, required: true, index: true },
    workerId: { type: String, required: true, index: true },
    service: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled", "rated"] as BookingStatus[],
      default: "pending",
      index: true,
    },
    scheduledAt: { type: Date, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true },
    },
    pricing: {
      estimatedCost: { type: Number, default: 0 },
      finalCost: { type: Number },
      currency: { type: String, default: "INR" },
    },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Geospatial index on booking locati
bookingSchema.index({ location: "2dsphere" });

export const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
