import express from "express";
import { contactProfileAPI, getAllContacts } from "../controllers/contactUs.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/contactProfileAPI", auth, contactProfileAPI);
router.get("/", auth, getAllContacts);

export default router;
