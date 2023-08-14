import mongoose from "mongoose";

const groupPostSchema = mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  creatorId: { type: String, required: true },
  groupId: { type: String },
  text: { type: String, required: true },
  image: { type: String },
  likes: { type: Array, default: [] },
  comments: { type: Array, default: [] },
  sharedId: { type: String, default: "" },
  type: { type: String },
  pdfName: { type: String },
  pdfFile: { type: String },
});

export default mongoose.model("GroupPost", groupPostSchema);
