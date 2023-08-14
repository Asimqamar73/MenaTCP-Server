import mongoose from "mongoose";

const lessonsSchema = mongoose.Schema({
  lessonNumber: { type: Number, required: true, unique: false },
  lessonName: { type: String, required: true },
  lessonDescription: { type: String, required: true },
  courseId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
});

export default mongoose.model("Lesson", lessonsSchema);
