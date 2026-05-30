import { z } from "zod";

// ─── Auth Validators ─────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["customer", "worker"]),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── User Profile Validators ─────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(10).max(15).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  services: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    })
    .optional(),
});

export const locationUpdateSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});

// ─── Booking Validators ──────────────────────────────────

export const createBookingSchema = z.object({
  workerId: z.string().min(1, "Worker ID is required"),
  service: z.string().min(1, "Service type is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  scheduledAt: z.string().datetime("Invalid date format"),
  location: z.object({
    longitude: z.number().min(-180).max(180),
    latitude: z.number().min(-90).max(90),
    address: z.string().min(1, "Address is required"),
  }),
  estimatedCost: z.number().positive().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters").max(500),
});

// ─── Chat Validators ─────────────────────────────────────

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000),
  type: z.enum(["text", "image"]).default("text"),
});

// ─── Query Validators ────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const workerSearchSchema = z.object({
  service: z.string().optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  radius: z.coerce.number().positive().max(100).default(10), // km
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
