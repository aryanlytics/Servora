import mongoose, { Schema, type Document } from "mongoose";
import type { IUserProfile, UserRole } from "@servora/shared-types";

export interface IUserProfileDocument extends Omit<IUserProfile, "_id">, Document {}

const userProfileSchema = new Schema<IUserProfileDocument>(
  {
    authId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "worker", "admin"] as UserRole[],
      required: true,
    },
    // Worker-specific fields
    services: { type: [String], default: [] },
    bio: { type: String, default: "" },
    hourlyRate: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
userProfileSchema.index({ location: "2dsphere" });

// Compound index for worker search
userProfileSchema.index({ role: 1, isAvailable: 1, services: 1 });

export const UserProfile = mongoose.model<IUserProfileDocument>(
  "UserProfile",
  userProfileSchema
);
