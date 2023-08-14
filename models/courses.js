import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  // instructorName: { type: String, required: true },
  instructorId: { type: String, required: true },
  courseName: { type: String, required: true },
  categoryId: { type: String, required: true },
  courseOverview: { type: String, required: true },
  courseThumbnail: { type: String },
  timestamp: { type: Date, default: Date.now() },
});

export default mongoose.model("Courses", courseSchema);
