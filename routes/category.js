import express from "express";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/admin.js";

import {
  addCategory,
  getAllCategories,
  getCategoriesByName,
  updateCategory,
  deleteCategory,
  getCategoryById,
  emptyCategory,
} from "../controllers/category.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/search-by-name/:query", getCategoriesByName);
router.get("/search-by-name", emptyCategory);
router.post("/create-category", auth, adminAuth, addCategory);
router.patch("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get-category/:id", getCategoryById);

export default router;
