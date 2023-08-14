import express from "express";
import { auth } from "../middleware/auth.js";
import {adminAndinstructorAuth} from "../middleware/adminAndInstructor.js"
import multer from "../middleware/mutler.js"
import {imageUploadWeb} from "../controllers/imageUploadWeb.js"
import {
  createGroup,
  getAllGroupsById,
  deleteGroupById,
  getAllGroups,
  getGroupsByName,
  getGroupById,
  deleteGroup,
} from "../controllers/group.js";

const router = express.Router();

router.post("/create-group", auth,adminAndinstructorAuth, multer.single('photo'),imageUploadWeb, createGroup);
router.get("/getAll-Group-By-adminId", auth, getAllGroupsById);
router.get("/delete-Group-By-Id", auth, deleteGroupById);
router.get("/get-All-Groups", auth, getAllGroups);
router.get("/search-by-name/:query", auth, getGroupsByName);
router.get("/get-Group-By-Id/:id", auth, getGroupById);
router.delete("/deleteGroup/:id", deleteGroup);

export default router;
