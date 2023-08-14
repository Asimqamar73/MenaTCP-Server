import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createEvent,
  getAllEvents,
  getEventsByName,
  deleteEvent,
} from "../controllers/event.js";

const router = express.Router();

router.get("/all-events", auth, getAllEvents);

router.post("/create-event", auth, createEvent);

router.get("/search-by-name/:query", auth, getEventsByName);

router.delete("/delete-event/:id", auth, deleteEvent);

// router.get("/get-event", auth, getEvent);
// router.get("/get-event/:id", auth, getEvent);

export default router;
