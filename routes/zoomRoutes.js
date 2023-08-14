import express from "express";
import {
  createZoomMeeting,
  fetchMeetingById,
  // fetchRecordedMeetingById,
} from "../controllers/zoomMeeting.js";
import { tokenCheck } from "../middleware/zoomTokenCheck.js";
const router = express.Router();

router.post("/create-Zoom-Meeting", tokenCheck, createZoomMeeting);
router.get("/fetch-zoom-meetings-byId/:groupId", tokenCheck, fetchMeetingById);
// router.get(
//   "/fetch-recorded-zoom-meetings-byId/:groupId",
//   tokenCheck,
//   fetchRecordedMeetingById
// );

export default router;
