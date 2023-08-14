import express from "express";
import { auth } from "../middleware/auth.js";

import {
  Invite,
  AcceptInvite,
  pendingInvites,
  joinedGroups,
  getGroupMemberInfo,
  getAllGroupMembers,
} from "../controllers/groupMember.js";

const router = express.Router();

router.post("/send-invite", auth, Invite);
router.patch("/accept-invite/:id", auth, AcceptInvite);
router.get("/pending-invite", auth, pendingInvites);
router.get("/joined-groups", auth, joinedGroups);
router.get("/get-group-member-info/:id", auth, getGroupMemberInfo);
router.get("/get-All-Group-Members/:id", auth, getAllGroupMembers);

export default router;
