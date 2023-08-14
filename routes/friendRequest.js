import express from "express";
import { auth } from "../middleware/auth.js";
import {
  sendFriendRequest,
  getFriendRequests,
} from "../controllers/friendRequest.js";

const router = express.Router();

router.post("/send-friend-request", auth, sendFriendRequest);
router.get("/get-friend-requests/:userId", auth, getFriendRequests);

export default router;
