import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createGroupPost,
  getAllGroupPosts,
  likedGroupPosts,
  shareGroupPost,
  getAllGroupPostsById,
  //   commentGroupPosts,
  //   getGroupPostComments,
  //   followGroupReq,
  //   userGroupPosts,
  //   getAllGroupLikes,
  deleteGroupPostById,
  getGroupPostById,
} from "../controllers/groupPost.js";

const router = express.Router();

router.get("/all-group-posts", auth, getAllGroupPosts);
router.get("/group-post/:postId", auth, getGroupPostById);
router.post("/create-group-post", auth, createGroupPost);
router.post("/share-post", auth, shareGroupPost);
router.post("/liked-group-post", auth, likedGroupPosts);
// router.post("/comment-group-post", auth, commentGroupPosts);
// router.post("/getGroup-Comments", auth, getGroupPostComments);
// router.post("/getGroup-Likes", auth, getAllGroupLikes);
// router.post("/setGroup-Followers", auth, followGroupReq);
// router.post("/userGroup-posts", auth, userGroupPosts);
router.delete("/deleteGroup-post/:id", auth, deleteGroupPostById);
router.get("/getAll-GroupPosts-ById/:groupId", auth, getAllGroupPostsById);

export default router;
