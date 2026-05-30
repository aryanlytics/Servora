import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authMiddleware } from "../middleware/auth";

const router: Router = Router();

// ─── Service URLs ────────────────────────────────────────
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL ?? "http://localhost:4001";
const USER_SERVICE = process.env.USER_SERVICE_URL ?? "http://localhost:4002";
const BOOKING_SERVICE = process.env.BOOKING_SERVICE_URL ?? "http://localhost:4003";
const CHAT_SERVICE = process.env.CHAT_SERVICE_URL ?? "http://localhost:4004";
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:4005";

// ─── Auth Routes (public) ────────────────────────────────
router.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/" },
  })
);

// ─── User Routes (protected) ─────────────────────────────
router.use(
  "/users",
  authMiddleware,
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/" },
  })
);

// ─── Booking Routes (protected) ──────────────────────────
router.use(
  "/bookings",
  authMiddleware,
  createProxyMiddleware({
    target: BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/bookings": "/" },
  })
);

// ─── Chat Routes (protected) ─────────────────────────────
router.use(
  "/chat",
  authMiddleware,
  createProxyMiddleware({
    target: CHAT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/chat": "/" },
  })
);

// ─── Notification Routes (protected) ─────────────────────
router.use(
  "/notifications",
  authMiddleware,
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/notifications": "/" },
  })
);

export default router;
