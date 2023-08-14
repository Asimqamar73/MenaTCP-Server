import express from "express";
import { auth } from "../middleware/auth.js";
import { addPdfInLessonById,getPdfsByLessonId,deletePdfById } from "../controllers/pdf.js";
import { adminAndinstructorAuth } from "../middleware/adminAndInstructor.js";
import {imageUploadWeb} from "../controllers/imageUploadWeb.js"
import multer from "../middleware/mutler.js";

const router = express.Router();

router.post("/create-pdf/:lessonId",auth ,adminAndinstructorAuth, multer.single("photo"), imageUploadWeb, addPdfInLessonById);
router.get("/getPdfs-By-LessonId/:lessonId",auth, getPdfsByLessonId);
router.delete("/deletePdf-byId/:pdfId",deletePdfById);

export default router;
