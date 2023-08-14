import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createPost,
  getAllPosts,
  likedPosts,
  commentPosts,
  sharePost,
  getPostComments,
  followReq,
  userPosts,
  getAllLikes,
  deletePost,
  getPostById,
} from "../controllers/post.js";

const router = express.Router();

router.get("/all-posts", auth, getAllPosts);
router.get("/post/:postId", auth, getPostById);
router.post("/create-post", auth, createPost);
router.post("/liked-post", auth, likedPosts);
router.post("/comment-post", auth, commentPosts);
router.post("/share-post", auth, sharePost);
router.post("/getComments", auth, getPostComments);
router.post("/getLikes", auth, getAllLikes);
router.post("/setFollowers", auth, followReq);
router.post("/user-posts", auth, userPosts);
router.delete("/delete-post/:id", auth, deletePost);

export default router;
