import type { Request, Response, NextFunction } from "express";
import { UserProfile } from "../models/user-profile.model";
import {
  ApiResponse,
  NotFoundError,
  updateProfileSchema,
  locationUpdateSchema,
  workerSearchSchema,
} from "@servora/shared-utils";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const profile = await UserProfile.findOne({ authId: userId });
    if (!profile) {
      throw new NotFoundError("Profile not found");
    }
    res.json(ApiResponse.success(profile));
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const validated = updateProfileSchema.parse(req.body);

    const profile = await UserProfile.findOneAndUpdate(
      { authId: userId },
      { $set: validated },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    res.json(ApiResponse.success(profile, "Profile updated"));
  } catch (error) {
    next(error);
  }
}

export async function searchWorkers(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = workerSearchSchema.parse(req.query);
    const { service, longitude, latitude, radius, page, limit } = validated;

    const query: Record<string, unknown> = {
      role: "worker",
      isAvailable: true,
    };

    if (service) {
      query.services = { $in: [service] };
    }

    if (longitude !== undefined && latitude !== undefined) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const skip = (page - 1) * limit;
    const [workers, total] = await Promise.all([
      UserProfile.find(query).skip(skip).limit(limit).lean(),
      UserProfile.countDocuments(query),
    ]);

    res.json(ApiResponse.paginated(workers, { page, limit, total }));
  } catch (error) {
    next(error);
  }
}

export async function getWorkerById(req: Request, res: Response, next: NextFunction) {
  try {
    const worker = await UserProfile.findById(req.params.id);
    if (!worker || worker.role !== "worker") {
      throw new NotFoundError("Worker not found");
    }
    res.json(ApiResponse.success(worker));
  } catch (error) {
    next(error);
  }
}

export async function toggleAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const profile = await UserProfile.findOne({ authId: userId });
    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    profile.isAvailable = !profile.isAvailable;
    await profile.save();

    res.json(ApiResponse.success({ isAvailable: profile.isAvailable }, "Availability updated"));
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { longitude, latitude } = locationUpdateSchema.parse(req.body);

    const profile = await UserProfile.findOneAndUpdate(
      { authId: userId },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true }
    );

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    res.json(ApiResponse.success(profile, "Location updated"));
  } catch (error) {
    next(error);
  }
}
