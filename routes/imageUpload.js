import express from "express";

import { uploadImage } from "../controllers/imageUpload.js";
import multer from "../middleware/mutler.js";

const router = express.Router();

// router.post("/upload-file", fileUploadMulter, uploadImage);
router.post("/upload-image", multer.single("photo"), uploadImage);
//  (req, res) => {
//   console.log("first req.body ::", req.body);
// });

export default router;
