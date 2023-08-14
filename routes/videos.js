import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getVideosByLessonId,
  deleteVideoInLessonById,
  addVideosInLessonById,
  addVideosInLessonByURL,
} from "../controllers/videos.js";
import { adminAndinstructorAuth } from "../middleware/adminAndInstructor.js";
import { videoUpload } from "../controllers/videoUpload.js";
import multer from "../middleware/mutler.js";
import { imageUploadWeb } from "../controllers/imageUploadWeb.js";

const router = express.Router();

// router.post("/lesson-videos", auth,adminAndinstructorAuth, addVideos);

router.post(
  "/addVideos-InLesson-ById/:lessonId",
  auth,
  adminAndinstructorAuth,
  multer.array("video", 2),
  videoUpload,
  addVideosInLessonById
);
router.post(
  "/addVideos-InLesson-ByURL/:lessonId",
  auth,
  adminAndinstructorAuth,
  multer.single("photo"),
  imageUploadWeb,
  addVideosInLessonByURL
);
router.get("/getVideos-By-LessonId/:lessonId", auth, getVideosByLessonId);
router.delete("/deleteVideo-lessons/:videoId", deleteVideoInLessonById);

export default router;
