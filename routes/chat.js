import express from "express";
import {
  addChat,
  deleteChats,
  getChat,
  getChatsByName,
  getChatsForUser,
} from "../controllers/chat.js";
import { getFullChat } from "../controllers/message.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getChatsForUser);

router.get("/one/:userId", auth, getChat);

router.post("/add/:id", addChat);
router.delete("/delete", deleteChats);

router.get("/messages/:chatId", auth, getFullChat);

router.get("/search-by-name/:query", auth, getChatsByName);

export default router;
