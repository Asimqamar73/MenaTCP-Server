import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createComment,
  deleteComment,
  fetchAllComments,
  createGroupComment,
} from "../controllers/comments.js";

const router = express.Router();

router.post("/create-comment", auth, createComment);
router.delete("/delete-comment/:id", auth, deleteComment);
router.get("/get-allcomments/:id", auth, fetchAllComments);
router.post("/create-group-comment", auth, createGroupComment);

export default router;
