import mongoose from "mongoose";

const videosSchema = mongoose.Schema({
  lessonId: { type: String, required: true },
  videoName: { type: String, required: true },
  videoThumbnailSrc: { type: String, required: true },
  videoSrc: { type: String, required: true },
  source: { type: String, required: true },
  timestamp: { type: Date, default: Date.now(), required: true },
});

export default mongoose.model("Videos", videosSchema);