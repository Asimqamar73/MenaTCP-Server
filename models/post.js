import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  creatorId: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  likes: { type: Array, default: [] },
  pdfs: { type: Array },
  type: { type: String },
  sharedId: { type: String, default: "" },
});

export default mongoose.model("Post", postSchema);
