import express from "express";
import { auth } from "../middleware/auth.js";
import {
  fetchAllNotifications,
  fetchNotifications,
  sendNotificationToAll,
  viewedNotification,
} from "../controllers/notifications.js";

const router = express.Router();
router.get("/get-allNotifications", auth, fetchAllNotifications);
router.post("/read-notification", auth, viewedNotification);
router.post("/pushNotification", auth, sendNotificationToAll);
router.get("/pushNotfications", auth, fetchNotifications);

export default router;
