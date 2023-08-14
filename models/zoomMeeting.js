import mongoose from "mongoose";

const zoomMeetingSchema = mongoose.Schema({
  group_id: { type: String,required:true },
  meeting_id: { type: String, required: true },
});

export default mongoose.model("ZoomMeeting", zoomMeetingSchema);