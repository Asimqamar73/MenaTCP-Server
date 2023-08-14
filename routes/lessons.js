import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addLessons,
  getAllLessonsByCourseId,
  getLessonById,
  updateVideoInLessonById,
  deleteLessonById,
  updateLessonById,
} from "../controllers/lessons.js";
import { adminAndinstructorAuth } from "../middleware/adminAndInstructor.js";

const router = express.Router();

router.get("/course/:courseId", getAllLessonsByCourseId);

router.get("/:id", getLessonById);

router.post("/create-lessons", auth, adminAndinstructorAuth, addLessons);

router.patch("/update-lesson/:lessonId",auth,adminAndinstructorAuth,updateLessonById);

router.patch("/deleteVideo-lessons/:lessonId",auth,adminAndinstructorAuth,updateVideoInLessonById);

router.delete("/:lessonId", auth, adminAndinstructorAuth, deleteLessonById);

export default router;
