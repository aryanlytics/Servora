import { Router } from "express";
import {
  getProfile,
  updateProfile,
  searchWorkers,
  getWorkerById,
  toggleAvailability,
  updateLocation,
} from "../controllers/user.controller";

const router: Router = Router();

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Workers
router.get("/workers", searchWorkers);
router.get("/workers/:id", getWorkerById);
router.patch("/workers/availability", toggleAvailability);
router.patch("/workers/location", updateLocation);

export default router;
