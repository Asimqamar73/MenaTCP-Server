import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  creatorId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
});
export default mongoose.model("Group", groupSchema);
