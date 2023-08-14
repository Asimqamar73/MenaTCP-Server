import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/admin.js";

import {
  addInstructor,
  deleteInstructor,
  getAllInstructors,
  updateInstructor,
  getInstructorByName,
  instructorLogin,
  emptyInstructor,
  getInstructorById,
    
} from "../controllers/instructor.js";
import { adminAndinstructorAuth } from "../middleware/adminAndInstructor.js";
// import { instructorAuth } from "../middleware/adminAndInstructor.js";

const router = express.Router();

router.post("/login", instructorLogin);
router.get("/", getAllInstructors);
router.get("/search-by-name/:query", getInstructorByName);
router.get("/search-by-name", emptyInstructor);
router.post(
  "/create-instructor",
  auth,
  adminAuth,
  adminAndinstructorAuth,
  addInstructor
);
router.patch("/update-instructor/:id", updateInstructor);
router.delete("/delete-instructor/:id", deleteInstructor);
router.get("/get-instructor/:id", getInstructorById);

export default router;
