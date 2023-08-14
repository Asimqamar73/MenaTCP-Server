import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({
  creatorId: { type: String, required: true },
  postId: { type: String, required: true },
  commentMessage: { type: String, required: true },
  timestamp: { type: Date, default: Date.now(), required: true },
});

export default mongoose.model("GroupComments", commentsSchema);
