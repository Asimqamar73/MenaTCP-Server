import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/admin.js";
import multer from "../middleware/mutler.js";
import {imageUploadWeb} from "../controllers/imageUploadWeb.js";
import {
  addCourse,
  getCourses,
  getCourseById,
  updateCourseById,
  deleteCourse,
  getCourseByName,
} from "../controllers/course.js";
import { adminAndinstructorAuth } from "../middleware/adminAndInstructor.js";

const router = express.Router();

router.get("/", auth, getCourses);

router.get("/:id", getCourseById);
router.post("/create-course", auth, adminAuth, multer.single("photo"), imageUploadWeb, addCourse);
router.get("/search-by-name/:query", auth, getCourseByName);

router.patch(
  "/update-course/:courseId",
  auth,
  adminAndinstructorAuth,
  updateCourseById
);
router.delete(
  "/delete-course/:courseId",
  auth,
  adminAndinstructorAuth,
  deleteCourse
);

export default router;
