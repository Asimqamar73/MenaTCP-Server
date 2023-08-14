import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createGroupComment,
  deleteGroupComment,
  fetchAllGroupComments,
} from "../controllers/groupComments.js";

const router = express.Router();

router.post("/create-group-comment", auth, createGroupComment);
router.delete("/delete-group-comment/:id", auth, deleteGroupComment);
router.get("/get-allgroupcomments/:id", auth, fetchAllGroupComments);

export default router;
