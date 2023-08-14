import express from "express";
import {
  login,
  createAccount,
  getAllAdmin,
  getAdminDetails,
} from "../controllers/admin.js";
import { adminAuth } from "../middleware/admin.js";
import { auth } from "../middleware/auth.js";
// import { instructorAuth } from "../middleware/adminAndInstructor.js";

const router = express.Router();

router.post("/login", login);
// router.post("/createAccount", createAccount);
router.post("/createAccount", auth, adminAuth, createAccount);
router.get("/getAllAdmin", auth, adminAuth, getAllAdmin);
router.get("/details", auth, getAdminDetails);

export default router;
