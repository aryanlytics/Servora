import { Router } from "express";
import { getConversations, getMessages, sendMessage, markAsRead } from "../controllers/chat.controller";

const router: Router = Router();

router.get("/conversations", getConversations);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", sendMessage);
router.patch("/conversations/:id/read", markAsRead);

export default router;
