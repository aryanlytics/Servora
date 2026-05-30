import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  cancelBooking,
  submitReview,
} from "../controllers/booking.controller";

const router: Router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.patch("/:id/accept", acceptBooking);
router.patch("/:id/reject", rejectBooking);
router.patch("/:id/start", startBooking);
router.patch("/:id/complete", completeBooking);
router.patch("/:id/cancel", cancelBooking);
router.post("/:id/review", submitReview);

export default router;
