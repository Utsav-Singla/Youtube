import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/read", protect, markAsRead);
router.get("/unread-count", protect, getUnreadCount);

export default router;
