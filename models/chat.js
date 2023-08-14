import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  chatType: { type: String, required: true },
  users: { type: Array, required: true },
  last: { type: String },
  lastSender: { type: String },
  timestamp: { type: Date, default: Date.now(), required: true },
});

export default mongoose.model("Chat", chatSchema);
